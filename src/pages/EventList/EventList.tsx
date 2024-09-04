import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Event from "@/models/event";
import logo from "@/assets/logo.png";
import defaultAvatar from "@/assets/avatar.png";
import { Input } from "@/components/ui/input";
import "./EventList.css";
import { useNavigate } from "react-router-dom";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const username = "John Doe";
const avatar = "";

const EventList: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedTimeFrames, setSelectedTimeFrames] = useState<{
    [key: string]: string;
  }>({
    All: "",
    "Shaking game": "",
    "Quiz game": "",
  });
  const [quizGameTimes, setQuizGameTimes] = useState<
    { time: string; label: string }[]
  >([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalQuizGames, setTotalQuizGames] = useState(0);
  const [totalShakingGames, setTotalShakingGames] = useState(0);

  const handleSelectGame = (buttonName: string) => {
    setSelectedGame(buttonName);
  };

  const handleSelectTimeFrame = (buttonName: string) => {
    setSelectedTimeFrames((prevState) => ({
      ...prevState,
      [selectedGame]: prevState[selectedGame] === buttonName ? "" : buttonName,
    }));
  };

  const handleSelectQuizGameTime = (timeObj: {
    time: string;
    label: string;
  }) => {
    setSelectedTimeFrames((prevState) => ({
      ...prevState,
      "Quiz game": prevState["Quiz game"] === timeObj.time ? "" : timeObj.time,
    }));
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/event/search?input=${query}`,
      );
      setEvents(response.data);
    } catch (err) {
      console.log("Failed to fetch events");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/event/");
        setEvents(response.data);
      } catch (err) {
        console.log("Failed to fetch events");
      }
    };

    const fetchNumberOfEvents = async () => {
      try {
        let response = await axios.get("http://localhost:3001/event/count");
        setTotalEvents(response.data.count);
        response = await axios.get(
          "http://localhost:3001/event/count?game=quiz",
        );
        setTotalQuizGames(response.data.count);
        response = await axios.get(
          "http://localhost:3001/event/count?game=shaking",
        );
        setTotalShakingGames(response.data.count);
      } catch (err) {
        console.log("Failed to fetch number of events");
      }
    };

    const fetchQuizGameTimes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/event/event-times-today",
        );
        const now = new Date();

        const times = response.data.map((time: Date) => {
          const eventTime = new Date(time);
          const formattedTime = eventTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          const label = eventTime > now ? "Upcoming" : "Happening";

          return {
            time: formattedTime,
            label: label,
          };
        });

        setQuizGameTimes(times);
      } catch (err) {
        console.log("Failed to fetch quiz game times");
      }
    };

    fetchEvents();
    fetchNumberOfEvents();
    fetchQuizGameTimes();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let url = "http://localhost:3001/event/";

        if (
          selectedGame !== "All" ||
          selectedTimeFrames[selectedGame] ||
          quizGameTimes.length > 0
        ) {
          const params = new URLSearchParams();

          if (selectedGame !== "All") {
            const game = selectedGame === "Shaking game" ? "shaking" : "quiz";
            params.append("game", game);
          }
          if (
            selectedTimeFrames[selectedGame] == "happening" ||
            selectedTimeFrames[selectedGame] == "upcoming"
          ) {
            params.append("status", selectedTimeFrames[selectedGame]);
          } else {
            params.delete("status");
          }

          if (selectedGame == "Quiz game" && quizGameTimes.length > 0) {
            const quizGameTime = quizGameTimes.find(
              (time) => time.time == selectedTimeFrames["Quiz game"],
            );
            if (quizGameTime) {
              const [hours, minutes] = quizGameTime.time.split(":");
              const date = new Date();
              date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
              params.append("start-time", date.toISOString());
            }
          }

          url = `http://localhost:3001/event/filter?${params.toString()}`;
        }

        const response = await axios.get(url);
        setEvents(response.data);
      } catch (err) {
        console.log("Failed to fetch events");
      }
    };

    fetchEvents();
  }, [selectedGame, selectedTimeFrames, quizGameTimes]);

  const handleAvatarClick = () => {
    navigate("/profile")
  }
  return (
    <>
      <div className="pb-16">
        <header className="flex justify-between items-center p-4">
          <div className="flex-shrink-0">
            <img src={logo} alt="Logo" className="h-12" />
          </div>
          <div className="flex items-center" onClick={handleAvatarClick}>
            <span className="mr-2">{username}</span>
            <img
              src={avatar ? avatar : defaultAvatar}
              alt="User Avatar"
              className="h-10 w-10 rounded-full"
            />
          </div>
        </header>
        <div className="sticky top-0 z-50">
          {/* ---------------------------------------------------------------------- */}
          {/* Game filter */}
          <div className="bg-white flex border-b">
            <button
              className={`flex-grow p-2 ${selectedGame === "All" ? "border-b-2 border-[#7d4af9] text-[#7d4af9] font-bold" : ""}`}
              onClick={() => handleSelectGame("All")}
            >
              All ({totalEvents})
            </button>
            <button
              className={`flex-grow p-2 ${selectedGame === "Shaking game" ? "border-b-2 border-[#7d4af9] text-[#7d4af9] font-bold" : ""}`}
              onClick={() => handleSelectGame("Shaking game")}
            >
              Shaking game ({totalShakingGames})
            </button>
            <button
              className={`flex-grow p-2 ${selectedGame === "Quiz game" ? "border-b-2 border-[#7d4af9] text-[#7d4af9] font-bold" : ""}`}
              onClick={() => handleSelectGame("Quiz game")}
            >
              Quiz game ({totalQuizGames})
            </button>
          </div>
          {/* ---------------------------------------------------------------------- */}
          {/* Timeframe filter */}
          <div className="shadow-sm">
            <div className="p-1 bg-slate-50 flex overflow-x-auto w-screen hidden-scrollbar">
              {selectedGame !== "Quiz game" && (
                <button
                  className={`bg-white flex-1 p-2 border rounded-lg m-1 ${
                    selectedTimeFrames[selectedGame] === "happening"
                      ? "border-[#7d4af9] text-[#7d4af9]"
                      : "border-gray-500"
                  }`}
                  onClick={() => handleSelectTimeFrame("happening")}
                >
                  <span className="">Happening</span>
                </button>
              )}
              {selectedGame === "Quiz game" &&
                quizGameTimes.map((timeObj, index) => (
                  <div
                    key={index}
                    className={`flex-1 bg-white min-w-28 p-2 border rounded-lg m-1 whitespace-nowrap text-center ${
                      selectedTimeFrames["Quiz game"] === timeObj.time
                        ? "border-[#7d4af9] text-[#7d4af9]"
                        : "border-gray-500"
                    }`}
                    onClick={() => handleSelectQuizGameTime(timeObj)}
                  >
                    <div className="font-semibold text-xl">{timeObj.time}</div>
                    <div>{timeObj.label}</div>
                  </div>
                ))}

              <button
                className={`min-w-28 bg-white flex-1 p-2 border rounded-lg m-1 ${
                  selectedTimeFrames[selectedGame] === "upcoming"
                    ? "border-[#7d4af9] text-[#7d4af9]"
                    : "border-gray-500"
                }`}
                onClick={() => handleSelectTimeFrame("upcoming")}
              >
                <span className="">Upcoming</span>
              </button>
            </div>
          </div>
        </div>
        {/* ---------------------------------------------------------------------- */}
        {/* Searchbar */}
        <div className="m-4">
          <Input
            placeholder="Search"
            className="text-md"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {/* ---------------------------------------------------------------------- */}
        {/* Event list */}
        <div>
          {events &&
            events.map((event, index) => (
              <Link to={`/event/${event.id}`} key={index}>
                <div className="flex m-2 p-2 border-b border-slate-300 relative">
                  <div className="w-1/3">
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={event.imgUrl}
                        alt={event.name}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="w-2/3 pl-2 text-left flex flex-col justify-between">
                    <div>
                      <div className="mb-1 font-semibold line-clamp-1">
                        {event.name}
                      </div>
                      <div className="mb-2 line-clamp-2 text-sm">
                        {event.description}
                      </div>
                      <div className="font-medium">{event.brand}</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-[#7d4af9]">
                        {new Date(event.startDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(event.endDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                      <div
                        className={`${
                          event.status == "upcoming"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        } p-1 rounded-md`}
                      >
                        {capitalizeFirstLetter(event.status)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-white ${
                      event.game == "quiz" ? "bg-blue-500" : "bg-orange-400"
                    } p-1 rounded-md text-sm absolute -top-0.5 -left-0.5`}
                  >
                    {capitalizeFirstLetter(event.game)}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default EventList;
