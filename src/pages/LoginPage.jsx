import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginPage.css";
import logo from "../assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/mapview");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      return setError("Please enter your email address");
    }

    try {
      setError("");
      setLoading(true);
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError("Failed to reset password. Please check your email.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo || "/placeholder.svg"} alt="App Logo" className="login-logo" />
        <h2>Welcome Back!</h2>
        <p>Sign in to continue navigating indoors.</p>

        {error && <div className="error-message">{error}</div>}
        {resetSent && (
          <div className="success-message">
            Password reset email sent. Check your inbox.
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="links-container">
          <p className="forgot-password" onClick={handleResetPassword}>
            Forgot your password?
          </p>
          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;