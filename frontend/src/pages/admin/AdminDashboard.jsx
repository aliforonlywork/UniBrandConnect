import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

// ── nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { text:"Dashboard",            path:"/admin/dashboard",             icon:"⊞" },
  { text:"Manage Users",         path:"/admin/users",                 icon:"👥" },
  { text:"Student List",         path:"/admin/admstudentlist",        icon:"🎓" },
  { text:"Approve Brands",       path:"/admin/approve-brands",        icon:"🏷️" },
  { text:"Approve Campaigns",    path:"/admin/approve-campaigns",     icon:"📣" },
  /*{ text:"Approve Universities", path:"/admin/approve-universities",  icon:"🏫" },*/
  /*{ text:"Commission Settings",  path:"/admin/commission",            icon:"💸" },*/
  { text:"Platform Analytics",   path:"/admin/platformanalytics",     icon:"📊" },
  /*{ text:"Transaction Logs",     path:"/admin/transactions",          icon:"🧾" },*/
];

// ── metric config ─────────────────────────────────────────────────────────────
const STAT_CONFIG = [
  { title:"Students",     icon:"🎓", color:"#1d4ed8", light:"#dbeafe", bar:"linear-gradient(90deg,#3b82f6,#60a5fa)" },
  { title:"Companies",    icon:"🏢", color:"#6d28d9", light:"#ede9fe", bar:"linear-gradient(90deg,#7c3aed,#a78bfa)" },
  { title:"Campaigns",    icon:"🚀", color:"#065f46", light:"#d1fae5", bar:"linear-gradient(90deg,#059669,#34d399)" },
  { title:"Transactions", icon:"💳", color:"#92400e", light:"#ffedd5", bar:"linear-gradient(90deg,#ea580c,#fb923c)" },
];

// ── custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:"14px", padding:"14px 20px", boxShadow:"0 20px 40px rgba(0,0,0,0.12)", fontFamily:"'Sora',sans-serif" }}>
      <p style={{ margin:0, fontSize:"12px", color:"#64748b", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>{label}</p>
      <p style={{ margin:"6px 0 0", fontSize:"24px", fontWeight:800, color:"#2563eb" }}>{payload[0].value}</p>
    </div>
  );
}

