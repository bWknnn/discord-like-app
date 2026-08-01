import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { currentUser } from "../api/users";

export default function ProtectedRoute() {
  const [auth, setAuth] = useState("loading");

  useEffect(() => {
    currentUser()
      .then((user) => setAuth(user ? "ok" : "bad"))
      .catch(() => setAuth("bad"));
  }, []);

  if (auth === "loading") {
    return null;
  }

  if (auth === "bad") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
