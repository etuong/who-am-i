const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const Constant = require("./Constants");

app.use(logger("dev"));
app.use(cors());
app.get("/", (_, res) => {
  res.redirect("https://who-am-i-webapp.netlify.app/");
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = process.env.PORT || Constant.PORT;

server.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:8080",
      "https://lighthearted-piroshki-24ee03.netlify.app",
    ],
    credentials: true,
  },
  transports: ["polling", "websocket"],
  allowEIO3: true,
  pingTimeout: 30000, // Shut down socket after 30 minutes of inactivity
});

const Player = require("./Player");
const GameRoom = require("./GameRoom");
const gameRooms = new Map();

io.on("connection", (socket) => {
  // Ping a response from handshake
  socket.emit("connected");

  socket.on("check_room_validity", (roomId) => {
    const gameRoom = gameRooms.get(roomId);
    if (gameRoom) {
      if (gameRoom.isGameInSession) {
        socket.emit("game_in_session");
      } else {
        socket.emit("room_exists");
      }
    }
  });

  socket.on("create_new_room", (data) => {
    // Only using five characters to make lives easier
    const randomId = require("random-id");
    const roomId = "/?" + randomId(5, "aA0");

    const newGameRoom = new GameRoom(roomId);

    const newPlayer = new Player(data.name, socket.id, roomId);

    newGameRoom.addPlayerToRoom(newPlayer);

    // Add new player connection to game room socket
    socket.join(roomId);

    // Take the player to the lobby to wait for other players
    socket.emit("show_lobby");

    // Give player initial data like cards
    socket.emit("update_player", newPlayer);

    // Inform all players of game status
    socket.emit("update_preparation", {
      players: newGameRoom.players,
      isGameReady: newGameRoom.isGameReady(),
    });

    gameRooms.set(roomId, newGameRoom);

    console.log(`${data.name} has created a new game in room ${roomId}`);
  });

  socket.on("join_room", (data) => {
    const roomId = data.id;
    const gameRoom = gameRooms.get(roomId);

    if (gameRoom.isDuplicatePlayerName(data.name)) {
      socket.emit("player_name_exist");
    } else {
      const newPlayer = new Player(data.name, socket.id, roomId);

      gameRoom.addPlayerToRoom(newPlayer);

      socket.join(roomId);

      socket.emit("update_player", newPlayer);

      io.sockets.in(roomId).emit("update_preparation", {
        players: gameRoom.players,
        isGameReady: gameRoom.isGameReady(),
      });

      console.log(`${data.name} has joined room ${roomId}`);
    }
  });

  socket.on("player_wrote_guess", ({ guessing_name, player }) => {
    const gameRoom = gameRooms.get(player.roomId);

    if (gameRoom.isGameInSession) {
      socket.emit("game_in_session");
      return;
    }

    const selected_player = gameRoom.getPlayerById(player.id);

    gameRoom.addCard(guessing_name, player.id);

    selected_player.ready = true;

    socket.emit("update_player", selected_player);

    io.sockets.in(player.roomId).emit("update_preparation", {
      players: gameRoom.players,
      isGameReady: gameRoom.isGameReady(),
    });

    console.log(
      `${player.name} in room ${player.roomId} wrote down ${guessing_name} to guess!`
    );
  });

  socket.on("game_ready", (roomId) => {
    const gameRoom = gameRooms.get(roomId);
    gameRoom.startGame();
    io.sockets.in(roomId).emit("game_start");
    setTimeout(
      () =>
        io.sockets.in(roomId).emit("update_playground", {
          currentGuesser: gameRoom.currentGuesser,
          players: gameRoom.players,
        }),
      100
    );

    console.log(`Room ${roomId} is playing!`);
  });

  socket.on("end_turn", (roomId) => {
    const gameRoom = gameRooms.get(roomId);
    gameRoom.getNextGuesser();
    io.sockets.in(roomId).emit("update_playground", {
      currentGuesser: gameRoom.currentGuesser,
      players: gameRoom.players,
    });
  });

  socket.on("player_wins", ({ roomId, id }) => {
    const gameRoom = gameRooms.get(roomId);
    const selected_player = gameRoom.getPlayerById(id);
    selected_player.hasWon = true;
    io.sockets.in(roomId).emit("guess_right", selected_player.name);

    const numPlayerStillPlaying = gameRoom.numPlayerStillPlaying;

    if (numPlayerStillPlaying > 0) {
      gameRoom.getNextGuesser();
      io.sockets.in(roomId).emit("update_playground", {
        currentGuesser: gameRoom.currentGuesser,
        players: gameRoom.players,
        onlyOneGuessLeft: numPlayerStillPlaying === 1,
      });
    } else {
      gameRoom.resetGame();
      io.sockets.in(roomId).emit("game_over");
    }
  });

  socket.on("play_again", ({ name, roomId, id }) => {
    const gameRoom = gameRooms.get(roomId);

    if (gameRoom.isGameInSession) {
      socket.emit("game_in_session");
      return;
    }

    const newPlayer = new Player(name, id, roomId);
    gameRoom.addPlayerToRoom(newPlayer);
    socket.emit("update_player", newPlayer);

    socket.emit("show_lobby");

    io.sockets.in(roomId).emit("update_preparation", {
      players: gameRoom.players,
      isGameReady: gameRoom.isGameReady(),
    });

    console.log(`${name} in  room ${roomId} playing again`);
  });

  socket.on("disconnect", () => {
    gameRooms.forEach((gameRoom, roomId) => {
      let players = gameRoom.players;
      for (let player of players) {
        if (player.id === socket.id) {
          socket.leave(roomId);
          io.sockets.in(roomId).emit("player_disconnect", player.name);
          console.log(`${player.name} just left room ${roomId}`);

          const number_of_current_players =
            gameRoom.removePlayerFromRoom(player);

          // Kick the other two players out if the third last player quits
          if (gameRoom.isGameInSession && number_of_current_players < 1) {
            gameRooms.delete(roomId);
            io.sockets.in(roomId).emit("show_home");
            console.log(`Deleting room ${roomId} because not enough players`);
          } else {
            io.sockets.in(roomId).emit("update_preparation", {
              players: gameRoom.players,
              isGameReady: gameRoom.isGameReady(),
            });
          }

          break;
        }
      }
    });
  });
});

app.get("/rooms", (req, res) => {
  res.status(200).send({ rooms: [...gameRooms] });
});

app.get("/delete-all-messages", (_req, res) => {
  deleteAllMessages();
  res.status(200).send("All messages have been deleted!");
});

process.on("exit", function (code) {
  server.close();
  console.log("Server exit", code);
});
