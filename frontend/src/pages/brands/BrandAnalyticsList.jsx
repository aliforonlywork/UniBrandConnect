import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const STATUS_CONFIG = {
  approved: { bg:"linear-gradient(135deg,#dcfce7,#bbf7d0)", border:"#86efac", color:"#166534", dot:"#22c55e" },
  pending:  { bg:"linear-gradient(135deg,#fef3c7,#fde68a)", border:"#fcd34d", color:"#92400e", dot:"#f59e0b" },
  rejected: { bg:"linear-gradient(135deg,#fee2e2,#fecaca)", border:"#fca5a5", color:"#991b1b", dot:"#ef4444" },
};
const getStatus = (s="pending") => STATUS_CONFIG[s.toLowerCase()] || STATUS_CONFIG.pending;

const BrandAnalyticsList = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await API.get("/campaigns/my");
        setCampaigns(res.data.campaigns || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .analytics-card {
          background:#fff; border-radius:24px; overflow:hidden;
          border:1.5px solid #f1f5f9;
          box-shadow:0 4px 20px rgba(0,0,0,0.05);
          transition:transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease, border-color 0.2s ease;
          display:flex; flex-direction:column;
        }
        .analytics-card:hover { transform:translateY(-7px); box-shadow:0 22px 50px rgba(0,0,0,0.10); border-color:#c7d2fe; }

        .view-btn {
          width:100%; padding:14px; border:none; border-radius:14px;
          background:linear-gradient(135deg,#2563eb,#4f46e5);
          color:white; font-size:14px; font-weight:800;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 8px 22px rgba(37,99,235,0.25);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .view-btn:hover  { transform:translateY(-2px); box-shadow:0 14px 30px rgba(37,99,235,0.38); filter:brightness(1.08); }
        .view-btn:active { transform:scale(0.97); filter:brightness(0.95); }

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
              <span className="pulse-dot" /> Analytics Hub
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Campaign Analytics 📊</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Monitor campaign insights, engagement performance, conversions, and overall growth across your brand marketing activities.
            </p>
          </div>
        </div>

        {/* ── LOADING ── */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"280px" }}>
            <div style={{ background:"white", padding:"40px 56px", borderRadius:"24px", boxShadow:"0 10px 40px rgba(0,0,0,0.08)", textAlign:"center", border:"1.5px solid #f1f5f9" }}>
              <div style={{ width:"36px", height:"36px", borderRadius:"50%", border:"3px solid #eef2ff", borderTopColor:"#6366f1", animation:"spin 0.85s linear infinite", margin:"0 auto 18px" }} />
              <p style={{ margin:0, fontSize:"15px", fontWeight:700, color:"#6366f1" }}>Loading Campaigns…</p>
              <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Preparing analytics dashboard</p>
            </div>
          </div>

        ) : campaigns.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div style={{ background:"white", padding:"70px 30px", borderRadius:"24px", textAlign:"center", border:"1.5px dashed #e2e8f0", boxShadow:"0 4px 18px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:"56px", marginBottom:"16px" }}>📊</div>
            <h2 style={{ color:"#0f172a", margin:"0 0 10px", fontSize:"22px", fontWeight:800 }}>No Campaigns Found</h2>
            <p style={{ color:"#64748b", fontSize:"15px", maxWidth:"440px", margin:"0 auto", lineHeight:1.7 }}>
              Create campaigns to start tracking engagement, conversions, and marketing performance analytics.
            </p>
          </div>

        ) : (
          <>
            {/* Section label */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
              <h3 style={{ margin:0, fontSize:"17px", fontWeight:800, color:"#0f172a" }}>
                Your Campaigns
                <span style={{ marginLeft:"10px", fontSize:"13px", fontWeight:600, color:"#94a3b8" }}>({campaigns.length})</span>
              </h3>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"#f0fdf4", padding:"7px 14px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Live</span>
              </div>
            </div>

            {/* ── GRID ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(330px, 1fr))", gap:"22px" }}>
              {campaigns.map((campaign) => {
                const stCfg = getStatus(campaign.status);
                return (
                  <div key={campaign._id} className="analytics-card">

                    {/* Image / Placeholder */}
                    {campaign.image ? (
                      <div style={{ position:"relative", flexShrink:0 }}>
                        <img
                          src={`http://localhost:5000${campaign.image}`}
                          alt={campaign.title}
                          style={{ width:"100%", height:"210px", objectFit:"cover", display:"block" }}
                        />
                        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60px", background:"linear-gradient(to top, rgba(15,23,42,0.35), transparent)" }} />
                        {/* Category badge on image */}
                        <div style={{
                          position:"absolute", top:"12px", left:"12px",
                          padding:"5px 14px", borderRadius:"999px",
                          background:"rgba(255,255,255,0.9)", backdropFilter:"blur(8px)",
                          color:"#4338ca", fontSize:"12px", fontWeight:700,
                          boxShadow:"0 2px 8px rgba(0,0,0,0.10)",
                        }}>
                          {campaign.category || "General"}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        height:"160px", flexShrink:0,
                        background:"linear-gradient(135deg,#1e1b4b,#4338ca,#6366f1)",
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:"52px",
                        position:"relative",
                      }}>
                        📣
                        <div style={{ position:"absolute", top:"12px", left:"12px", padding:"5px 14px", borderRadius:"999px", background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", color:"white", fontSize:"12px", fontWeight:700 }}>
                          {campaign.category || "General"}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div style={{ padding:"22px", display:"flex", flexDirection:"column", flex:1 }}>

                      {/* Title + status */}
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"10px", marginBottom:"10px" }}>
                        <h2 style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#0f172a", lineHeight:1.25 }}>
                          {campaign.title}
                        </h2>
                        <div style={{
                          display:"inline-flex", alignItems:"center", gap:"6px",
                          padding:"5px 12px", borderRadius:"999px", flexShrink:0,
                          background:stCfg.bg, border:`1.5px solid ${stCfg.border}`,
                          color:stCfg.color, fontSize:"11px", fontWeight:700,
                        }}>
                          <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:stCfg.dot }} />
                          {campaign.status}
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{ margin:"0 0 18px", color:"#64748b", lineHeight:1.7, fontSize:"13px" }}>
                        {campaign.description?.slice(0, 110)}{campaign.description?.length > 110 ? "…" : ""}
                      </p>

                      <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"16px" }} />

                      {/* Stats */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"18px" }}>
                        <div style={{ background:"#f8fafc", borderRadius:"14px", padding:"12px 14px", border:"1px solid #f1f5f9" }}>
                          <p style={{ margin:"0 0 3px", color:"#94a3b8", fontSize:"10px", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>Price</p>
                          <h3 style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#0f172a" }}>Rs {campaign.price?.toLocaleString() || "—"}</h3>
                        </div>
                        <div style={{ background:"linear-gradient(135deg,#dcfce7,#bbf7d0)", borderRadius:"14px", padding:"12px 14px", border:"1px solid #86efac" }}>
                          <p style={{ margin:"0 0 3px", color:"#166534", fontSize:"10px", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>Commission</p>
                          <h3 style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#166534" }}>{campaign.commissionRate || 0}%</h3>
                        </div>
                      </div>

                      {/* CTA */}
                      <div style={{ marginTop:"auto" }}>
                        <button
                          className="view-btn"
                          onClick={() => navigate(`/brand/analytics/${campaign._id}`)}
                        >
                          📊 View Analytics
                        </button>
                      </div>
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

export default BrandAnalyticsList;