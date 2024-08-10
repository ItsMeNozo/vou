import { useParams } from "react-router-dom";
import Notification from "@/types/Notification";
import { formatDateFromNow } from "@/utils/DateUtils";

const notification: Notification = {
  id: "1",
  title: "Welcome to the Platform!",
  content: "Thank you for joining our platform. We're excited to have you onboard.",
  read: false,
  createdAt: new Date("2024-08-01T09:00:00Z"),
  updatedAt: new Date("2024-08-01T09:00:00Z")
};

const NotificationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="sticky top-0 z-50 bg-white p-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold">Notification Details</h1>
      </div>

      <div className="mt-6">
        <p className="text-gray-400 text-sm">{formatDateFromNow(notification.createdAt)}</p>
        <h2 className="mt-4 text-2xl font-semibold">{notification.title}</h2>
        <p className="mt-4 text-lg text-gray-700">{notification.content}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">Status</h3>
        <p className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
          notification.read ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.read ? 'Read' : 'Unread'}
        </p>
      </div>
    </div>
  );
}

export default NotificationDetails;
