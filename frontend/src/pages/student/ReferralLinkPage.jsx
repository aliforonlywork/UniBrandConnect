import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const INFO_CARDS = [
  {
    icon: "🖱️",
    title: "Track Clicks",
    description: "Monitor user engagement and referral activity in real-time.",
    bg: "#eef2ff", color: "#4338ca", border: "#c7d2fe",
    accentBg: "linear-gradient(135deg,#6366f1,#818cf8)",
    glow: "rgba(99,102,241,0.20)",
  },
  {
    icon: "💸",
    title: "Earn Commissions",
    description: "Receive rewards for every successful conversion and purchase.",
    bg: "#f0fdf4", color: "#166534", border: "#bbf7d0",
    accentBg: "linear-gradient(135deg,#10b981,#34d399)",
    glow: "rgba(16,185,129,0.20)",
  },
  {
    icon: "🚀",
    title: "Boost Performance",
    description: "Share campaigns strategically across platforms to maximise earnings.",
    bg: "#fffbeb", color: "#92400e", border: "#fde68a",
    accentBg: "linear-gradient(135deg,#f59e0b,#fbbf24)",
    glow: "rgba(245,158,11,0.20)",
  },
];

const SHARE_OPTIONS = [
  { label:"WhatsApp",  emoji:"💬", color:"#25D366", bg:"#f0fdf4", border:"#bbf7d0", url:(l)=>`https://wa.me/?text=${encodeURIComponent(l)}` },
  { label:"Twitter",   emoji:"🐦", color:"#1DA1F2", bg:"#eff6ff", border:"#bfdbfe", url:(l)=>`https://twitter.com/intent/tweet?url=${encodeURIComponent(l)}` },
  { label:"Telegram",  emoji:"✈️", color:"#0088cc", bg:"#f0f9ff", border:"#bae6fd", url:(l)=>`https://t.me/share/url?url=${encodeURIComponent(l)}` },
  { label:"LinkedIn",  emoji:"💼", color:"#0077b5", bg:"#eff6ff", border:"#bfdbfe", url:(l)=>`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(l)}` },
];

const ReferralLinkPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const link     = location.state?.link;

  const [copied,    setCopied]    = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .ref-main-card {
          width: 100%;
          max-width: 880px;
          background: #fff;
          border-radius: 32px;
          overflow: hidden;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
        }

        .info-chip {
          border-radius: 22px;
          padding: 22px 20px;
          border: 1.5px solid;
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          cursor: default; position: relative; overflow: hidden;
        }
        .info-chip:hover { transform: translateY(-5px); }
        .info-chip::before {
          content: '';
          position: absolute; top:0; right:0;
          width:70px; height:70px;
          border-radius: 0 22px 0 70px;
          background: rgba(0,0,0,0.04);
        }

        .copy-btn {
          padding: 16px 24px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          color: white;
          font-weight: 800;
          font-size: 15px;
          font-family: 'Sora',sans-serif;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(79,70,229,0.28);
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.2s ease, filter 0.2s ease;
          display: flex; align-items: center; gap: 8px;
          white-space: nowrap;
        }
        .copy-btn:hover  { transform:translateY(-2px); box-shadow:0 14px 30px rgba(79,70,229,0.38); filter:brightness(1.08); }
        .copy-btn:active { transform:scale(0.96); filter:brightness(0.95); }
        .copy-btn.copied { background:linear-gradient(135deg,#10b981,#059669); box-shadow:0 10px 24px rgba(16,185,129,0.30); }

        .explore-btn {
          padding: 15px 26px;
          border-radius: 16px; border: none;
          background: linear-gradient(135deg,#2563eb,#4f46e5);
          color: white; font-weight: 800; font-size: 14px;
          font-family: 'Sora',sans-serif; cursor: pointer;
          box-shadow: 0 8px 22px rgba(37,99,235,0.28);
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; gap:6px;
        }
        .explore-btn:hover  { transform:translateY(-2px); box-shadow:0 14px 30px rgba(37,99,235,0.38); filter:brightness(1.08); }
        .explore-btn:active { transform:scale(0.96); filter:brightness(0.95); }

        .back-btn {
          padding: 15px 26px;
          border-radius: 16px; border: 1.5px solid #e2e8f0;
          background: white; color: #0f172a;
          font-weight: 700; font-size: 14px;
          font-family: 'Sora',sans-serif; cursor: pointer;
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
          display:flex; align-items:center; gap:6px;
        }
        .back-btn:hover  { background:#f8fafc; border-color:#c7d2fe; transform:translateX(-2px); }
        .back-btn:active { background:#f1f5f9; transform:scale(0.97); }

        .share-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 999px;
          border: 1.5px solid; font-size: 13px; font-weight: 700;
          font-family: 'Sora',sans-serif; cursor: pointer;
          transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s ease;
          text-decoration: none;
        }
        .share-pill:hover  { transform:translateY(-2px); box-shadow:0 6px 18px rgba(0,0,0,0.12); }
        .share-pill:active { transform:scale(0.96); }

        .browse-btn {
          padding: 15px 30px; border-radius: 18px; border: none;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          color: white; font-weight: 800; font-size: 15px;
          font-family: 'Sora',sans-serif; cursor: pointer;
          box-shadow: 0 10px 24px rgba(79,70,229,0.28);
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
        }
        .browse-btn:hover  { transform:translateY(-2px); box-shadow:0 16px 32px rgba(79,70,229,0.38); filter:brightness(1.08); }
        .browse-btn:active { transform:scale(0.96); filter:brightness(0.95); }

        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.35s ease both; }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%;
          background:#10b981; display:inline-block;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.45); }
        }
      `}</style>

      <div style={{
        minHeight:"100vh", padding:"36px 40px",
        background:"#f8fafc",
        fontFamily:"'Sora',sans-serif",
        display:"flex", flexDirection:"column",
        alignItems:"center",
      }}>
        <div className="ref-main-card">

          {/* ── HEADER ── */}
          <div style={{
            background:"linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
            padding:"44px 48px", color:"white",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", top:"-50px", right:"-50px", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
            <div style={{ position:"absolute", bottom:"-40px", left:"-40px", width:"150px", height:"150px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
            <div style={{ position:"relative", zIndex:2 }}>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:"8px",
                padding:"7px 16px", borderRadius:"999px",
                background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.18)",
                fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
                marginBottom:"18px",
              }}>
                🔗 Referral System
              </div>
              <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1.15 }}>
                Your Referral Link 🔗
              </h1>
              <p style={{ marginTop:"14px", fontSize:"16px", opacity:0.82, lineHeight:1.8, maxWidth:"580px", fontWeight:400 }}>
                Share your personalized referral link and earn commissions from every successful click, conversion, and purchase.
              </p>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div style={{ padding:"40px" }}>
            {link ? (
              <div className="fade-in">

                {/* Success banner */}
                <div style={{
                  background:"linear-gradient(135deg,#ecfdf5,#d1fae5)",
                  padding:"22px 24px", borderRadius:"20px",
                  border:"1.5px solid #bbf7d0", marginBottom:"28px",
                  display:"flex", alignItems:"center", gap:"14px",
                }}>
                  <div style={{
                    width:"44px", height:"44px", borderRadius:"14px", flexShrink:0,
                    background:"linear-gradient(135deg,#10b981,#059669)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"20px", boxShadow:"0 4px 12px rgba(16,185,129,0.30)",
                  }}>✅</div>
                  <div>
                    <h2 style={{ margin:"0 0 4px", color:"#065f46", fontSize:"17px", fontWeight:800 }}>
                      Referral Link Generated Successfully
                    </h2>
                    <p style={{ margin:0, color:"#047857", fontSize:"13px", lineHeight:1.6 }}>
                      Ready to share across social media, messaging apps, and digital platforms.
                    </p>
                  </div>
                  <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
                    <span className="pulse-dot" />
                    <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Live</span>
                  </div>
                </div>

                {/* URL row */}
                <div style={{ marginBottom:"28px" }}>
                  <h3 style={{ margin:"0 0 14px", fontSize:"16px", fontWeight:800, color:"#0f172a", display:"flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ width:"4px", height:"18px", background:"linear-gradient(#6366f1,#7c3aed)", borderRadius:"2px", display:"inline-block" }} />
                    Referral URL
                  </h3>
                  <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
                    <input
                      type="text" value={link} readOnly
                      style={{
                        flex:1, minWidth:"240px",
                        padding:"15px 18px", borderRadius:"16px",
                        border:"1.5px solid #c7d2fe",
                        background:"#f8fafc", fontSize:"14px",
                        fontFamily:"'Sora',sans-serif", fontWeight:500,
                        color:"#0f172a", outline:"none",
                      }}
                    />
                    <button className={`copy-btn${copied ? " copied" : ""}`} onClick={handleCopy}>
                      {copied ? "✓ Copied!" : "📋 Copy Link"}
                    </button>
                  </div>
                </div>

                {/* Share row */}
                <div style={{ marginBottom:"32px" }}>
                  <h3 style={{ margin:"0 0 14px", fontSize:"16px", fontWeight:800, color:"#0f172a", display:"flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ width:"4px", height:"18px", background:"linear-gradient(#6366f1,#7c3aed)", borderRadius:"2px", display:"inline-block" }} />
                    Share Via
                  </h3>
                  <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                    {SHARE_OPTIONS.map((s) => (
                      <a
                        key={s.label}
                        href={s.url(link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-pill"
                        style={{ background:s.bg, borderColor:s.border, color:s.color }}
                      >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"28px" }} />

                {/* Info chips */}
                <h3 style={{ margin:"0 0 16px", fontSize:"16px", fontWeight:800, color:"#0f172a", display:"flex", alignItems:"center", gap:"8px" }}>
                  <span style={{ width:"4px", height:"18px", background:"linear-gradient(#6366f1,#7c3aed)", borderRadius:"2px", display:"inline-block" }} />
                  How It Works
                </h3>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(210px, 1fr))", gap:"16px", marginBottom:"32px" }}>
                  {INFO_CARDS.map((card, i) => (
                    <div key={i} className="info-chip" style={{ background:card.bg, borderColor:card.border }}>
                      <div style={{
                        width:"40px", height:"40px", borderRadius:"12px",
                        background:card.accentBg,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"18px", marginBottom:"12px",
                        boxShadow:`0 4px 12px ${card.glow}`,
                      }}>
                        {card.icon}
                      </div>
                      <h3 style={{ margin:"0 0 6px", color:card.color, fontSize:"15px", fontWeight:800 }}>{card.title}</h3>
                      <p style={{ margin:0, color:"#475569", lineHeight:1.7, fontSize:"13px" }}>{card.description}</p>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
                  <button className="explore-btn" onClick={() => navigate("/student/campaigns")}>
                    🚀 Explore More Campaigns
                  </button>
                  <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                  </button>
                </div>
              </div>

            ) : (
              /* ── NO LINK EMPTY STATE ── */
              <div style={{ textAlign:"center", padding:"40px 20px" }} className="fade-in">
                <div style={{ fontSize:"56px", marginBottom:"16px" }}>🔗</div>
                <h2 style={{ margin:"0 0 12px", color:"#0f172a", fontSize:"22px", fontWeight:800 }}>No Referral Link Found</h2>
                <p style={{ color:"#64748b", lineHeight:1.8, maxWidth:"460px", margin:"0 auto 28px", fontSize:"15px" }}>
                  Generate a referral link from a campaign page to start sharing and earning commissions.
                </p>
                <button className="browse-btn" onClick={() => navigate("/student/campaigns")}>
                  🚀 Browse Campaigns
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralLinkPage;