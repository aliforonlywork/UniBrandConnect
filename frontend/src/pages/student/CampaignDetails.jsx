import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

// ── stat config ───────────────────────────────────────────────────────────────
const STAT_CONFIG = [
  { key:"category",        label:"Category",     icon:"🏷️",  bgLight:"#eef2ff", color:"#4338ca" },
  { key:"price",           label:"Price",        icon:"💵",  bgLight:"#f0fdf4", color:"#166534" },
  { key:"commissionRate",  label:"Commission",   icon:"💸",  bgLight:"#fef3c7", color:"#92400e" },
  { key:"totalBudget",     label:"Budget",       icon:"💼",  bgLight:"#ede9fe", color:"#6d28d9" },
  { key:"clickCount",      label:"Total Views",  icon:"👁️",  bgLight:"#dbeafe", color:"#1d4ed8" },
  { key:"conversionCount", label:"Conversions",  icon:"✅",  bgLight:"#fce7f3", color:"#9d174d" },
];

const formatVal = (key, val) => {
  if (key === "price")           return `Rs. ${val ?? "N/A"}`;
  if (key === "commissionRate")  return val != null ? `${val}%` : "N/A";
  if (key === "category")        return val || "General";
  return val ?? 0;
};

const STATUS_STYLE = {
  active:   { bg:"linear-gradient(135deg,#dcfce7,#bbf7d0)", color:"#166534", dot:"#22c55e", label:"Active"   },
  inactive: { bg:"linear-gradient(135deg,#fee2e2,#fecaca)", color:"#991b1b", dot:"#ef4444", label:"Inactive" },
  paused:   { bg:"linear-gradient(135deg,#fef3c7,#fde68a)", color:"#92400e", dot:"#f59e0b", label:"Paused"   },
};
const getStatus = (s="") => STATUS_STYLE[s.toLowerCase()] || STATUS_STYLE.active;

