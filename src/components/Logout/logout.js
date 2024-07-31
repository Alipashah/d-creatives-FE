import React from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  function handleClick() {
    // localStorage.removeItem("id");
    // localStorage.removeItem("name");
    // localStorage.removeItem("image");
    // localStorage.removeItem("email");
    // localStorage.removeItem("role");
    // localStorage.removeItem("token");
    // localStorage.removeItem("projectList");
    localStorage.clear();
    navigate("/");
  }
  return (
    <button className="login-btn ps-3 pe-3 pt-2 pb-2" onClick={handleClick}>
      Logout
    </button>
  );
}

export default Logout;
