import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";

export function AddFriendPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const handleSendRequest = () => {
    // TODO: Implement the logic to send a friend request here
    setRequestSent(true);
  };

  return (
    <div className="relative">
      <button className="p-2 text-purple-500 hover:bg-gray-200 rounded-full focus:outline-none" onClick={() => setIsVisible(!isVisible)}>
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsVisible(false)}></div>
          <div className="relative w-64 bg-white border border-gray-300 shadow-lg rounded-md p-4 z-50">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-500">Add Friend</h3>
              <div className="relative mb-4">
                <Input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} className="pr-10 border-purple-500" />
                {requestSent && <FontAwesomeIcon icon={faCheck} className="absolute inset-y-3 right-0 pr-3 flex items-center text-green-500" />}
              </div>
              <button
                onClick={handleSendRequest}
                className={`w-full bg-purple-500 text-white hover:bg-purple-600 p-2 rounded-md ${requestSent ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={requestSent}
              >
                {requestSent ? "Request Sent" : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
