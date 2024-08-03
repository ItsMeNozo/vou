import React from "react";
import classes from "./Notifications.module.css";

const Notifications: React.FC = () => {
  return (
    <div className={classes.notifications}>
      <h3>Notifications</h3>
      <ul>
        <li>
          You received a gift! <button className={classes.acceptBtn}>Accept</button>
        </li>
        <li>
          You received an attempt! <button className={classes.acceptBtn}>Accept</button>
        </li>
        <li>
          Play request from Nhung
          <button className={classes.giveBtn}>Give</button>
        </li>
      </ul>
    </div>
  );
};

export default Notifications;
