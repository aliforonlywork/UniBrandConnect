import { useEffect, useState } from "react";
import API from "../../services/api";
import axios from "axios";

const ClickHistory = () => {
  const [clicks, setClicks]   = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Get clicks from analytics endpoint - it usually has full data
      const [clicksRes, analyticsRes] = await Promise.all([
        API.get("/clicks").catch(() => ({ data: { clicks: [] } })),
        axios.get("http://localhost:5000/api/analytics/student", { 
          headers: { Authorization: `Bearer ${token}` } 
        }).catch(() => ({ data: {} }))
      ]);

      // Use whichever has more data
      let allClicks = clicksRes.data.clicks || clicksRes.data || [];
      const analyticsClicks = analyticsRes.data.clicks || [];
      
      if (analyticsClicks.length > allClicks.length) {
        allClicks = analyticsClicks; // Use analytics if it has 88 vs 53
      }
      
      console.log("CLICKS loaded:", allClicks.length);
      setClicks(allClicks);
    } catch (error) {
      console.log(error);
      setClicks([]);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);

  // ── helpers ──────────────────────────────────────────────────────────────
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" });
  };
  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
  };
  // Shorten long user-agent strings for display
  const shortUA = (ua = "") => {
    if (!ua || ua === "Unknown Device") return "Unknown Device";
    if (ua.includes("Mobile")) return "📱 Mobile Browser";
    if (ua.includes("Chrome"))  return "🌐 Chrome Browser";
    if (ua.includes("Firefox")) return "🦊 Firefox Browser";
    if (ua.includes("Safari"))  return "🧭 Safari Browser";
    if (ua.includes("Edge"))    return "🔵 Edge Browser";
    return ua.slice(0, 48) + (ua.length > 48 ? "…" : "");
  };

  // ── loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
          @keyframes spin { to { transform:rotate(360deg); } }
        `}</style>
        <div style={{
          minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center",
          background:"#f8fafc", fontFamily:"'Sora',sans-serif",
        }}>
          <div style={{
            background:"white", padding:"40px 56px", borderRadius:"24px",
            boxShadow:"0 10px 40px rgba(0,0,0,0.08)", textAlign:"center",
            border:"1.5px solid #f1f5f9",
          }}>
            <div style={{
              width:"40px", height:"40px", borderRadius:"50%",
              border:"3px solid #eef2ff", borderTopColor:"#6366f1",
              animation:"spin 0.8s linear infinite",
              margin:"0 auto 18px",
            }} />
            <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#6366f1" }}>Loading Click History…</p>
            <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Fetching your referral activity</p>
          </div>
        </div>
      </>
    );
  }

  // ── main render ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .click-card {
          background: #fff;
          border-radius: 22px;
          padding: 26px 28px;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 4px 18px rgba(0,0,0,0.05);
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.2s ease;
        }
        .click-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 44px rgba(0,0,0,0.09);
          border-color: #c7d2fe;
        }

        .info-chip {
          background: #f8fafc;
          border-radius: 14px;
          padding: 16px 18px;
          border: 1px solid #f1f5f9;
          transition: background 0.18s ease;
        }
        .info-chip:hover { background: #f1f5f9; }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%;
          background:#10b981; display:inline-block;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.45); }
        }

        .stat-card {
          background:#fff;
          border-radius:22px;
          padding:28px 26px;
          border:1.5px solid #f1f5f9;
          box-shadow:0 4px 18px rgba(0,0,0,0.05);
          position:relative; overflow:hidden;
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.09);
        }
        .stat-card::before {
          content:'';
          position:absolute; top:0; left:0; right:0;
          height:4px;
          background: linear-gradient(90deg,#6366f1,#818cf8);
          border-radius:22px 22px 0 0;
        }
      `}</style>

      <div style={{
        minHeight:"100vh",
        padding:"36px 40px",
        background:"#f8fafc",
        fontFamily:"'Sora',sans-serif",
      }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
          padding:"44px 48px",
          borderRadius:"28px",
          color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(99,102,241,0.30)",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", right:"-40px", top:"-40px", width:"240px", height:"240px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", right:"80px", bottom:"-70px", width:"160px", height:"160px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
              <span className="pulse-dot" />
              <span style={{ fontSize:"12px", fontWeight:700, color:"#a5b4fc", letterSpacing:"2px", textTransform:"uppercase" }}>Real-Time Tracking</span>
            </div>
            <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1.1 }}>
              Click History 📈
            </h1>
            <p style={{ marginTop:"14px", fontSize:"16px", opacity:0.8, maxWidth:"560px", lineHeight:1.7, fontWeight:400 }}>
              Monitor all referral clicks, visitor activity, and campaign engagement performance in real-time.
            </p>
          </div>
        </div>

        {/* ── STAT CARD ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",
          gap:"20px",
          marginBottom:"28px",
        }}>
          <div className="stat-card">
            <div style={{
              width:"46px", height:"46px", borderRadius:"14px",
              background:"#eef2ff",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"22px", marginBottom:"16px",
            }}>🖱️</div>
            <p style={{ margin:0, color:"#94a3b8", fontSize:"12px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Total Clicks</p>
            <h2 style={{ margin:"8px 0 0", fontSize:"42px", fontWeight:800, color:"#0f172a", lineHeight:1 }}>{clicks.length}</h2>
          </div>

          <div className="stat-card" style={{ ["--accent"]:"#10b981" }}>
            <div style={{
              width:"46px", height:"46px", borderRadius:"14px",
              background:"#ecfdf5",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"22px", marginBottom:"16px",
            }}>📅</div>
            <p style={{ margin:0, color:"#94a3b8", fontSize:"12px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Latest Click</p>
            <h2 style={{ margin:"8px 0 0", fontSize:"20px", fontWeight:800, color:"#0f172a", lineHeight:1.3 }}>
              {clicks.length > 0 ? formatDate(clicks[0].createdAt) : "—"}
            </h2>
          </div>

          <div className="stat-card">
            <div style={{
              width:"46px", height:"46px", borderRadius:"14px",
              background:"#fdf2f8",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"22px", marginBottom:"16px",
            }}>📣</div>
            <p style={{ margin:0, color:"#94a3b8", fontSize:"12px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Unique Campaigns</p>
            <h2 style={{ margin:"8px 0 0", fontSize:"42px", fontWeight:800, color:"#0f172a", lineHeight:1 }}>
              {new Set(clicks.map(c => c.referralId?.campaignId?._id).filter(Boolean)).size || 0}
            </h2>
          </div>
        </div>

        {/* ── CLICK LIST ── */}
        {clicks.length === 0 ? (
          <div style={{
            background:"#fff",
            borderRadius:"24px",
            padding:"70px 30px",
            textAlign:"center",
            border:"1.5px dashed #e2e8f0",
            boxShadow:"0 4px 18px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize:"52px", marginBottom:"16px" }}>🖱️</div>
            <h2 style={{ color:"#0f172a", margin:"0 0 10px", fontSize:"22px", fontWeight:800 }}>No Clicks Yet</h2>
            <p style={{ color:"#64748b", maxWidth:"420px", margin:"0 auto", lineHeight:1.7, fontSize:"15px" }}>
              Your referral clicks will appear here once users start interacting with your campaign referral links.
            </p>
          </div>
        ) : (
          <div style={{ display:"grid", gap:"16px" }}>

            {/* List header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 4px 4px" }}>
              <h3 style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#0f172a" }}>
                All Clicks
                <span style={{ marginLeft:"10px", fontSize:"13px", fontWeight:600, color:"#94a3b8" }}>({clicks.length})</span>
              </h3>
              <div style={{
                display:"flex", alignItems:"center", gap:"8px",
                background:"#f0fdf4", padding:"6px 14px",
                borderRadius:"999px", border:"1px solid #bbf7d0",
              }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Live</span>
              </div>
            </div>

            {clicks.map((click) => (
              <div key={click._id} className="click-card">

                {/* TOP ROW */}
                <div style={{
                  display:"flex", justifyContent:"space-between",
                  alignItems:"flex-start", flexWrap:"wrap", gap:"14px",
                  marginBottom:"20px",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                    {/* Icon */}
                    <div style={{
                      width:"46px", height:"46px", borderRadius:"14px",
                      background:"linear-gradient(135deg,#6366f1,#818cf8)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"20px", flexShrink:0,
                      boxShadow:"0 4px 12px rgba(99,102,241,0.3)",
                    }}>🖱️</div>
                    <div>
                      <p style={{ margin:0, fontSize:"12px", color:"#94a3b8", fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:"4px" }}>Campaign</p>
                      <h2 style={{ margin:0, color:"#0f172a", fontSize:"18px", fontWeight:800, lineHeight:1.2 }}>
                        {click.referralId?.campaignId?.title || "Unknown Campaign"}
                      </h2>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div style={{
                    padding:"7px 16px",
                    borderRadius:"999px",
                    background:"linear-gradient(135deg,#6366f1,#818cf8)",
                    color:"white",
                    fontWeight:700,
                    fontSize:"12px",
                    letterSpacing:"0.5px",
                    boxShadow:"0 4px 12px rgba(99,102,241,0.3)",
                    flexShrink:0,
                    display:"flex", alignItems:"center", gap:"6px",
                  }}>
                    <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"rgba(255,255,255,0.7)", display:"inline-block" }} />
                    Active Click
                  </div>
                </div>

                {/* DIVIDER */}
                <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"18px" }} />

                {/* INFO CHIPS */}
                <div style={{
                  display:"grid",
                  gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",
                  gap:"12px",
                }}>
                  {/* Date */}
                  <div className="info-chip">
                    <p style={{ margin:"0 0 5px", color:"#94a3b8", fontSize:"11px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>📅 Click Date</p>
                    <p style={{ margin:0, color:"#0f172a", fontSize:"15px", fontWeight:700 }}>{formatDate(click.createdAt)}</p>
                    <p style={{ margin:"2px 0 0", color:"#94a3b8", fontSize:"12px" }}>{formatTime(click.createdAt)}</p>
                  </div>

                  {/* Device */}
                  <div className="info-chip">
                    <p style={{ margin:"0 0 5px", color:"#94a3b8", fontSize:"11px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>💻 Device</p>
                    <p style={{ margin:0, color:"#0f172a", fontSize:"15px", fontWeight:700 }}>{shortUA(click.userAgent)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
};

export default ClickHistory;