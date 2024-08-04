import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import classes from "./AdditionalPlayAttemptsPopup.module.css";

const friends = ["Nhung", "Nguyen", "John", "Doe"]; // Example list of friends

const AdditionalPlayAttemptsPopup: React.FC = () => {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const handleRequestFromFriend = (friend: string) => {
    setSelectedFriend(friend);
    // Handle request logic here
    alert(`Request sent to ${friend} for additional play attempt.`);
  };

  const handleShareOnFacebook = () => {
    // Handle share on Facebook logic here
    alert("Shared on Facebook. You got 5 additional play attempts.");
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
      </PopoverContent>
    </Popover>
  );
};

export default AdditionalPlayAttemptsPopup;
