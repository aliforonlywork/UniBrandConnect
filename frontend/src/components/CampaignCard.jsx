import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_COLORS = {
  Technology: { bg:"#eff6ff", color:"#1d4ed8" },
  Fashion:    { bg:"#fdf2f8", color:"#9d174d" },
  Sports:     { bg:"#ecfdf5", color:"#065f46" },
  Education:  { bg:"#fefce8", color:"#854d0e" },
  Gaming:     { bg:"#f5f3ff", color:"#6d28d9" },
  Beauty:     { bg:"#fdf4ff", color:"#7e22ce" },
  Food:       { bg:"#fff7ed", color:"#9a3412" },
  Fitness:    { bg:"#f0fdf4", color:"#166534" },
  Travel:     { bg:"#f0f9ff", color:"#0c4a6e" },
  Finance:    { bg:"#fffbeb", color:"#92400e" },
  General:    { bg:"#eef2ff", color:"#4338ca" },
};
const getCat = (c) => CATEGORY_COLORS[c] || CATEGORY_COLORS.General;

const CampaignCard = ({ campaign, showAIScore = false }) => {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);

  const campaignData = campaign.campaign || campaign;

  const handleNavigate = () => navigate(`/student/campaign/${campaignData._id}`);

  const catStyle = getCat(campaignData.category || "General");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

        .camp-card-root {
          width:320px;
          background:#fff;
          border-radius:22px;
          overflow:hidden;
          cursor:pointer;
          border:1.5px solid #f1f5f9;
          box-shadow:0 4px 18px rgba(0,0,0,0.05);
          display:flex; flex-direction:column;
          font-family:'Sora',sans-serif;
          transition:transform 0.25s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.25s ease,
                      border-color 0.2s ease;
        }
        .camp-card-root:hover {
          transform:translateY(-7px);
          box-shadow:0 22px 48px rgba(0,0,0,0.10);
          border-color:#c7d2fe;
        }
        .camp-card-root:active {
          transform:scale(0.98);
        }

        .camp-view-btn {
          width:100%; padding:13px; border:none; border-radius:14px;
          background:linear-gradient(135deg,#2563eb,#4f46e5);
          color:white; font-weight:800; font-size:14px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 6px 20px rgba(37,99,235,0.25);
          transition:transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
        }
        .camp-view-btn:hover  { transform:translateY(-2px); box-shadow:0 10px 26px rgba(37,99,235,0.38); filter:brightness(1.08); }
        .camp-view-btn:active { transform:scale(0.96); filter:brightness(0.95); }
      `}</style>

      <div
        className="camp-card-root"
        onClick={handleNavigate}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
      >
        {/* ── IMAGE ── */}
        <div style={{ position:"relative", flexShrink:0 }}>
          {campaignData.image ? (
            <img
              src={`http://localhost:5000${campaignData.image}`}
              alt={campaignData.title}
              style={{ width:"100%", height:"195px", objectFit:"cover", display:"block" }}
            />
          ) : (
            <div style={{
              width:"100%", height:"195px",
              background:"linear-gradient(135deg,#1e1b4b,#4338ca,#6366f1)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"48px",
            }}>📣</div>
          )}

          {/* Gradient overlay */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60px", background:"linear-gradient(to top,rgba(15,23,42,0.35),transparent)" }} />

          {/* Category badge */}
          <div style={{
            position:"absolute", top:"12px", left:"12px",
            display:"inline-flex", alignItems:"center", gap:"5px",
            padding:"5px 12px", borderRadius:"999px",
            background:"rgba(255,255,255,0.90)", backdropFilter:"blur(8px)",
            color:catStyle.color, fontSize:"11px", fontWeight:700,
            boxShadow:"0 2px 8px rgba(0,0,0,0.10)",
          }}>
            {campaignData.category || "General"}
          </div>

          {/* AI Score badge */}
          {showAIScore && (
            <div style={{
              position:"absolute", top:"12px", right:"12px",
              display:"inline-flex", alignItems:"center", gap:"5px",
              padding:"6px 12px", borderRadius:"999px",
              background:"linear-gradient(135deg,#2563eb,#4f46e5)",
              color:"white", fontSize:"12px", fontWeight:800,
              boxShadow:"0 4px 12px rgba(37,99,235,0.35)",
              backdropFilter:"blur(8px)",
            }}>
              ⭐ {campaign.recommendationScore || 0}
            </div>
          )}
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding:"20px", display:"flex", flexDirection:"column", flex:1 }}>

          {/* Brand */}
          <p style={{ margin:"0 0 6px", fontSize:"11px", color:"#94a3b8", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>
            🏢 {campaignData.brandId?.name || "Brand"}
          </p>

          {/* Title */}
          <h3 style={{ margin:"0 0 10px", fontSize:"18px", fontWeight:800, color:"#0f172a", lineHeight:1.3 }}>
            {campaignData.title}
          </h3>

          {/* Description */}
          <p style={{ margin:"0 0 16px", color:"#64748b", fontSize:"13px", lineHeight:1.7, flex:1 }}>
            {campaignData.description?.slice(0, 90) || "No description available"}
            {campaignData.description?.length > 90 ? "…" : ""}
          </p>

          {/* Divider */}
          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"14px" }} />

          {/* Price + Commission chips */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
            <div style={{ background:"#f8fafc", borderRadius:"12px", padding:"10px 12px", border:"1px solid #f1f5f9" }}>
              <p style={{ margin:"0 0 3px", color:"#94a3b8", fontSize:"10px", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>Price</p>
              <p style={{ margin:0, color:"#0f172a", fontSize:"16px", fontWeight:800 }}>PKR {(campaignData.price||0).toLocaleString()}</p>
            </div>
            <div style={{ background:"linear-gradient(135deg,#dcfce7,#bbf7d0)", borderRadius:"12px", padding:"10px 12px", border:"1px solid #86efac" }}>
              <p style={{ margin:"0 0 3px", color:"#166534", fontSize:"10px", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>Commission</p>
              <p style={{ margin:0, color:"#166534", fontSize:"16px", fontWeight:800 }}>{campaignData.commissionRate || 0}%</p>
            </div>
          </div>

          {/* CTA */}
          <button
            className="camp-view-btn"
            onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
          >
            View Details →
          </button>
        </div>
      </div>
    </>
  );
};

export default CampaignCard;