interface GameData {
  playersAnswered: number,
  questionLive: boolean,
  question: number,
}

interface Game {
  eventId: string;
  gameLive: boolean;
  gameData: GameData;
}

class LiveGames {
  public games: Game[];

  constructor() {
    this.games = [];
  }

  addGame(eventId: string, gameLive: boolean, gameData: GameData): Game {
    const game: Game = { eventId, gameLive, gameData };
    this.games.push(game);
    return game;
  }

  removeGame(eventId: string): Game | undefined {
    const game = this.getGame(eventId);

    if (game) {
      this.games = this.games.filter((game) => game.eventId !== eventId);
    }
    return game;
  }

  getGame(eventId: string): Game | undefined {
    return this.games.find((game) => game.eventId === eventId);
  }
}

export { LiveGames };
