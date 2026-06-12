import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

const STEPS = [
  { icon:"🔗", label:"Validating referral code…"  },
  { icon:"🛡️", label:"Verifying campaign status…"  },
  { icon:"📊", label:"Recording your analytics…"  },
  { icon:"🚀", label:"Redirecting to product…"     },
];

const ReferralRedirect = () => {
  const { code } = useParams();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Animate through steps while redirect happens
    const stepInterval = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 450);

    const redirect = async () => {
      try {
        console.log("Referral code:", code);
        const res = await API.get(`/referrals/${code}`);
        console.log("Response:", res.data);
        const campaignId = res.data.campaignId;
const referralId = res.data.referral?._id || res.data._id;
const studentId = res.data.referral?.studentId || res.data.studentId;

// Save so checkout can read it
localStorage.setItem("referralId", referralId);
localStorage.setItem("referralStudentId", studentId);
localStorage.setItem("referralCampaignId", campaignId);

setTimeout(() => {
  clearInterval(stepInterval);
  window.location.href = `/product/${campaignId}`;
}, 1800);
      } catch (error) {
        clearInterval(stepInterval);
        console.error("Referral Error:", error.response?.data || error);
        alert(error.response?.data?.message || "Invalid referral link");
      }
    };

    redirect();
    return () => clearInterval(stepInterval);
  }, [code]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        @keyframes loading {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(160%); }
        }
        @keyframes pulse-ring {
          0%   { transform:scale(1);    box-shadow: 0 0 0 0   rgba(99,102,241,0.4); }
          50%  { transform:scale(1.06); box-shadow: 0 0 0 16px rgba(99,102,241,0);  }
          100% { transform:scale(1);    box-shadow: 0 0 0 0   rgba(99,102,241,0);   }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-8px); }
        }
        @keyframes fadeSlideIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0);   }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes orbit {
          from { transform:rotate(0deg)   translateX(54px) rotate(0deg); }
          to   { transform:rotate(360deg) translateX(54px) rotate(-360deg); }
        }

        .redirect-card {
          width:100%; max-width:500px;
          background:#fff;
          border-radius:32px;
          padding:52px 44px;
          text-align:center;
          border:1.5px solid #f1f5f9;
          box-shadow:0 24px 60px rgba(0,0,0,0.10);
          position:relative; z-index:2;
        }

        .step-item {
          display:flex; align-items:center; gap:12px;
          padding:10px 16px; border-radius:14px;
          font-size:13px; font-weight:600;
          transition: all 0.3s ease;
          animation: fadeSlideIn 0.3s ease both;
        }
        .step-item.active   { background:#eef2ff; color:#4338ca; }
        .step-item.done     { background:#f0fdf4; color:#166534; }
        .step-item.pending  { background:#f8fafc; color:#94a3b8; }
      `}</style>

      <div style={{
        minHeight:"100vh",
        display:"flex", justifyContent:"center", alignItems:"center",
        background:"linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)",
        padding:"20px",
        fontFamily:"'Sora',sans-serif",
        overflow:"hidden", position:"relative",
      }}>

        {/* Background blobs */}
        <div style={{ position:"absolute", top:"-120px", right:"-120px", width:"360px", height:"360px", borderRadius:"50%", background:"rgba(99,102,241,0.07)", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", bottom:"-100px", left:"-100px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(124,58,237,0.07)", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", top:"40%", left:"60%", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(16,185,129,0.05)", filter:"blur(30px)" }} />

        <div className="redirect-card">

          {/* Animated icon ring */}
          <div style={{ position:"relative", width:"120px", height:"120px", margin:"0 auto 32px" }}>
            {/* Orbiting dot */}
            <div style={{
              position:"absolute", top:"50%", left:"50%",
              marginTop:"-5px", marginLeft:"-5px",
              width:"10px", height:"10px", borderRadius:"50%",
              background:"#6366f1",
              animation:"orbit 2s linear infinite",
            }} />
            {/* Main icon circle */}
            <div style={{
              width:"120px", height:"120px", borderRadius:"50%",
              background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 16px 40px rgba(79,70,229,0.30)",
              animation:"pulse-ring 2.4s ease-in-out infinite",
              fontSize:"46px",
            }}>🔗</div>
          </div>

          {/* Badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"8px",
            padding:"7px 18px", borderRadius:"999px",
            background:"#eef2ff", border:"1.5px solid #c7d2fe",
            color:"#4338ca", fontWeight:700, fontSize:"12px",
            letterSpacing:"1px", textTransform:"uppercase",
            marginBottom:"20px",
          }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#6366f1", animation:"pulse-ring 1.5s ease-in-out infinite" }} />
            Secure Referral Redirect
          </div>

          <h1 style={{ margin:"0 0 14px", fontSize:"34px", fontWeight:800, color:"#0f172a", lineHeight:1.2 }}>
            Redirecting You…
          </h1>
          <p style={{ margin:"0 auto 30px", color:"#64748b", lineHeight:1.9, fontSize:"15px", maxWidth:"380px" }}>
            Please wait while we securely connect you to the selected campaign product page through UniBrandConnect.
          </p>

          {/* Progress bar */}
          <div style={{ width:"100%", height:"10px", background:"#f1f5f9", borderRadius:"999px", overflow:"hidden", marginBottom:"28px" }}>
            <div style={{
              width:"60%", height:"100%", borderRadius:"999px",
              background:"linear-gradient(90deg,#6366f1,#818cf8,#a78bfa,#818cf8,#6366f1)",
              backgroundSize:"300% 100%",
              animation:"loading 1.8s ease-in-out infinite",
            }} />
          </div>

          {/* Step tracker */}
          <div style={{ display:"grid", gap:"8px", marginBottom:"28px", textAlign:"left" }}>
            {STEPS.map((s, i) => {
              const state = i < step ? "done" : i === step ? "active" : "pending";
              return (
                <div key={i} className={`step-item ${state}`}>
                  <span style={{ fontSize:"16px", width:"22px", textAlign:"center" }}>
                    {state === "done" ? "✅" : state === "active" ? s.icon : "⏳"}
                  </span>
                  <span>{s.label}</span>
                  {state === "active" && (
                    <div style={{ marginLeft:"auto", width:"14px", height:"14px", borderRadius:"50%", border:"2px solid #c7d2fe", borderTopColor:"#6366f1", animation:"spin 0.7s linear infinite", flexShrink:0 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer trust line */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
            <span style={{ fontSize:"14px" }}>🔒</span>
            <p style={{ margin:0, fontSize:"12px", color:"#94a3b8", fontWeight:500 }}>
              Your referral tracking and analytics are being processed securely.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralRedirect;