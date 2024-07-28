import { useState, useEffect } from "react";
import React from "react";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/avatar.png";
import { Input } from "@/components/ui/input";
import "./EventList.css";

const username = "John Doe";
const avatar = "";

const eventItems = [
  {
    // name, description, imageURL, brand, startTime, endTime, vouchers: [{voucher, quantity}], game, status
    name: "Summer Fun Quiz Challenge",
    description: "Join our Summer Fun Quiz Challenge and stand a chance to win refreshing prizes every day! Answer fun trivia questions and earn vouchers.",
    brand_name: "Cool Drinks Inc.",
    startTime: "2024-07-01T10:00:00Z",
    endTime: "2024-07-31T22:00:00Z",
    game_type: "Quiz",
    status: "Upcoming",
    imageURL: "https://ohiostate.pressbooks.pub/app/uploads/sites/8/2016/09/ThinkstockPhotos-483171893.jpg",
  },
  {
    // name, description, imageURL, brand, startTime, endTime, vouchers: [{voucher, quantity}], game, status
    name: "Summer Fun Quiz Challenge",
    description: "Join our Summer Fun Quiz Challenge and stand a chance to win refreshing prizes every day! Answer fun trivia questions and earn vouchers.",
    brand_name: "Cool Drinks Inc.",
    startTime: "2024-07-01T10:00:00Z",
    endTime: "2024-07-31T22:00:00Z",
    game_type: "Quiz",
    status: "Upcoming",
    imageURL: "https://ohiostate.pressbooks.pub/app/uploads/sites/8/2016/09/ThinkstockPhotos-483171893.jpg",
  },
  {
    // name, description, imageURL, brand, startTime, endTime, vouchers: [{voucher, quantity}], game, status
    name: "Summer Fun Quiz Challenge",
    description: "Join our Summer Fun Quiz Challenge and stand a chance to win refreshing prizes every day! Answer fun trivia questions and earn vouchers.",
    brand_name: "Cool Drinks Inc.",
    startTime: "2024-07-01T10:00:00Z",
    endTime: "2024-07-31T22:00:00Z",
    game_type: "Quiz",
    status: "Upcoming",
    imageURL: "https://ohiostate.pressbooks.pub/app/uploads/sites/8/2016/09/ThinkstockPhotos-483171893.jpg",
  },
  {
    // name, description, imageURL, brand, startTime, endTime, vouchers: [{voucher, quantity}], game, status
    name: "Summer Fun Quiz Challenge",
    description: "Join our Summer Fun Quiz Challenge and stand a chance to win refreshing prizes every day! Answer fun trivia questions and earn vouchers.",
    brand_name: "Cool Drinks Inc.",
    startTime: "2024-07-01T10:00:00Z",
    endTime: "2024-07-31T22:00:00Z",
    game_type: "Quiz",
    status: "Upcoming",
    imageURL: "https://ohiostate.pressbooks.pub/app/uploads/sites/8/2016/09/ThinkstockPhotos-483171893.jpg",
  },
  {
    // name, description, imageURL, brand, startTime, endTime, vouchers: [{voucher, quantity}], game, status
    name: "Summer Fun Quiz Challenge",
    description: "Join our Summer Fun Quiz Challenge and stand a chance to win refreshing prizes every day! Answer fun trivia questions and earn vouchers.",
    brand_name: "Cool Drinks Inc.",
    startTime: "2024-07-01T10:00:00Z",
    endTime: "2024-07-31T22:00:00Z",
    game_type: "Quiz",
    status: "Upcoming",
    imageURL: "https://ohiostate.pressbooks.pub/app/uploads/sites/8/2016/09/ThinkstockPhotos-483171893.jpg",
  },
];

