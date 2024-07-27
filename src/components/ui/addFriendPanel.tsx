import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddFriendPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const handleSendRequest = () => {
    // Implement the logic to send a friend request here
    setRequestSent(true);
  };

  return (
    <div className="relative">
      <Button variant="outline" className="p-2 text-purple-500" onClick={() => setIsVisible(!isVisible)}>
        <FontAwesomeIcon icon={faUserPlus} />
      </Button>
      {isVisible && (
        <div className="absolute top-12 right-0 w-64 bg-white border border-gray-300 shadow-lg rounded-md p-4">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-500">Add Friend</h3>
            <div className="relative mb-4">
              <Input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} className="pr-10 border-purple-500" />
              {requestSent && <FontAwesomeIcon icon={faCheck} className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500" />}
            </div>
            <Button variant="outline" className="w-full bg-purple-500 text-white hover:bg-purple-600" onClick={handleSendRequest} disabled={requestSent}>
              {requestSent ? "Request Sent" : "Send Request"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
