import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "@/config/firebaseConfig";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthenticated(!!user); // Set authenticated to true if the user exists
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return authenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
