import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

const CATEGORY_COLORS = {
  General:     { bg:"#eef2ff", color:"#4338ca", dot:"#6366f1" },
  Fashion:     { bg:"#fdf2f8", color:"#9d174d", dot:"#ec4899" },
  Tech:        { bg:"#eff6ff", color:"#1e40af", dot:"#3b82f6" },
  Food:        { bg:"#fff7ed", color:"#9a3412", dot:"#f97316" },
  Health:      { bg:"#f0fdf4", color:"#166534", dot:"#22c55e" },
  Beauty:      { bg:"#fdf4ff", color:"#7e22ce", dot:"#a855f7" },
  Sports:      { bg:"#ecfdf5", color:"#065f46", dot:"#10b981" },
  Education:   { bg:"#fefce8", color:"#854d0e", dot:"#eab308" },
};

const getCatStyle = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.General;

const AvailableCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await API.get("/campaigns/student/campaigns");
        console.log("Campaign API Response:", res.data);
        setCampaigns(res.data.campaigns || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const categories = ["All", ...new Set(campaigns.map(c => c.category || "General"))];
  const filtered   = filter === "All" ? campaigns : campaigns.filter(c => (c.category || "General") === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .campaign-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.25s ease,
                      border-color 0.2s ease;
          display: flex;
          flex-direction: column;
        }
        .campaign-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 50px rgba(0,0,0,0.11);
          border-color: #c7d2fe;
        }

        .ai-btn {
          background: white;
          color: #4f46e5;
          border: none;
          padding: 15px 22px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,0.14);
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.2s ease;
          display: flex; align-items: center; gap: 8px;
          white-space: nowrap;
        }
        .ai-btn:hover  { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(0,0,0,0.18); }
        .ai-btn:active { transform: scale(0.96); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }

        .view-btn {
          width: 100%;
          padding: 15px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          font-weight: 700;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(79,70,229,0.28);
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.2s ease,
                      filter 0.2s ease;
          letter-spacing: 0.2px;
        }
        .view-btn:hover  { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(79,70,229,0.38); filter: brightness(1.08); }
        .view-btn:active { transform: scale(0.97); box-shadow: 0 4px 14px rgba(79,70,229,0.25); filter: brightness(0.95); }

        .filter-pill {
          padding: 8px 18px;
          border-radius: 999px;
          border: 1.5px solid #e2e8f0;
          background: white;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          color: #64748b;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .filter-pill:hover  { border-color: #818cf8; color: #4338ca; background: #eef2ff; }
        .filter-pill.active { background: linear-gradient(135deg,#6366f1,#818cf8); color: white; border-color: transparent; box-shadow: 0 4px 14px rgba(99,102,241,0.3); }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%;
          background:#10b981; display:inline-block;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.45); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        .info-chip {
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          background: #f8fafc;
          transition: background 0.15s ease;
        }
        .info-chip:hover { background: #f1f5f9; }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
          padding:"44px 48px",
          borderRadius:"28px", color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(99,102,241,0.30)",
          position:"relative", overflow:"hidden",
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"24px",
        }}>
          <div style={{ position:"absolute", right:"-40px", top:"-40px", width:"240px", height:"240px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", right:"80px", bottom:"-70px", width:"160px", height:"160px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
              <span className="pulse-dot" />
              <span style={{ fontSize:"12px", fontWeight:700, color:"#a5b4fc", letterSpacing:"2px", textTransform:"uppercase" }}>Live Campaigns</span>
            </div>
            <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1.1 }}>Available Campaigns 🚀</h1>
            <p style={{ marginTop:"14px", fontSize:"16px", opacity:0.8, maxWidth:"520px", lineHeight:1.7, fontWeight:400 }}>
              Explore high-performing campaigns, promote products, generate referrals, and maximize your earnings.
            </p>
          </div>
          <div style={{ position:"relative", zIndex:1 }}>
            <Link to="/student/recommendations" style={{ textDecoration:"none" }}>
              <button className="ai-btn">
                <span style={{ fontSize:"18px" }}>✨</span>
                AI Recommended Campaigns
              </button>
            </Link>
          </div>
        </div>

        {/* ── LOADING ── */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"320px" }}>
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
              <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#6366f1" }}>Loading Campaigns…</p>
              <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Finding the best campaigns for you</p>
            </div>
          </div>

        ) : campaigns.length === 0 ? (
          <div style={{
            background:"white", padding:"70px 30px", borderRadius:"24px",
            textAlign:"center", border:"1.5px dashed #e2e8f0",
            boxShadow:"0 4px 18px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize:"52px", marginBottom:"16px" }}>📋</div>
            <h2 style={{ color:"#0f172a", margin:"0 0 10px", fontSize:"22px", fontWeight:800 }}>No Campaigns Available</h2>
            <p style={{ color:"#64748b", maxWidth:"420px", margin:"0 auto", lineHeight:1.7, fontSize:"15px" }}>
              New campaigns will appear here once brands publish them on the platform.
            </p>
          </div>

        ) : (
          <>
            {/* ── FILTER BAR ── */}
            <div style={{
              display:"flex", alignItems:"center", gap:"10px",
              flexWrap:"wrap", marginBottom:"28px",
            }}>
              <span style={{ fontSize:"13px", fontWeight:700, color:"#94a3b8", letterSpacing:"1px", textTransform:"uppercase", marginRight:"4px" }}>Filter:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill${filter === cat ? " active" : ""}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"8px", background:"#f0fdf4", padding:"6px 14px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>{filtered.length} Active</span>
              </div>
            </div>

            {/* ── GRID ── */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",
              gap:"24px",
            }}>
              {filtered.map((campaign) => {
                const catStyle = getCatStyle(campaign.category || "General");
                return (
                  <div
                    key={campaign._id}
                    className="campaign-card"
                    onClick={() => navigate(`/student/campaign/${campaign._id}`)}
                  >
                    {/* IMAGE / PLACEHOLDER */}
                    <div style={{ position:"relative", flexShrink:0 }}>
                      {campaign.image ? (
                        <img
                          src={`http://localhost:5000${campaign.image}`}
                          alt={campaign.title}
                          style={{ width:"100%", height:"210px", objectFit:"cover", display:"block" }}
                        />
                      ) : (
                        <div style={{
                          height:"210px",
                          background:"linear-gradient(135deg, #1e1b4b, #4338ca, #6366f1)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:"52px",
                        }}>🚀</div>
                      )}

                      {/* Gradient overlay at bottom of image */}
                      <div style={{
                        position:"absolute", bottom:0, left:0, right:0,
                        height:"60px",
                        background:"linear-gradient(to top, rgba(15,23,42,0.35), transparent)",
                      }} />

                      {/* Category badge */}
                      <div style={{
                        position:"absolute", top:"14px", right:"14px",
                        background: catStyle.bg,
                        color: catStyle.color,
                        padding:"6px 14px",
                        borderRadius:"999px",
                        fontSize:"12px", fontWeight:700,
                        display:"flex", alignItems:"center", gap:"6px",
                        boxShadow:"0 2px 10px rgba(0,0,0,0.12)",
                      }}>
                        <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:catStyle.dot }} />
                        {campaign.category || "General"}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div style={{ padding:"24px", display:"flex", flexDirection:"column", flex:1 }}>
                      {/* Brand */}
                      <p style={{ margin:"0 0 6px", fontSize:"12px", color:"#94a3b8", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>
                        By {campaign.brandId?.name || "Brand"}
                      </p>

                      {/* Title */}
                      <h2 style={{ margin:"0 0 16px", fontSize:"20px", fontWeight:800, color:"#0f172a", lineHeight:1.3 }}>
                        {campaign.title}
                      </h2>

                      {/* Divider */}
                      <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"16px" }} />

                      {/* Info chips */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"20px" }}>
                        <div className="info-chip">
                          <p style={{ margin:"0 0 4px", fontSize:"11px", color:"#94a3b8", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>Price</p>
                          <p style={{ margin:0, fontSize:"17px", fontWeight:800, color:"#0f172a" }}>Rs. {campaign.price}</p>
                        </div>
                        <div style={{
                          padding:"14px 16px", borderRadius:"16px",
                          background:"linear-gradient(135deg,#dcfce7,#bbf7d0)",
                          border:"1px solid #86efac",
                        }}>
                          <p style={{ margin:"0 0 4px", fontSize:"11px", color:"#166534", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>Commission</p>
                          <p style={{ margin:0, fontSize:"17px", fontWeight:800, color:"#166534" }}>{campaign.commissionRate}%</p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div style={{ marginTop:"auto" }}>
                        <button
                          className="view-btn"
                          onClick={(e) => { e.stopPropagation(); navigate(`/student/campaign/${campaign._id}`); }}
                        >
                          View Campaign Details →
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

export default AvailableCampaigns;