import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAuthHeaders, API_BASE_URL } from "../service/authService";
import "../style/Signup.css";

export default function InviteSignup() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
  });

  useEffect(() => {
    // Fetch invite details securely to display the org and intended role
    // In a real implementation, you'd have an endpoint like GET /invites/:token
    const fetchInvite = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/invites/validate/${token}`);
        if (!res.ok) throw new Error("Invalid or expired invitation link.");
        const data = await res.json();
        setInviteData(data);
        setForm(f => ({ ...f, email: data.email || "" }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }
    
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      // Register with token
      const res = await fetch(`${API_BASE_URL}/auth/register-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email: form.email,
          password: form.password,
          full_name: form.full_name
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Registration failed");
      }
      
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="auth-page">Loading invitation...</div>;

  return (
    <div className="auth-page">
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
          <div className="auth-badge">🎟️ Exclusive Access</div>
          {inviteData ? (
            <>
              <h1>You're invited to</h1>
              <h2>{inviteData.organization_name}'s Celebration</h2>
              <p>Create your secure account below to join the celebration as a {inviteData.role.replace('_', ' ')}.</p>
            </>
          ) : (
            <>
              <h1>Invitation Invalid</h1>
              <p>This invitation link may have expired or does not exist.</p>
            </>
          )}
        </motion.div>
      </div>

      <div className="auth-form-panel">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Complete your registration to continue</p>
          </div>

          {error && <div className="auth-alert error-alert">{error}</div>}
          {success && <div className="auth-alert success-alert">{success}</div>}

          {inviteData && !success && (
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
                  disabled={!!inviteData.email} // Disable if email was pre-set in invite
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Log in here</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
