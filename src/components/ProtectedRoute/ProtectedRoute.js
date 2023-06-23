import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainUseContext } from "../../context/MainContext";

export default function ProtectedRoute({ children }) {
  const { user } = MainUseContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/admin");
    }
  }, [user]);
  return user ? children : null;
}
