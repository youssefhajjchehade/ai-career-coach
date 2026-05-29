import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/register", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong during register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page premium-auth">
      <section className="auth-shell reverse-auth">
        <div className="auth-visual">
          <span className="hero-badge">Build smarter applications</span>
          <h1>Create your AI-powered resume analysis workspace.</h1>
          <p>
            Save reports, compare roles, detect missing skills, and download
            professional PDF summaries from one dashboard.
          </p>

          <div className="auth-feature-list">
            <span>✓ Gemini analysis</span>
            <span>✓ Resume PDF parsing</span>
            <span>✓ Saved history</span>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <p className="eyebrow">Create account</p>
          <h1>Start free</h1>
          <p>Build your resume improvement workspace in seconds.</p>

          {message && <div className="error-message">{message}</div>}

          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Youssef"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="youssef@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
