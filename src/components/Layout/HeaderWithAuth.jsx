import React, { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthProvider";
import Header from "./Header";

export default function HeaderWithAuth() {
  const auth = useAuth();
  const { user, logout } = auth;
  const leaveTimestamp = useRef(null);
  const TIMEOUT_MINUTES = 30;

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        leaveTimestamp.current = Date.now();
      } else if (document.visibilityState === "visible") {
        if (leaveTimestamp.current) {
          const diff = Date.now() - leaveTimestamp.current;
          // 30 minutes = 1800000 ms
          if (diff >= TIMEOUT_MINUTES * 60 * 1000) {
            logout();
          }
        }
        leaveTimestamp.current = null;
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [logout]);

  if (!user) return null;
  return <Header />;
}
