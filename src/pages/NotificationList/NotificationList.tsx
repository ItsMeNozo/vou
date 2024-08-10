import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Notification from '@/types/Notification';
import moment from "moment";



const notifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to the Platform!",
    content: "Thank you for joining our platform. We're excited to have you onboard.",
    read: false,
    createdAt: new Date("2024-08-01T09:00:00Z"),
    updatedAt: new Date("2024-08-01T09:00:00Z")
  },
  {
    id: "2",
    title: "New Feature Released",
    content: "We have released a new feature that will improve your experience. Check it out now!",
    read: true,
    createdAt: new Date("2024-08-05T12:30:00Z"),
    updatedAt: new Date("2024-08-05T14:00:00Z")
  },
  {
    id: "3",
    title: "Security Update",
    content: "We've updated our security protocols. Please review the changes to stay informed.",
    read: false,
    createdAt: new Date("2024-08-08T08:45:00Z"),
    updatedAt: new Date("2024-08-08T08:45:00Z")
  },
  {
    id: "4",
    title: "Scheduled Maintenance",
    content: "Our platform will undergo scheduled maintenance on August 10th. Please be aware of potential downtime.",
    read: false,
    createdAt: new Date("2024-08-09T15:00:00Z"),
    updatedAt: new Date("2024-08-09T15:00:00Z")
  },
  {
    id: "5",
    title: "Account Verified",
    content: "Your account has been successfully verified. You now have full access to all features.",
    read: true,
    createdAt: new Date("2024-08-10T10:20:00Z"),
    updatedAt: new Date("2024-08-10T10:30:00Z")
  }
];



const NotificationList: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectNotification = (id: string) => {
		navigate(`/notification/${id}`);
	}

  return (
    <>
      <div className="mb-16">
        <div className="text-left p-4 sticky top-0 z-50 bg-white">
          <span className="text-left text-3xl font-bold">Notifications</span>
        </div>
        <div className="bg-slate-50">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-white m-2 flex pr-2 border border-slate-300 relative rounded-sm"
              onClick={() => handleSelectNotification(notification.id)}
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
                  {moment(notification.createdAt).fromNow()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationList;