function AdminDashboard() {
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
      const response = await axios.get("http://localhost:5000/api/analytics/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setAnalyticsData([
        { name:"Students",     value: data.students     || 0 },
        { name:"Companies",    value: data.companies    || 0 },
        { name:"Campaigns",    value: data.campaigns    || 0 },
        { name:"Referrals",    value: data.referrals    || 0 },
        { name:"Transactions", value: data.transactions || 0 },
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

  const statCards = [
    { ...STAT_CONFIG[0], value: analyticsData[0]?.value || 0 },
    { ...STAT_CONFIG[1], value: analyticsData[1]?.value || 0 },
    { ...STAT_CONFIG[2], value: analyticsData[2]?.value || 0 },
    { ...STAT_CONFIG[3], value: analyticsData[4]?.value || 0 },
  ];

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

        .admin-nav-item {
          display:flex; align-items:center; gap:11px;
          padding:12px 16px; border-radius:14px; margin-bottom:4px;
          cursor:pointer; font-size:13.5px; font-weight:500; color:#94a3b8;
          transition:background 0.18s ease, color 0.18s ease, transform 0.18s ease;
          user-select:none;
        }
        .admin-nav-item:hover { background:rgba(255,255,255,0.07); color:#e2e8f0; transform:translateX(4px); }
        .admin-nav-item.active {
          background:linear-gradient(135deg,rgba(37,99,235,0.22),rgba(59,130,246,0.12));
          color:#bfdbfe; box-shadow:0 0 0 1px rgba(37,99,235,0.30);
        }
        .admin-nav-item:active { transform:scale(0.97); }

        .logout-btn {
          width:100%; padding:13px; border-radius:14px; border:none;
          background:linear-gradient(135deg,#ef4444,#dc2626);
          color:white; font-weight:700; font-size:14px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 8px 22px rgba(239,68,68,0.30);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
        }
        .logout-btn:hover  { transform:translateY(-2px); box-shadow:0 14px 28px rgba(239,68,68,0.42); filter:brightness(1.08); }
        .logout-btn:active { transform:scale(0.96); filter:brightness(0.94); }

        .stat-card {
          background:#fff; border-radius:22px; padding:24px;
          display:flex; align-items:center; gap:18px;
          border:1.5px solid #f1f5f9;
          box-shadow:0 4px 18px rgba(0,0,0,0.05);
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          cursor:default; position:relative; overflow:hidden;
        }
        .stat-card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(0,0,0,0.09); }
        .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:22px 22px 0 0; }

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
          background:"linear-gradient(180deg, #0c1525 0%, #111827 50%, #0a1628 100%)",
          padding:"28px 18px", color:"white",
          boxShadow:"4px 0 30px rgba(0,0,0,0.20)",
          position:"sticky", top:0, height:"100vh",
          display:"flex", flexDirection:"column",
        }}>

          {/* Logo */}
          <div style={{ marginBottom:"28px", padding:"0 6px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
              <div style={{
                width:"36px", height:"36px", borderRadius:"10px",
                background:"linear-gradient(135deg,#2563eb,#3b82f6)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"18px", boxShadow:"0 4px 12px rgba(37,99,235,0.40)",
              }}>👑</div>
              <span style={{ fontSize:"16px", fontWeight:800, color:"#f1f5f9" }}>
                UniBrand<span style={{ color:"#60a5fa" }}>Connect</span>
              </span>
            </div>
            <div style={{ marginLeft:"46px", fontSize:"11px", color:"#475569", fontWeight:600, letterSpacing:"2px", textTransform:"uppercase" }}>Admin Control Center</div>
          </div>

          <div style={{ height:"1px", background:"rgba(255,255,255,0.06)", marginBottom:"16px" }} />

          {/* Nav */}
          <nav style={{ flex:1, overflowY:"auto" }}>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.path}
                className={`admin-nav-item${activeNav === item.path ? " active" : ""}`}
                onClick={() => handleNav(item.path)}
              >
                <span style={{ fontSize:"15px", width:"20px", textAlign:"center" }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
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
              background:"linear-gradient(135deg,#2563eb,#7c3aed)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"15px", fontWeight:700, color:"white", flexShrink:0,
            }}>
              {(user?.name || "A")[0].toUpperCase()}
            </div>
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:"13px", fontWeight:700, color:"#e2e8f0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {user?.name || "Admin"}
              </div>
              <div style={{ fontSize:"11px", color:"#475569" }}>System Administrator</div>
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
            background:"linear-gradient(135deg, #0c1525 0%, #1e293b 35%, #1e3a8a 65%, #2563eb 100%)",
            borderRadius:"28px", padding:"44px 48px",
            color:"white", marginBottom:"28px",
            boxShadow:"0 20px 60px rgba(37,99,235,0.28)",
            position:"relative", overflow:"hidden",
            display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"24px",
          }}>
            <div style={{ position:"absolute", right:"-40px", top:"-40px", width:"240px", height:"240px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
            <div style={{ position:"absolute", right:"80px", bottom:"-70px", width:"160px", height:"160px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#93c5fd", letterSpacing:"2px", textTransform:"uppercase" }}>Live Dashboard</span>
              </div>
              <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>
                Welcome Back, {user?.name || "Admin"} 👑
              </h1>
              <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
                Monitor platform growth, manage approvals, and analyze real-time system performance from your premium admin dashboard.
              </p>
            </div>

            {/* Admin badge */}
            <div style={{
              background:"rgba(255,255,255,0.10)", backdropFilter:"blur(10px)",
              border:"1.5px solid rgba(255,255,255,0.18)",
              padding:"20px 28px", borderRadius:"20px",
              position:"relative", zIndex:1, textAlign:"center",
            }}>
              <div style={{
                width:"52px", height:"52px", borderRadius:"50%",
                background:"linear-gradient(135deg,#2563eb,#7c3aed)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"24px", margin:"0 auto 10px",
                boxShadow:"0 6px 18px rgba(37,99,235,0.40)",
              }}>👑</div>
              <p style={{ margin:0, fontSize:"11px", opacity:0.7, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>Role</p>
              <h3 style={{ margin:"4px 0 0", fontSize:"18px", fontWeight:800 }}>Administrator</h3>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:"18px", marginBottom:"28px" }}>
            {statCards.map((item, i) => (
              <div key={i} className="stat-card">
                <style>{`.stat-card:nth-child(${i+1})::before { background:${item.bar}; }`}</style>
                <div style={{
                  width:"60px", height:"60px", borderRadius:"18px",
                  background:item.light,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"26px", flexShrink:0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <h2 style={{ margin:0, fontSize:"34px", fontWeight:800, color:"#0f172a", lineHeight:1 }}>
                    {item.value.toLocaleString()}
                  </h2>
                  <p style={{ margin:"5px 0 0", color:"#64748b", fontSize:"13px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{ background:"#fff", borderRadius:"24px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 22px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"22px", flexWrap:"wrap", gap:"12px" }}>
              <div>
                <h2 style={{ margin:"0 0 6px", fontSize:"22px", fontWeight:800, color:"#0f172a" }}>Platform Analytics Overview</h2>
                <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>Real-time monitoring of users, campaigns, referrals, and platform activities.</p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"#f0fdf4", padding:"8px 16px", borderRadius:"100px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"13px", fontWeight:700, color:"#16a34a" }}>Live Data</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"22px" }}>
              {analyticsData.map((item, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <div style={{ width:"10px", height:"10px", borderRadius:"3px", background:"#2563eb" }} />
                  <span style={{ fontSize:"12px", color:"#64748b", fontWeight:500 }}>{item.name}</span>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={400}>
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
                <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(37,99,235,0.05)", radius:8 }} />
                <Bar dataKey="value" fill="#2563eb" radius={[10,10,0,0]} barSize={52} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarItem({ text, onClick }) {
  return <div onClick={onClick} className="admin-nav-item">{text}</div>;
}

export default AdminDashboard;