const EventList: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedTimeFrames, setSelectedTimeFrames] = useState<{ [key: string]: string }>({
    All: "Happening",
    "Shaking game": "Happening",
    "Quiz game": "",
  });
  const [quizGameTimes, setQuizGameTimes] = useState<{ time: string; label: string }[]>([]);

  const handleSelectGame = (buttonName: string) => {
    setSelectedGame(buttonName);
  };

  const handleSelectTimeFrame = (buttonName: string) => {
    setSelectedTimeFrames((prevState) => ({
      ...prevState,
      [selectedGame]: buttonName,
    }));
  };

  useEffect(() => {
    if (selectedGame === "Quiz game") {
      const times = generateNearestTimes();
      setQuizGameTimes(times);
      if (times.length > 0) {
        setSelectedTimeFrames((prevState) => ({
          ...prevState,
          "Quiz game": times[0].time,
        }));
      }
    }
  }, [selectedGame]);

  const generateNearestTimes = () => {
    const times: { time: string; label: string }[] = [];
    const now = new Date();
    const currentHour = now.getHours();
    const nextStartHour = Math.ceil(currentHour / 3) * 3; // Find the next hour divisible by 3

    for (let i = 0; i < 5; i++) {
      const futureTime = new Date(now);
      futureTime.setHours(nextStartHour + i * 3, 0, 0, 0); // Set the time to the next 3-hour interval
      const hours = futureTime.getHours().toString().padStart(2, "0");
      const minutes = futureTime.getMinutes().toString().padStart(2, "0");
      const label = i === 0 ? "Happening" : "Upcoming";
      times.push({ time: `${hours}:${minutes}`, label });
    }
    return times;
  };

  const totalEvents = 10;
  const totalShakingGames = 4;
  const totalQuizGames = 6;

  return (
    <>
      <div className="pb-16">
        <header className="flex justify-between items-center p-4">
          <div className="flex-shrink-0">
            <img src={logo} alt="Logo" className="h-12" />
          </div>
          <div className="flex items-center">
            <span className="mr-2">{username}</span>
            <img src={avatar ? avatar : defaultAvatar} alt="User Avatar" className="h-10 w-10 rounded-full" />
          </div>
        </header>
        <div className="sticky top-0 z-50">
          {/* ---------------------------------------------------------------------- */}
          {/* Game filter */}
          <div className="bg-white flex border-b">
            <button className={`flex-grow p-2 ${selectedGame === "All" ? "border-b-2 border-[#7d4af9] text-[#7d4af9] font-bold" : ""}`} onClick={() => handleSelectGame("All")}>
              All ({totalEvents})
            </button>
            <button className={`flex-grow p-2 ${selectedGame === "Shaking game" ? "border-b-2 border-[#7d4af9] text-[#7d4af9] font-bold" : ""}`} onClick={() => handleSelectGame("Shaking game")}>
              Shaking game ({totalShakingGames})
            </button>
            <button className={`flex-grow p-2 ${selectedGame === "Quiz game" ? "border-b-2 border-[#7d4af9] text-[#7d4af9] font-bold" : ""}`} onClick={() => handleSelectGame("Quiz game")}>
              Quiz game ({totalQuizGames})
            </button>
          </div>
          {/* ---------------------------------------------------------------------- */}
          {/* Timeframe filter */}
          <div className="shadow-sm">
            {selectedGame === "Quiz game" ? (
              <div className="p-1 bg-slate-50 flex overflow-x-auto w-screen hidden-scrollbar">
                {quizGameTimes.map((timeObj, index) => (
                  <div
                    key={index}
                    className={`bg-white min-w-28 p-2 border rounded-lg m-1 whitespace-nowrap text-center ${
                      selectedTimeFrames["Quiz game"] === timeObj.time ? "border-[#7d4af9] text-[#7d4af9]" : "border-gray-500"
                    }`}
                    onClick={() => handleSelectTimeFrame(timeObj.time)}
                  >
                    <div className="font-semibold text-xl">{timeObj.time}</div>
                    <div>{timeObj.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-1 bg-slate-50 flex">
                <button
                  className={`bg-white flex-1 p-2 border rounded-lg m-1 ${selectedTimeFrames[selectedGame] === "Happening" ? "border-[#7d4af9]  text-[#7d4af9]" : "border-gray-500"}`}
                  onClick={() => handleSelectTimeFrame("Happening")}
                >
                  <span className="">Happening</span>
                </button>
                <button
                  className={`bg-white flex-1 p-2 border rounded-lg m-1 ${selectedTimeFrames[selectedGame] === "Upcoming" ? "border-[#7d4af9]  text-[#7d4af9]" : "border-gray-500"}`}
                  onClick={() => handleSelectTimeFrame("Upcoming")}
                >
                  <span className="">Upcoming</span>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* ---------------------------------------------------------------------- */}
        {/* Searchbar */}
        <div className="m-4">
          <Input placeholder="Search" className="" />
        </div>
        {/* ---------------------------------------------------------------------- */}
        {/* Event list */}
        <div>
          {eventItems.map((event, index) => (
            <div key={index} className="flex m-2 p-2 border-b border-slate-300 relative">
              <div className="w-1/3">
                <div className="aspect-w-1 aspect-h-1">
                  <img src={event.imageURL} alt={event.name} className="object-cover rounded-lg" />
                </div>
              </div>
              <div className="w-2/3 pl-2 text-left flex flex-col justify-between">
                <div>
                  <div className="mb-1 font-semibold line-clamp-1">{event.name}</div>
                  <div className="mb-2 line-clamp-2 text-sm">{event.description}</div>
                  <div className="font-medium">{event.brand_name}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-[#7d4af9]">
                    {new Date(event.startTime).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })} -{" "}
                    {new Date(event.endTime).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })}
                  </div>
                  <div className="bg-yellow-400 p-1 rounded-md">{event.status}</div>
                </div>
              </div>
              <div className="text-white bg-blue-500 p-1 rounded-md text-sm absolute -top-0.5 -left-0.5">{event.game_type}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EventList;
