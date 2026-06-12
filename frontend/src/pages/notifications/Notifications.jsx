import { useEffect, useState } from "react";
import API from "../../services/api";

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" })
    : "Recently";
const formatTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" })
    : "";

// Simple classifier for notification type from message content
const getNotifType = (msg = "") => {
  const m = msg.toLowerCase();
  if (m.includes("approv"))  return { icon:"✅", color:"#166534", light:"#f0fdf4", border:"#86efac", accent:"#10b981" };
  if (m.includes("reject"))  return { icon:"❌", color:"#991b1b", light:"#fef2f2", border:"#fca5a5", accent:"#ef4444" };
  if (m.includes("payment") || m.includes("earn") || m.includes("revenue"))
                              return { icon:"💰", color:"#92400e", light:"#fffbeb", border:"#fcd34d", accent:"#f59e0b" };
  if (m.includes("campaign")) return { icon:"📣", color:"#4338ca", light:"#eef2ff", border:"#c7d2fe", accent:"#6366f1" };
  if (m.includes("referral")) return { icon:"🔗", color:"#1d4ed8", light:"#eff6ff", border:"#93c5fd", accent:"#3b82f6" };
  if (m.includes("brand"))    return { icon:"🏷️", color:"#6d28d9", light:"#f5f3ff", border:"#ddd6fe", accent:"#7c3aed" };
  return                             { icon:"🔔", color:"#1d4ed8", light:"#eff6ff", border:"#bfdbfe", accent:"#2563eb" };
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
      <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ background:"white", padding:"44px 60px", borderRadius:"28px", boxShadow:"0 10px 44px rgba(0,0,0,0.09)", textAlign:"center", border:"1.5px solid #f1f5f9" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"50%", border:"3px solid #dbeafe", borderTopColor:"#2563eb", animation:"spin 0.85s linear infinite", margin:"0 auto 18px" }} />
          <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#2563eb" }}>Loading Notifications…</p>
          <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Fetching your latest alerts</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .notif-row {
          background:#fff; border-radius:20px;
          padding:20px 22px;
          border:1.5px solid #f1f5f9;
          box-shadow:0 3px 14px rgba(0,0,0,0.04);
          display:flex; gap:16px; align-items:flex-start;
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, border-color 0.18s ease;
          cursor:default;
        }
        .notif-row:hover {
          transform:translateY(-3px);
          box-shadow:0 12px 32px rgba(0,0,0,0.08);
        }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%; background:#10b981;
          display:inline-block; animation:pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.45);} }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #0c1525 0%, #1e293b 35%, #1e3a8a 65%, #2563eb 100%)",
          padding:"44px 48px", borderRadius:"28px", color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(37,99,235,0.28)",
          position:"relative", overflow:"hidden",
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"24px",
        }}>
          <div style={{ position:"absolute", right:"-40px", top:"-40px", width:"240px", height:"240px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", right:"80px", bottom:"-70px", width:"160px", height:"160px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"7px 16px", borderRadius:"999px",
              background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.18)",
              fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
              marginBottom:"18px",
            }}>
              <span className="pulse-dot" /> Platform Alerts
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Notifications 🔔</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Stay updated with platform activities, approvals, campaign updates, and important alerts.
            </p>
          </div>

          {/* Count */}
          <div style={{
            background:"rgba(255,255,255,0.10)", border:"1.5px solid rgba(255,255,255,0.18)",
            padding:"20px 28px", borderRadius:"20px", backdropFilter:"blur(10px)",
            position:"relative", zIndex:1, textAlign:"center", minWidth:"160px",
          }}>
            <p style={{ margin:"0 0 6px", fontSize:"11px", color:"#93c5fd", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>Total Alerts</p>
            <h2 style={{ margin:0, fontSize:"40px", fontWeight:800, lineHeight:1 }}>{notifications.length}</h2>
          </div>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div style={{
            display:"flex", alignItems:"center", gap:"10px",
            background:"#fef2f2", color:"#991b1b",
            padding:"14px 18px", borderRadius:"14px",
            marginBottom:"22px", border:"1.5px solid #fecaca",
            fontSize:"14px", fontWeight:600,
          }}>
            <span>⚠️</span>{error}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {notifications.length === 0 ? (
          <div style={{ background:"white", padding:"70px 30px", borderRadius:"24px", textAlign:"center", border:"1.5px dashed #e2e8f0", boxShadow:"0 4px 18px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:"56px", marginBottom:"16px" }}>🔔</div>
            <h2 style={{ color:"#0f172a", margin:"0 0 10px", fontSize:"22px", fontWeight:800 }}>No Notifications Yet</h2>
            <p style={{ color:"#64748b", margin:0, fontSize:"15px", lineHeight:1.7, maxWidth:"400px", marginInline:"auto" }}>
              Your latest platform notifications will appear here as activity happens.
            </p>
          </div>

        ) : (
          <>
            {/* Section label */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"18px", flexWrap:"wrap", gap:"10px" }}>
              <h3 style={{ margin:0, fontSize:"16px", fontWeight:800, color:"#0f172a" }}>
                Recent Alerts
                <span style={{ marginLeft:"10px", fontSize:"13px", fontWeight:600, color:"#94a3b8" }}>({notifications.length})</span>
              </h3>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"#f0fdf4", padding:"7px 14px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Live</span>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {notifications.map((notification) => {
                const cfg = getNotifType(notification.message);
                return (
                  <div
                    key={notification._id}
                    className="notif-row"
                    style={{ borderLeftColor:cfg.accent, borderLeftWidth:"4px" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = cfg.border; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.borderLeftColor = cfg.accent; }}
                  >
                    {/* Icon */}
                    <div style={{
                      width:"46px", height:"46px", borderRadius:"14px", flexShrink:0,
                      background:cfg.light, border:`1.5px solid ${cfg.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"20px",
                    }}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ margin:"0 0 6px", fontSize:"14px", color:"#0f172a", fontWeight:600, lineHeight:1.6 }}>
                        {notification.message}
                      </p>
                      <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
                        <span style={{ fontSize:"12px", color:"#94a3b8", fontWeight:500 }}>
                          📅 {formatDate(notification.createdAt)}
                        </span>
                        {formatTime(notification.createdAt) && (
                          <span style={{ fontSize:"12px", color:"#94a3b8", fontWeight:500 }}>
                            🕐 {formatTime(notification.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Type tag */}
                    <div style={{
                      padding:"5px 12px", borderRadius:"999px", flexShrink:0,
                      background:cfg.light, border:`1.5px solid ${cfg.border}`,
                      color:cfg.color, fontSize:"11px", fontWeight:700,
                      display:"flex", alignItems:"center", gap:"5px",
                      alignSelf:"flex-start",
                    }}>
                      <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:cfg.accent }} />
                      {cfg.icon === "✅" ? "Approved" : cfg.icon === "❌" ? "Rejected" : cfg.icon === "💰" ? "Payment" : cfg.icon === "📣" ? "Campaign" : cfg.icon === "🔗" ? "Referral" : cfg.icon === "🏷️" ? "Brand" : "Alert"}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Notifications;