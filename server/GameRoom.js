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

  startGame() {
    this.isGameInSession = true;
  }
}

module.exports = GameRoom;
