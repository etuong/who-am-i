const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const Constant = require("./Constants");

app.use(logger("dev"));
app.use(cors());
app.get("/", (_, res) => {
  res.redirect("https://etuong.github.io/who-am-i/");
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
    origin: ["http://localhost:8080", "https://etuong.github.io"],
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
    if (gameRooms.has(roomId)) {
      socket.emit("room_exists");
    }
  });

  socket.on("create_new_room", (data) => {
    // Only using five characters to make lives easier
    const uniqid = require("uniqid");
    const roomId = uniqid("/");

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

    if (gameRoom.isGameInSession) {
      socket.emit("game_in_session");
      console.log(
        `${data.name} tries to join room ${roomId} but game is in session`
      );
    } else if (gameRoom.isDuplicatePlayerName(data.name)) {
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

process.on("exit", function (code) {
  server.close();
  console.log("Server exit", code);
});
