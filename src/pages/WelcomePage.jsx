import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/WelcomePage.css";
import logo from "../assets/logo.png";
import background from "../assets/map-background.png";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="welcome-container">
      <img src={background || "/placeholder.svg"} alt="background" className="background-img" />
      <div className="overlay">
        <img src={logo || "/placeholder.svg"} alt="App Logo" className="app-logo" />
        <h1 className="app-title">Indoor Navigator</h1>
        <p className="welcome-caption">Navigate indoor spaces with ease</p>
        <div className="button-group">
          {currentUser ? (
            <button onClick={() => navigate("/mapview")}>Go to Map</button>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/signup")}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;