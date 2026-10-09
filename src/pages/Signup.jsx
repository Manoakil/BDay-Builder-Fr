import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerWithCode, getRoleHome } from "../service/authService";
import "../style/Signup.css";

function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    secret_code: "",
    role: "wisher",
    date_of_birth: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to role-based home
  if (localStorage.getItem("isLoggedIn")) {
    return <Navigate to={getRoleHome()} replace />;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.full_name || form.full_name.trim().length < 2) {
      setError("Please enter a valid full name.");
      return;
    }
    if (!form.email || !form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!form.secret_code || form.secret_code.trim().length < 3) {
      setError("Please enter a valid secret code.");
      return;
    }

    setLoading(true);
    try {
      await registerWithCode(form.email, form.password, form.full_name, form.secret_code.trim().toUpperCase(), form.role, form.date_of_birth);
      setSuccess("Registration successful! Redirecting to login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Network error: Could not connect to the backend server. Please check if the server is running and configured correctly.");
      } else {
        setError(err.message || "An unexpected error occurred during signup.");
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
          <div className="auth-badge">🎟️ Create Account</div>
          <h1>Join the Platform</h1>
          <p>
            Create your administrative account to manage organizations and birthday celebrations.
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
            <h2>Create Account</h2>
            <p>Register with your organization's secret invite code</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="full_name"
                placeholder="Alex Taylor"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Organization / Event Secret Code</label>
              <input
                name="secret_code"
                placeholder="e.g. A3BX9K"
                value={form.secret_code}
                onChange={handleChange}
                required
                style={{ textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}
              />
            </div>

            <div className="form-group">
              <label>Your Role in the Organization / Event</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="wisher">🎉 Event Guest / Wisher</option>
                <option value="birthday_person">👑 Guest of Honor (Birthday Person)</option>
                <option value="org_admin">🎛️ Organization Admin / Host</option>
              </select>
            </div>

            {form.role === "birthday_person" && (
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  required={form.role === "birthday_person"}
                />
                <p style={{ fontSize: "0.8rem", color: "#8c829e", marginTop: "0.3rem" }}>
                  If today is your birthday, you'll be auto-approved instantly.
                </p>
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
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

            {error && (
              <motion.p
                className="error-msg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ⚠️ {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="success-msg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ✅ {success}
              </motion.p>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating account…" : "Join Organization & Sign Up"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
