import React, { useState } from "react";
import { Link } from "react-router-dom";
import classes from "./MainScreen.module.css";
import item1 from "@/assets/game/items/item1.png";
import item2 from "@/assets/game/items/item2.png";
import item3 from "@/assets/game/items/item3.png";
import shake from "@/assets/game/wshake.png";
import Box from "@/components/ShakingBox";
import { QuestionPopover } from "@/components/HelpPopover";
import { AddFriendPanel } from "@/components/AddFriendPanel";
import NotificationPopup from "@/components/NotifcationPopover";
import InventoryPopup from "@/components/InventoryPopup";
import AdditionalPlayAttemptsPopup from "@/components/AdditionalPlayAttemptsPopup"; 

const items = [item1, item2, item3]; // Array of items to choose from

const MainScreen: React.FC = () => {
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [isShaking, setIsShaking] = useState(false); 
  const [showDropAnimation, setShowDropAnimation] = useState(false);
  const [randomItem, setRandomItem] = useState<string | null>(null); // State for random item
  const [showPopup, setShowPopup] = useState(false); // State for showing popup when no attempts

  const handleShakeEnd = () => {
    // This function is called after the shake animation ends
    const randomIndex = Math.floor(Math.random() * items.length);
    setRandomItem(items[randomIndex]); // Select a random item
    setShakeTrigger(false); // Reset shake trigger
  };

  const handleStartGame = () => {
    if (attempts > 0) {
      setShowGame(true);
      setAttempts(attempts - 1);
      setIsShaking(true);

      // Start dropping items after a short delay (simulate shake)
      setTimeout(() => {
        setShowDropAnimation(true);
        setIsShaking(false);

        // Randomly pick an item to show after shaking
        const randomIndex = Math.floor(Math.random() * items.length);
        setRandomItem(items[randomIndex]);
      }, 1500); // Shake duration before dropping items

      // Reset the shake effect after 4 seconds
      setTimeout(() => {
        setShowDropAnimation(false);
      }, 4000); // Duration of drop animation
    } else {
      setShowPopup(true); // Show popup when no attempts are left
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup when the user dismisses it
  };

  const handleGetMoreAttempts = (additionalAttempts: number) => {
    setAttempts(attempts + additionalAttempts); // Add the specified number of attempts
    setShowPopup(false); // Close the popup after getting more attempts
  };

  return (
    <div>
      <nav className={classes.navbar}>
        <Link to={"#info"} className={`${classes.navlink} ${classes.profile}`}>
          <span className={classes.username}>Ngoc Pham</span>
          <small className={classes.remaining}>{attempts} plays remaining</small>
        </Link>
        <div className={classes.navbar_controls}>
          <NotificationPopup />
          <AddFriendPanel />
          <InventoryPopup />
          <QuestionPopover />
        </div>
      </nav>

      {/* Show popup when no attempts are left */}
      {showPopup && (
        <AdditionalPlayAttemptsPopup
          onClose={handleClosePopup}
          onGetMoreAttempts={handleGetMoreAttempts} // Pass function to add more attempts
        />
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

              {/* Show random item after shaking */}
              {randomItem && (
                <div className={classes.result}>
                  <h2>Congratulations! You got:</h2>
                  <img src={randomItem} alt="Random Item" className={classes.random_item} />
                  <button onClick={handleStartGame} className={classes.start_btn}>
                    Shake More
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className={classes.game_banner}>
                <img src={item1} alt="Game Icon" width={100} />
                <img src={item2} alt="Game Icon" width={100} />
                <img src={item3} alt="Game Icon" width={100} />
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
