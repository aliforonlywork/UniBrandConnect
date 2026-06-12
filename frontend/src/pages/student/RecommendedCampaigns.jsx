import { useEffect, useState } from "react";
import API from "../../services/api";
import RecommendationList from "../../components/recommendation/RecommendationList";

const AI_FEATURES = [
  { icon: "🎯", label: "Smart Matching",       desc: "Campaigns matched to your niche"       },
  { icon: "📊", label: "Performance Analysis", desc: "Ranked by your past earnings"           },
  { icon: "👁️", label: "Interest Tracking",    desc: "Based on your click patterns"           },
  { icon: "🧠", label: "Behavior Insights",    desc: "Learns from your referral activity"     },
];

const RecommendedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchRecommendations = async () => {
    try {
      const response = await API.get("/campaigns/student/recommendations");
      setCampaigns(response.data.campaigns || []);
    } catch (error) {
      console.error("Recommendation Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecommendations(); }, []);

  // ── loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
          @keyframes spin { to { transform:rotate(360deg); } }
          @keyframes float {
            0%,100% { transform:translateY(0); }
            50%      { transform:translateY(-8px); }
          }
        `}</style>
        <div style={{
          minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center",
          background:"#f8fafc", fontFamily:"'Sora',sans-serif",
        }}>
          <div style={{
            background:"white", padding:"44px 60px", borderRadius:"28px",
            boxShadow:"0 10px 44px rgba(0,0,0,0.09)", textAlign:"center",
            border:"1.5px solid #f1f5f9",
          }}>
            <div style={{ fontSize:"44px", marginBottom:"16px", animation:"float 2s ease-in-out infinite" }}>✨</div>
            <div style={{
              width:"36px", height:"36px", borderRadius:"50%",
              border:"3px solid #ede9fe", borderTopColor:"#7c3aed",
              animation:"spin 0.85s linear infinite",
              margin:"0 auto 18px",
            }} />
            <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#7c3aed" }}>Generating AI Recommendations…</p>
            <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Analyzing your activity and interests</p>
          </div>
        </div>
      </>
    );
  }

  // ── main ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .feature-chip {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 14px 18px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: background 0.2s ease, transform 0.2s ease;
          cursor: default;
        }
        .feature-chip:hover {
          background: rgba(255,255,255,0.17);
          transform: translateY(-2px);
        }

        .insight-card {
          background: #fff;
          border-radius: 24px;
          padding: 30px;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: box-shadow 0.22s ease, transform 0.22s cubic-bezier(.34,1.56,.64,1);
        }
        .insight-card:hover {
          box-shadow: 0 16px 42px rgba(0,0,0,0.08);
          transform: translateY(-3px);
        }

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
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-6px); }
        }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ── HERO HEADER ── */}
        <div style={{
          background:"linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338ca 65%, #7c3aed 100%)",
          padding:"48px",
          borderRadius:"28px", color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(124,58,237,0.30)",
          position:"relative", overflow:"hidden",
        }}>
          {/* Decorative blobs */}
          <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"240px", height:"240px", borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
          <div style={{ position:"absolute", bottom:"-50px", left:"-50px", width:"180px", height:"180px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
          <div style={{ position:"absolute", top:"40%", right:"15%", width:"100px", height:"100px", borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />

          <div style={{ position:"relative", zIndex:2 }}>
            {/* AI badge */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"8px 18px", borderRadius:"999px",
              background:"rgba(255,255,255,0.12)",
              border:"1px solid rgba(255,255,255,0.2)",
              fontSize:"12px", fontWeight:700,
              letterSpacing:"1.5px", textTransform:"uppercase",
              marginBottom:"20px",
              backdropFilter:"blur(10px)",
            }}>
              <span style={{ fontSize:"14px", animation:"float 2.5s ease-in-out infinite", display:"inline-block" }}>✨</span>
              AI-Powered Recommendation Engine
            </div>

            <h1 style={{ margin:0, fontSize:"40px", fontWeight:800, lineHeight:1.15, maxWidth:"700px" }}>
              AI Recommended Campaigns
            </h1>
            <p style={{ marginTop:"16px", fontSize:"16px", opacity:0.82, lineHeight:1.8, maxWidth:"620px", fontWeight:400 }}>
              Personalized campaigns intelligently selected using your interests, clicks, engagement, referral activity, and performance analytics.
            </p>

            {/* Feature tags */}
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginTop:"28px" }}>
              {AI_FEATURES.map((f, i) => (
                <div key={i} className="feature-chip">
                  <span style={{ fontSize:"16px", marginRight:"7px" }}>{f.icon}</span>
                  <span style={{ fontSize:"13px", fontWeight:700 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── AI INSIGHT CARD ── */}
        <div className="insight-card" style={{ marginBottom:"28px" }}>
          <div style={{ display:"flex", gap:"20px", alignItems:"flex-start", flexWrap:"wrap" }}>
            {/* AI Icon */}
            <div style={{
              width:"68px", height:"68px", borderRadius:"20px", flexShrink:0,
              background:"linear-gradient(135deg,#7c3aed,#4f46e5)",
              display:"flex", justifyContent:"center", alignItems:"center",
              boxShadow:"0 10px 24px rgba(124,58,237,0.32)",
            }}>
              <span style={{ fontSize:"28px", fontWeight:900, color:"white", fontFamily:"monospace" }}>AI</span>
            </div>

            <div style={{ flex:1, minWidth:"240px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px", flexWrap:"wrap" }}>
                <h2 style={{ margin:0, fontSize:"20px", fontWeight:800, color:"#0f172a" }}>Intelligent Recommendation System</h2>
                <div style={{
                  display:"flex", alignItems:"center", gap:"6px",
                  background:"#f0fdf4", padding:"5px 12px",
                  borderRadius:"999px", border:"1px solid #bbf7d0",
                }}>
                  <span className="pulse-dot" />
                  <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Active</span>
                </div>
              </div>
              <p style={{ margin:0, color:"#64748b", lineHeight:1.8, fontSize:"14px", maxWidth:"680px" }}>
                Our recommendation engine analyzes user engagement patterns, referral behavior, click history, and campaign trends — providing highly relevant campaigns that maximize your success and earning potential.
              </p>

              {/* Mini feature row */}
              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginTop:"16px" }}>
                {AI_FEATURES.map((f, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:"6px",
                    padding:"6px 12px", borderRadius:"999px",
                    background:"#f8fafc", border:"1px solid #f1f5f9",
                    fontSize:"12px", fontWeight:600, color:"#475569",
                  }}>
                    <span>{f.icon}</span>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── EMPTY STATE ── */}
        {campaigns.length === 0 ? (
          <div style={{
            background:"white", padding:"70px 30px", borderRadius:"24px",
            textAlign:"center", border:"1.5px dashed #e2e8f0",
            boxShadow:"0 4px 18px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize:"52px", marginBottom:"16px", animation:"float 3s ease-in-out infinite", display:"inline-block" }}>🤖</div>
            <h2 style={{ color:"#0f172a", margin:"0 0 10px", fontSize:"22px", fontWeight:800 }}>No Recommendations Yet</h2>
            <p style={{ color:"#64748b", maxWidth:"440px", margin:"0 auto", lineHeight:1.8, fontSize:"15px" }}>
              Our AI engine needs more interaction data to generate personalized campaign recommendations. Start clicking and engaging with campaigns!
            </p>
          </div>

        ) : (
          <>
            {/* Section header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"22px", flexWrap:"wrap", gap:"12px" }}>
              <div>
                <h2 style={{ margin:"0 0 6px", fontSize:"24px", fontWeight:800, color:"#0f172a" }}>
                  Recommended For You 🎯
                </h2>
                <p style={{ margin:0, color:"#64748b", fontSize:"14px", lineHeight:1.6 }}>
                  AI-selected campaigns based on your activity, interests, and engagement behavior.
                </p>
              </div>
              <div style={{
                display:"flex", alignItems:"center", gap:"8px",
                background:"#f5f3ff", padding:"8px 16px",
                borderRadius:"999px", border:"1px solid #ddd6fe",
              }}>
                <span style={{ fontSize:"14px" }}>✨</span>
                <span style={{ fontSize:"13px", fontWeight:700, color:"#7c3aed" }}>{campaigns.length} Matches Found</span>
              </div>
            </div>

            <RecommendationList recommendations={campaigns} />
          </>
        )}
      </div>
    </>
  );
};

export default RecommendedCampaigns;