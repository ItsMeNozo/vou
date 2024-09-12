import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios for API requests
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import classes from "./NotificationPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

const NotificationPopup: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // Hàm để fetch thông báo từ API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3005/api/player/notifications/vSYRZLEJQxuE6WZH3CC2'); // Replace with playerId
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleAccept = async (notificationId: string, playerAId: string) => {
    try {
      await axios.post('http://localhost:3005/api/respond-request', {
        playerAId,  // Sử dụng senderId từ notification
        response: 'accept'
      });

      // Xử lý khi chấp nhận thành công
      setNotifications(notifications.filter((notif) => notif.id !== notificationId));
    } catch (error) {
      setError("Error accepting play request");
    }
  };

  const handleDecline = async (notificationId: string, playerAId: string) => {
    try {
      await axios.post('http://localhost:3005/api/respond-request', {
        playerAId,  // Sử dụng senderId từ notification
        response: 'decline'
      });

      // Xử lý khi từ chối thành công
      setNotifications(notifications.filter((notif) => notif.id !== notificationId));
    } catch (error) {
      setError("Error declining play request");
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger>
        <FontAwesomeIcon
          icon={faBell}
          className="hover:text-purple-700 transition-colors duration-300 text-xl"
        />
      </PopoverTrigger>
      <PopoverContent className={classes.popup_inner}>
        <h2>Notification</h2>
        <ul>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <li key={notification.id}>
                {notification.message}
                <div className={classes.buttons}>
                  <button className={classes.accept} onClick={() => handleAccept(notification.id, notification.senderId)}>Accept</button>
                  <button className={classes.decline} onClick={() => handleDecline(notification.id,notification.senderId)}>Decline</button>
                </div>
              </li>
            ))
          ) : (
            <li>No new notifications</li>
          )}
        </ul>
        {notificationMessage && <p className={classes.notification}>{notificationMessage}</p>}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopup;
