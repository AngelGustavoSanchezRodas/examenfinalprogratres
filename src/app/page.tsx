"use client";

import { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import ChatRoom from "../components/ChatRoom";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    // Check sessionStorage on load
    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("username");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(storedUser);
    }
  }, []);

  const handleLoginSuccess = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setCurrentUser(newUsername);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    setToken(null);
    setCurrentUser("");
  };

  if (!token) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <ChatRoom
      token={token}
      currentUser={currentUser}
      onLogout={handleLogout}
    />
  );
}
