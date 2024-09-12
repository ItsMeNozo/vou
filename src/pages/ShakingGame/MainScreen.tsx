import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import classes from "./MainScreen.module.css";
import rabbit from "@/assets/game/items/rabbit.png";
import cat from "@/assets/game/items/cat.png";
import panda from "@/assets/game/items/panda.png";
import shake from "@/assets/game/wshake.png";
import Box from "@/components/ShakingBox";
import { QuestionPopover } from "@/components/HelpPopover";

import NotificationPopup from "@/components/NotifcationPopover";
import InventoryPopup from "@/components/InventoryPopup";
import AdditionalPlayAttemptsPopup from "@/components/AdditionalPlayAttemptsPopup";

type ItemType = {
  name: "rabbit" | "cat" | "panda";
  image: string;
};

// Array of items to choose from with names and corresponding images
const items: ItemType[] = [
  { name: "rabbit", image: rabbit },
  { name: "cat", image: cat },
  { name: "panda", image: panda },
];

const MainScreen: React.FC = () => {
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [attempts, setAttempts] = useState(0); // Default 0, will be fetched from backend
  const [isShaking, setIsShaking] = useState(false);
  const [showDropAnimation, setShowDropAnimation] = useState(false);
  const [randomItem, setRandomItem] = useState<ItemType | null>(null); // State for random item
  const [showPopup, setShowPopup] = useState(false); // State for showing popup when no attempts
  const [username, setUsername] = useState(""); // State for username

  // Function to fetch player data (username and plays)
  const fetchPlayerData = async () => {
    try {
      const playerId = "vSYRZLEJQxuE6WZH3CC2"; // Example player ID
      const response = await axios.get(`http://localhost:3005/api/player/${playerId}`); // Backend API to fetch player data

      // Update state with the fetched data
      setUsername(response.data.username);
      setAttempts(response.data.plays);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  // Fetch player data when the component is mounted
  useEffect(() => {
    fetchPlayerData();
  }, []);

  const handleShakeEnd = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setRandomItem(items[randomIndex]); // Select a random item
    setShakeTrigger(false); // Reset shake trigger
  };

  

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup when the user dismisses it
  };

  const handleGetMoreAttempts = (additionalAttempts: number) => {
    setAttempts(attempts + additionalAttempts); // Add the specified number of attempts
    setShowPopup(false); // Close the popup after getting more attempts
  };
 // Call the API only when randomItem has been updated
useEffect(() => {
  if (randomItem) {
    handleShakeResult(randomItem);  // Call API after the random item is set
  }
}, [randomItem]);

const handleStartGame = () => {
  if (attempts > 0) {
    setShowGame(true);
    setAttempts(attempts - 1);
    setIsShaking(true);

    setTimeout(() => {
      setShowDropAnimation(true);
      setIsShaking(false);

      // Select a random item and update the state
      const randomIndex = Math.floor(Math.random() * items.length);
      const chosenItem = items[randomIndex]; 
      setRandomItem(chosenItem);  // Set the chosen item and trigger useEffect

    }, 1500); 
  } else {
    setShowPopup(true); 
  }
};

  
  // Hàm gọi API sau khi đã random item
  const handleShakeResult = (shakenItem: ItemType) => {
    console.log("Random Item:", shakenItem);
    const endpoint = "http://localhost:3005/api/shake";
  
    const data = {
      playerId: "vSYRZLEJQxuE6WZH3CC2", // Ví dụ Player ID
      item: shakenItem.name, // Gửi item được chọn
    };
  
    axios.post(endpoint, data)
      .then((response) => {
        console.log("Shake successful:", response.data);
      })
      .catch((error) => {
        console.error("Error shaking:", error);
      });
  };
  
  
  

  return (
    <div>
      <nav className={classes.navbar}>
        <Link to={"#info"} className={`${classes.navlink} ${classes.profile}`}>
          <span className={classes.username}>{username || "Player"}</span>
          <small className={classes.remaining}>{attempts} plays remaining</small>
        </Link>
        <div className={classes.navbar_controls}>
          <NotificationPopup />
          
          <InventoryPopup />
          <QuestionPopover />
        </div>
      </nav>

      {showPopup && (
        <AdditionalPlayAttemptsPopup
          onClose={handleClosePopup}
          onGetMoreAttempts={handleGetMoreAttempts} remainingPlays={0}        />
      )}

      <div
        className={classes.main_screen}
        style={{
          background:
            "linear-gradient(352.71deg, #6530b9 -0.26%, #FFFFFF 73.24%)",
        }}
      >
        <div className={classes.game_menu}>
          <h1 className={classes.game_title}>Shake the pet</h1>
          {showGame ? (
            <div className="mt-5">
              <Box triggerShake={isShaking} onShakeEnd={handleShakeEnd} />

              <div className={classes.instruction}>
                <img
                  src={shake}
                  alt="Game Icon"
                  width={120}
                  className={classes.shake_image}
                />
                <p>
                  Shake the pet to collect items. Collect enough items to win
                  rewards.
                </p>
              </div>

            
{randomItem && (
  <div className={classes.result}>
    <h2>Congratulations! You got:</h2>
    <img src={randomItem.image} alt={randomItem.name} className={classes.random_item} />
    <button onClick={handleStartGame} className={classes.start_btn}>
      Shake More
    </button>
  </div>
)}
            </div>
          ) : (
            <>
              <div className={classes.game_banner}>
                <img src={rabbit} alt="Rabbit" width={100} />
                <img src={cat} alt="Cat" width={100} />
                <img src={panda} alt="Panda" width={100} />
              </div>
              <button
                onClick={handleStartGame}

                className={classes.start_btn}
                disabled={attempts === 0} // Disable the button when no attempts left
              >
                SHAKE IT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
