import { useState } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon:"📊", title:"Analytics Dashboard",
    desc:"Track clicks, earnings, and campaign performance in real-time.",
    bg:"linear-gradient(135deg,#6366f1,#818cf8)", glow:"rgba(99,102,241,0.25)",
  },
  {
    icon:"🤖", title:"AI Recommendations",
    desc:"Personalized campaign suggestions powered by your engagement data.",
    bg:"linear-gradient(135deg,#7c3aed,#a78bfa)", glow:"rgba(124,58,237,0.25)",
  },
  {
    icon:"🏆", title:"Gamification System",
    desc:"Leaderboards, badges, rewards, and achievement tracking.",
    bg:"linear-gradient(135deg,#f59e0b,#fbbf24)", glow:"rgba(245,158,11,0.25)",
  },
  {
    icon:"💰", title:"Commission Earnings",
    desc:"Students earn referral commissions through campaign sales.",
    bg:"linear-gradient(135deg,#10b981,#34d399)", glow:"rgba(16,185,129,0.25)",
  },
];

const STATS = [
  { number:"AI",   label:"Smart Recommendations", icon:"✨", bg:"#eef2ff", color:"#4338ca" },
  { number:"24/7", label:"Real-Time Analytics",   icon:"📊", bg:"#f0fdf4", color:"#166534" },
  { number:"100%", label:"Secure Platform",       icon:"🔒", bg:"#fffbeb", color:"#92400e" },
];

