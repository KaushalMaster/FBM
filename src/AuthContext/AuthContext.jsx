// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { auth } from "../Config/firebase-config";

export const AuthContext = createContext(
  { currentUser: null } // default value
);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        return;
      }
      setCurrentUser(user.uid);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
