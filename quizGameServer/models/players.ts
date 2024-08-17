interface PlayerData {
  score: number;
  answer: number;
}

interface Player {
  eventId: string;
  socketId: string;
  playerId: string;
  gameData: PlayerData;
}

class Players {
  private players: Player[];

  constructor() {
    this.players = [];
  }

  addPlayer(eventId: string, socketId: string, playerId: string, name: string, gameData: PlayerData): Player {
    const player: Player = { eventId, socketId, playerId, name, gameData };
    this.players.push(player);
    return player;
  }

  removePlayer(playerId: string): Player | undefined {
    const player = this.getPlayerById(playerId);

    if (player) {
      this.players = this.players.filter(
        (player) => player.playerId !== playerId,
      );
    }
    return player;
  }

  getPlayerById(playerId: string): Player | undefined {
    return this.players.find((player) => player.playerId === playerId);
  }

  getPlayerBySocketId(socketId: string): Player | undefined {
    return this.players.find((player) => player.socketId === socketId);
  }

  getPlayers(eventId: string): Player[] {
    return this.players.filter((player) => player.eventId === eventId);
  }
}

export { Players };
