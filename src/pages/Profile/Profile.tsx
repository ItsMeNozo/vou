import React, { useEffect, useState } from "react";
import axios from "axios";
import User from "@/types/User";
import avatarImg from "@/assets/avatar.png";
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "@/utils/authUtils";
import { auth } from "@/config/firebaseConfig";

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditing(true);
    const { id, value } = e.target;
    setUser(
      (prevData) =>
        ({
          ...prevData,
          [id]: value || "",
        }) as User,
    );
  };

  const handleSave = async () => {
    auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        try {
          await axios.put(`${API_GATEWAY_URL}/api/user/${userAuth.uid}`, user);
        } catch (error) {
          console.error("Error updating user :", error);
        }
        setIsEditing(false);
      }
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const response = await axios.get(
            `${API_GATEWAY_URL}/api/user/${user?.uid}`,
          );
          setUser(response.data.data);
        } catch (err) {
          console.log("Failed to fetch user details");
        }
      }
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      )}

      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        <img
          src={user?.avatar ? user.avatar : avatarImg}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      {/* Profile Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-left text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            value={user?.username}
            disabled={true}
            className="w-full p-2 mt-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-left text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={user?.email}
            disabled={true}
            className="w-full p-2 mt-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-left text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullname"
            value={user?.fullname}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-left text-gray-700">Phone</label>
          <input
            type="tel"
            id="phoneNumber"
            value={user?.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
          />
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <button
          onClick={() => handleSignOut(navigate)}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
