import { useState, useRef } from 'react';

// ── Config ───────────────────────────────────────────────────────────────────
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0d0d0d;
    --paper: #f5f0e8;
    --cream: #ece7db;
    --accent: #c8392b;
    --accent2: #2563eb;
    --muted: #7a7169;
    --border: #d4cec3;
    --high: #c8392b;
    --high-bg: #fdf3f2;
    --med: #b45309;
    --med-bg: #fefce8;
    --low: #4b5563;
    --low-bg: #f9fafb;
    --green: #16a34a;
    --green-bg: #f0fdf4;
  }

  html { font-size: 16px; }

  body {
    font-family: 'DM Sans', sans-serif;
    background-color: var(--paper);
    color: var(--ink);
    min-height: 100vh;
  }

  h1, h2, h3, .display {
    font-family: 'Syne', sans-serif;
  }

  /* ── Layout ── */
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    padding: 1.25rem 2rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--paper);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
  }

  .logo span { color: var(--accent); }

  .main {
    flex: 1;
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
  }

  /* ── Upload Screen ── */
  .hero-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.75rem;
  }

  .hero-title {
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;
  }

  .hero-sub {
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.6;
    max-width: 500px;
    margin-bottom: 2.5rem;
  }

  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    background: white;
    margin-bottom: 1.25rem;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--accent);
    background: var(--high-bg);
  }

  .upload-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .upload-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
  }

  .upload-hint {
    color: var(--muted);
    font-size: 0.875rem;
  }

  .file-selected {
    background: var(--green-bg);
    border-color: var(--green);
  }

  .role-input {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    background: white;
    color: var(--ink);
    margin-bottom: 1.25rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .role-input:focus { border-color: var(--accent2); }
  .role-input::placeholder { color: var(--muted); }

  .btn-primary {
    width: 100%;
    padding: 1rem;
    background: var(--ink);
    color: white;
    border: none;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
  }

  .btn-primary:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Loading ── */
  .loading-screen {
    text-align: center;
    padding: 4rem 1rem;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1.5rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .loading-sub { color: var(--muted); }

  /* ── Results ── */
  .results-back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--muted);
    font-size: 0.875rem;
    cursor: pointer;
    margin-bottom: 2rem;
    border: none;
    background: none;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s;
  }

  .results-back:hover { color: var(--ink); }

  .score-card {
    background: var(--ink);
    color: white;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
    align-items: center;
  }

  .score-number {
    font-family: 'Syne', sans-serif;
    font-size: 4.5rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .score-denom {
    font-size: 1.5rem;
    opacity: 0.4;
  }

  .score-bar-wrap {
    height: 4px;
    background: rgba(255,255,255,0.15);
    border-radius: 2px;
    margin-top: 0.75rem;
  }

  .score-bar-fill {
    height: 100%;
    border-radius: 2px;
    background: white;
    transition: width 1s ease;
  }

  .score-role {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.5;
    margin-bottom: 0.25rem;
    font-weight: 500;
  }

  .score-summary {
    font-size: 0.95rem;
    line-height: 1.6;
    opacity: 0.85;
  }

  /* ── Sections ── */
  .section {
    margin-bottom: 2rem;
  }

  .section-header {
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }

  /* ── Strengths ── */
  .strengths-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .strength-item {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    background: var(--green-bg);
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .strength-dot {
    color: var(--green);
    margin-top: 2px;
    flex-shrink: 0;
  }

  /* ── Improvement Cards ── */
  .improvement-card {
    border-radius: 10px;
    margin-bottom: 0.75rem;
    overflow: hidden;
    border: 1px solid;
  }

  .card-high { border-color: #fca5a5; background: var(--high-bg); }
  .card-medium { border-color: #fcd34d; background: var(--med-bg); }
  .card-low { border-color: var(--border); background: white; }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.875rem 1rem;
    cursor: pointer;
    user-select: none;
  }

  .card-header-left { display: flex; align-items: center; gap: 0.625rem; }

  .priority-badge {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 4px;
  }

  .badge-high { background: var(--high); color: white; }
  .badge-medium { background: var(--med); color: white; }
  .badge-low { background: #e5e7eb; color: #374151; }

  .card-section {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
  }

  .card-issue {
    padding: 0 1rem 0.875rem;
    font-size: 0.925rem;
    color: #374151;
    line-height: 1.55;
  }

  .card-suggestion {
    margin: 0 1rem 1rem;
    padding: 0.875rem;
    background: white;
    border-radius: 6px;
    border-left: 3px solid;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .suggestion-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.3rem;
  }

  .border-high { border-left-color: var(--high); }
  .border-medium { border-left-color: var(--med); }
  .border-low { border-left-color: #9ca3af; }

  .chevron {
    font-size: 0.75rem;
    color: var(--muted);
    transition: transform 0.2s;
  }

  .chevron.open { transform: rotate(180deg); }

  /* ── Feedback ── */
  .feedback-section {
    text-align: center;
    padding: 2rem;
    background: var(--cream);
    border-radius: 12px;
    margin-bottom: 2rem;
  }

  .feedback-question {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .feedback-buttons {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }

  .feedback-btn {
    padding: 0.5rem 1.25rem;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    background: white;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    transition: border-color 0.15s, background 0.15s;
  }

  .feedback-btn:hover, .feedback-btn.selected {
    border-color: var(--ink);
    background: var(--ink);
    color: white;
  }

  .btn-secondary {
    padding: 0.875rem 2rem;
    border: 2px solid var(--ink);
    border-radius: 8px;
    background: white;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .btn-secondary:hover { background: var(--ink); color: white; }

  /* ── Error ── */
  .error-box {
    background: var(--high-bg);
    border: 1px solid #fca5a5;
    border-radius: 8px;
    padding: 1rem;
    color: var(--high);
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 600px) {
    .score-card { grid-template-columns: 1fr; }
    .score-number { font-size: 3.5rem; }
  }
`;

// ── Helpers ──────────────────────────────────────────────────────────────────
const PRIORITY = {
  high:   { cardClass: 'card-high',   badgeClass: 'badge-high',   borderClass: 'border-high',   label: 'Fix First' },
  medium: { cardClass: 'card-medium', badgeClass: 'badge-medium', borderClass: 'border-medium', label: 'Important' },
  low:    { cardClass: 'card-low',    badgeClass: 'badge-low',    borderClass: 'border-low',    label: 'Nice to Have' },
};

const sortOrder = { high: 0, medium: 1, low: 2 };

// ── Components ───────────────────────────────────────────────────────────────
function ImprovementCard({ section, issue, suggestion, priority }) {
  const [open, setOpen] = useState(priority === 'high');
  const cfg = PRIORITY[priority] || PRIORITY.low;

  return (
    <div className={`improvement-card ${cfg.cardClass}`}>
      <div className="card-header" onClick={() => setOpen(o => !o)}>
        <div className="card-header-left">
          <span className={`priority-badge ${cfg.badgeClass}`}>{cfg.label}</span>
          <span className="card-section">{section}</span>
        </div>
        <span className={`chevron ${open ? 'open' : ''}`}>▼</span>
      </div>
      <p className="card-issue">{issue}</p>
      {open && (
        <div className={`card-suggestion ${cfg.borderClass}`}>
          <div className="suggestion-label">Suggested Fix</div>
          {suggestion}
        </div>
      )}
    </div>
  );
}

function ScoreCard({ score, summary, role }) {
  const pct = (score / 10) * 100;
  return (
    <div className="score-card">
      <div>
        <div className="score-number">
          {score}<span className="score-denom">/10</span>
        </div>
        <div className="score-bar-wrap">
          <div className="score-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div>
        <div className="score-role">Evaluated for: {role}</div>
        <p className="score-summary">{summary}</p>
      </div>
    </div>
  );
}

// ── Screens ──────────────────────────────────────────────────────────────────
function UploadScreen({ onResult }) {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const handleFile = f => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    setError('');
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { setError('Please select a resume file.'); return; }
    setLoading(true);
    setError('');

    const form = new FormData();
    form.append('resume', file);
    form.append('target_role', role || 'a general professional position');

    try {
      const res = await fetch(`${API_URL}/evaluate`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      onResult(data, role || 'General Position');
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <div className="loading-title">Analyzing your resume…</div>
        <p className="loading-sub">Our AI is reviewing your experience and identifying opportunities.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hero-label">AI Resume Evaluator</div>
      <h1 className="hero-title">Get feedback that<br />actually matters.</h1>
      <p className="hero-sub">
        Upload your resume and tell us the role you're targeting. Our AI will give you specific, actionable feedback — not generic tips.
      </p>

      {error && <div className="error-box">⚠ {error}</div>}

      <div
        className={`upload-zone ${drag ? 'drag-over' : ''} ${file ? 'file-selected' : ''}`}
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <div className="upload-icon">{file ? '✅' : '📄'}</div>
        <div className="upload-title">
          {file ? file.name : 'Drop your resume here'}
        </div>
        <p className="upload-hint">
          {file ? `${(file.size / 1024).toFixed(0)} KB — click to change` : 'PDF or DOCX · click to browse'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>

      <input
        className="role-input"
        placeholder="Target role (e.g. Software Engineer at Google, Product Manager)"
        value={role}
        onChange={e => setRole(e.target.value)}
      />

      <button className="btn-primary" onClick={handleSubmit} disabled={!file}>
        Evaluate My Resume →
      </button>
    </>
  );
}

function ResultsScreen({ data, role, onReset }) {
  const [feedback, setFeedback] = useState(null);

  const sorted = [...(data.improvements || [])].sort(
    (a, b) => (sortOrder[a.priority] ?? 2) - (sortOrder[b.priority] ?? 2)
  );

  const high = sorted.filter(i => i.priority === 'high');
  const rest = sorted.filter(i => i.priority !== 'high');

  return (
    <>
      <button className="results-back" onClick={onReset}>← Evaluate another resume</button>

      <ScoreCard score={data.overall_score} summary={data.summary} role={role} />

      {data.strengths?.length > 0 && (
        <div className="section">
          <div className="section-header">What's Working</div>
          <div className="strengths-list">
            {data.strengths.map((s, i) => (
              <div key={i} className="strength-item">
                <span className="strength-dot">✓</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {high.length > 0 && (
        <div className="section">
          <div className="section-header">Fix These First</div>
          {high.map((item, i) => <ImprovementCard key={i} {...item} />)}
        </div>
      )}

      {rest.length > 0 && (
        <div className="section">
          <div className="section-header">Other Improvements</div>
          {rest.map((item, i) => <ImprovementCard key={i} {...item} />)}
        </div>
      )}

      <div className="feedback-section">
        <div className="feedback-question">Was this evaluation helpful?</div>
        <div className="feedback-buttons">
          {['👍 Yes', '😐 Somewhat', '👎 Not really'].map(label => (
            <button
              key={label}
              className={`feedback-btn ${feedback === label ? 'selected' : ''}`}
              onClick={() => setFeedback(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="btn-secondary" onClick={onReset}>
          Evaluate Another Resume
        </button>
      </div>
    </>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [result, setResult] = useState(null);
  const [role, setRole] = useState('');

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <header className="header">
          <div className="logo">Resume<span>IQ</span></div>
        </header>
        <main className="main">
          {result
            ? <ResultsScreen data={result} role={role} onReset={() => setResult(null)} />
            : <UploadScreen onResult={(data, r) => { setResult(data); setRole(r); }} />
          }
        </main>
      </div>
    </>
  );
}
