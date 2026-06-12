import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

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
        @keyframes shake {
          0%,100% { transform:translateX(0) rotate(0deg); }
          20%,60% { transform:translateX(-5px) rotate(-3deg); }
          40%,80% { transform:translateX(5px)  rotate(3deg); }
        }
        @keyframes shimmer {
          0%   { background-position:200% 0; }
          100% { background-position:-200% 0; }
        }

        .cancel-card {
          background:#fff;
          border-radius:28px;
          padding:52px 44px;
          width:100%; max-width:520px;
          text-align:center;
          border:1.5px solid #fecaca;
          box-shadow:0 24px 60px rgba(239,68,68,0.12);
          animation:fadeUp 0.5s ease both;
        }

        .retry-btn {
          padding:14px 30px; border:none; border-radius:16px;
          background:linear-gradient(135deg,#ef4444,#dc2626);
          color:white; font-weight:800; font-size:15px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 10px 26px rgba(239,68,68,0.30);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; gap:8px;
        }
        .retry-btn:hover  { transform:translateY(-2px); box-shadow:0 16px 34px rgba(239,68,68,0.42); filter:brightness(1.08); }
        .retry-btn:active { transform:scale(0.97); filter:brightness(0.95); }

        .home-btn {
          padding:14px 30px; border-radius:16px;
          border:1.5px solid #e2e8f0; background:white;
          color:#0f172a; font-weight:700; font-size:15px;
          font-family:'Sora',sans-serif; cursor:pointer;
          transition:background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
          display:flex; align-items:center; gap:8px;
        }
        .home-btn:hover  { background:#f8fafc; border-color:#fca5a5; transform:translateY(-2px); }
        .home-btn:active { transform:scale(0.97); }

        .info-row {
          display:flex; align-items:center; gap:12px;
          padding:11px 16px; border-radius:14px;
          background:#f8fafc; border:1.5px solid #f1f5f9;
          text-align:left;
          transition:background 0.15s ease;
        }
        .info-row:hover { background:#fef2f2; border-color:#fca5a5; }
      `}</style>

      <div style={{
        minHeight:"100vh",
        display:"flex", justifyContent:"center", alignItems:"center",
        background:"linear-gradient(135deg, #fff1f2 0%, #fef2f2 40%, #f8fafc 100%)",
        padding:"20px",
        fontFamily:"'Sora',sans-serif",
        position:"relative", overflow:"hidden",
      }}>
        {/* Background blobs */}
        <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"280px", height:"280px", borderRadius:"50%", background:"rgba(239,68,68,0.07)", filter:"blur(40px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-80px", left:"-80px", width:"240px", height:"240px", borderRadius:"50%", background:"rgba(220,38,38,0.06)", filter:"blur(40px)", pointerEvents:"none" }} />

        <div className="cancel-card">

          {/* Animated cancel icon */}
          <div style={{ animation:"popIn 0.6s cubic-bezier(.34,1.56,.64,1) 0.1s both" }}>
            <div style={{
              width:"100px", height:"100px", borderRadius:"50%",
              background:"linear-gradient(135deg,#ef4444,#dc2626)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"44px", margin:"0 auto 28px",
              boxShadow:"0 16px 40px rgba(239,68,68,0.32)",
              animation:"shake 0.6s ease 0.7s both",
            }}>❌</div>
          </div>

          {/* Status badge */}
          <div style={{ animation:"fadeUp 0.5s ease 0.3s both" }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"7px",
              padding:"6px 16px", borderRadius:"999px",
              background:"#fee2e2", border:"1.5px solid #fca5a5",
              color:"#991b1b", fontSize:"12px", fontWeight:700,
              letterSpacing:"1px", textTransform:"uppercase",
              marginBottom:"16px",
            }}>
              <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#ef4444" }} />
              Payment Cancelled
            </div>

            <h1 style={{ margin:"0 0 14px", fontSize:"32px", fontWeight:800, color:"#0f172a", lineHeight:1.2 }}>
              Payment Cancelled
            </h1>

            <p style={{ margin:"0 0 10px", color:"#64748b", fontSize:"15px", lineHeight:1.8 }}>
              Your payment process was cancelled before completion.
            </p>
            <p style={{ margin:"0 0 28px", color:"#64748b", fontSize:"14px", lineHeight:1.7 }}>
              No charges were applied and no transaction was completed. You can safely retry the payment anytime.
            </p>
          </div>

          {/* Info rows */}
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"28px", animation:"fadeUp 0.5s ease 0.45s both" }}>
            {[
              { icon:"🛡️", label:"No Charges Applied",     desc:"Your payment was not processed"           },
              { icon:"💳", label:"Card Not Charged",        desc:"Zero amount was deducted"                 },
              { icon:"🔄", label:"Safe to Retry",           desc:"Return to the campaign and try again"     },
              { icon:"🔒", label:"Your Data is Secure",     desc:"All information remains private"          },
            ].map((f, i) => (
              <div key={i} className="info-row">
                <div style={{ width:"36px", height:"36px", borderRadius:"11px", background:"#fee2e2", border:"1px solid #fca5a5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"17px", flexShrink:0 }}>
                  {f.icon}
                </div>
                <div>
                  <p style={{ margin:0, fontSize:"13px", fontWeight:700, color:"#0f172a" }}>{f.label}</p>
                  <p style={{ margin:0, fontSize:"12px", color:"#94a3b8" }}>{f.desc}</p>
                </div>
                <div style={{ marginLeft:"auto", color:"#94a3b8", fontSize:"14px" }}>✓</div>
              </div>
            ))}
          </div>

          {/* Shimmer divider — red toned */}
          <div style={{
            height:"3px", borderRadius:"999px",
            background:"linear-gradient(90deg,#ef4444,#f87171,#fca5a5,#f87171,#ef4444)",
            backgroundSize:"300% 100%",
            animation:"shimmer 2s linear infinite",
            marginBottom:"28px",
          }} />

          {/* Action buttons */}
          <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap", animation:"fadeUp 0.5s ease 0.6s both" }}>
            <button className="retry-btn" onClick={() => navigate(-1)}>
              🔄 Try Again
            </button>
            <button className="home-btn" onClick={() => navigate("/")}>
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}