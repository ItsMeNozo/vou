import axios from "axios";
import { auth } from "@/config/firebaseConfig"; // Firebase config
import { signOut } from "firebase/auth"; // Firebase sign-out method
import { NavigateFunction } from "react-router-dom"; // Import Navigate for redirect

const AUTH_USER_PORT = import.meta.env.VITE_AUTH_USER_PORT;

export const handleSignOut = async (navigate: NavigateFunction) => {
  try {
    // Get the current user's ID token (access token)
    const idToken = await auth.currentUser?.getIdToken(); // Retrieve the ID token

    if (!idToken) {
      console.error("No access token found");
      return;
    }

    // Send logout request to backend with the ID token in the body
    await axios.post(`http://localhost:${AUTH_USER_PORT}/api/auth/logout`, {
      token: idToken, // Send the token in the request body
    });

    // Sign out from Firebase Authentication
    await signOut(auth);

    // Navigate to login page after sign-out
    navigate("/auth/login");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
