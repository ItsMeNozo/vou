import React from "react";
import { Link } from "react-router-dom";

import classes from "./MainScreen.module.css";

import inventoryImg from "@/assets/game/inventory.png";
import item1 from "@/assets/game/items/item1.png";
import item2 from "@/assets/game/items/item2.png";
import item3 from "@/assets/game/items/item3.png";

const MainScreen: React.FC = () => {
  return (
    <div>
      <nav className={classes.navbar}>
        <Link to={"#info"} className={`${classes.navlink} ${classes.profile}`}>
          <span className={classes.username}>Ngoc Pham</span>
          <small className={classes.remaining}>3 plays remaining</small>
        </Link>
        <div className={classes.navbar_controls}>
          <Link to={"#notification"} className={classes.navlink}>
            <span className={`material-symbols-outlined`}>notifications</span>
          </Link>
          <Link to={"#friend"} className={`${classes.navlink}`}>
            <span className="material-symbols-outlined">group</span>
          </Link>
          <Link to={"#inventory"} className={classes.navlink}>
            <img src={inventoryImg} alt="inventory" width="24" />
          </Link>
          <Link to={"#help"} className={`${classes.navlink}`}>
            <span className={`material-symbols-outlined ${classes.help}`}>help</span>
          </Link>
        </div>
      </nav>
      <div
        className={classes.main_screen}
        style={{
          background: "linear-gradient(352.71deg, #6530b9 -0.26%, #FFFFFF 73.24%)",
        }}
      >
        <div className={classes.game_menu}>
          <h1 className={classes.game_title}>Shake the pet</h1>
          <div className={classes.game_banner}>
            <img src={item1} alt="Game Icon" width={100} />
            <img src={item2} alt="Game Icon" width={100} />
            <img src={item3} alt="Game Icon" width={100} />
          </div>
          <button className={classes.start_btn}>SHAKE IT</button>
          {/* TODO: add this instruction below shaking ball
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
