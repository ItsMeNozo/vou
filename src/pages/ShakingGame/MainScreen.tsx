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
import NotificationPopup from "@/components/NotifcationPopover";//
import InventoryPopup from "@/components/InventoryPopup";
import AdditionalPlayAttemptsPopup from "@/components/AdditionalPlayAttemptsPopup"; // Import the AdditionalPlayAttemptsPopup component

const MainScreen: React.FC = () => {
  const [showGame, setShowGame] = useState(false);
  const [attempts, setAttempts] = useState(3); // Example attempts state

  const handleStartGame = () => {
    if (attempts > 0) {
      setShowGame(true);
      setAttempts(attempts - 1);
    }
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
      {!showGame && attempts === 0 && <AdditionalPlayAttemptsPopup />}
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
              <Box />
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
            </div>
          ) : (
            <>
              <div className={classes.game_banner}>
                <img src={item1} alt="Game Icon" width={100} />
                <img src={item2} alt="Game Icon" width={100} />
                <img src={item3} alt="Game Icon" width={100} />
              </div>
              <button onClick={handleStartGame} className={classes.start_btn}>
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
