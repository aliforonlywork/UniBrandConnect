import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PaymentSuccess() {
const navigate = useNavigate();
const [homePressed, setHomePressed]   = useState(false);
const [dashPressed, setDashPressed]   = useState(false);


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        @keyframes popIn {
          0%   { transform:scale(0.4); opacity:0; }
          70%  { transform:scale(1.15); }
          100% { transform:scale(1);   opacity:1; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position:200% 0; }
          100% { background-position:-200% 0; }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-8px); }
        }
        @keyframes confetti {
          0%   { transform:rotate(0deg) scale(1);   opacity:1; }
          100% { transform:rotate(720deg) scale(0); opacity:0; top:100%; }
        }

        .success-card {
          background:#fff;
          border-radius:28px;
          padding:52px 44px;
          width:100%; max-width:520px;
          text-align:center;
          border:1.5px solid #f1f5f9;
          box-shadow:0 24px 60px rgba(0,0,0,0.10);
          animation:fadeUp 0.5s ease both;
        }

        .home-btn {
          padding:14px 30px; border:none; border-radius:16px;
          background:linear-gradient(135deg,#10b981,#059669);
          color:white; font-weight:800; font-size:15px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 10px 26px rgba(16,185,129,0.30);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; gap:8px;
        }
        .home-btn:hover  { transform:translateY(-2px); box-shadow:0 16px 34px rgba(16,185,129,0.42); filter:brightness(1.08); }
        .home-btn:active { transform:scale(0.97); filter:brightness(0.95); }

        .dash-btn {
          padding:14px 30px; border-radius:16px;
          border:1.5px solid #e2e8f0; background:white;
          color:#0f172a; font-weight:700; font-size:15px;
          font-family:'Sora',sans-serif; cursor:pointer;
          transition:background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
          display:flex; align-items:center; gap:8px;
        }
        .dash-btn:hover  { background:#f8fafc; border-color:#c7d2fe; transform:translateY(-2px); }
        .dash-btn:active { transform:scale(0.97); }

        .feature-row {
          display:flex; align-items:center; gap:12px;
          padding:11px 16px; border-radius:14px;
          background:#f8fafc; border:1.5px solid #f1f5f9;
          text-align:left;
          transition:background 0.15s ease;
        }
        .feature-row:hover { background:#f0fdf4; border-color:#bbf7d0; }
      `}</style>

      <div style={{
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #f8fafc 100%)",
        padding:"20px",
        fontFamily:"'Sora',sans-serif",
        position:"relative",
        overflow:"hidden",
      }}>
        {/* Background blobs */}
        <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"280px", height:"280px", borderRadius:"50%", background:"rgba(16,185,129,0.08)", filter:"blur(40px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-80px", left:"-80px", width:"240px", height:"240px", borderRadius:"50%", background:"rgba(5,150,105,0.07)", filter:"blur(40px)", pointerEvents:"none" }} />

        <div className="success-card">

          {/* Animated success icon */}
          <div style={{ animation:"popIn 0.6s cubic-bezier(.34,1.56,.64,1) 0.1s both" }}>
            <div style={{
              width:"100px", height:"100px", borderRadius:"50%",
              background:"linear-gradient(135deg,#10b981,#059669)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"46px", margin:"0 auto 28px",
              boxShadow:"0 16px 40px rgba(16,185,129,0.35)",
              animation:"float 3s ease-in-out 0.7s infinite",
            }}>✅</div>
          </div>

          {/* Title */}
          <div style={{ animation:"fadeUp 0.5s ease 0.3s both" }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"7px",
              padding:"6px 16px", borderRadius:"999px",
              background:"#dcfce7", border:"1.5px solid #86efac",
              color:"#166534", fontSize:"12px", fontWeight:700,
              letterSpacing:"1px", textTransform:"uppercase",
              marginBottom:"16px",
            }}>
              <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e" }} />
              Payment Confirmed
            </div>

            <h1 style={{ margin:"0 0 14px", fontSize:"32px", fontWeight:800, color:"#0f172a", lineHeight:1.2 }}>
              Payment Successful! 🎉
            </h1>

            <p style={{ margin:"0 0 10px", color:"#64748b", fontSize:"15px", lineHeight:1.8 }}>
              Your payment has been completed successfully and your order has been confirmed.
            </p>
            <p style={{ margin:"0 0 28px", color:"#64748b", fontSize:"14px", lineHeight:1.7 }}>
              Referral tracking, campaign analytics, and commission distribution have been processed within the platform.
            </p>
          </div>

          {/* Progress-style info rows */}
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"30px", animation:"fadeUp 0.5s ease 0.45s both" }}>
            {[
              { icon:"💳", label:"Payment Processed",         desc:"Your transaction is complete"    },
              { icon:"🔗", label:"Referral Tracked",          desc:"Commission credited to student"  },
              { icon:"📊", label:"Analytics Updated",         desc:"Campaign stats recorded live"    },
              { icon:"🚀", label:"Order Confirmed",           desc:"Thank you for using UniBrandConnect" },
            ].map((f, i) => (
              <div key={i} className="feature-row">
                <div style={{ width:"36px", height:"36px", borderRadius:"11px", background:"#dcfce7", border:"1px solid #86efac", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"17px", flexShrink:0 }}>
                  {f.icon}
                </div>
                <div>
                  <p style={{ margin:0, fontSize:"13px", fontWeight:700, color:"#0f172a" }}>{f.label}</p>
                  <p style={{ margin:0, fontSize:"12px", color:"#94a3b8" }}>{f.desc}</p>
                </div>
                <div style={{ marginLeft:"auto", color:"#22c55e", fontSize:"16px", fontWeight:900 }}>✓</div>
              </div>
            ))}
          </div>

          {/* Shimmer divider */}
          <div style={{
            height:"3px", borderRadius:"999px",
            background:"linear-gradient(90deg,#10b981,#34d399,#6ee7b7,#34d399,#10b981)",
            backgroundSize:"300% 100%",
            animation:"shimmer 2s linear infinite",
            marginBottom:"28px",
          }} />

          {/* Action buttons */}
          <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap", animation:"fadeUp 0.5s ease 0.6s both" }}>
            <button className="home-btn" onClick={() => navigate("/")}>
              🏠 Back to Home
            </button>
            <button className="dash-btn" onClick={() => navigate("/student/dashboard")}>
              📊 Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}