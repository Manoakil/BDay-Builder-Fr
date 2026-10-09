import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser, getRoleHome } from "../service/authService";
import "../style/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to role-based home
  if (localStorage.getItem("isLoggedIn")) {
    return <Navigate to={getRoleHome()} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await loginUser(email, password);
      navigate(getRoleHome(), { replace: true });
    } catch (err) {
      // Improve error message for network issues (like CORS or server down)
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Network error: Could not connect to the backend server. Please check if the server is running and configured correctly.");
      } else {
        setError(err.message || "An unexpected error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <div className="auth-image-panel">
        <div className="auth-branding">
          <div className="auth-logo-badge">✨</div>
          <span className="auth-brand-name">Birthday Builder</span>
        </div>

        <motion.div
          className="auth-image-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-badge">🎉 Celebrate Life</div>
          <h1>Create Unforgettable Memories</h1>
          <p>
            Log in to manage your organization's birthday events, moderate wishes, or experience a celebration built just for you.
          </p>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access your portal</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  <img 
                    src={showPassword ? "/monkey.png" : "/eye.png"} 
                    alt={showPassword ? "Hide password" : "Show password"} 
                    style={{ width: '35px', height: '35px', objectFit: 'contain' }}
                  />
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <a href="#forgot">Forgot password?</a>
            </div>

            {error && (
              <motion.p
                className="error-msg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ⚠️ {error}
              </motion.p>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign In to Vault"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account yet? <Link to="/signup">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
