import http from "http";
import express from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import mongoose, { Document, Schema } from "mongoose";
import cron from "node-cron";
import axios from "axios";

import { LiveGames } from "./models/liveGames";
import { Players } from "./models/players";

import quizRoute from "./routes/quizRoute";
import QuizSet from "./models/quizSet";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const games = new LiveGames();
const players = new Players();

const port = process.env.QUIZ_GAME_PORT || 3000;
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/";

app.use("/quiz", quizRoute);
app.use(cors());

server.listen(port, () => {
  console.log("Server started on port 3000");
});

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

interface IKahootGame extends Document {
  id: number;
  name: string;
  questions: {
    question: string;
    answers: string[];
    correct: string;
  }[];
}

const kahootGameSchema = new Schema<IKahootGame>({
  id: { type: Number },
  name: { type: String },
  questions: [
    {
      question: { type: String },
      answers: { type: [String] },
      correct: { type: String },
    },
  ],
});

interface Event {
  id: string;
  startDate: string;
}

const KahootGame = mongoose.model<IKahootGame>("KahootGame", kahootGameSchema);

const scheduleGameStart = async () => {
  const response = await axios.get(
    "http://localhost:3001/event/filter?game=quiz",
  );
  const events = response.data;

  if (events && events.length > 0) {
    events.forEach((event: Event) => {
      const startDate = new Date(event.startDate);
      const now = new Date();

      if (startDate > now) {
        const cronTime = `${startDate.getMinutes()} ${startDate.getHours()} ${startDate.getDate()} ${startDate.getMonth() + 1} *`;
        cron.schedule(cronTime, async () => {
          games.addGame(event.id, false, {
            playersAnswered: 0,
            questionLive: false,
            question: 1,
          });

          const game = games.getGame(event.id);
          if (!game) {
            return;
          }
          game.gameLive = true;

          //
          // emit instructions to AI
          //

          const quizSet = await QuizSet.findOne({ eventId: event.id });
          if (quizSet) {
            const { question, answers } = quizSet.quizzes[0];

            io.to(event.id).emit("gameQuestions", {
              question,
              answers,
            });

            game.gameData.questionLive = true;

            setTimeout(() => nextQuestion(event.id), 20000);
          }
        });
      }
    });
  }
};

