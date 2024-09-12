import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios from "axios"; // Import axios for API requests
import classes from "./AdditionalPlayAttemptsPopup.module.css";

type AdditionalPlayAttemptsPopupProps = {
  onClose: () => void; // Callback to close the popup
  onGetMoreAttempts: (attempts: number) => void; // Callback to get more attempts
  remainingPlays: number; // Number of remaining plays
};

const AdditionalPlayAttemptsPopup: React.FC<AdditionalPlayAttemptsPopupProps> = ({
  onClose,
  onGetMoreAttempts,
  remainingPlays
}) => {
  const [friendUsername, setFriendUsername] = useState<string>(""); // Input field for friend's username

  // Request more attempts by sharing on Facebook
  const handleShareOnFacebook = async () => {
    try {
      if (remainingPlays > 0) {
        alert("You still have plays remaining. You can't get more attempts through sharing.");
        return;
      }

      const response = await axios.post('http://localhost:3005/api/share-facebook', {
        playerId: 'vSYRZLEJQxuE6WZH3CC2', // Replace with actual player ID
      });

      alert("Shared on Facebook. You got additional play attempts.");
      onGetMoreAttempts(5); // Add the granted play attempts (based on server logic)
      onClose(); // Close the popup after sharing
    } catch (error) {
      console.error("Error sharing on Facebook:", error);
      alert("There was an error sharing on Facebook.");
    }
  };

  // Handle requesting from a friend
  const handleRequestFromFriend = () => {
    if (friendUsername) {
      alert(`Request sent to ${friendUsername} for additional play attempts.`);
      setFriendUsername(""); // Clear input after sending the request
    } else {
      alert("Please enter a friend's username.");
    }
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
            Share on Facebook + 5 attempts
          </button>
          <div className={classes.request_section}>
            <input
              type="text"
              placeholder="Enter friend's username"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)} // Update state with input
              className={classes.input_field}
            />
            <button onClick={handleRequestFromFriend} className={classes.request_button}>
              Send Request
            </button>
          </div>
        </div>
        <button onClick={onClose} className={classes.close_button}>
          Close
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default AdditionalPlayAttemptsPopup;
