import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import classes from "./NotificationPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
const NotificationPopup: React.FC = () => {
  const [notification, setNotification] = useState("");

  const handleAccept = (type: string) => {
    setNotification(`You have accepted the ${type} request from Huy`);
  };

  const handleDecline = (type: string) => {
    setNotification(`You have declined the ${type} request from Huy`);
  };

  return (
    <Popover>
    <PopoverTrigger>
        <FontAwesomeIcon
          icon={faBell}
          className=" hover:text-purple-700 transition-colors duration-300 text-xl"
        />
      </PopoverTrigger>
      <PopoverContent className={classes.popup_inner}>
        <h2>Notification</h2>
        <ul>
          <li>
            You received a gift from Huy
          </li>
          <li>
            Friend Request From Huy
            <div className={classes.buttons}>
              <button className={classes.accept} onClick={() => handleAccept("friend")}>Accept</button>
              <button className={classes.decline} onClick={() => handleDecline("friend")}>Decline</button>
            </div>
          </li>
          <li>
            Play request from Huy
            <div className={classes.buttons}>
              <button className={classes.accept} onClick={() => handleAccept("play")}>Accept</button>
              <button className={classes.decline} onClick={() => handleDecline("play")}>Decline</button>
            </div>
          </li>
        </ul>
        {notification && <p className={classes.notification}>{notification}</p>}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopup;
