import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";
import ReportButton from "../components/ReportButton";

const sampleDescriptions = [
  {
    label: "Software / AI",
    text: `Junior Full Stack Developer / AI Engineer Intern

We are looking for a motivated computer engineering student to join our remote engineering team.

Responsibilities:
- Build web applications using React, JavaScript, HTML, and CSS
- Develop backend APIs using Node.js, Express, and MongoDB
- Work with REST APIs and database models
- Assist with machine learning experiments using Python
- Collaborate using Git and GitHub

Requirements:
- JavaScript, React, Node.js, Express
- MongoDB or MySQL
- Python and basic machine learning knowledge
- Strong communication and remote collaboration skills

Nice to have:
- TensorFlow, PyTorch, Docker, or AWS experience`,
  },
  {
    label: "Marketing",
    text: `Marketing Intern

We are looking for a motivated marketing intern to support our digital marketing team.

Responsibilities:
- Assist with social media content planning and scheduling
- Write copy for Instagram, LinkedIn, and email campaigns
- Analyze campaign performance using Google Analytics
- Support SEO research and keyword planning
- Prepare reports on engagement, reach, impressions, and conversions

Requirements:
- Strong communication and writing skills
- Basic understanding of digital marketing
- Familiarity with social media platforms
- Interest in SEO, content marketing, and analytics

Nice to have:
- Canva, Google Analytics, Mailchimp, or HubSpot experience`,
  },
  {
    label: "Data Analyst",
    text: `Junior Data Analyst

We are hiring a junior data analyst to support reporting and business insights.

Responsibilities:
- Clean, analyze, and interpret business data
- Build reports using Excel, SQL, and dashboard tools
- Communicate findings to non-technical stakeholders
- Track KPIs and identify trends

Requirements:
- Strong Excel skills
- SQL basics
- Analytical thinking and attention to detail
- Ability to explain data clearly

Nice to have:
- Python, Power BI, Tableau, or statistics coursework`,
  },
];

const formatPercent = (value) => (value === null || value === undefined ? "—" : `${value}%`);

function Dashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;

      try {
        const res = await API.get("/analysis/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHistory(res.data.analyses);
      } catch (error) {
        console.log("Could not fetch history", error);
      }
    };

    fetchHistory();
  }, [token]);

  const dashboardStats = useMemo(() => {
    const best = history.length
      ? Math.max(...history.map((item) => item.matchScore))
      : null;

    const latest = analysis?.matchScore ?? history[0]?.matchScore ?? null;
    const aiCount = history.filter((item) => item.analysisMode === "ai").length;
    const avg = history.length
      ? Math.round(
          history.reduce((total, item) => total + Number(item.matchScore || 0), 0) /
            history.length
        )
      : null;

    return {
      saved: history.length,
      latest,
      best,
      avg,
      aiCount,
    };
  }, [analysis, history]);

  const progressStep = useMemo(() => {
    if (analysis) return 3;
    if (extractedText && jobDescription.trim()) return 2;
    if (extractedText) return 1;
    return 0;
  }, [analysis, extractedText, jobDescription]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setResumeFile(file);
    setResumeFileName(file?.name || "");
    setExtractedText("");
    setAnalysis(null);
    showMessage(file ? "Resume selected. Click extract to read the PDF." : "", "info");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      showMessage("Please choose a PDF resume first.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setLoadingUpload(true);
      showMessage("Extracting text from your resume...", "info");

      const res = await API.post("/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setExtractedText(res.data.extractedText);
      showMessage(
        res.data.truncated
          ? "Resume extracted. Long text was safely shortened for analysis."
          : res.data.message,
        "success"
      );
    } catch (error) {
      showMessage(error.response?.data?.message || "Error uploading resume", "error");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!extractedText) {
      showMessage("Please upload your resume first.", "error");
      return;
    }

    if (!jobDescription.trim()) {
      showMessage("Please paste a job description first.", "error");
      return;
    }

    try {
      setLoadingAnalysis(true);
      showMessage("Running Gemini career analysis...", "info");

      const res = await API.post(
        "/analysis/analyze",
        {
          resumeText: extractedText,
          jobDescription,
          resumeFileName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(res.data.analysis);
      setHistory((prev) => [res.data.analysis, ...prev]);
      setActiveHistoryId(res.data.analysis._id);
      showMessage(res.data.message, "success");
    } catch (error) {
      showMessage(error.response?.data?.message || "Error analyzing resume", "error");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleDeleteAnalysis = async (analysisId) => {
    const confirmed = window.confirm("Are you sure you want to delete this analysis?");

    if (!confirmed) return;

    try {
      await API.delete(`/analysis/${analysisId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory((prev) => prev.filter((item) => item._id !== analysisId));

      if (analysis?._id === analysisId) {
        setAnalysis(null);
      }

      if (activeHistoryId === analysisId) {
        setActiveHistoryId(null);
      }

      showMessage("Analysis deleted successfully", "success");
    } catch (error) {
      showMessage(error.response?.data?.message || "Error deleting analysis", "error");
    }
  };

  const loadSampleDescription = (sampleText) => {
    setJobDescription(sampleText);
    setAnalysis(null);
    showMessage("Sample job description loaded. You can edit it before analyzing.", "info");
  };

  const selectedHistory = history.find((item) => item._id === activeHistoryId);
  const activeAnalysis = selectedHistory || analysis || history[0];
  const scoreValue = activeAnalysis?.matchScore || 0;

  return (
    <main className="dashboard-page app-dashboard">
      <section className="dashboard-card dashboard-wide dashboard-shell command-center">
        <div className="dashboard-header pro-header">
          <div>
            <p className="eyebrow">AI command center</p>
            <h1>Welcome back, {user?.name}</h1>
            <p>
              Build targeted applications with PDF parsing, Gemini-backed job matching,
              skill-gap detection, interview prep, and exportable career reports.
            </p>
          </div>

          <div className="dashboard-status">
            <span className="status-dot"></span>
            Protected workspace
          </div>
        </div>

        <div className="dashboard-stats premium-stats">
          <div className="stat-card">
            <span>{dashboardStats.saved}</span>
            <p>Saved analyses</p>
          </div>

          <div className="stat-card">
            <span>{formatPercent(dashboardStats.latest)}</span>
            <p>Latest score</p>
          </div>

          <div className="stat-card">
            <span>{formatPercent(dashboardStats.best)}</span>
            <p>Best score</p>
          </div>

          <div className="stat-card">
            <span>{dashboardStats.aiCount}</span>
            <p>AI-powered runs</p>
          </div>
        </div>

        <div className="progress-strip">
          {["Upload", "Paste", "Analyze"].map((label, index) => (
            <div
              key={label}
              className={progressStep > index ? "progress-step complete" : "progress-step"}
            >
              <span>{index + 1}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>

        {message && <p className={`upload-message ${messageType}`}>{message}</p>}

        <div className="dashboard-grid smart-grid">
          <div className="dashboard-panel glass-panel upload-panel">
            <div className="panel-heading">
              <span>1</span>
              <div>
                <h2>Resume upload</h2>
                <p>Upload a PDF resume. Files are parsed in memory and not saved as PDFs.</p>
              </div>
            </div>

            <form onSubmit={handleUpload} className="upload-form modern-upload">
              <label className="file-drop-zone">
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <span className="drop-icon">⇧</span>
                <strong>{resumeFileName || "Choose a PDF resume"}</strong>
                <small>Maximum 5MB • PDF only</small>
              </label>

              <button type="submit" disabled={loadingUpload}>
                {loadingUpload ? "Extracting..." : "Extract Resume"}
              </button>
            </form>

            {extractedText && (
              <div className="success-note">
                Text extracted: {extractedText.length.toLocaleString()} characters
              </div>
            )}
          </div>

          <div className="dashboard-panel glass-panel target-panel">
            <div className="panel-heading">
              <span>2</span>
              <div>
                <h2>Target role</h2>
                <p>Paste any job description, or load a sample to test quickly.</p>
              </div>
            </div>

            <div className="sample-row">
              {sampleDescriptions.map((sample) => (
                <button key={sample.label} type="button" onClick={() => loadSampleDescription(sample.text)}>
                  {sample.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleAnalyze}>
              <textarea
                className="job-textarea smart-textarea"
                placeholder="Paste job description here..."
                value={jobDescription}
                maxLength={12000}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <div className="textarea-footer">
                <span>{jobDescription.length.toLocaleString()} / 12,000 characters</span>
                <button className="analyze-btn" type="submit" disabled={loadingAnalysis}>
                  {loadingAnalysis ? "Analyzing with AI..." : "Analyze Resume"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {activeAnalysis && (
          <div className="analysis-box polished-card result-card">
            <div className="section-title-row result-header">
              <div>
                <p className="eyebrow">Career insight</p>
                <h2>{activeAnalysis.jobTitle || "Analysis Result"}</h2>
                <p className="result-meta">
                  {activeAnalysis.careerField || "Career field"} • {activeAnalysis.seniorityLevel || "Seniority not specified"}
                </p>

                <div className="result-action-row">
                  <span className={`analysis-mode ${activeAnalysis.analysisMode === "ai" ? "ai" : "fallback"}`}>
                    {activeAnalysis.analysisMode === "ai" ? "Gemini AI analysis" : "Rule-based fallback"}
                  </span>
                  <ReportButton analysis={activeAnalysis} />
                </div>
              </div>

              <div className="score-orb" style={{ "--score": `${scoreValue * 3.6}deg` }}>
                <div>
                  <strong>{activeAnalysis.matchScore}%</strong>
                  <span>Match</span>
                </div>
              </div>
            </div>

            {activeAnalysis.overallFeedback && (
              <div className="feedback-callout">
                <strong>Overall feedback</strong>
                <p>{activeAnalysis.overallFeedback}</p>
              </div>
            )}

            <div className="result-columns">
              <section>
                <h3>Matched Skills</h3>
                <div className="tag-list">
                  {activeAnalysis.matchedSkills?.length > 0 ? (
                    activeAnalysis.matchedSkills.map((skill) => (
                      <span className="tag success-tag" key={skill}>{skill}</span>
                    ))
                  ) : (
                    <p>No matched skills found yet.</p>
                  )}
                </div>
              </section>

              <section>
                <h3>Missing Skills</h3>
                <div className="tag-list">
                  {activeAnalysis.missingSkills?.length > 0 ? (
                    activeAnalysis.missingSkills.map((skill) => (
                      <span className="tag warning-tag" key={skill}>{skill}</span>
                    ))
                  ) : (
                    <p>No major missing skills found.</p>
                  )}
                </div>
              </section>
            </div>

            <h3>Missing Keywords</h3>
            <div className="tag-list">
              {activeAnalysis.missingKeywords?.length > 0 ? (
                activeAnalysis.missingKeywords.map((keyword) => (
                  <span className="tag keyword-tag" key={keyword}>{keyword}</span>
                ))
              ) : (
                <p>No major missing keywords found.</p>
              )}
            </div>

            <div className="result-columns">
              <section>
                <h3>Strengths</h3>
                <ul className="clean-list">
                  {(activeAnalysis.strengths?.length
                    ? activeAnalysis.strengths
                    : ["Run a new AI analysis to generate strengths."]
                  ).map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </section>

              <section>
                <h3>Resume Improvements</h3>
                <ul className="clean-list">
                  {(
                    activeAnalysis.resumeImprovements?.length
                      ? activeAnalysis.resumeImprovements
                      : activeAnalysis.suggestions || []
                  ).map((suggestion, index) => <li key={index}>{suggestion}</li>)}
                </ul>
              </section>
            </div>

            <h3>Interview Questions</h3>
            {activeAnalysis.interviewQuestions?.length > 0 ? (
              <ol className="question-list">
                {activeAnalysis.interviewQuestions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ol>
            ) : (
              <p>No interview questions generated yet.</p>
            )}
          </div>
        )}

        <div className="history-box polished-card history-redesign">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Saved work</p>
              <h2>Analysis History</h2>
            </div>
            <span className="history-count">{history.length} saved</span>
          </div>

          {history.length === 0 ? (
            <div className="empty-state">
              <h3>No saved analyses yet</h3>
              <p>Upload your resume and analyze a job description to create your first saved result.</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div className={activeHistoryId === item._id ? "history-card active" : "history-card"} key={item._id}>
                  <div className="history-card-header">
                    <div>
                      <h3>{item.jobTitle || item.resumeFileName}</h3>
                      <p className="history-date">
                        {new Date(item.createdAt).toLocaleString()} • {item.analysisMode === "ai" ? "AI" : "Fallback"}
                      </p>
                    </div>

                    <div className="history-actions">
                      <span>{item.matchScore}% match</span>

                      <button className="ghost-btn" onClick={() => setActiveHistoryId(item._id)} type="button">
                        View
                      </button>

                      <ReportButton analysis={item} small />

                      <button className="delete-analysis-btn" onClick={() => handleDeleteAnalysis(item._id)} type="button">
                        Delete
                      </button>
                    </div>
                  </div>

                  <p>
                    <strong>Matched:</strong>{" "}
                    {item.matchedSkills?.length > 0 ? item.matchedSkills.slice(0, 5).join(", ") : "None"}
                  </p>

                  <p>
                    <strong>Missing:</strong>{" "}
                    {item.missingSkills?.length > 0 ? item.missingSkills.slice(0, 5).join(", ") : "None"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {extractedText && (
          <details className="resume-details">
            <summary>View extracted resume text</summary>
            <div className="resume-text-box">
              <pre>{extractedText}</pre>
            </div>
          </details>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
