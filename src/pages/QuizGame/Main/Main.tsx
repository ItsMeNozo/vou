import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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

interface PlayerData {
  playerId: string;
  avatar: string;
  name: string;
  gameData: {
    score: number;
  };
}

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

const question = "What is the capital of France?";
const trueAnswer = 0;
const place = 1;

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
  const [searchParams] = useSearchParams();
  const [playerAnswered, setPlayerAnswered] = useState(-1);
  const [correct, setCorrect] = useState(false);
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(question);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [questionOver, setQuestionOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
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
    if (timeLeft === 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("player-join-game", {
      userId: player.playerId,
      eventId,
      name: player.name,
    });

    socket.on("noGameFound", () => {
      window.location.href = "/quiz-game";
    });

    socket.on(
      "gameQuestions",
      (data: { question: string; answers: string[] }) => {
        setMessage(data.question);
        setAnswers(data.answers);
      },
    );

    socket.on("answerResult", (data: boolean) => {
      setCorrect(data);
    });

    socket.on(
      "questionOver",
      (data: { topPlayers: { id: string; score: number }[] }) => {
        setTopPlayers(data.topPlayers);
        socket.emit("getScore");
      },
    );

    socket.on("newScore", (data: number) => {
      setScore(data);
      setQuestionOver(true);
    });

    socket.on("nextQuestionPlayer", () => {
      setCorrect(false);
      setPlayerAnswered(-1);
      setButtonVisibility(true);
      setMessage("");
      document.body.style.backgroundColor = "white";
    });

    socket.on("GameOver", () => {
      document.body.style.backgroundColor = "#FFFFFF";
      setButtonVisibility(false);
      setMessage("GAME OVER");
    });

    return () => {
      socket.off("noGameFound");
      socket.off("answerResult");
      socket.off("questionOver");
      socket.off("newScore");
      socket.off("nextQuestionPlayer");
      socket.off("GameOver");
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

    const showTimer = setTimeout(() => {
      setLeaderboardVisible(true);

      const hideTimer = setTimeout(() => {
        setLeaderboardVisible(false);
        setQuestionOver(false);
        setTimeLeft(5);
        setPlayerAnswered(-1);
        setFalseAnswerClass("text-white");
        setAnswerClass(["hidden", "hidden", "hidden", "hidden"]);
        setMessage(question);
      }, 5000);

      return () => clearTimeout(hideTimer);
    }, 5000);

    return () => clearTimeout(showTimer);
  }, [questionOver]);

  useEffect(() => {
    if (timeLeft === 0) {
      setQuestionOver(true);
    }
  });

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
      setButtonVisibility(false);
      setMessage("Answer Submitted! Waiting on other players...");
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
                      className={trueAnswer !== 0 ? falseAnswerClassChart : ""}
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
                      className={trueAnswer !== 1 ? falseAnswerClassChart : ""}
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
                      className={trueAnswer !== 2 ? falseAnswerClassChart : ""}
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
                      className={trueAnswer !== 3 ? falseAnswerClassChart : ""}
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
                    className={`flex gap-2 items-center text-left w-full p-4 ${ind === 0 ? "bg-[#2EB67D]" : ind === 1 ? "bg-[#ECB22E]" : ind === 2 ? "bg-[#E01E5B]" : "bg-[#36C5F0]"} rounded-md 
                    ${ind !== trueAnswer ? falseAnswerClass : "text-white"}`}
                  >
                    <div>
                      {ind == 0
                        ? "A. "
                        : ind == 1
                          ? "B. "
                          : ind == 2
                            ? "C. "
                            : "D. "}
                      {ans}
                    </div>
                    <div className={`${answerClass[ind]} text-2xl`}>
                      {ind == trueAnswer ? (
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
          {player.gameData.score} | {place}
          {getPlaceSuffix(place)}
        </div>
      </div>
      <SlackParticles />
    </>
  );
};

export default QuizGameMain;
