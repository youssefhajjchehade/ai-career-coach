import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
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

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page premium-auth">
      <section className="auth-shell">
        <div className="auth-visual">
          <span className="hero-badge">Secure workspace</span>
          <h1>Welcome back to your career command center.</h1>
          <p>
            Continue analyzing job descriptions, tracking saved reports, and
            downloading polished application insights.
          </p>

          <div className="auth-preview-card">
            <div className="score-orb small-orb">
              <div>
                <strong>82%</strong>
                <span>Match</span>
              </div>
            </div>
            <div>
              <strong>Latest analysis ready</strong>
              <p>Resume gaps, interview questions, and PDF report saved.</p>
            </div>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <p className="eyebrow">Login</p>
          <h1>Welcome back</h1>
          <p>Login to continue using AI Career Coach.</p>

          {message && <div className="error-message">{message}</div>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
