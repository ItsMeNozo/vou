interface GameData {
  playersAnswered: number,
  questionLive: boolean,
  gameid: string,
  question: number,
}

interface Game {
  pin: string;
  hostId: string;
  gameLive: boolean;
  gameData: GameData;
}

class LiveGames {
  public games: Game[];

  constructor() {
    this.games = [];
  }

  addGame(pin: string, hostId: string, gameLive: boolean, gameData: GameData): Game {
    const game: Game = { pin, hostId, gameLive, gameData };
    this.games.push(game);
    return game;
  }

  removeGame(hostId: string): Game | undefined {
    const game = this.getGame(hostId);

    if (game) {
      this.games = this.games.filter((game) => game.hostId !== hostId);
    }
    return game;
  }

  getGame(hostId: string): Game | undefined {
    return this.games.find((game) => game.hostId === hostId);
  }
}

export { LiveGames };
