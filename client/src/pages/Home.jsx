import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const roleSamples = [
  {
    title: "Software Engineer",
    score: 86,
    field: "Technology",
    matched: ["React", "Node.js", "MongoDB", "REST APIs"],
    missing: ["Docker", "AWS"],
    gradient: "blue",
  },
  {
    title: "Marketing Intern",
    score: 72,
    field: "Marketing",
    matched: ["Writing", "Social Media", "Analytics"],
    missing: ["SEO", "Mailchimp"],
    gradient: "violet",
  },
  {
    title: "Data Analyst",
    score: 78,
    field: "Analytics",
    matched: ["Python", "Excel", "SQL"],
    missing: ["Power BI", "Dashboards"],
    gradient: "cyan",
  },
];

const stats = [
  { value: "PDF", label: "resume parsing" },
  { value: "JWT", label: "protected accounts" },
  { value: "AI", label: "Gemini analysis" },
  { value: "CRUD", label: "saved history" },
];

function Home() {
  const [activeRole, setActiveRole] = useState(0);
  const currentRole = roleSamples[activeRole];
  const token = localStorage.getItem("token");

  const insightText = useMemo(() => {
    if (currentRole.score >= 80) {
      return "Strong fit. Tailor achievements and add measurable impact before applying.";
    }

    return "Good foundation. Add missing keywords only when they match real experience.";
  }, [currentRole.score]);

  return (
    <main className="home-page">
      <section className="hero-section dynamic-hero">
        <div className="mesh-bg mesh-one"></div>
        <div className="mesh-bg mesh-two"></div>
        <div className="mesh-bg mesh-three"></div>

        <div className="hero-content reveal-up">
          <span className="hero-badge">Gemini-powered career workspace</span>

          <h1>
            Transform any job post into a sharp, targeted resume strategy.
          </h1>

          <p>
            Upload a PDF resume, paste any job description, and get a polished
            AI report with match scoring, skill gaps, keyword gaps, resume edits,
            and interview questions.
          </p>

          <div className="hero-actions">
            <Link to={token ? "/dashboard" : "/register"} className="primary-link magnetic-btn">
              {token ? "Open Dashboard" : "Start Analyzing"}
            </Link>

            <Link to={token ? "/dashboard" : "/login"} className="secondary-link">
              {token ? "View Saved Reports" : "Login"}
            </Link>
          </div>

          <div className="trust-row">
            <span>Secure backend</span>
            <span>Any career field</span>
            <span>Downloadable reports</span>
          </div>
        </div>

        <div className="hero-visual reveal-up delay-1">
          <div className={`hero-card interactive-preview ${currentRole.gradient}`}>
            <div className="preview-topbar">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="role-tabs">
              {roleSamples.map((role, index) => (
                <button
                  key={role.title}
                  className={activeRole === index ? "role-tab active" : "role-tab"}
                  onClick={() => setActiveRole(index)}
                  type="button"
                >
                  {role.title}
                </button>
              ))}
            </div>

            <div className="scanner-card">
              <div className="scan-line"></div>
              <div className="score-preview modern-score">
                <span>{currentRole.score}%</span>
                <p>{currentRole.field} match</p>
              </div>

              <div className="analysis-bars">
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
              </div>
            </div>

            <div className="preview-section">
              <h3>Matched strengths</h3>
              <div className="mini-tags">
                {currentRole.matched.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="preview-section">
              <h3>Missing focus areas</h3>
              <div className="mini-tags warning">
                {currentRole.missing.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="insight-card">
              <strong>AI insight</strong>
              <p>{insightText}</p>
            </div>
          </div>

          <div className="floating-chip chip-one">ATS keywords</div>
          <div className="floating-chip chip-two">Interview prep</div>
          <div className="floating-chip chip-three">PDF report</div>
        </div>
      </section>

      <section className="stats-band">
        {stats.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="workflow-section">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>A complete resume review flow in minutes.</h2>
          <p>
            Built as a real full-stack product: authentication, protected API
            routes, file handling, AI analysis, database history, and PDF export.
          </p>
        </div>

        <div className="workflow-grid">
          <article>
            <span>01</span>
            <h3>Upload</h3>
            <p>Submit a PDF resume and extract the text securely on the backend.</p>
          </article>

          <article>
            <span>02</span>
            <h3>Analyze</h3>
            <p>Paste a real job description from software, marketing, analytics, or any field.</p>
          </article>

          <article>
            <span>03</span>
            <h3>Act</h3>
            <p>Use the report to improve your resume, prepare interviews, and track progress.</p>
          </article>
        </div>
      </section>

      <section className="features-section upgraded-features">
        <div className="feature-card featured-card">
          <span className="feature-icon">✦</span>
          <h3>AI-powered matching</h3>
          <p>
            Gemini reads the resume and job post together to produce structured
            feedback for the target role.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">⌁</span>
          <h3>Portfolio-ready backend</h3>
          <p>
            JWT auth, protected routes, MongoDB history, PDF upload handling,
            and delete operations.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">↧</span>
          <h3>PDF report export</h3>
          <p>
            Download a polished report containing the score, gaps, suggestions,
            and interview questions.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;
