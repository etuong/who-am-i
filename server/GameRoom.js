class GameRoom {
  constructor(roomId) {
    // This is the unique ID for the room. It's the room's password
    this.roomId = roomId;

    // All players in the game room
    this.players = [];

    // All initial names to be distributed
    this.cards = new Map();

    // So no new players can join once game starts
    this.isGameInSession = false;

    // Keep track of whose turn it is
    this.currentGuesserIndex = -1;
    this.currentGuesser = undefined;
  }

  addPlayerToRoom(newPlayer) {
    this.players.push(newPlayer);
  }

  addCard(guess, from) {
    this.cards.set(from, guess);
  }

  getPlayerById(player_id) {
    return this.players.find(({ id }) => id === player_id);
  }

  isDuplicatePlayerName(name) {
    return this.players.find((player) => player.name === name);
  }

  isGameReady() {
    return (
      this.players.length > 1 && this.players.every((player) => player.ready)
    );
  }

  // TODO: stack overflow
  getNextGuesser() {
    if (this.currentGuesserIndex + 1 === this.players.length) {
      this.currentGuesserIndex = 0;
    } else {
      this.currentGuesserIndex += 1;
    }

    if (this.players[this.currentGuesserIndex].hasWon) {
      this.getNextGuesser();
    } else {
      this.currentGuesser = this.players[this.currentGuesserIndex];
    }
  }

  // When player's socket gets disconnected, remove the player
  removePlayerFromRoom(player) {
    const index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
    }

    return this.players.length;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  startGame() {
    this.isGameInSession = true;

    // Distribute the guesses to players
    this.shuffleArray(this.players);
    for (let player of this.players) {
      for (const [from, nameToGuess] of this.cards.entries()) {
        if (player.id !== from) {
          player.nameToGuess = nameToGuess;
          this.cards.delete(from);
          break;
        }
      }
    }

    this.getNextGuesser();
  }
}

module.exports = GameRoom;
