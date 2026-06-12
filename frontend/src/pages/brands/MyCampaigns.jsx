import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

const STATUS_CONFIG = {
  approved: { bg:"linear-gradient(135deg,#dcfce7,#bbf7d0)", border:"#86efac", color:"#166534", dot:"#22c55e",  label:"Approved"  },
  pending:  { bg:"linear-gradient(135deg,#fef3c7,#fde68a)", border:"#fcd34d", color:"#92400e", dot:"#f59e0b",  label:"Pending"   },
  rejected: { bg:"linear-gradient(135deg,#fee2e2,#fecaca)", border:"#fca5a5", color:"#991b1b", dot:"#ef4444",  label:"Rejected"  },
  active:   { bg:"linear-gradient(135deg,#dbeafe,#bfdbfe)", border:"#93c5fd", color:"#1d4ed8", dot:"#3b82f6",  label:"Active"    },
};
const getStatus = (s="pending") => STATUS_CONFIG[s.toLowerCase()] || STATUS_CONFIG.pending;

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState("All");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await API.get("/campaigns/my");
        setCampaigns(res.data.campaigns || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const statuses  = ["All", ...new Set(campaigns.map(c => c.status || "pending"))];
  const filtered  = filter === "All" ? campaigns : campaigns.filter(c => (c.status || "pending") === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .campaign-card {
          background:#fff; border-radius:24px; padding:26px;
          border:1.5px solid #f1f5f9;
          box-shadow:0 4px 20px rgba(0,0,0,0.05);
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.2s ease;
          display:flex; flex-direction:column;
        }
        .campaign-card:hover { transform:translateY(-6px); box-shadow:0 20px 46px rgba(0,0,0,0.09); border-color:#c7d2fe; }

        .create-btn {
          padding:14px 24px; border:none; border-radius:16px;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          color:white; font-weight:800; font-size:14px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 10px 28px rgba(79,70,229,0.30);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; gap:8px;
        }
        .create-btn:hover  { transform:translateY(-2px); box-shadow:0 16px 36px rgba(79,70,229,0.42); filter:brightness(1.08); }
        .create-btn:active { transform:scale(0.97); filter:brightness(0.95); }

        .edit-btn {
          flex:1; padding:13px; border:none; border-radius:14px;
          background:linear-gradient(135deg,#4f46e5,#6366f1);
          color:white; font-weight:700; font-size:13px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 6px 18px rgba(79,70,229,0.25);
          transition:transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
          text-align:center;
        }
        .edit-btn:hover  { transform:translateY(-2px); box-shadow:0 10px 24px rgba(79,70,229,0.35); filter:brightness(1.08); }
        .edit-btn:active { transform:scale(0.96); filter:brightness(0.95); }

        .analytics-btn {
          flex:1; padding:13px; border-radius:14px;
          border:1.5px solid #c7d2fe; background:white;
          color:#4338ca; font-weight:700; font-size:13px;
          font-family:'Sora',sans-serif; cursor:pointer;
          transition:background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .analytics-btn:hover  { background:#eef2ff; border-color:#818cf8; transform:translateY(-2px); }
        .analytics-btn:active { transform:scale(0.96); }

        .filter-pill {
          padding:7px 16px; border-radius:999px;
          border:1.5px solid #e2e8f0; background:white;
          font-size:12px; font-weight:700; font-family:'Sora',sans-serif;
          cursor:pointer; color:#64748b; text-transform:capitalize;
          transition:all 0.16s ease;
        }
        .filter-pill:hover   { border-color:#818cf8; color:#4338ca; background:#eef2ff; }
        .filter-pill.active  { background:linear-gradient(135deg,#6366f1,#818cf8); color:white; border-color:transparent; box-shadow:0 4px 12px rgba(99,102,241,0.28); }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%; background:#10b981;
          display:inline-block; animation:pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.45);} }
        @keyframes spin   { to{transform:rotate(360deg);} }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
          padding:"44px 48px", borderRadius:"28px", color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(99,102,241,0.30)",
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
              <span className="pulse-dot" /> Campaign Manager
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>My Campaigns 📋</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Manage your active brand campaigns, monitor their status, and optimize performance through the UniBrandConnect platform.
            </p>
          </div>
          <div style={{ position:"relative", zIndex:1 }}>
            <Link to="/brand/create" style={{ textDecoration:"none" }}>
              <button className="create-btn">✚ Create New Campaign</button>
            </Link>
          </div>
        </div>

        {/* ── LOADING ── */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"280px" }}>
            <div style={{ background:"white", padding:"40px 56px", borderRadius:"24px", boxShadow:"0 10px 40px rgba(0,0,0,0.08)", textAlign:"center", border:"1.5px solid #f1f5f9" }}>
              <div style={{ width:"36px", height:"36px", borderRadius:"50%", border:"3px solid #eef2ff", borderTopColor:"#6366f1", animation:"spin 0.85s linear infinite", margin:"0 auto 18px" }} />
              <p style={{ margin:0, fontSize:"15px", fontWeight:700, color:"#6366f1" }}>Loading Campaigns…</p>
            </div>
          </div>

        ) : campaigns.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div style={{ background:"white", padding:"70px 30px", borderRadius:"24px", textAlign:"center", border:"1.5px dashed #e2e8f0", boxShadow:"0 4px 18px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:"52px", marginBottom:"16px" }}>📋</div>
            <h2 style={{ color:"#0f172a", margin:"0 0 10px", fontSize:"22px", fontWeight:800 }}>No Campaigns Yet</h2>
            <p style={{ color:"#64748b", marginBottom:"28px", maxWidth:"420px", margin:"0 auto 28px", fontSize:"15px", lineHeight:1.7 }}>
              Start building your first premium campaign and connect with students across universities.
            </p>
            <Link to="/brand/create" style={{ textDecoration:"none" }}>
              <button className="create-btn" style={{ display:"inline-flex" }}>🚀 Create Campaign</button>
            </Link>
          </div>

        ) : (
          <>
            {/* ── FILTER BAR ── */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", marginBottom:"24px" }}>
              <span style={{ fontSize:"12px", fontWeight:700, color:"#94a3b8", letterSpacing:"1px", textTransform:"uppercase", marginRight:"4px" }}>Filter:</span>
              {statuses.map((s) => (
                <button key={s} className={`filter-pill${filter === s ? " active" : ""}`} onClick={() => setFilter(s)} style={{ textTransform:"capitalize" }}>
                  {s}
                </button>
              ))}
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"8px", background:"#f0fdf4", padding:"6px 14px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>{filtered.length} Campaign{filtered.length !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* ── GRID ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:"20px" }}>
              {filtered.map((campaign) => {
                const stCfg = getStatus(campaign.status);
                return (
                  <div key={campaign._id} className="campaign-card">

                    {/* Colored top bar */}
                    <div style={{ height:"4px", background:stCfg.bg.includes("green") ? "linear-gradient(90deg,#10b981,#34d399)" : stCfg.bg.includes("yellow")||stCfg.bg.includes("fef3") ? "linear-gradient(90deg,#f59e0b,#fbbf24)" : stCfg.bg.includes("red")||stCfg.bg.includes("fee2") ? "linear-gradient(90deg,#ef4444,#f87171)" : "linear-gradient(90deg,#6366f1,#818cf8)", borderRadius:"22px 22px 0 0", margin:"-26px -26px 22px", borderTopLeftRadius:"22px", borderTopRightRadius:"22px" }} />

                    {/* Top row: status + dot */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                      <div style={{
                        display:"inline-flex", alignItems:"center", gap:"7px",
                        padding:"6px 14px", borderRadius:"999px",
                        background:stCfg.bg, border:`1.5px solid ${stCfg.border}`,
                        color:stCfg.color, fontSize:"12px", fontWeight:700,
                      }}>
                        <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:stCfg.dot }} />
                        {campaign.status || "Pending"}
                      </div>
                      <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 0 3px rgba(34,197,94,0.20)" }} />
                    </div>

                    {/* Title */}
                    <h2 style={{ margin:"0 0 16px", fontSize:"19px", fontWeight:800, color:"#0f172a", lineHeight:1.3 }}>
                      {campaign.title}
                    </h2>

                    {/* Info chips */}
                    <div style={{ background:"#f8fafc", borderRadius:"16px", padding:"14px 16px", marginBottom:"20px", border:"1px solid #f1f5f9" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
                        <span style={{ color:"#94a3b8", fontSize:"12px", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>Price</span>
                        <span style={{ color:"#0f172a", fontSize:"15px", fontWeight:800 }}>Rs {campaign.price?.toLocaleString() || "—"}</span>
                      </div>
                      <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"10px" }} />
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ color:"#94a3b8", fontSize:"12px", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>Commission</span>
                        <span style={{
                          padding:"4px 12px", borderRadius:"999px",
                          background:"linear-gradient(135deg,#dcfce7,#bbf7d0)",
                          border:"1px solid #86efac",
                          color:"#166534", fontSize:"13px", fontWeight:800,
                        }}>
                          {campaign.commission || campaign.commissionRate || 0}%
                        </span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display:"flex", gap:"10px", marginTop:"auto" }}>
                      <Link to={`/brand/edit/${campaign._id}`} style={{ textDecoration:"none", flex:1 }}>
                        <button className="edit-btn">✏️ Edit</button>
                      </Link>
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

export default MyCampaigns;