const nextQuestion = async (eventId: string) => {
  const game = games.getGame(eventId);
  if (!game) return;

  game.gameData.questionLive = false;
  const playerData = players.getPlayers(eventId);

  io.to(eventId).emit("questionOver");

  playerData.forEach((player) => {
    player.gameData.answer = -1;
  });

  game.gameData.playersAnswered = 0;
  setTimeout(async () => {
    try {
      const quizSet = await QuizSet.findOne({ eventId });
      if (!quizSet) return;

      game.gameData.question += 1;
      if (quizSet.quizzes.length >= game.gameData.question) {
        const questionNum = game.gameData.question - 1;
        const { question, answers } = quizSet.quizzes[questionNum];
        io.to(eventId).emit("gameQuestions", { question, answers });

        game.gameData.questionLive = true;
        io.to(eventId).emit("nextQuestionPlayer");

        setTimeout(() => nextQuestion(eventId), 20000);
      } else {
        const playersInGame = players.getPlayers(eventId);
        const topPlayers = playersInGame
          .map((player) => ({
            id: player.playerId,
            score: player.gameData.score,
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        io.to(eventId).emit("GameOver", { topPlayers });
      }
    } catch (err) {
      console.error(err);
    }
  }, 5000);
};

scheduleGameStart();

io.on("connection", (socket: Socket) => {
  socket.on("player-join-game", (data) => {
    const { eventId, userId, name } = data;
    const player = players.getPlayerById(userId);
    if (!player) {
      players.addPlayer(eventId, socket.id, userId, name, {
        score: 0,
        answer: 0,
      });
    } else {
      player.socketId = socket.id;
    }
    socket.join(eventId);
  });

  socket.on("playerAnswer", async (num, timeLeft) => {
    const player = players.getPlayerBySocketId(socket.id);
    if (!player) return;

    const eventId = player.eventId;
    const game = games.getGame(eventId);
    if (!game) return;

    if (game.gameData.questionLive) {
      player.gameData.answer = num;
      game.gameData.playersAnswered += 1;

      const gameQuestion = game.gameData.question;

      try {
        const quizSet = await QuizSet.findOne({ eventId });
        if (!quizSet) return;

        const correctAnswer = quizSet.quizzes[gameQuestion - 1].correct;

        if (num == correctAnswer) {
          player.gameData.score += 100 + (timeLeft / 20) * 100;
          socket.emit("answerResult", true);
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  socket.on("getScore", () => {
    const player = players.getPlayerBySocketId(socket.id);
    if (player) {
      socket.emit("newScore", player.gameData.score);
    }
  });
});

io.on("connection", (socket: Socket) => {
  socket.on("host-join", async (data) => {
    try {
      const result = await KahootGame.findOne({ id: parseInt(data.id) });

      if (result) {
        const gamePin = (Math.floor(Math.random() * 90000) + 10000).toString();
        games.addGame(gamePin, socket.id, false, {
          playersAnswered: 0,
          questionLive: false,
          gameId: data.id,
          question: 1,
        });

        const game = games.getGame(socket.id);
        if (game) {
          socket.join(game.pin);
          console.log("Game Created with pin:", game.pin);
          socket.emit("showGamePin", { pin: game.pin });
        }
      } else {
        socket.emit("noGameFound");
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("host-join-game", async (data) => {
    const oldHostId = data.id;
    const game = games.getGame(oldHostId);

    if (game) {
      game.hostId = socket.id;
      socket.join(game.pin);
      const playerData = players.getPlayers(oldHostId);
      playerData.forEach((player) => {
        if (player.hostId === oldHostId) {
          player.hostId = socket.id;
        }
      });

      const gameId = game.gameData["gameId"];
      try {
        const kahootGame = await KahootGame.findOne({ id: parseInt(gameId) });

        if (kahootGame) {
          const { question, answers, correct } = kahootGame.questions[0];
          socket.emit("gameQuestions", {
            q1: question,
            a1: answers[0],
            a2: answers[1],
            a3: answers[2],
            a4: answers[3],
            correct,
            playersInGame: playerData.length,
          });
          io.to(game.pin).emit("gameStartedPlayer");
          game.gameData.questionLive = true;
        }
      } catch (err) {
        console.error(err);
        socket.emit("noGameFound");
      }
    } else {
      socket.emit("noGameFound");
    }
  });

  socket.on("player-join", (params) => {
    let gameFound = false;
    for (const game of games.games) {
      if (params.pin === game.pin) {
        console.log("Player connected to game");
        const hostId = game.hostId;
        players.addPlayer(hostId, socket.id, params.name, {
          score: 0,
          answer: 0,
        });
        socket.join(params.pin);

        const playersInGame = players.getPlayers(hostId);
        io.to(params.pin).emit("updatePlayerLobby", playersInGame);
        gameFound = true;
        break;
      }
    }

    if (!gameFound) {
      socket.emit("noGameFound");
    }
  });

  socket.on("player-join-game", (data) => {
    const player = players.getPlayer(data.id);
    if (player) {
      const game = games.getGame(player.hostId);
      if (game) {
        socket.join(game.pin);
        player.playerId = socket.id;
        const playerData = players.getPlayers(game.hostId);
        socket.emit("playerGameData", playerData);
      } else {
        socket.emit("noGameFound");
      }
    } else {
      socket.emit("noGameFound");
    }
  });

  socket.on("disconnect", () => {
    let game = games.getGame(socket.id);
    if (game) {
      if (!game.gameLive) {
        games.removeGame(socket.id);
        console.log("Game ended with pin:", game.pin);

        const playersToRemove = players.getPlayers(game.hostId);
        for (const player of playersToRemove) {
          players.removePlayer(player.playerId);
        }

        io.to(game.pin).emit("hostDisconnect");
        socket.leave(game.pin);
      }
    } else {
      const player = players.getPlayer(socket.id);
      if (player) {
        const hostId = player.hostId;
        game = games.getGame(hostId);
        if (game && !game.gameLive) {
          players.removePlayer(socket.id);
          const playersInGame = players.getPlayers(hostId);
          io.to(game.pin).emit("updatePlayerLobby", playersInGame);
          socket.leave(game.pin);
        }
      }
    }
  });

  socket.on("playerAnswer", async (num) => {
    const player = players.getPlayer(socket.id);
    if (!player) return;

    const hostId = player.hostId;
    const playerNum = players.getPlayers(hostId);
    const game = games.getGame(hostId);
    if (!game) return;

    if (game.gameData.questionLive) {
      player.gameData.answer = num;
      game.gameData.playersAnswered += 1;

      const gameQuestion = game.gameData.question;
      const gameId = game.gameData.gameId;

      try {
        const kahootGame = await KahootGame.findOne({ id: parseInt(gameId) });
        if (!kahootGame) return;

        const correctAnswer = kahootGame.questions[gameQuestion - 1].correct;

        if (num == correctAnswer) {
          player.gameData.score += 100;
          io.to(game.pin).emit("getTime", socket.id);
          socket.emit("answerResult", true);
        }

        if (game.gameData.playersAnswered === playerNum.length) {
          game.gameData.questionLive = false;
          const playerData = players.getPlayers(game.hostId);
          io.to(game.pin).emit("questionOver", playerData, correctAnswer);
        } else {
          io.to(game.pin).emit("updatePlayersAnswered", {
            playersInGame: playerNum.length,
            playersAnswered: game.gameData.playersAnswered,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  socket.on("getScore", () => {
    const player = players.getPlayer(socket.id);
    if (player) {
      socket.emit("newScore", player.gameData.score);
    }
  });

  socket.on("time", (data) => {
    const time = (data.time / 20) * 100;
    const player = players.getPlayer(data.player);
    if (player) {
      player.gameData.score += time;
    }
  });

  socket.on("timeUp", async () => {
    const game = games.getGame(socket.id);
    if (!game) return;

    game.gameData.questionLive = false;
    const playerData = players.getPlayers(game.hostId);

    const gameQuestion = game.gameData.question;
    const gameId = game.gameData.gameId;

    try {
      const kahootGame = await KahootGame.findOne({ id: parseInt(gameId) });
      if (kahootGame) {
        const correctAnswer = kahootGame.questions[gameQuestion - 1].correct;
        io.to(game.pin).emit("questionOver", playerData, correctAnswer);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("nextQuestion", async () => {
    const playerData = players.getPlayers(socket.id);

    playerData.forEach((player) => {
      if (player.hostId === socket.id) {
        player.gameData.answer = 0;
      }
    });

    const game = games.getGame(socket.id);
    if (!game) return;

    game.gameData.playersAnswered = 0;
    game.gameData.questionLive = true;
    game.gameData.question += 1;
    const gameId = game.gameData.gameId;

    try {
      const kahootGame = await KahootGame.findOne({ id: parseInt(gameId) });
      if (!kahootGame) return;

      if (kahootGame.questions.length >= game.gameData.question) {
        const questionNum = game.gameData.question - 1;
        const { question, answers, correct } =
          kahootGame.questions[questionNum];
        socket.emit("gameQuestions", {
          q1: question,
          a1: answers[0],
          a2: answers[1],
          a3: answers[2],
          a4: answers[3],
          correct,
          playersInGame: playerData.length,
        });
        io.to(game.pin).emit("nextQuestionPlayer");
      } else {
        const playersInGame = players.getPlayers(game.hostId);
        let [first, second, third, fourth, fifth] = [
          { name: "", score: 0 },
          { name: "", score: 0 },
          { name: "", score: 0 },
          { name: "", score: 0 },
          { name: "", score: 0 },
        ];

        for (const player of playersInGame) {
          const playerScore = player.gameData.score;
          if (playerScore > fifth.score) {
            if (playerScore > fourth.score) {
              if (playerScore > third.score) {
                if (playerScore > second.score) {
                  if (playerScore > first.score) {
                    [fifth, fourth, third, second, first] = [
                      fourth,
                      third,
                      second,
                      first,
                      { name: player.name, score: playerScore },
                    ];
                  } else {
                    [fifth, fourth, third, second] = [
                      fourth,
                      third,
                      second,
                      { name: player.name, score: playerScore },
                    ];
                  }
                } else {
                  [fifth, fourth, third] = [
                    fourth,
                    third,
                    { name: player.name, score: playerScore },
                  ];
                }
              } else {
                [fifth, fourth] = [
                  fourth,
                  { name: player.name, score: playerScore },
                ];
              }
            } else {
              fifth = { name: player.name, score: playerScore };
            }
          }
        }
        io.to(game.pin).emit("GameOver", {
          num1: first.name,
          num2: second.name,
          num3: third.name,
          num4: fourth.name,
          num5: fifth.name,
        });
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("startGame", () => {
    const game = games.getGame(socket.id);
    if (game) {
      game.gameLive = true;
      socket.emit("gameStarted", game.hostId);
    }
  });

  socket.on("requestDbNames", async () => {
    try {
      const kahootGames = await KahootGame.find({});
      socket.emit("gameNamesData", kahootGames);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("newQuiz", async (data) => {
    try {
      const games = await KahootGame.find({});
      data.id = games.length === 0 ? 1 : games[games.length - 1].id + 1;

      const game = new KahootGame(data);
      await game.save();

      socket.emit("startGameFromCreator", games.length);
    } catch (err) {
      console.error(err);
    }
  });
});
