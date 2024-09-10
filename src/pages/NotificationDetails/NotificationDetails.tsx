import { useParams } from "react-router-dom";
import Notification from "@/types/Notification";
import { formatDateFromNow } from "@/utils/DateUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";



const NotificationDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Access the passed voucher object from state
  const { notification } = location.state || {};


  if (!notification) {
    return <div>No notification found</div>;
  }


  return (
    <div className="max-w-2xl mx-auto p-3 pb-6 pt-0 bg-white rounded-lg shadow-lg">
      <div className="sticky top-0 z-50 tex-left bg-white p-4 border-b border-gray-200 flex flex-row">
        <div className=" flex flex-col justify-center items-center mr-2 "
          onClick={() => navigate(-1)}
        >
          <MdArrowBackIos className="text-center" />
        </div>
        <h1 className="text-2xl font-bold">Notification Details</h1>
      </div>

      <div className="mt-6">
        <p className="text-gray-400 text-sm">{formatDateFromNow(notification.createdAt)}</p>
        <h2 className="mt-4 text-2xl font-semibold">{notification.title}</h2>
        <p className="mt-4 text-lg text-gray-700">{notification.content}</p>
      </div>

    </div>
  );
}

export default NotificationDetails;
