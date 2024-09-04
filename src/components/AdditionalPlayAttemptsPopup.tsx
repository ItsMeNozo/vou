import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import classes from "./AdditionalPlayAttemptsPopup.module.css";

const friends = ["Nhung", "Nguyen", "John", "Doe"]; // Example list of friends

type AdditionalPlayAttemptsPopupProps = {
  onClose: () => void; // Callback to close the popup
  onGetMoreAttempts: (attempts: number) => void; // Callback to get more attempts, now accepts a number of attempts
};

const AdditionalPlayAttemptsPopup: React.FC<AdditionalPlayAttemptsPopupProps> = ({
  onClose,
  onGetMoreAttempts,
}) => {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const handleRequestFromFriend = (friend: string) => {
    setSelectedFriend(friend);
    alert(`Request sent to ${friend} for additional play attempt.`);
  };

  const handleShareOnFacebook = () => {
    alert("Shared on Facebook. You got 5 additional play attempts.");
    onGetMoreAttempts(5); // Add 5 additional play attempts
    onClose(); // Close the popup after getting more attempts
  };

  return (
    <Popover>
      <PopoverTrigger>
        <button className={classes.trigger_button}>Request More Attempts</button>
      </PopoverTrigger>
      <PopoverContent className={classes.popup_inner}>
        <h2>Oops!</h2>
        <p>You have 0 attempts left. Request more attempts:</p>
        <div className={classes.options}>
          <button onClick={handleShareOnFacebook} className={classes.share_button}>
            Share on Facebook
          </button>
          <div className={classes.friends_list}>
            {friends.map(friend => (
              <div key={friend} className={classes.friend_item}>
                <span>{friend}</span>
                <button onClick={() => handleRequestFromFriend(friend)}>Request</button>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onClose} className={classes.close_button}>Close</button>
      </PopoverContent>
    </Popover>
  );
};

export default AdditionalPlayAttemptsPopup;
