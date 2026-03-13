import { useState, useEffect, createContext, useContext } from "react";

// ============================================================
// AUTH CONTEXT
// ============================================================
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const API = "https://hospital-management-system-ohh9.onrender.com/";

const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ============================================================
// ICONS (inline SVGs)
// ============================================================
const Icon = {
  Hospital: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Stats: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
};

// ============================================================
// STYLES
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --navy: #0a1628;
    --navy-mid: #142040;
    --blue: #1a56db;
    --blue-light: #3b82f6;
    --teal: #0d9488;
    --teal-light: #14b8a6;
    --gold: #f59e0b;
    --cream: #fefdf8;
    --gray-50: #f8fafc;
    --gray-100: #f1f5f9;
    --gray-200: #e2e8f0;
    --gray-400: #94a3b8;
    --gray-600: #475569;
    --gray-800: #1e293b;
    --red: #ef4444;
    --green: #22c55e;
    --shadow: 0 4px 24px rgba(10,22,40,0.12);
    --shadow-lg: 0 8px 48px rgba(10,22,40,0.18);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--gray-50); color: var(--gray-800); }
  
  h1, h2, h3 { font-family: 'Playfair Display', serif; }
  
  .app-shell { min-height: 100vh; display: flex; flex-direction: column; }
  
  /* NAVBAR */
  .navbar {
    background: var(--navy);
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }
  .navbar-brand { display: flex; align-items: center; gap: 10px; color: white; }
  .navbar-brand span { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--teal-light); }
  .navbar-nav { display: flex; align-items: center; gap: 0.25rem; }
  .nav-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 8px;
    background: transparent; border: none; cursor: pointer;
    color: var(--gray-400); font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .nav-btn:hover, .nav-btn.active { background: rgba(255,255,255,0.08); color: white; }
  .nav-btn.logout { color: #f87171; }
  .nav-btn.logout:hover { background: rgba(239,68,68,0.15); color: #fca5a5; }
  .role-badge {
    padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .role-ADMIN { background: rgba(245,158,11,0.2); color: var(--gold); }
  .role-DOCTOR { background: rgba(13,148,136,0.2); color: var(--teal-light); }
  .role-PATIENT { background: rgba(59,130,246,0.2); color: var(--blue-light); }
  
  /* MAIN */
  .main { flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
  
  /* AUTH */
  .auth-page {
    min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
    background: var(--navy);
  }
  .auth-left {
    display: flex; flex-direction: column; justify-content: center; padding: 4rem;
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%);
    position: relative; overflow: hidden;
  }
  .auth-left::before {
    content: ''; position: absolute; top: -100px; right: -100px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%);
  }
  .auth-left-content { position: relative; z-index: 1; }
  .auth-left h1 { font-size: 3rem; color: white; line-height: 1.2; margin-bottom: 1rem; }
  .auth-left h1 span { color: var(--teal-light); }
  .auth-left p { color: var(--gray-400); font-size: 1.1rem; line-height: 1.7; }
  .auth-feature { display: flex; align-items: center; gap: 10px; margin-top: 1rem; color: var(--gray-400); }
  .auth-feature-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--teal-light); }
  .auth-right {
    background: white; display: flex; align-items: center; justify-content: center; padding: 3rem;
  }
  .auth-form { width: 100%; max-width: 420px; }
  .auth-form h2 { font-size: 2rem; color: var(--navy); margin-bottom: 0.5rem; }
  .auth-form p { color: var(--gray-600); margin-bottom: 2rem; }
  .auth-tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 2px solid var(--gray-200); }
  .auth-tab {
    padding: 0.5rem 0; font-weight: 600; cursor: pointer; border: none; background: none;
    color: var(--gray-400); border-bottom: 2px solid transparent; margin-bottom: -2px;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; transition: all 0.2s;
  }
  .auth-tab.active { color: var(--navy); border-bottom-color: var(--navy); }
  
  /* FORM */
  .form-group { margin-bottom: 1rem; }
  .form-label { display: block; font-weight: 500; color: var(--gray-800); margin-bottom: 0.4rem; font-size: 0.875rem; }
  .form-input, .form-select {
    width: 100%; padding: 10px 14px; border-radius: 8px;
    border: 2px solid var(--gray-200); font-size: 0.925rem;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
    outline: none; background: var(--gray-50);
  }
  .form-input:focus, .form-select:focus { border-color: var(--blue); background: white; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  
  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;
    font-size: 0.9rem; font-weight: 600; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; text-decoration: none;
  }
  .btn-primary { background: var(--navy); color: white; }
  .btn-primary:hover { background: var(--navy-mid); transform: translateY(-1px); }
  .btn-teal { background: var(--teal); color: white; }
  .btn-teal:hover { background: var(--teal-light); transform: translateY(-1px); }
  .btn-blue { background: var(--blue); color: white; }
  .btn-blue:hover { background: var(--blue-light); }
  .btn-green { background: #16a34a; color: white; }
  .btn-green:hover { background: var(--green); }
  .btn-red { background: #dc2626; color: white; }
  .btn-red:hover { background: var(--red); }
  .btn-ghost { background: transparent; border: 2px solid var(--gray-200); color: var(--gray-600); }
  .btn-ghost:hover { border-color: var(--gray-400); color: var(--gray-800); }
  .btn-full { width: 100%; justify-content: center; padding: 12px; }
  .btn-sm { padding: 6px 12px; font-size: 0.8rem; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
  
  /* CARDS */
  .card {
    background: white; border-radius: 16px; padding: 1.5rem;
    box-shadow: var(--shadow); border: 1px solid var(--gray-100);
  }
  .card-title { font-size: 1.1rem; font-weight: 600; color: var(--gray-800); margin-bottom: 1rem; }
  
  /* PAGE HEADER */
  .page-header { margin-bottom: 2rem; }
  .page-header h2 { font-size: 2rem; color: var(--navy); margin-bottom: 0.5rem; }
  .page-header p { color: var(--gray-600); }
  
  /* GRID */
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  
  /* DOCTOR CARD */
  .doctor-card {
    background: white; border-radius: 16px; padding: 1.5rem;
    box-shadow: var(--shadow); border: 1px solid var(--gray-100);
    transition: all 0.25s; cursor: pointer;
  }
  .doctor-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--teal-light); }
  .doctor-avatar {
    width: 56px; height: 56px; border-radius: 14px;
    background: linear-gradient(135deg, var(--teal), var(--blue));
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.4rem; font-weight: 700; font-family: 'Playfair Display', serif;
    margin-bottom: 1rem;
  }
  .doctor-name { font-weight: 700; font-size: 1.05rem; color: var(--navy); margin-bottom: 4px; }
  .doctor-spec { color: var(--teal); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.75rem; }
  .doctor-slots { font-size: 0.8rem; color: var(--gray-600); }
  
  /* APPOINTMENT CARD */
  .appt-card {
    background: white; border-radius: 12px; padding: 1.25rem;
    border: 1px solid var(--gray-200); margin-bottom: 0.75rem;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  }
  .appt-card:hover { border-color: var(--blue-light); }
  .appt-info { flex: 1; }
  .appt-name { font-weight: 600; color: var(--navy); margin-bottom: 4px; }
  .appt-meta { font-size: 0.85rem; color: var(--gray-600); }
  .appt-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
  
  /* STATUS BADGE */
  .status-badge {
    padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .status-BOOKED { background: #dbeafe; color: #1d4ed8; }
  .status-CONFIRMED { background: #dcfce7; color: #15803d; }
  .status-COMPLETED { background: #f3f4f6; color: #374151; }
  .status-CANCELLED { background: #fee2e2; color: #b91c1c; }
  
  /* STAT CARD */
  .stat-card {
    background: white; border-radius: 16px; padding: 1.5rem;
    box-shadow: var(--shadow); border: 1px solid var(--gray-100);
    text-align: center;
  }
  .stat-number { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; color: var(--navy); }
  .stat-label { color: var(--gray-600); font-size: 0.875rem; margin-top: 4px; }
  .stat-icon { margin-bottom: 0.75rem; }
  
  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(10,22,40,0.6);
    display: flex; align-items: center; justify-content: center; z-index: 1000;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: white; border-radius: 20px; padding: 2rem;
    width: 100%; max-width: 480px; box-shadow: var(--shadow-lg);
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .modal-title { font-size: 1.4rem; color: var(--navy); }
  .modal-close { background: none; border: none; cursor: pointer; color: var(--gray-400); padding: 4px; }
  .modal-close:hover { color: var(--gray-800); }
  
  /* ALERT */
  .alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 1rem; font-size: 0.9rem; }
  .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
  .alert-success { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
  
  /* SEARCH BAR */
  .search-bar {
    display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem;
    background: white; padding: 1rem 1.25rem; border-radius: 12px;
    box-shadow: var(--shadow); border: 1px solid var(--gray-100);
  }
  .search-bar input, .search-bar select {
    flex: 1; border: none; outline: none; font-size: 0.95rem;
    font-family: 'DM Sans', sans-serif; color: var(--gray-800); background: transparent;
  }
  .search-divider { width: 1px; height: 24px; background: var(--gray-200); }
  
  /* SLOT CHIP */
  .slot-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 6px; background: var(--gray-100);
    font-size: 0.8rem; color: var(--gray-600); margin: 2px;
  }
  
  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 4rem 2rem; color: var(--gray-400); }
  .empty-state-icon { font-size: 3rem; margin-bottom: 1rem; }
  .empty-state h3 { font-family: 'DM Sans', sans-serif; color: var(--gray-600); margin-bottom: 0.5rem; }
  
  /* SPINNER */
  .spinner {
    width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  
  /* TABS */
  .tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; background: white; padding: 6px; border-radius: 12px; box-shadow: var(--shadow); width: fit-content; }
  .tab-btn {
    padding: 8px 20px; border-radius: 8px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.9rem;
    background: transparent; color: var(--gray-600); transition: all 0.2s;
  }
  .tab-btn.active { background: var(--navy); color: white; }
  
  @media (max-width: 768px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .main { padding: 1rem; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

// ============================================================
// AUTH PAGE
// ============================================================
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PATIENT", specialization: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const endpoint = tab === "login" ? "/auth/login" : "/auth/register";
      const body = tab === "login" ? { email: form.email, password: form.password } : form;
      const data = await apiFetch(endpoint, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      onLogin(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(13,148,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#14b8a6" }}>
              <Icon.Hospital />
            </div>
            <span style={{ color: "#14b8a6", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>MediSchedule</span>
          </div>
          <h1>Hospital <span>Appointment</span> & Scheduling</h1>
          <p style={{ marginTop: 16 }}>Streamline patient care with intelligent scheduling, real-time availability, and seamless doctor-patient coordination.</p>
          {[["Patients", "Book appointments instantly"], ["Doctors", "Manage your availability"], ["Admins", "Oversee department operations"]].map(([role, desc]) => (
            <div key={role} className="auth-feature">
              <div className="auth-feature-dot" />
              <span><strong style={{ color: "#14b8a6" }}>{role}</strong> — {desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form">
          <h2>Welcome Back</h2>
          <p>Sign in to access your dashboard</p>
          <div className="auth-tabs">
            {["login", "register"].map((t) => (
              <button key={t} className={`auth-tab${tab === t ? " active" : ""}`} onClick={() => { setTab(t); setError(""); }}>
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          {tab === "register" && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Dr. Jane Smith" value={form.name} onChange={set("name")} />
              </div>
              <div className="form-group">
                <label className="form-label">Register as</label>
                <select className="form-select" value={form.role} onChange={set("role")}>
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              {form.role === "DOCTOR" && (
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input className="form-input" placeholder="Cardiology, Neurology..." value={form.specialization} onChange={set("specialization")} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+1 234 567 8900" value={form.phone} onChange={set("phone")} />
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={submit} disabled={loading}>
            {loading ? <span className="spinner" /> : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PATIENT: FIND DOCTORS + BOOK
// ============================================================
function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [bookForm, setBookForm] = useState({ appointmentDate: "", startTime: "", endTime: "", notes: "" });
  const [bookError, setBookError] = useState("");
  const [bookSuccess, setBookSuccess] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    apiFetch(`/doctors/search${spec ? `?specialization=${spec}` : ""}`)
      .then(setDoctors).catch(console.error).finally(() => setLoading(false));
  }, [spec]);

  const filtered = doctors.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  const book = async () => {
    setBookError(""); setBookSuccess(""); setBooking(true);
    try {
      await apiFetch("/appointments/book", {
        method: "POST",
        body: JSON.stringify({ doctorId: selected.id, ...bookForm }),
      });
      setBookSuccess("Appointment booked successfully!");
      setTimeout(() => { setSelected(null); setBookSuccess(""); }, 2000);
    } catch (e) {
      setBookError(e.message);
    } finally {
      setBooking(false);
    }
  };

  const specs = [...new Set(doctors.map((d) => d.specialization).filter(Boolean))];

  return (
    <>
      <div className="page-header">
        <h2>Find a Doctor</h2>
        <p>Search by name or specialization and book your appointment</p>
      </div>
      <div className="search-bar">
        <Icon.Search />
        <input placeholder="Search doctors by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="search-divider" />
        <select value={spec} onChange={(e) => setSpec(e.target.value)} style={{ border: "none", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", background: "transparent", color: "#475569" }}>
          <option value="">All Specializations</option>
          {specs.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>Loading doctors...</div> : (
        <div className="grid-3">
          {filtered.map((doc) => (
            <div key={doc.id} className="doctor-card" onClick={() => { setSelected(doc); setBookError(""); setBookSuccess(""); }}>
              <div className="doctor-avatar">{doc.name.charAt(0)}</div>
              <div className="doctor-name">{doc.name}</div>
              <div className="doctor-spec">{doc.specialization || "General Practice"}</div>
              <div className="doctor-slots">
                {doc.availableSlots?.length > 0
                  ? `${doc.availableSlots.length} slot(s) available`
                  : "No slots listed"}
              </div>
              <button className="btn btn-teal btn-sm" style={{ marginTop: 12 }}>Book Appointment</button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: "1/-1" }}>
              <div className="empty-state-icon">👨‍⚕️</div>
              <h3>No doctors found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Book Appointment</h3>
              <button className="modal-close" onClick={() => setSelected(null)}><Icon.X /></button>
            </div>
            <div style={{ marginBottom: 16, padding: 14, background: "#f0fdf4", borderRadius: 10 }}>
              <div style={{ fontWeight: 600, color: "#0a1628" }}>{selected.name}</div>
              <div style={{ color: "#0d9488", fontSize: "0.875rem" }}>{selected.specialization}</div>
            </div>
            {bookError && <div className="alert alert-error">{bookError}</div>}
            {bookSuccess && <div className="alert alert-success">{bookSuccess}</div>}
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={bookForm.appointmentDate} min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setBookForm((f) => ({ ...f, appointmentDate: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input className="form-input" type="time" value={bookForm.startTime}
                  onChange={(e) => setBookForm((f) => ({ ...f, startTime: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">End Time</label>
                <input className="form-input" type="time" value={bookForm.endTime}
                  onChange={(e) => setBookForm((f) => ({ ...f, endTime: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <input className="form-input" placeholder="Reason for visit..." value={bookForm.notes}
                onChange={(e) => setBookForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
            {selected.availableSlots?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div className="form-label" style={{ marginBottom: 8 }}>Doctor's Available Slots</div>
                {selected.availableSlots.map((s) => (
                  <span key={s.id} className="slot-chip">
                    {s.date} {s.startTime}–{s.endTime}
                  </span>
                ))}
              </div>
            )}
            <button className="btn btn-primary btn-full" onClick={book} disabled={booking}>
              {booking ? <span className="spinner" /> : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// MY APPOINTMENTS (Patient/Doctor)
// ============================================================
function MyAppointments({ user }) {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  const load = () => {
    setLoading(true);
    apiFetch("/appointments/my").then(setAppts).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const action = async (id, endpoint) => {
    try {
      await apiFetch(`/appointments/${id}/${endpoint}`, { method: "PATCH" });
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const statuses = ["ALL", "BOOKED", "CONFIRMED", "COMPLETED", "CANCELLED"];
  const filtered = filter === "ALL" ? appts : appts.filter((a) => a.status === filter);

  return (
    <>
      <div className="page-header">
        <h2>My Appointments</h2>
        <p>{user.role === "DOCTOR" ? "Manage your patient appointments" : "Track your appointment history"}</p>
      </div>
      <div className="tabs">
        {statuses.map((s) => (
          <button key={s} className={`tab-btn${filter === s ? " active" : ""}`} onClick={() => setFilter(s)}>
            {s === "ALL" ? `All (${appts.length})` : s}
          </button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>Loading...</div> : error ? (
        <div className="alert alert-error">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No appointments found</h3>
        </div>
      ) : (
        <div className="card">
          {filtered.map((a) => (
            <div key={a.id} className="appt-card">
              <div className="appt-info">
                <div className="appt-name">
                  {user.role === "PATIENT" ? `Dr. ${a.doctorName}` : a.patientName}
                  {user.role === "PATIENT" && a.doctorSpecialization && (
                    <span style={{ color: "#0d9488", fontWeight: 400, fontSize: "0.85rem", marginLeft: 8 }}>• {a.doctorSpecialization}</span>
                  )}
                </div>
                <div className="appt-meta">
                  📅 {a.appointmentDate} &nbsp;⏰ {a.startTime} – {a.endTime}
                  {a.notes && <span> &nbsp;📝 {a.notes}</span>}
                </div>
              </div>
              <div className="appt-actions">
                <span className={`status-badge status-${a.status}`}>{a.status}</span>
                {user.role === "DOCTOR" && a.status === "BOOKED" && (
                  <button className="btn btn-green btn-sm" onClick={() => action(a.id, "confirm")}><Icon.Check /> Confirm</button>
                )}
                {user.role === "DOCTOR" && a.status === "CONFIRMED" && (
                  <button className="btn btn-blue btn-sm" onClick={() => action(a.id, "complete")}>Complete</button>
                )}
                {(a.status === "BOOKED" || a.status === "CONFIRMED") && (
                  <button className="btn btn-red btn-sm" onClick={() => action(a.id, "cancel")}><Icon.X /> Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ============================================================
// DOCTOR: MANAGE SLOTS
// ============================================================
function ManageSlots({ user }) {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "" });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => apiFetch(`/doctors/${user.userId}/slots`).then(setSlots).catch(console.error).finally(() => setLoading(false));
  useEffect(load, []);

  const add = async () => {
    setError(""); setAdding(true);
    try {
      await apiFetch("/doctors/slots", { method: "POST", body: JSON.stringify(form) });
      setSuccess("Slot added!"); setForm({ date: "", startTime: "", endTime: "" });
      load(); setTimeout(() => setSuccess(""), 2000);
    } catch (e) { setError(e.message); } finally { setAdding(false); }
  };

  const del = async (id) => {
    if (!confirm("Remove this slot?")) return;
    await apiFetch(`/doctors/slots/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <div className="page-header">
        <h2>Manage Availability</h2>
        <p>Set your available time slots for patients to book</p>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Add New Slot</div>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input className="form-input" type="time" value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input className="form-input" type="time" value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} />
            </div>
          </div>
          <button className="btn btn-teal btn-full" onClick={add} disabled={adding}>
            {adding ? <span className="spinner" /> : <><Icon.Plus /> Add Slot</>}
          </button>
        </div>
        <div className="card">
          <div className="card-title">Your Slots ({slots.length})</div>
          {loading ? <div style={{ color: "#94a3b8" }}>Loading...</div> : slots.length === 0 ? (
            <div className="empty-state"><p>No slots added yet</p></div>
          ) : (
            <div style={{ maxHeight: 350, overflowY: "auto" }}>
              {slots.sort((a, b) => a.date > b.date ? 1 : -1).map((s) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.date}</div>
                    <div style={{ color: "#0d9488", fontSize: "0.8rem" }}>{s.startTime} – {s.endTime}</div>
                  </div>
                  <button className="btn btn-red btn-sm" onClick={() => del(s.id)}><Icon.X /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ============================================================
// ADMIN: STATS + ALL APPOINTMENTS
// ============================================================
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appts, setAppts] = useState([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiFetch("/admin/stats"), apiFetch("/appointments")])
      .then(([s, a]) => { setStats(s); setAppts(a); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    await apiFetch(`/appointments/${id}/cancel`, { method: "PATCH" });
    const updated = await apiFetch("/appointments");
    setAppts(updated);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>Loading dashboard...</div>;

  return (
    <>
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Hospital overview and appointment management</p>
      </div>
      <div className="tabs">
        {["overview", "appointments"].map((t) => (
          <button key={t} className={`tab-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === "overview" && stats && (
        <>
          <div className="grid-4" style={{ marginBottom: "2rem" }}>
            {[
              { label: "Total Doctors", val: stats.totalDoctors, color: "#14b8a6", icon: "👨‍⚕️" },
              { label: "Total Patients", val: stats.totalPatients, color: "#3b82f6", icon: "🧑‍🤝‍🧑" },
              { label: "Total Appointments", val: stats.totalAppointments, color: "#f59e0b", icon: "📅" },
              { label: "Completed", val: stats.completedCount, color: "#22c55e", icon: "✅" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ fontSize: "1.75rem" }}>{s.icon}</div>
                <div className="stat-number" style={{ color: s.color }}>{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card-title">Appointment Status Breakdown</div>
              {[
                { label: "Booked", count: stats.bookedCount, color: "#1d4ed8", bg: "#dbeafe" },
                { label: "Confirmed", count: stats.confirmedCount, color: "#15803d", bg: "#dcfce7" },
                { label: "Completed", count: stats.completedCount, color: "#374151", bg: "#f3f4f6" },
                { label: "Cancelled", count: stats.cancelledCount, color: "#b91c1c", bg: "#fee2e2" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontWeight: 500 }}>{s.label}</span>
                  <span style={{ padding: "4px 12px", borderRadius: 20, background: s.bg, color: s.color, fontSize: "0.85rem", fontWeight: 700 }}>{s.count}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-title">Appointments per Doctor</div>
              {stats.appointmentsPerDoctor?.length === 0 ? (
                <div style={{ color: "#94a3b8" }}>No data yet</div>
              ) : stats.appointmentsPerDoctor?.map((d) => (
                <div key={d.doctorId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontWeight: 500 }}>Dr. {d.doctorName}</span>
                  <span style={{ background: "#0a1628", color: "white", borderRadius: 8, padding: "2px 12px", fontSize: "0.85rem" }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {tab === "appointments" && (
        <div className="card">
          <div className="card-title">All Appointments ({appts.length})</div>
          {appts.length === 0 ? (
            <div className="empty-state"><p>No appointments yet</p></div>
          ) : appts.map((a) => (
            <div key={a.id} className="appt-card">
              <div className="appt-info">
                <div className="appt-name">{a.patientName} → Dr. {a.doctorName}</div>
                <div className="appt-meta">📅 {a.appointmentDate} ⏰ {a.startTime} – {a.endTime} &nbsp;|&nbsp; {a.doctorSpecialization}</div>
              </div>
              <div className="appt-actions">
                <span className={`status-badge status-${a.status}`}>{a.status}</span>
                {["BOOKED", "CONFIRMED"].includes(a.status) && (
                  <button className="btn btn-red btn-sm" onClick={() => cancel(a.id)}><Icon.X /> Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [page, setPage] = useState(user?.role === "DOCTOR" ? "schedule" : "find");

  const login = (u) => { setUser(u); setPage(u.role === "DOCTOR" ? "schedule" : u.role === "ADMIN" ? "admin" : "find"); };
  const logout = () => { localStorage.clear(); setUser(null); };

  if (!user) return (
    <>
      <style>{styles}</style>
      <AuthPage onLogin={login} />
    </>
  );

  const navItems = {
    PATIENT: [{ key: "find", label: "Find Doctor", icon: <Icon.Search /> }, { key: "appts", label: "My Appointments", icon: <Icon.Calendar /> }],
    DOCTOR: [{ key: "schedule", label: "My Schedule", icon: <Icon.Calendar /> }, { key: "slots", label: "Manage Slots", icon: <Icon.Plus /> }],
    ADMIN: [{ key: "admin", label: "Dashboard", icon: <Icon.Stats /> }, { key: "appts", label: "All Appointments", icon: <Icon.Calendar /> }],
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        <nav className="navbar">
          <div className="navbar-brand">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(13,148,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#14b8a6" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
            </div>
            <span>MediSchedule</span>
          </div>
          <div className="navbar-nav">
            {(navItems[user.role] || []).map((item) => (
              <button key={item.key} className={`nav-btn${page === item.key ? " active" : ""}`} onClick={() => setPage(item.key)}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{user.name}</span>
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
            <button className="nav-btn logout" onClick={logout}><Icon.Logout /> Sign Out</button>
          </div>
        </nav>
        <main className="main">
          {page === "find" && <FindDoctors />}
          {page === "appts" && <MyAppointments user={user} />}
          {page === "slots" && <ManageSlots user={user} />}
          {page === "schedule" && <MyAppointments user={user} />}
          {page === "admin" && <AdminDashboard />}
        </main>
      </div>
    </>
  );
}
