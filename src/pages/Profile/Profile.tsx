import React, { useState } from "react";
import User from "@/types/User";
import avatarImg from "@/assets/avatar.png";
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "@/utils/authUtils";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    profileImgUrl: avatarImg, // Placeholder image URL
    fullName: "John Doe",
    password: "",
    email: "johndoe@example.com",
    phone: "+1234567890",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log("User details saved:", user);
    setIsEditing(false);
  };

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
          src={user.profileImgUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      {/* Profile Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-left text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-left text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-left text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={user.phone}
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
