class Player {
  constructor(name, id, roomId) {
    this.name = name;

    // Player unique ID. This is the Socket ID
    this.id = id;

    // So we know the game room that the player is in.
    // This is the room's password
    this.roomId = roomId;
  }
}

module.exports = Player;
