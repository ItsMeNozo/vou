interface PlayerData {
  score: number;
  answer: number;
}

interface Player {
  hostId: string;
  playerId: string;
  name: string;
  gameData: PlayerData;
}

class Players {
  private players: Player[];

  constructor() {
    this.players = [];
  }

  addPlayer(hostId: string, playerId: string, name: string, gameData: PlayerData): Player {
    const player: Player = { hostId, playerId, name, gameData };
    this.players.push(player);
    return player;
  }

  removePlayer(playerId: string): Player | undefined {
    const player = this.getPlayer(playerId);

    if (player) {
      this.players = this.players.filter(
        (player) => player.playerId !== playerId,
      );
    }
    return player;
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.find((player) => player.playerId === playerId);
  }

  getPlayers(hostId: string): Player[] {
    return this.players.filter((player) => player.hostId === hostId);
  }
}

export { Players };
