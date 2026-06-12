import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

// ── metric config ─────────────────────────────────────────────────────────────
const METRIC_CONFIG = {
  Campaigns: { color:"#6366f1", bg:"linear-gradient(135deg,#6366f1,#818cf8)", light:"#eef2ff", icon:"📣" },
  Sales:     { color:"#10b981", bg:"linear-gradient(135deg,#10b981,#34d399)", light:"#ecfdf5", icon:"🛒" },
  Referrals: { color:"#0ea5e9", bg:"linear-gradient(135deg,#0ea5e9,#38bdf8)", light:"#f0f9ff", icon:"🔗" },
  Students:  { color:"#ec4899", bg:"linear-gradient(135deg,#ec4899,#f472b6)", light:"#fdf2f8", icon:"🎓" },
  Revenue:   { color:"#f59e0b", bg:"linear-gradient(135deg,#f59e0b,#fbbf24)", light:"#fffbeb", icon:"💰" },
};

// ── nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label:"Dashboard",       path:"/brand/dashboard", icon:"⊞" },
  { label:"My Campaigns",    path:"/brand/campaigns", icon:"📋" },
  { label:"Create Campaign", path:"/brand/create",    icon:"✚" },
  /*{ label:"Applicants",      path:"/brand/applicants",icon:"👥" },*/
  { label:"Performance",     path:"/brand/performance",icon:"📈"},
  { label:"Edit Campaign",   path:"/brand/campaigns", icon:"✏️" },
  { label:"Analytics",       path:"/brand/analytics", icon:"📊" },
];

// ── custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const cfg = METRIC_CONFIG[label] || {};
  return (
    <div style={{
      background:"#fff", border:"1px solid #e2e8f0",
      borderRadius:"14px", padding:"14px 20px",
      boxShadow:"0 20px 40px rgba(0,0,0,0.12)",
      fontFamily:"'Sora',sans-serif",
    }}>
      <p style={{ margin:0, fontSize:"12px", color:"#64748b", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>{label}</p>
      <p style={{ margin:"6px 0 0", fontSize:"24px", fontWeight:800, color:cfg.color || "#6366f1" }}>
        {label === "Revenue" ? `$${payload[0].value}` : payload[0].value}
      </p>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
function BrandDashboard() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = JSON.parse(localStorage.getItem("user"));

  const [analyticsData, setAnalyticsData] = useState([]);
  const [activeNav,     setActiveNav]     = useState(location.pathname);
  const [logoutPressed, setLogoutPressed] = useState(false);

  const socket = io("http://localhost:5000");

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/analytics/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setAnalyticsData([
        { name:"Campaigns", value: data.campaigns || 0 },
        { name:"Sales",     value: data.sales      || 0 },
        { name:"Referrals", value: data.referrals  || 0 },
        { name:"Students",  value: data.students   || 0 },
        { name:"Revenue",   value: data.revenue    || 0 },
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

  const handleNav = (path) => { setActiveNav(path); navigate(path); };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .brand-nav-item {
          display:flex; align-items:center; gap:11px;
          padding:13px 16px; border-radius:14px; margin-bottom:4px;
          cursor:pointer; font-size:14px; font-weight:500; color:#94a3b8;
          transition:background 0.18s ease, color 0.18s ease, transform 0.18s ease;
          user-select:none;
        }
        .brand-nav-item:hover { background:rgba(255,255,255,0.07); color:#e2e8f0; transform:translateX(4px); }
        .brand-nav-item.active {
          background:linear-gradient(135deg,rgba(99,102,241,0.25),rgba(129,140,248,0.15));
          color:#c7d2fe; box-shadow:0 0 0 1px rgba(99,102,241,0.3);
        }
        .brand-nav-item:active { transform:scale(0.97); }

        .notif-btn {
          width:100%; margin-top:18px; padding:13px;
          border-radius:14px; border:none;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          color:white; font-weight:700; font-size:14px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 8px 22px rgba(99,102,241,0.32);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .notif-btn:hover { transform:translateY(-2px); box-shadow:0 14px 30px rgba(99,102,241,0.42); filter:brightness(1.08); }
        .notif-btn:active { transform:scale(0.96); filter:brightness(0.95); }

        .logout-btn {
          width:100%; padding:13px; border-radius:14px; border:none;
          background:linear-gradient(135deg,#ef4444,#dc2626);
          color:white; font-weight:700; font-size:14px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 8px 22px rgba(239,68,68,0.30);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
        }
        .logout-btn:hover { transform:translateY(-2px); box-shadow:0 14px 28px rgba(239,68,68,0.42); filter:brightness(1.08); }
        .logout-btn:active { transform:scale(0.96); filter:brightness(0.94); }

        .stat-card {
          background:#fff; padding:26px 24px; border-radius:22px;
          border:1.5px solid transparent;
          box-shadow:0 4px 18px rgba(0,0,0,0.05);
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.2s ease;
          cursor:default; position:relative; overflow:hidden;
        }
        .stat-card:hover { transform:translateY(-6px); box-shadow:0 18px 42px rgba(0,0,0,0.09); }
        .stat-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:4px; border-radius:22px 22px 0 0;
        }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%; background:#10b981;
          display:inline-block; animation:pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.45);} }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ══ SIDEBAR ══ */}
        <div style={{
          width:"268px", flexShrink:0,
          background:"linear-gradient(180deg, #0c1525 0%, #111827 50%, #0f1f35 100%)",
          padding:"28px 18px", color:"white",
          boxShadow:"4px 0 30px rgba(0,0,0,0.18)",
          position:"sticky", top:0, height:"100vh",
          display:"flex", flexDirection:"column",
        }}>
          {/* Brand */}
          <div style={{ marginBottom:"28px", padding:"0 6px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
              <div style={{
                width:"36px", height:"36px", borderRadius:"10px",
                background:"linear-gradient(135deg,#6366f1,#818cf8)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"18px", boxShadow:"0 4px 12px rgba(99,102,241,0.4)",
              }}>🏢</div>
              <span style={{ fontSize:"17px", fontWeight:800, color:"#f1f5f9" }}>
                UniBrand<span style={{ color:"#818cf8" }}>Connect</span>
              </span>
            </div>
            <div style={{ marginLeft:"46px", fontSize:"11px", color:"#475569", fontWeight:600, letterSpacing:"2px", textTransform:"uppercase" }}>Brand Panel</div>
          </div>

          <div style={{ height:"1px", background:"rgba(255,255,255,0.06)", marginBottom:"16px" }} />

          {/* Nav */}
          <nav style={{ flex:1, overflowY:"auto" }}>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className={`brand-nav-item${activeNav === item.path ? " active" : ""}`}
                onClick={() => handleNav(item.path)}
              >
                <span style={{ fontSize:"15px", width:"20px", textAlign:"center" }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}

            <button className="notif-btn" onClick={() => navigate("/notifications")}>
              🔔 Notifications
            </button>
          </nav>

          <div style={{ height:"1px", background:"rgba(255,255,255,0.06)", margin:"16px 6px" }} />

          {/* User info */}
          <div style={{
            display:"flex", alignItems:"center", gap:"12px",
            padding:"12px 10px", marginBottom:"14px",
            background:"rgba(255,255,255,0.04)",
            borderRadius:"14px", border:"1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{
              width:"38px", height:"38px", borderRadius:"50%",
              background:"linear-gradient(135deg,#6366f1,#ec4899)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"15px", fontWeight:700, color:"white", flexShrink:0,
            }}>
              {(user?.name || "B")[0].toUpperCase()}
            </div>
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:"13px", fontWeight:700, color:"#e2e8f0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {user?.name || "Brand"}
              </div>
              <div style={{ fontSize:"11px", color:"#475569" }}>Brand Account</div>
            </div>
          </div>

          <button
            className="logout-btn"
            onMouseDown={() => setLogoutPressed(true)}
            onMouseUp={() => setLogoutPressed(false)}
            onMouseLeave={() => setLogoutPressed(false)}
            onClick={handleLogout}
          >
            🚪 &nbsp;Sign Out
          </button>
        </div>

        {/* ══ MAIN CONTENT ══ */}
        <div style={{ flex:1, padding:"36px 40px", minWidth:0 }}>

          {/* Header banner */}
          <div style={{
            background:"linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
            borderRadius:"28px", padding:"44px 48px",
            color:"white", marginBottom:"28px",
            boxShadow:"0 20px 60px rgba(99,102,241,0.30)",
            position:"relative", overflow:"hidden",
            display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"24px",
          }}>
            <div style={{ position:"absolute", right:"-40px", top:"-40px", width:"240px", height:"240px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
            <div style={{ position:"absolute", right:"80px", bottom:"-70px", width:"160px", height:"160px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#a5b4fc", letterSpacing:"2px", textTransform:"uppercase" }}>Live Dashboard</span>
              </div>
              <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>
                Welcome Back, {user?.name || "Brand"} 🏢
              </h1>
              <p style={{ marginTop:"12px", fontSize:"16px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
                Monitor campaign growth, sales performance, student engagement, and referral analytics in real-time.
              </p>
            </div>

            {/* Profile card */}
            <div style={{
              background:"rgba(255,255,255,0.12)", backdropFilter:"blur(10px)",
              border:"1px solid rgba(255,255,255,0.18)",
              padding:"20px 24px", borderRadius:"20px",
              minWidth:"200px", position:"relative", zIndex:1,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
                <div style={{
                  width:"36px", height:"36px", borderRadius:"50%",
                  background:"linear-gradient(135deg,#6366f1,#ec4899)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"15px", fontWeight:700,
                }}>
                  {(user?.name || "B")[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ margin:0, fontSize:"11px", opacity:0.7, fontWeight:600, letterSpacing:"1px", textTransform:"uppercase" }}>Active Brand</p>
                  <h3 style={{ margin:0, fontSize:"16px", fontWeight:800 }}>{user?.name || "Brand"}</h3>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"rgba(255,255,255,0.10)", borderRadius:"999px", padding:"5px 12px", width:"fit-content" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"11px", fontWeight:700, color:"#86efac" }}>Online</span>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(190px, 1fr))", gap:"18px", marginBottom:"28px" }}>
            {analyticsData.map((item, index) => {
              const cfg = METRIC_CONFIG[item.name] || { color:"#6366f1", bg:"linear-gradient(135deg,#6366f1,#818cf8)", light:"#eef2ff", icon:"📊" };
              return (
                <div
                  key={index}
                  className="stat-card"
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = cfg.color + "55"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
                >
                  <style>{`.stat-card:nth-child(${index+1})::before { background:${cfg.bg}; }`}</style>
                  <div style={{
                    width:"46px", height:"46px", borderRadius:"14px",
                    background:cfg.light,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"22px", marginBottom:"16px",
                  }}>{cfg.icon}</div>
                  <p style={{ margin:0, color:"#94a3b8", fontSize:"12px", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>{item.name}</p>
                  <h2 style={{ marginTop:"8px", marginBottom:0, fontSize:"36px", fontWeight:800, color:"#0f172a", lineHeight:1 }}>
                    {item.name === "Revenue" ? `$${item.value}` : item.value}
                  </h2>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div style={{ background:"#fff", borderRadius:"24px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 24px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
              <div>
                <h2 style={{ margin:"0 0 6px", fontSize:"22px", fontWeight:800, color:"#0f172a" }}>Campaign Performance Overview</h2>
                <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>Track campaigns, referrals, students, and revenue analytics.</p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"#f0fdf4", padding:"8px 16px", borderRadius:"100px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"13px", fontWeight:600, color:"#16a34a" }}>Live</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"22px" }}>
              {analyticsData.map((item, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <div style={{ width:"10px", height:"10px", borderRadius:"3px", background:METRIC_CONFIG[item.name]?.color || "#6366f1" }} />
                  <span style={{ fontSize:"12px", color:"#64748b", fontWeight:500 }}>{item.name}</span>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={analyticsData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false}
                  tick={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:600, fill:"#64748b" }}
                />
                <YAxis
                  stroke="#94a3b8" axisLine={false} tickLine={false}
                  tick={{ fontFamily:"'Sora',sans-serif", fontSize:12, fill:"#94a3b8" }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(99,102,241,0.05)", radius:8 }} />
                <Bar dataKey="value" fill="#6366f1" radius={[10,10,0,0]} barSize={52} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarItem({ label, onClick }) {
  return (
    <div onClick={onClick} className="brand-nav-item">{label}</div>
  );
}

export default BrandDashboard;