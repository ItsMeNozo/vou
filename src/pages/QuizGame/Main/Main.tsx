import React, { useEffect, useState } from "react";

import defaultAvatar from "@/assets/avatar.png";
import { SlackParticles, SnowParticles } from "@/components/ui/particles";
import { AnimatedTalkingMC, AnimatedIdleMC } from "@/components/ui/animatedMC";
import { IoCheckmarkSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { Bar, BarChart, CartesianGrid, LabelList, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import { useSocket } from "@/contexts/SocketContext"; 

import Leaderboard from "./Leaderboard";
import "./Main.css";

function getPlaceSuffix(place: number) {
  if (place % 10 === 1 && place % 100 !== 11) {
    return "st";
  } else if (place % 10 === 2 && place % 100 !== 12) {
    return "nd";
  } else if (place % 10 === 3 && place % 100 !== 13) {
    return "rd";
  } else {
    return "th";
  }
}

const chartData = [{ answerA: 10, answerB: 5, answerC: 20, answerD: 1 }];

const chartConfig = {
  answerA: {
    label: "Answer A",
    color: "#2EB67D",
  },
  answerB: {
    label: "Answer B",
    color: "#ECB22E",
  },
  answerC: {
    label: "Answer C",
    color: "#E01E5B",
  },
  answerD: {
    label: "Answer D",
    color: "#36C5F0",
  },
} satisfies ChartConfig;

const player = {
  playerId: "123",
  name: "John Doe",
  gameData: {
    score: 1000,
  },
  avatar: "",
};

const eventId = "66b70aa8f9d6d14160e0d2dd";
 
const QuizGameMain: React.FC = () => {
  const socket = useSocket();
  const [playerAnswered, setPlayerAnswered] = useState(-1);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(1);
  const [message, setMessage] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(-1);
  const [questionOver, setQuestionOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [falseAnswerClass, setFalseAnswerClass] = useState("text-white");
  const [falseAnswerClassChart, setFalseAnswerClassChart] = useState("");
  const [answerClass, setAnswerClass] = useState([
    "hidden",
    "hidden",
    "hidden",
    "hidden",
  ]);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [topPlayers, setTopPlayers] = useState<{ id: string; score: number }[]>(
    [],
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit("player-join-game", {
      userId: player.playerId,
      eventId,
    });

    socket.on("waitingForNextQuestion", () => {
      setMessage("Waiting for next the question...");
      setButtonVisibility(false);
    });

    socket.on( 
      "gameQuestions",
      (data: {
        question: string;
        answers: string[];
        timeLeft: number;
        playerAnswer: number;
      }) => {
        if (data.playerAnswer == -1) {
          setMessage(data.question);
          setButtonVisibility(true);
        }
        setAnswers(data.answers);
        setTimeLeft(data.timeLeft);
        setPlayerAnswered(data.playerAnswer);
      },
    );

    socket.on(
      "questionOver",
      (data: { topPlayers: { id: string; score: number }[] }) => {
        setTopPlayers(data.topPlayers);
        setQuestionOver(true);
        socket.emit("getScore");
      },
    );

    socket.on("answerResult", (data: { correct: boolean }) => {
      setCorrect(data.correct);
    });

    socket.on("correctAnswer", (data: { correctAnswer: number }) => {
      setCorrectAnswer(data.correctAnswer);
    });

    socket.on("newScore", (data: { score: number; rank: number }) => {
      setScore(data.score);
      setRank(data.rank);
      setQuestionOver(true);
    });

    socket.on("stats", (data: { answersCount: number[] }) => {
      // chartData[0] = {
      //   answerA: data.answersCount[0],
      //   answerB: data.answersCount[1],
      //   answerC: data.answersCount[2],
      //   answerD: data.answersCount[3],
      // };
    });

    socket.on("leaderboard", () => {
      setLeaderboardVisible(true);
    });

    socket.on("nextQuestionPlayer", () => {
      setCorrect(false);
      setButtonVisibility(true);
      setPlayerAnswered(-1);
      setQuestionOver(false);
      setFalseAnswerClass("text-white");
      setAnswerClass(["hidden", "hidden", "hidden", "hidden"]);
      setMessage("");
      setLeaderboardVisible(false);
      document.body.style.backgroundColor = "white";
    });

    socket.on("gameOver", () => {
      document.body.style.backgroundColor = "#FFFFFF";
      setButtonVisibility(false);
      setQuestionOver(false);
      setMessage("GAME OVER");
    });

    socket.on("noGameFound", () => {
      window.location.href = "/quiz-game";
    });

    socket.on("timeUpdate", (data: { timeLeft: number }) => {
      setTimeLeft(data.timeLeft);
    });

    return () => {
      socket.off("gameQuestions");
      socket.off("questionOver");
      socket.off("answerResult");
      socket.off("correctAnswer");
      socket.off("newScore");
      socket.off("stats");
      socket.off("leaderboard");
      socket.off("nextQuestionPlayer");
      socket.off("GameOver");
      socket.off("noGameFound");
    };
  }, [socket]);

  useEffect(() => {
    if (!questionOver) return;

    setButtonVisibility(true);
    setFalseAnswerClass("opacity-30 text-black");
    setFalseAnswerClassChart("opacity-55");
    setAnswerClass(
      answerClass.map((_, i) => (i === playerAnswered ? "block" : "hidden")),
    );

    if (correct) {
      setMessage("Correct!");
    } else {
      setMessage("Incorrect!");
    }
  }, [questionOver]);

  useEffect(() => {
    if (!questionOver) return;
    if (correct) {
      setMessage("Correct!");
    } else {
      setMessage("Incorrect!");
    }
  }, [correct]);

  useEffect(() => {
    if (playerAnswered !== -1) {
      setButtonVisibility(false);
      setMessage("Answer submitted! Waiting on other players...");
    }
  }, [playerAnswered]);

  const setButtonVisibility = (visible: boolean) => {
    const visibility = visible ? "visible" : "hidden";
    for (let i = 0; i < 4; i++) {
      document.getElementById(`answer${i}`)!.style.visibility = visibility;
    }
  };

  const answerSubmitted = (num: number) => {
    if (playerAnswered == -1) {
      setPlayerAnswered(num);
      if (socket) {
        socket.emit("playerAnswer", num, timeLeft);
      }
    }
  };

  return (
    <>
      <div className="mb-32">
        {/* MC */}
        <div className="border-b-2 border-slate-400 bg-[#1f263b] z-10 relative pt-4">
          <SnowParticles />
          {playerAnswered == -1 ? <AnimatedTalkingMC /> : <AnimatedIdleMC />}
          <div className="countdown-timer absolute bottom-3 left-3">
            <div className="bg-[#7d4af9] text-white p-4 text-2xl font-semibold rounded-full w-16">
              {timeLeft}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 z-10 pt-12">
          {!leaderboardVisible && (
            <>
              {/* Stats chart */}
              {questionOver && (
                <ChartContainer
                  config={chartConfig}
                  className="w-full aspect-w-16 aspect-h-9 z-10 statsChart mb-8"
                >
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <YAxis hide domain={[0, "dataMax + 5"]} />
                    <Bar
                      dataKey="answerA"
                      fill="var(--color-answerA)"
                      radius={4}
                      className={
                        correctAnswer !== 0 ? falseAnswerClassChart : ""
                      }
                    >
                      <LabelList
                        dataKey="answerA"
                        position="top"
                        className="text-xl"
                      />
                    </Bar>
                    <Bar
                      dataKey="answerB"
                      fill="var(--color-answerB)"
                      radius={4}
                      className={
                        correctAnswer !== 1 ? falseAnswerClassChart : ""
                      }
                    >
                      <LabelList
                        dataKey="answerB"
                        position="top"
                        className="text-xl"
                      />
                    </Bar>
                    <Bar
                      dataKey="answerC"
                      fill="var(--color-answerC)"
                      radius={4}
                      className={
                        correctAnswer !== 2 ? falseAnswerClassChart : ""
                      }
                    >
                      <LabelList
                        dataKey="answerC"
                        position="top"
                        className="text-xl"
                      />
                    </Bar>
                    <Bar
                      dataKey="answerD"
                      fill="var(--color-answerD)"
                      radius={4}
                      className={
                        correctAnswer !== 3 ? falseAnswerClassChart : ""
                      }
                    >
                      <LabelList
                        dataKey="answerD"
                        position="top"
                        className="text-xl"
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}

              {/* Question and message */}
              <h2 id="message" className="text-center text-2xl mb-4 z-10">
                {message}
              </h2>

              {/* Answer list */}
              <div className="grid gap-4 w-full max-w-lg z-10">
                {answers.map((ans, ind) => (
                  <button
                    key={ind}
                    onClick={() => answerSubmitted(ind)}
                    id={`answer${ind}`}
                    className={`invisible flex gap-2 items-center text-left w-full p-4 rounded-md
                    ${["bg-[#2EB67D]", "bg-[#ECB22E]", "bg-[#E01E5B]", "bg-[#36C5F0]"][ind]}  
                    ${ind !== correctAnswer ? falseAnswerClass : "text-white"}`}
                  >
                    <div>
                      {["A. ", "B. ", "C. ", "D. "][ind]}
                      {ans}
                    </div>
                    <div className={`${answerClass[ind]} text-2xl`}>
                      {ind == correctAnswer ? (
                        <IoCheckmarkSharp />
                      ) : (
                        <IoCloseSharp />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Leaderboard */}
          {leaderboardVisible && <Leaderboard topPlayers={topPlayers} />}
        </div>
      </div>

      {/* Footer: username, score, place */}
      <div className="border-t-2 border-slate-400 bg-white flex justify-between items-center p-4 z-10 w-full fixed -bottom-1">
        <div className="flex items-center gap-2">
          <img
            src={player.avatar ? player.avatar : defaultAvatar}
            alt="User Avatar"
            className="h-10 w-10 rounded-full"
          />
          <span className="mr-2">{player.name}</span>
        </div>
        <div id="scoreText" className="p-2 bg-slate-700 text-white rounded-md">
          {score} | {rank}
          {getPlaceSuffix(rank)}
        </div>
      </div>
      <SlackParticles />
    </>
  );
};

export default QuizGameMain;