// ── main component ────────────────────────────────────────────────────────────
const CampaignDetails = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [campaign,   setCampaign]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [link,       setLink]       = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied,     setCopied]     = useState(false);
  const [genPressed, setGenPressed] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await API.get(`/campaigns/${id}`);
        setCampaign(res.data.campaign);
        try {
          await API.post("/engagement/view", { campaignId: id, category: res.data.campaign?.category });
        } catch { console.log("Engagement tracking failed"); }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const generateLink = async () => {
    try {
      setGenerating(true);
      const res = await API.post("/referrals/generate", { campaignId: id });
      try {
        await API.post("/engagement/join", { campaignId: id, category: campaign?.category });
      } catch { console.log("Join tracking failed"); }
      setLink(res.data.link);
      navigate("/student/referral-link", { state: { link: res.data.link } });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to generate link");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
      <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ background:"white", padding:"44px 60px", borderRadius:"28px", boxShadow:"0 10px 44px rgba(0,0,0,0.09)", textAlign:"center", border:"1.5px solid #f1f5f9" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"50%", border:"3px solid #eef2ff", borderTopColor:"#6366f1", animation:"spin 0.85s linear infinite", margin:"0 auto 18px" }} />
          <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#6366f1" }}>Loading Campaign Details…</p>
          <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Fetching campaign info</p>
        </div>
      </div>
    </>
  );

  // ── not found ────────────────────────────────────────────────────────────
  if (!campaign) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>
      <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ background:"white", padding:"56px", borderRadius:"28px", boxShadow:"0 10px 40px rgba(0,0,0,0.08)", textAlign:"center", border:"1.5px solid #f1f5f9" }}>
          <div style={{ fontSize:"52px", marginBottom:"16px" }}>📋</div>
          <h2 style={{ margin:"0 0 10px", color:"#0f172a", fontSize:"22px", fontWeight:800 }}>Campaign Not Found</h2>
          <p style={{ color:"#64748b", marginBottom:"24px" }}>This campaign may have been removed or is unavailable.</p>
          <button onClick={() => navigate(-1)} style={{ padding:"12px 24px", borderRadius:"14px", border:"1.5px solid #e2e8f0", background:"white", color:"#0f172a", fontWeight:700, fontSize:"14px", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
            ← Go Back
          </button>
        </div>
      </div>
    </>
  );

  const statusCfg = getStatus(campaign.status);

  // ── main render ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .stat-chip {
          border-radius: 20px;
          padding: 20px 22px;
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          cursor: default;
          position: relative; overflow: hidden;
        }
        .stat-chip:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 32px rgba(0,0,0,0.10);
        }
        .stat-chip::before {
          content:'';
          position:absolute; top:0; right:0;
          width:60px; height:60px;
          border-radius:0 20px 0 60px;
          background:rgba(0,0,0,0.04);
        }

        .gen-btn {
          padding: 16px 28px;
          border-radius: 18px;
          border: none;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          color: white;
          font-weight: 800;
          font-size: 15px;
          font-family: 'Sora',sans-serif;
          cursor: pointer;
          box-shadow: 0 10px 26px rgba(79,70,229,0.30);
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.2s ease,
                      filter 0.2s ease;
          display: flex; align-items: center; gap: 8px;
        }
        .gen-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 16px 32px rgba(79,70,229,0.40); filter:brightness(1.08); }
        .gen-btn:active:not(:disabled) { transform:scale(0.96); box-shadow:0 4px 14px rgba(79,70,229,0.25); filter:brightness(0.95); }
        .gen-btn:disabled { opacity:0.65; cursor:not-allowed; }

        .back-btn {
          padding: 16px 28px;
          border-radius: 18px;
          border: 1.5px solid #e2e8f0;
          background: white;
          color: #0f172a;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Sora',sans-serif;
          cursor: pointer;
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
          display: flex; align-items: center; gap: 8px;
        }
        .back-btn:hover  { background:#f8fafc; border-color:#c7d2fe; transform:translateX(-2px); }
        .back-btn:active { background:#f1f5f9; transform:scale(0.97); }

        .copy-btn {
          padding: 13px 24px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          color: white;
          font-weight: 700;
          font-size: 14px;
          font-family: 'Sora',sans-serif;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
          display:flex; align-items:center; gap:6px;
        }
        .copy-btn:hover  { transform:translateY(-2px); box-shadow:0 8px 20px rgba(79,70,229,0.30); filter:brightness(1.08); }
        .copy-btn:active { transform:scale(0.96); filter:brightness(0.95); }
        .copy-btn.copied { background:linear-gradient(135deg,#10b981,#059669); }

        .tag-pill {
          padding:9px 16px; border-radius:999px;
          background:#eef2ff; color:#4338ca;
          font-size:13px; font-weight:700;
          transition: background 0.18s ease, transform 0.18s ease;
          cursor:default;
        }
        .tag-pill:hover { background:#e0e7ff; transform:translateY(-2px); }

        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
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
              🚀 Campaign Details
            </div>
            <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1.15, maxWidth:"780px" }}>
              {campaign.title}
            </h1>
            <p style={{ marginTop:"14px", fontSize:"16px", opacity:0.8, lineHeight:1.7, fontWeight:400 }}>
              Discover campaign insights, earnings potential, performance metrics, and referral opportunities.
            </p>
          </div>
        </div>

        {/* ── MAIN CARD ── */}
        <div style={{
          background:"#fff", borderRadius:"28px", overflow:"hidden",
          border:"1.5px solid #f1f5f9",
          boxShadow:"0 8px 32px rgba(0,0,0,0.06)",
          marginBottom:"24px",
        }}>
          {/* Image */}
          {campaign.image ? (
            <div style={{ position:"relative" }}>
              <img
                src={`http://localhost:5000${campaign.image}`}
                alt={campaign.title}
                style={{ width:"100%", height:"400px", objectFit:"cover", display:"block" }}
              />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"100px", background:"linear-gradient(to top, rgba(15,23,42,0.5), transparent)" }} />
            </div>
          ) : (
            <div style={{
              height:"220px",
              background:"linear-gradient(135deg,#1e1b4b,#4338ca,#6366f1)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:"64px",
            }}>🚀</div>
          )}

          {/* Content */}
          <div style={{ padding:"36px" }}>

            {/* Title row */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"16px", marginBottom:"28px" }}>
              <div>
                <p style={{ margin:"0 0 6px", fontSize:"12px", color:"#94a3b8", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>
                  By {campaign.brandId?.name || "Brand"}
                </p>
                <h2 style={{ margin:0, color:"#0f172a", fontSize:"30px", fontWeight:800, lineHeight:1.2 }}>
                  {campaign.title}
                </h2>
              </div>
              {/* Status badge */}
              <div style={{
                padding:"9px 18px", borderRadius:"999px",
                background: statusCfg.bg, color: statusCfg.color,
                fontWeight:700, fontSize:"13px",
                display:"flex", alignItems:"center", gap:"7px",
                flexShrink:0,
              }}>
                <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:statusCfg.dot }} />
                {campaign.status || "Active"}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"28px" }} />

            {/* Description */}
            <div style={{ marginBottom:"30px" }}>
              <h3 style={{ margin:"0 0 12px", fontSize:"16px", fontWeight:800, color:"#0f172a", display:"flex", alignItems:"center", gap:"8px" }}>
                <span style={{ width:"4px", height:"18px", background:"linear-gradient(#6366f1,#7c3aed)", borderRadius:"2px", display:"inline-block" }} />
                Campaign Description
              </h3>
              <p style={{ margin:0, color:"#475569", lineHeight:1.9, fontSize:"15px" }}>
                {campaign.description}
              </p>
            </div>

            {/* Tags */}
            <div style={{ marginBottom:"30px" }}>
              <h3 style={{ margin:"0 0 14px", fontSize:"16px", fontWeight:800, color:"#0f172a", display:"flex", alignItems:"center", gap:"8px" }}>
                <span style={{ width:"4px", height:"18px", background:"linear-gradient(#6366f1,#7c3aed)", borderRadius:"2px", display:"inline-block" }} />
                Campaign Tags
              </h3>
              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                {campaign.tags?.length > 0 ? (
                  campaign.tags.map((tag, i) => (
                    <div key={i} className="tag-pill">#{tag}</div>
                  ))
                ) : (
                  <p style={{ margin:0, color:"#94a3b8", fontSize:"14px" }}>No tags available</p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"28px" }} />

            {/* Stats grid */}
            <h3 style={{ margin:"0 0 18px", fontSize:"16px", fontWeight:800, color:"#0f172a", display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ width:"4px", height:"18px", background:"linear-gradient(#6366f1,#7c3aed)", borderRadius:"2px", display:"inline-block" }} />
              Campaign Stats
            </h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"16px", marginBottom:"32px" }}>
              {STAT_CONFIG.map(({ key, label, icon, bgLight, color }) => (
                <div key={key} className="stat-chip" style={{ background:bgLight }}>
                  <div style={{ fontSize:"22px", marginBottom:"10px" }}>{icon}</div>
                  <p style={{ margin:"0 0 5px", fontSize:"11px", fontWeight:700, color, letterSpacing:"1px", textTransform:"uppercase" }}>{label}</p>
                  <h2 style={{ margin:0, fontSize:"24px", fontWeight:800, color:"#0f172a" }}>
                    {formatVal(key, campaign[key])}
                  </h2>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"28px" }} />

            {/* CTA buttons */}
            <div style={{ display:"flex", gap:"14px", flexWrap:"wrap" }}>
              <button className="gen-btn" onClick={generateLink} disabled={generating}>
                {generating ? (
                  <>
                    <div style={{ width:"16px", height:"16px", borderRadius:"50%", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"white", animation:"spin 0.7s linear infinite" }} />
                    Generating…
                  </>
                ) : (
                  <> 🚀 Generate Referral Link </>
                )}
              </button>
              <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>

            {/* Generated link */}
            {link && (
              <div style={{
                marginTop:"28px",
                padding:"28px",
                borderRadius:"24px",
                background:"linear-gradient(135deg,#eef2ff,#f5f3ff)",
                border:"1.5px solid #c7d2fe",
                animation:"fadeIn 0.35s ease",
              }}>
                <h3 style={{ margin:"0 0 14px", fontSize:"16px", fontWeight:800, color:"#0f172a", display:"flex", alignItems:"center", gap:"8px" }}>
                  🔗 Your Referral Link
                </h3>
                <input
                  type="text"
                  value={link}
                  readOnly
                  style={{
                    width:"100%",
                    padding:"14px 18px",
                    borderRadius:"14px",
                    border:"1.5px solid #c7d2fe",
                    marginBottom:"14px",
                    fontSize:"14px",
                    fontFamily:"'Sora',sans-serif",
                    fontWeight:500,
                    color:"#0f172a",
                    outline:"none",
                    background:"white",
                    boxSizing:"border-box",
                  }}
                />
                <button className={`copy-btn${copied ? " copied" : ""}`} onClick={handleCopy}>
                  {copied ? "✓ Copied!" : "📋 Copy Link"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ── STAT CARD (kept for backward compat) ── */
const StatCard = ({ title, value, bg, color }) => (
  <div
    style={{ background:bg, padding:"24px", borderRadius:"22px", transition:"0.3s" }}
    onMouseOver={(e) => { e.currentTarget.style.transform="translateY(-5px)"; }}
    onMouseOut={(e)  => { e.currentTarget.style.transform="translateY(0)"; }}
  >
    <p style={{ margin:"0 0 10px", color, fontSize:"14px", fontWeight:600 }}>{title}</p>
    <h2 style={{ margin:0, color:"#111827", fontSize:"28px" }}>{value}</h2>
  </div>
);

export default CampaignDetails;