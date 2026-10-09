import React from "react";
import { Link, Navigate } from "react-router-dom";
import { getRoleHome } from "../service/authService";
import "../style/Landing.css";

function Landing() {
  if (localStorage.getItem("isLoggedIn")) {
    return <Navigate to={getRoleHome()} replace />;
  }

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>🎂 Celebrate Every Moment</h1>
        <p>Send wishes, share memories, and make birthdays unforgettable.</p>
        <div className="landing-buttons">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/signup" className="btn-signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
