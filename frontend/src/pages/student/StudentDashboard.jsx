import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ─── COLOR MAP per metric ───────────────────────────────────────────────────
const METRIC_CONFIG = {
  Referrals:  { color: "#6366f1", bg: "linear-gradient(135deg,#6366f1,#818cf8)", light: "#eef2ff", icon: "👥" },
  Clicks:     { color: "#0ea5e9", bg: "linear-gradient(135deg,#0ea5e9,#38bdf8)", light: "#f0f9ff", icon: "🖱️" },
  Purchases:  { color: "#10b981", bg: "linear-gradient(135deg,#10b981,#34d399)", light: "#ecfdf5", icon: "🛒" },
  Earnings:   { color: "#f59e0b", bg: "linear-gradient(135deg,#f59e0b,#fbbf24)", light: "#fffbeb", icon: "💰" },
  Campaigns:  { color: "#ec4899", bg: "linear-gradient(135deg,#ec4899,#f472b6)", light: "#fdf2f8", icon: "📣" },
};

// ─── SIDEBAR ITEMS CONFIG ───────────────────────────────────────────────────
const NAV_ITEMS = [
  { title: "Dashboard",          path: "/student/dashboard",       icon: "⊞" },
  { title: "Available Campaigns",path: "/student/campaigns",       icon: "📋" },
  { title: "AI Recommendations", path: "/student/recommendations", icon: "✦" },
  { title: "Wallet",             path: "/student/wallet",          icon: "◈" },
  { title: "Earnings Report",    path: "/student/earnings",        icon: "📈" },
  { title: "My Referrals",       path: "/student/referrals",       icon: "🔗" },
  /*{ title: "Referral Link",      path: "/student/referral-link",   icon: "⭿" },*/
  { title: "Click History",      path: "/student/clicks",          icon: "⏱" },
  { title: "Gamification Center",path: "/student/gamification",    icon: "🏆" },
];

// ─── CUSTOM TOOLTIP ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const cfg = METRIC_CONFIG[label] || {};
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: "14px",
      padding: "14px 20px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
      fontFamily: "'Sora', sans-serif",
    }}>
      <p style={{ margin: 0, fontSize: "13px", color: "#64748b", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "6px 0 0", fontSize: "24px", fontWeight: 700, color: cfg.color || "#6366f1" }}>
        {label === "Earnings" ? `$${payload[0].value}` : payload[0].value}
      </p>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
function StudentDashboard() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = JSON.parse(localStorage.getItem("user"));

  const [analyticsData, setAnalyticsData]   = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeNav, setActiveNav]           = useState(location.pathname);
  const [pressedLogout, setPressedLogout]   = useState(false);

  const socket = io("http://localhost:5000");

  const [referrals, setReferrals] = useState([]); // ADD this state

const fetchAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");
    const [analyticsRes, walletRes, refRes] = await Promise.all([ // ADD refRes
      axios.get("http://localhost:5000/api/analytics/student", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("http://localhost:5000/api/wallet/my-wallet", { headers: { Authorization: `Bearer ${token}` } }),
      API.get("/referrals/my") // ADD this
    ]);

    const data = analyticsRes.data;
    const txs = walletRes.data.transactions || [];
    const refs = refRes.data.referrals || []; // ADD this
    setTransactions(txs);
    setReferrals(refs); // ADD this

    const realEarnings = txs
      .filter(tx => tx.type === "credit" || tx.type === "commission")
      .reduce((t, tx) => t + (tx.commissionAmount || 0), 0);

    const realClicks = refs.reduce((t, r) => t + (r.clicks || 0), 0); // ADD this

    setAnalyticsData([
      { name: "Referrals",  value: data.referrals  || 0 },
      { name: "Clicks",     value: realClicks }, // USE realClicks instead of data.clicks
      { name: "Purchases",  value: data.purchases  || 0 },
      { name: "Earnings",   value: realEarnings },
      { name: "Campaigns",  value: data.campaigns  || 0 },
    ]);
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    fetchAnalytics();
    socket.on("analyticsUpdated", fetchAnalytics);
    return () => socket.off("analyticsUpdated");
  }, []);

  const handleNav = (path) => {
    setActiveNav(path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ── BAR FILL BY INDEX ──────────────────────────────────────────────────────
  const barColors = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ec4899"];

  return (
    <>
      {/* ── GOOGLE FONT IMPORT ─────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        body { margin: 0; }

        .stat-card {
          background: #fff;
          border-radius: 20px;
          padding: 28px 24px;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.22s ease,
                      border-color 0.22s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
        }
        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(0,0,0,0.10);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 80px; height: 80px;
          border-radius: 0 20px 0 80px;
          opacity: 0.08;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 14px;
          margin-bottom: 4px;
          cursor: pointer;
          font-size: 14.5px;
          font-weight: 500;
          color: #94a3b8;
          transition: background 0.18s ease,
                      color 0.18s ease,
                      transform 0.18s ease,
                      box-shadow 0.18s ease;
          user-select: none;
        }
        .nav-item:hover {
          background: rgba(255,255,255,0.07);
          color: #e2e8f0;
          transform: translateX(4px);
        }
        .nav-item.active {
          background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(129,140,248,0.15));
          color: #c7d2fe;
          box-shadow: 0 0 0 1px rgba(99,102,241,0.3);
        }
        .nav-item:active {
          transform: scale(0.97);
        }

        .logout-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          font-weight: 700;
          font-size: 14.5px;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: transform 0.18s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.18s ease,
                      filter 0.18s ease;
          box-shadow: 0 8px 24px rgba(239,68,68,0.35);
        }
        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(239,68,68,0.45);
          filter: brightness(1.08);
        }
        .logout-btn:active {
          transform: scale(0.96) translateY(0);
          box-shadow: 0 4px 12px rgba(239,68,68,0.3);
          filter: brightness(0.95);
        }
        .logout-btn.pressed {
          background: linear-gradient(135deg, #b91c1c, #991b1b);
        }

        .chart-wrapper {
          background: #fff;
          border-radius: 24px;
          padding: 34px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
          border: 1.5px solid #f1f5f9;
        }

        .pulse-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #10b981;
          display: inline-block;
          animation: pulse 2s infinite;
          margin-right: 8px;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>

      <div style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Sora', sans-serif",
      }}>

        {/* ══════════════════ SIDEBAR ══════════════════ */}
        <div style={{
          width: "268px",
          background: "linear-gradient(180deg, #0c1525 0%, #111827 50%, #0f1f35 100%)",
          color: "white",
          padding: "28px 18px",
          boxShadow: "4px 0 30px rgba(0,0,0,0.18)",
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}>

          {/* Logo */}
          <div style={{ marginBottom: "32px", padding: "0 6px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
            }}>
              <div style={{
                width: "36px", height: "36px",
                background: "linear-gradient(135deg,#6366f1,#818cf8)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
                boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
              }}>🎓</div>
              <span style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "0.3px", color: "#f1f5f9" }}>
                UniBrand<span style={{ color: "#818cf8" }}>Connect</span>
              </span>
            </div>
            <div style={{
              marginLeft: "46px",
              fontSize: "11px",
              color: "#475569",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}>Student Panel</div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "16px", marginLeft: "6px", marginRight: "6px" }} />

          {/* Nav Items */}
          <nav style={{ flex: 1, overflowY: "auto" }}>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.path}
                className={`nav-item${activeNav === item.path ? " active" : ""}`}
                onClick={() => handleNav(item.path)}
              >
                <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{item.icon}</span>
                <span>{item.title}</span>
              </div>
            ))}
          </nav>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "16px 6px" }} />

          {/* User Info */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 10px",
            marginBottom: "14px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{
              width: "38px", height: "38px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "15px",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}>
              {(user?.name || "S")[0].toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name || "Student"}
              </div>
              <div style={{ fontSize: "12px", color: "#475569" }}>{user?.email || "student@uni.edu"}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            className={`logout-btn${pressedLogout ? " pressed" : ""}`}
            onMouseDown={() => setPressedLogout(true)}
            onMouseUp={() => setPressedLogout(false)}
            onMouseLeave={() => setPressedLogout(false)}
            onClick={handleLogout}
          >
            🚪 &nbsp;Sign Out
          </button>
        </div>

        {/* ══════════════════ MAIN CONTENT ══════════════════ */}
        <div style={{ flex: 1, padding: "36px 40px", minWidth: 0 }}>

          {/* ── HEADER BANNER ────────────────────────────── */}
          <div style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
            borderRadius: "28px",
            padding: "44px 48px",
            color: "white",
            boxShadow: "0 20px 60px rgba(99,102,241,0.30)",
            marginBottom: "32px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative circles */}
            <div style={{
              position: "absolute", right: "-40px", top: "-40px",
              width: "240px", height: "240px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
            }} />
            <div style={{
              position: "absolute", right: "80px", bottom: "-70px",
              width: "180px", height: "180px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "50%",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#a5b4fc", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Live Dashboard
                </span>
              </div>
              <h1 style={{ margin: 0, fontSize: "38px", fontWeight: 800, lineHeight: 1.1 }}>
                Welcome back, {user?.name || "Student"} 🎓
              </h1>
              <p style={{ marginTop: "14px", opacity: 0.8, fontSize: "16px", fontWeight: 400, maxWidth: "520px", lineHeight: 1.6 }}>
                Track your campaigns, referrals, earnings and performance analytics — all updating in real-time.
              </p>
            </div>
          </div>

          {/* ── QUICK STATS ──────────────────────────────── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px",
            marginBottom: "32px",
          }}>
            {analyticsData.map((item, index) => {
              const cfg = METRIC_CONFIG[item.name] || { color: "#6366f1", bg: "linear-gradient(135deg,#6366f1,#818cf8)", light: "#eef2ff", icon: "📊" };
              return (
                <div
                  key={index}
                  className="stat-card"
                  style={{ borderColor: "transparent" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = cfg.color + "55"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
                >
                  {/* Colored top accent */}
                  <div style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: "4px",
                    background: cfg.bg,
                    borderRadius: "20px 20px 0 0",
                  }} />

                  {/* Icon badge */}
                  <div style={{
                    width: "48px", height: "48px",
                    borderRadius: "14px",
                    background: cfg.light,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px",
                    marginBottom: "18px",
                  }}>
                    {cfg.icon}
                  </div>

                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                    {item.name}
                  </p>
                  <h2 style={{ marginTop: "8px", marginBottom: 0, fontSize: "36px", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    {item.name === "Earnings" ? `$${item.value}` : item.value}
                  </h2>
                </div>
              );
            })}
          </div>

          {/* ── CHART ────────────────────────────────────── */}
          <div className="chart-wrapper">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#0f172a" }}>
                  Performance Analytics
                </h2>
                <p style={{ marginTop: "6px", color: "#64748b", fontSize: "14px" }}>
                  Real-time stats of your marketing performance
                </p>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "#f0fdf4",
                padding: "8px 16px",
                borderRadius: "100px",
                border: "1px solid #bbf7d0",
              }}>
                <span className="pulse-dot" style={{ margin: 0 }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#16a34a" }}>Live</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
              {analyticsData.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: barColors[i] }} />
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>{item.name}</span>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={analyticsData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 600, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)", radius: 8 }} />
                <Bar
                  dataKey="value"
                  radius={[10, 10, 0, 0]}
                  barSize={52}
                  // Per-bar color via Cell approach replaced by fill per index
                  fill="#6366f1"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </>
  );
}

/* ══════════════════ SIDEBAR ITEM (kept for backward compat if used elsewhere) ══════════════════ */
function SidebarItem({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="nav-item"
    >
      {title}
    </div>
  );
}

export default StudentDashboard;