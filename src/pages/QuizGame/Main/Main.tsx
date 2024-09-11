import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { auth } from "@/config/firebaseConfig";
import axios from "axios";

import defaultAvatar from "@/assets/avatar.png";
import { SlackParticles, SnowParticles } from "@/components/ui/particles";
import { AnimatedTalkingMC, AnimatedIdleMC } from "@/components/ui/animatedMC";
import { IoCheckmarkSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useSocket } from "@/contexts/SocketContext";

import Leaderboard from "./Leaderboard";
import Stats from "./Stats";
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

interface User {
  username: string;
  avatar: string;
}

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  throw new Error("API_GATEWAY_URL is not defined in environment variables");
}

const QuizGameMain: React.FC = () => {
  const { eventId } = useParams();
  const socket = useSocket();
  const [userInfo, setUserInfo] = useState<User>();
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audio, setAudio] = useState(false);
  const [chartData, setChartData] = useState([
    { answerA: 0, answerB: 0, answerC: 0, answerD: 0 },
  ]);

  if (!eventId) {
    throw new Error("Event ID is not defined");
  }

  useEffect(() => {
    const fetchUserData = () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const response = await axios.get(
              `${API_GATEWAY_URL}/api/user/${user.uid}`,
            );
            const userData = response.data.data;
            setUserInfo({
              username: userData.username,
              avatar: userData.avatar,
            });
          } catch (err) {
            console.log("Failed to fetch user data");
          }
        }
      });
    };

    fetchUserData();
    const score = localStorage.getItem("score");
    const rank = localStorage.getItem("rank");
    setScore(score ? parseInt(score) : 0);
    setRank(rank ? parseInt(rank) : 0);
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!socket || !user) return;

      socket.emit("player-join-game", {
        userId: user.uid,
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
        localStorage.setItem("score", data.score.toString());
        localStorage.setItem("rank", data.rank.toString());
      });

      socket.on("stats", (data: { answersCount: number[] }) => {
        setChartData([
          {
            answerA: data.answersCount[0],
            answerB: data.answersCount[1],
            answerC: data.answersCount[2],
            answerD: data.answersCount[3],
          },
        ]);
      });

      socket.on("leaderboard", () => {
        setLeaderboardVisible(true);
      });

      socket.on("nextQuestionPlayer", () => {
        setCorrect(false);
        setPlayerAnswered(-1);
        setQuestionOver(false);
        setFalseAnswerClass("text-white");
        setAnswerClass(["hidden", "hidden", "hidden", "hidden"]);
        setMessage("Waiting for next the question...");
        setLeaderboardVisible(false);
        document.body.style.backgroundColor = "white";
      });

      socket.on("gameOver", () => {
        document.body.style.backgroundColor = "#FFFFFF";
        setQuestionOver(false);
        setMessage("GAME OVER");
      });

      socket.on("noGameFound", () => {
        window.location.href = "/quiz-game";
      });

      socket.on("timeUpdate", (data: { timeLeft: number }) => {
        setTimeLeft(data.timeLeft);
      });

      socket.on("audio", (data: { audio: ArrayBuffer }) => {
        if (audioRef.current) {
          const blob = new Blob([data.audio], { type: "audio/mp3" });
          const url = URL.createObjectURL(blob);
          audioRef.current.src = url;
          audioRef.current
            .play()
            .then(() => {
              setAudio(true);
            })
            .catch((error) => {
              console.error("Audio Play Error:", error);
            });

          audioRef.current.addEventListener("ended", () => {
            setAudio(false);
          });
        }
      });

      socket.on("audioError", (error: string) => {
        console.error("Audio Error:", error);
      });

      socket.on("waitingForGameStart", (data: { timeLeft: number }) => {
        setMessage(`Game will start in ${data.timeLeft} seconds...`);
      });

      socket.on("startGame", () => {
        setMessage("Let's get started!");
      });

      socket.on("resetLocalStorage", () => {
        localStorage.removeItem("score");
        localStorage.removeItem("rank");
        setScore(0);
        setRank(0);
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
        socket.off("timeUpdate");
        socket.off("audio");
        socket.off("audioError");
        socket.off("waitingForGameStart");
        socket.off("startGame");
        socket.off("resetLocalStorage");
      };
    });
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

  const handleEnableAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio Play Error:", error);
      });
    }
  };

  return (
    <>
      <audio ref={audioRef} />
      <Dialog defaultOpen>
        <DialogContent className="w-4/5 rounded-lg flex flex-col gap-6">
          <DialogHeader className="text-left flex flex-col gap-2">
            <DialogTitle>Enable Audio</DialogTitle>
            <DialogDescription>
              Select to enable audio for the game.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex justify-end gap-2">
            <DialogClose>
              <Button onClick={() => handleEnableAudio()}>Confirm</Button>
            </DialogClose>
            <DialogClose>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <div className="mb-32">
        {/* MC */}
        <div className="border-b-2 border-slate-400 bg-[#1f263b] z-10 relative pt-4">
          <SnowParticles />
          {audio ? <AnimatedTalkingMC /> : <AnimatedIdleMC />}
          <div className="countdown-timer absolute bottom-3 left-3">
            <div className="bg-[#7d4af9] text-white p-4 text-2xl font-semibold rounded-full w-16">
              {timeLeft}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 z-10 pt-12">
          {!leaderboardVisible ? (
            <>
              {/* Stats chart */}
              {questionOver && (
                <Stats
                  chartData={chartData}
                  correctAnswer={correctAnswer}
                  falseAnswerClassChart={falseAnswerClassChart}
                />
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
          ) : (
            // Leaderboard
            <Leaderboard topPlayers={topPlayers} />
          )}
        </div>
      </div>

      {/* Footer: username, score, place */}
      <div className="border-t-2 border-slate-400 bg-white flex justify-between items-center p-4 z-10 w-full fixed -bottom-1">
        <div className="flex items-center gap-2">
          <img
            src={userInfo?.avatar ? userInfo?.avatar : defaultAvatar}
            alt="User Avatar"
            className="h-10 w-10 rounded-full"
          />
          <span className="mr-2">{userInfo?.username}</span>
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