const Home = () => {
  const [loginHover, setLoginHover]       = useState(false);
  const [registerHover, setRegisterHover] = useState(false);
  const [primaryHover, setPrimaryHover]   = useState(false);
  const [secondaryHover, setSecHover]     = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Sora',sans-serif; }

        .feat-row {
          display:flex; gap:16px; align-items:flex-start;
          padding:18px 20px; border-radius:20px;
          background:#f8fafc; border:1.5px solid #f1f5f9;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
          cursor:default; margin-bottom:14px;
        }
        .feat-row:last-child { margin-bottom:0; }
        .feat-row:hover { background:#fff; border-color:#c7d2fe; transform:translateX(4px); }

        .stat-chip {
          background:#fff; border-radius:20px; padding:20px 22px;
          border:1.5px solid #f1f5f9; min-width:170px;
          box-shadow:0 4px 16px rgba(0,0,0,0.05);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
          cursor:default; position:relative; overflow:hidden;
        }
        .stat-chip:hover { transform:translateY(-5px); box-shadow:0 14px 34px rgba(0,0,0,0.09); }
        .stat-chip::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:20px 20px 0 0; }

        .nav-login-btn {
          padding:11px 22px; border-radius:14px; border:1.5px solid #e2e8f0;
          background:white; color:#0f172a; font-weight:700; font-size:14px;
          font-family:'Sora',sans-serif; cursor:pointer; margin-right:10px;
          box-shadow:0 4px 14px rgba(0,0,0,0.06);
          transition:transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .nav-login-btn:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(0,0,0,0.10); border-color:#c7d2fe; }
        .nav-login-btn:active { transform:scale(0.97); }

        .nav-register-btn {
          padding:11px 22px; border-radius:14px; border:none;
          background:linear-gradient(135deg,#4f46e5,#7c3aed); color:white;
          font-weight:800; font-size:14px; font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 8px 24px rgba(79,70,229,0.28);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
        }
        .nav-register-btn:hover { transform:translateY(-2px); box-shadow:0 14px 32px rgba(79,70,229,0.40); filter:brightness(1.08); }
        .nav-register-btn:active { transform:scale(0.97); filter:brightness(0.95); }

        .primary-btn {
          padding:16px 32px; border-radius:16px; border:none;
          background:linear-gradient(135deg,#4f46e5,#7c3aed); color:white;
          font-weight:800; font-size:15px; font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 14px 36px rgba(79,70,229,0.30);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; gap:8px;
        }
        .primary-btn:hover { transform:translateY(-3px); box-shadow:0 20px 44px rgba(79,70,229,0.42); filter:brightness(1.08); }
        .primary-btn:active { transform:scale(0.97); filter:brightness(0.95); }

        .secondary-btn {
          padding:16px 32px; border-radius:16px; border:1.5px solid #e2e8f0;
          background:white; color:#0f172a; font-weight:700; font-size:15px;
          font-family:'Sora',sans-serif; cursor:pointer;
          transition:transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
          display:flex; align-items:center; gap:8px;
        }
        .secondary-btn:hover { transform:translateY(-2px); border-color:#c7d2fe; box-shadow:0 8px 22px rgba(0,0,0,0.08); }
        .secondary-btn:active { transform:scale(0.97); }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%; background:#10b981;
          display:inline-block; animation:pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.45);} }
        @keyframes float { 0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }

        .slide-up { animation:slideUp 0.6s ease both; }
        .s1 { animation-delay:0.05s; }
        .s2 { animation-delay:0.12s; }
        .s3 { animation-delay:0.20s; }
        .s4 { animation-delay:0.28s; }
      `}</style>

      <div style={{
        minHeight:"100vh",
        padding:"0 70px 60px",
        background:"linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)",
        fontFamily:"'Sora',sans-serif",
        overflow:"hidden", position:"relative",
      }}>

        {/* Background blobs */}
        <div style={{ position:"absolute", top:"-120px", right:"-120px", width:"360px", height:"360px", borderRadius:"50%", background:"rgba(99,102,241,0.07)", filter:"blur(40px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-120px", left:"-120px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(124,58,237,0.07)", filter:"blur(40px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"40%", left:"45%", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(16,185,129,0.05)", filter:"blur(30px)", pointerEvents:"none" }} />

        {/* ── NAVBAR ── */}
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"28px 0 40px", position:"relative", zIndex:10,
        }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{
              width:"38px", height:"38px", borderRadius:"12px",
              background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"18px", boxShadow:"0 6px 16px rgba(79,70,229,0.30)",
            }}>🎓</div>
            <span style={{ fontSize:"20px", fontWeight:900, color:"#0f172a", letterSpacing:"-0.3px" }}>
              UniBrand<span style={{ color:"#6366f1" }}>Connect</span>
            </span>
          </div>

          {/* Nav buttons */}
          <div style={{ display:"flex", alignItems:"center" }}>
            <Link to="/login" style={{ textDecoration:"none" }}>
              <button className="nav-login-btn">Sign In</button>
            </Link>
            <Link to="/register" style={{ textDecoration:"none" }}>
              <button className="nav-register-btn">Get Started →</button>
            </Link>
          </div>
        </div>

        {/* ── HERO GRID ── */}
        <div style={{
          display:"grid", gridTemplateColumns:"1.15fr 1fr", gap:"60px",
          alignItems:"center", position:"relative", zIndex:2,
        }}>

          {/* LEFT */}
          <div>
            {/* Live badge */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"8px 18px", borderRadius:"999px",
              background:"white", border:"1.5px solid #c7d2fe",
              color:"#4338ca", fontWeight:700, fontSize:"13px",
              marginBottom:"28px", boxShadow:"0 4px 14px rgba(0,0,0,0.06)",
            }} className="slide-up s1">
              <span className="pulse-dot" />
              Smart University Referral Ecosystem
            </div>

            {/* Heading */}
            <h1 style={{
              fontSize:"66px", lineHeight:1.1, fontWeight:900, color:"#0f172a",
              letterSpacing:"-1.5px", marginBottom:"24px",
            }} className="slide-up s2">
              Connecting<br />
              <span style={{ color:"#6366f1" }}>Universities,</span><br />
              Students &{" "}
              <span style={{
                background:"linear-gradient(135deg,#7c3aed,#ec4899)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>Brands</span><br />
              <span style={{ fontSize:"52px", color:"#0f172a" }}>In One Platform</span>
            </h1>

            {/* Description */}
            <p style={{
              fontSize:"16px", color:"#64748b", lineHeight:1.9, maxWidth:"640px",
              marginBottom:"36px", fontWeight:400,
            }} className="slide-up s3">
              UniBrandConnect is an intelligent collaboration platform helping brands promote campaigns through students while universities build stronger industry partnerships. Students earn commissions, track performance, and receive AI-powered campaign recommendations.
            </p>

            {/* CTA buttons */}
            <div style={{ display:"flex", gap:"14px", marginBottom:"44px", flexWrap:"wrap" }} className="slide-up s4">
              <Link to="/register" style={{ textDecoration:"none" }}>
                <button className="primary-btn">🚀 Get Started Free</button>
              </Link>
              <Link to="/login" style={{ textDecoration:"none" }}>
                <button className="secondary-btn">Explore Platform →</button>
              </Link>
            </div>

            {/* Stat chips */}
            <div style={{ display:"flex", gap:"14px", flexWrap:"wrap" }}>
              {STATS.map((s, i) => (
                <div key={i} className="stat-chip slide-up" style={{ animationDelay:`${0.30 + i*0.07}s` }}>
                  <style>{`.stat-chip:nth-child(${i+1})::before { background:${i===0?"linear-gradient(90deg,#6366f1,#818cf8)":i===1?"linear-gradient(90deg,#10b981,#34d399)":"linear-gradient(90deg,#f59e0b,#fbbf24)"}; }`}</style>
                  <div style={{ fontSize:"20px", marginBottom:"8px" }}>{s.icon}</div>
                  <h2 style={{ margin:0, color:"#0f172a", fontSize:"26px", fontWeight:900 }}>{s.number}</h2>
                  <p style={{ margin:"4px 0 0", color:"#64748b", fontSize:"12px", fontWeight:600, lineHeight:1.4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — features card */}
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{
              width:"100%", maxWidth:"480px",
              background:"#fff", borderRadius:"28px", padding:"32px",
              border:"1.5px solid #f1f5f9",
              boxShadow:"0 24px 60px rgba(0,0,0,0.09)",
            }}>
              {/* Card header */}
              <div style={{ marginBottom:"24px" }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:"7px",
                  padding:"7px 16px", borderRadius:"999px",
                  background:"#ede9fe", border:"1px solid #ddd6fe",
                  color:"#6d28d9", fontWeight:700, fontSize:"12px",
                  letterSpacing:"1px", textTransform:"uppercase", marginBottom:"14px",
                }}>
                  <span className="pulse-dot" style={{ background:"#7c3aed" }} />
                  Live Campaign Insights
                </div>
                <h2 style={{ margin:"0 0 8px", fontSize:"22px", fontWeight:800, color:"#0f172a" }}>Platform Features</h2>
                <p style={{ margin:0, color:"#64748b", fontSize:"14px", lineHeight:1.7 }}>
                  Modern referral system, gamification, analytics, and AI-powered campaign recommendations.
                </p>
              </div>

              <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"20px" }} />

              {/* Feature rows */}
              {FEATURES.map((f, i) => (
                <div key={i} className="feat-row">
                  <div style={{
                    width:"48px", height:"48px", borderRadius:"14px", flexShrink:0,
                    background:f.bg,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"22px",
                    boxShadow:`0 6px 16px ${f.glow}`,
                  }}>{f.icon}</div>
                  <div>
                    <h4 style={{ margin:"0 0 4px", color:"#0f172a", fontSize:"14px", fontWeight:800 }}>{f.title}</h4>
                    <p style={{ margin:0, color:"#64748b", lineHeight:1.7, fontSize:"13px" }}>{f.desc}</p>
                  </div>
                </div>
              ))}

              {/* CTA strip at bottom */}
              <div style={{ height:"1px", background:"#f1f5f9", margin:"20px 0 18px" }} />
              <Link to="/register" style={{ textDecoration:"none" }}>
                <button style={{
                  width:"100%", padding:"14px", borderRadius:"14px", border:"none",
                  background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
                  color:"white", fontWeight:800, fontSize:"14px",
                  fontFamily:"'Sora',sans-serif", cursor:"pointer",
                  boxShadow:"0 8px 22px rgba(79,70,229,0.28)",
                  transition:"transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease",
                }}
                  onMouseEnter={(e)=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 14px 32px rgba(79,70,229,0.40)"; }}
                  onMouseLeave={(e)=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 8px 22px rgba(79,70,229,0.28)"; }}
                >
                  🚀 Start For Free — No Credit Card Required
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;