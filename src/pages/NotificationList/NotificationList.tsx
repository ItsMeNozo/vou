import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '@/types/Notification';
import { formatDateFromNow } from '@/utils/DateUtils';
import { getNotificationsByUsernameAndType, markNotificationAsRead } from '@/api/apiService';

const NotificationList: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const username = 'john_doe'; // Replace with actual username

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await getNotificationsByUsernameAndType(username);
      setNotifications(response);
      setLoading(false);
    } catch (err) {
      setError('Error fetching notifications');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSelectNotification = async (notification: Notification) => {
    try {
      if (!notification.read) {
        // Call API to mark as read
        await markNotificationAsRead(notification._id);
        // Update local state to mark the notification as read without refetching
        // setNotifications((prevNotifications) =>
        //   prevNotifications.map((n) =>
        //     n.id === notification.id ? { ...n, read: true } : n
        //   )
        // );
      }
      // Navigate to notification details page
      navigate(`/notification/notifcation-details`, { state: { notification } });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mb-16">
      <div className="text-left p-4 sticky top-0 z-50 bg-white">
        <span className="text-left text-3xl font-bold">Notifications</span>
      </div>
      <div className="bg-slate-50">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`m-2 flex pr-2 border border-slate-300 relative rounded-sm cursor-pointer ${
              notification.read ? 'bg-white' : 'bg-blue-50' // Style based on read status
            }`}
            onClick={() => handleSelectNotification(notification)}
          >
            <div className="py-2 w-2/3 pl-2 text-left">
              <div>
                <div className="mb-1 font-medium line-clamp-2">
                  {notification.title}
                </div>
                <div className="mb-2 line-clamp-1 text-sm">
                  {notification.content}
                </div>
              </div>
              <div className="text-slate-400 text-xs">
                {formatDateFromNow(notification.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
