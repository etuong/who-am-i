class GameRoom {
  constructor(roomId) {
    // This is the unique ID for the room. It's the room's password
    this.roomId = roomId;

    // All players in the game room
    this.players = [];

    // So no new players can join once game starts
    this.isGameInSession = false;
  }

  addPlayerToRoom(newPlayer) {
    this.players.push(newPlayer);
  }

  isDuplicatePlayerName(name) {
    return this.players.find((player) => player.name === name);
  }

  isGameReady() {
    return (
      this.players.length > 2 && this.players.every((player) => player.ready)
    );
  }

  // When player's socket gets disconnected, remove the player
  removePlayerFromRoom(player) {
    const index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
    }

    return this.players.length;
  }

  startGame() {
    this.isGameInSession = true;
  }
}

module.exports = GameRoom;
