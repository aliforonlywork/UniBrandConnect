import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

const FEATURES = [
  { icon:"🎯", title:"Campaign Access",       desc:"Explore premium referral campaigns and opportunities."         },
  { icon:"📊", title:"Advanced Analytics",    desc:"Track clicks, conversions, earnings, and growth in real-time." },
  { icon:"🤖", title:"AI Recommendations",    desc:"Receive intelligent campaign recommendations tailored to you."  },
  { icon:"🔒", title:"Secure Platform",       desc:"Protected authentication and end-to-end encrypted sessions."   },
];

const ROLES = [
  { value:"student",    label:"🎓 Student",    desc:"Access campaigns & earn"     },
  { value:"brand",      label:"🏷️ Brand",      desc:"Create & manage campaigns"   },
  { value:"university", label:"🏫 University", desc:"Oversee student activity"    },
  { value:"admin",      label:"⚙️ Admin",      desc:"Full platform control"       },
];

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name:"", email:"", password:"", confirmPassword:"", university:"", role:"student",
  });
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [pwMatch,   setPwMatch]   = useState(null); // null | true | false

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    if (e.target.name === "confirmPassword" || e.target.name === "password") {
      const pass = e.target.name === "password" ? e.target.value : updated.password;
      const conf = e.target.name === "confirmPassword" ? e.target.value : updated.confirmPassword;
      setPwMatch(conf.length > 0 ? pass === conf : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Sora',sans-serif; }

        .reg-input {
          width:100%; padding:14px 18px;
          border-radius:14px; border:1.5px solid #e2e8f0;
          background:#f8fafc; font-size:14px;
          font-family:'Sora',sans-serif; font-weight:500;
          color:#0f172a; outline:none;
          transition:border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .reg-input:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.12); background:#fff; }
        .reg-input::placeholder { color:#94a3b8; }
        .reg-input.valid   { border-color:#10b981; box-shadow:0 0 0 3px rgba(16,185,129,0.10); }
        .reg-input.invalid { border-color:#ef4444; box-shadow:0 0 0 3px rgba(239,68,68,0.10);  }

        .reg-select {
          width:100%; padding:14px 18px;
          border-radius:14px; border:1.5px solid #e2e8f0;
          background:#f8fafc; font-size:14px;
          font-family:'Sora',sans-serif; font-weight:600;
          color:#0f172a; outline:none; cursor:pointer;
          transition:border-color 0.2s ease, box-shadow 0.2s ease;
          appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 16px center;
        }
        .reg-select:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.12); background-color:#fff; }

        .role-pill {
          padding:9px 16px; border-radius:12px;
          border:1.5px solid #e2e8f0; background:#f8fafc;
          cursor:pointer; font-size:13px; font-weight:700;
          font-family:'Sora',sans-serif; color:#64748b;
          transition:all 0.18s ease; text-align:center;
        }
        .role-pill:hover   { border-color:#818cf8; color:#4338ca; background:#eef2ff; }
        .role-pill.selected { border-color:#6366f1; background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.30); }

        .reg-btn {
          width:100%; padding:17px;
          border:none; border-radius:16px;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          color:white; font-size:15px; font-weight:800;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 12px 32px rgba(79,70,229,0.30);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; justify-content:center; gap:10px;
        }
        .reg-btn:hover:not(:disabled) { transform:translateY(-3px); box-shadow:0 18px 40px rgba(79,70,229,0.40); filter:brightness(1.08); }
        .reg-btn:active:not(:disabled){ transform:scale(0.97); filter:brightness(0.95); }
        .reg-btn:disabled { opacity:0.7; cursor:not-allowed; }

        .pass-toggle {
          position:absolute; right:14px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer;
          font-size:16px; color:#64748b; transition:color 0.15s ease;
        }
        .pass-toggle:hover { color:#6366f1; }

        .feat-card {
          background:rgba(255,255,255,0.07); padding:20px 18px;
          border-radius:20px; border:1px solid rgba(255,255,255,0.10);
          backdrop-filter:blur(10px);
          transition:background 0.2s ease, transform 0.2s ease;
          cursor:default;
        }
        .feat-card:hover { background:rgba(255,255,255,0.13); transform:translateY(-3px); }

        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes slideUp  { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }
        @keyframes shake    { 0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-6px);}40%,80%{transform:translateX(6px);} }
        .error-shake { animation:shake 0.4s ease; }
        .slide-up    { animation:slideUp 0.5s ease both; }
      `}</style>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"100vh", fontFamily:"'Sora',sans-serif" }}>

        {/* ══ LEFT PANEL ══ */}
        <div style={{
          position:"relative",
          background:"linear-gradient(135deg, #0c1525 0%, #1e1b4b 35%, #312e81 65%, #4f46e5 100%)",
          padding:"60px 56px", color:"white",
          display:"flex", alignItems:"center", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:"-100px", right:"-100px", width:"280px", height:"280px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
          <div style={{ position:"absolute", bottom:"-70px", left:"-70px", width:"220px", height:"220px", borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
          <div style={{ position:"absolute", top:"45%", right:"12%", width:"110px", height:"110px", borderRadius:"50%", background:"rgba(99,102,241,0.14)" }} />

          <div style={{ position:"relative", zIndex:2, width:"100%" }}>
            {/* Brand */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"10px",
              padding:"9px 18px", borderRadius:"999px",
              background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.16)",
              fontSize:"13px", fontWeight:800, marginBottom:"30px",
            }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg,#6366f1,#818cf8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🎓</div>
              Join UniBrandConnect
            </div>

            <h1 style={{ fontSize:"46px", fontWeight:800, lineHeight:1.15, marginBottom:"18px" }}>
              Build Your Future<br />with Smart Brand<br />Collaboration 🚀
            </h1>
            <p style={{ fontSize:"15px", lineHeight:1.9, opacity:0.82, maxWidth:"460px", marginBottom:"36px", fontWeight:400 }}>
              Create your professional account and access a modern platform built for students, brands, universities, and administrators.
            </p>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(190px, 1fr))", gap:"12px" }}>
              {FEATURES.map((f, i) => (
                <div key={i} className="feat-card slide-up" style={{ animationDelay:`${i*0.08}s` }}>
                  <div style={{ fontSize:"24px", marginBottom:"10px" }}>{f.icon}</div>
                  <h4 style={{ margin:"0 0 5px", fontSize:"14px", fontWeight:800 }}>{f.title}</h4>
                  <p style={{ margin:0, fontSize:"12px", lineHeight:1.7, opacity:0.85 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:"32px 40px", background:"#f8fafc", overflowY:"auto" }}>
          <div style={{
            width:"100%", maxWidth:"500px",
            background:"#fff", borderRadius:"28px", padding:"42px 40px",
            border:"1.5px solid #f1f5f9",
            boxShadow:"0 20px 50px rgba(0,0,0,0.08)",
          }} className="slide-up">

            {/* Header */}
            <div style={{ textAlign:"center", marginBottom:"28px" }}>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:"6px",
                padding:"7px 18px", borderRadius:"999px",
                background:"#eef2ff", border:"1.5px solid #c7d2fe",
                color:"#4338ca", fontWeight:700, fontSize:"12px",
                letterSpacing:"1px", textTransform:"uppercase", marginBottom:"16px",
              }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#6366f1" }} />
                Secure Registration
              </div>
              <h2 style={{ margin:"0 0 6px", fontSize:"30px", fontWeight:800, color:"#0f172a" }}>Create Account</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>Start your professional journey with UniBrandConnect</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Error */}
              {error && (
                <div className="error-shake" style={{
                  display:"flex", alignItems:"center", gap:"10px",
                  background:"#fef2f2", color:"#991b1b",
                  padding:"13px 16px", borderRadius:"14px",
                  marginBottom:"20px", border:"1.5px solid #fecaca",
                  fontSize:"13px", fontWeight:600,
                }}>
                  <span>⚠️</span>{error}
                </div>
              )}

              {/* Two-col row: Name + Email */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"16px" }}>
                <div>
                  <label style={{ display:"block", marginBottom:"7px", color:"#374151", fontWeight:700, fontSize:"12px", letterSpacing:"0.3px" }}>Full Name</label>
                  <input type="text" name="name" placeholder="Your full name" onChange={handleChange} required className="reg-input" />
                </div>
                <div>
                  <label style={{ display:"block", marginBottom:"7px", color:"#374151", fontWeight:700, fontSize:"12px", letterSpacing:"0.3px" }}>University</label>
                  <input type="text" name="university" placeholder="Your university" onChange={handleChange} required className="reg-input" />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom:"16px" }}>
                <label style={{ display:"block", marginBottom:"7px", color:"#374151", fontWeight:700, fontSize:"12px", letterSpacing:"0.3px" }}>Email Address</label>
                <input type="email" name="email" placeholder="you@university.edu" onChange={handleChange} required className="reg-input" />
              </div>

              {/* Role pills */}
              <div style={{ marginBottom:"16px" }}>
                <label style={{ display:"block", marginBottom:"10px", color:"#374151", fontWeight:700, fontSize:"12px", letterSpacing:"0.3px" }}>Account Type</label>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      className={`role-pill${formData.role === r.value ? " selected" : ""}`}
                      onClick={() => setFormData({ ...formData, role: r.value })}
                    >
                      <div style={{ fontSize:"16px", marginBottom:"3px" }}>{r.label.split(" ")[0]}</div>
                      <div>{r.label.split(" ").slice(1).join(" ")}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Password row */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"22px" }}>
                <div>
                  <label style={{ display:"block", marginBottom:"7px", color:"#374151", fontWeight:700, fontSize:"12px", letterSpacing:"0.3px" }}>Password</label>
                  <div style={{ position:"relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      required
                      className="reg-input"
                      style={{ paddingRight:"42px" }}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ display:"block", marginBottom:"7px", color:"#374151", fontWeight:700, fontSize:"12px", letterSpacing:"0.3px" }}>
                    Confirm Password
                    {pwMatch === true  && <span style={{ color:"#10b981", marginLeft:"6px" }}>✓</span>}
                    {pwMatch === false && <span style={{ color:"#ef4444", marginLeft:"6px" }}>✗</span>}
                  </label>
                  <div style={{ position:"relative" }}>
                    <input
                      type={showConf ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm"
                      onChange={handleChange}
                      required
                      className={`reg-input${pwMatch === true ? " valid" : pwMatch === false ? " invalid" : ""}`}
                      style={{ paddingRight:"42px" }}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowConf(!showConf)} tabIndex={-1}>
                      {showConf ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div style={{ width:"16px", height:"16px", borderRadius:"50%", border:"2.5px solid rgba(255,255,255,0.4)", borderTopColor:"white", animation:"spin 0.75s linear infinite" }} />
                    Creating Account…
                  </>
                ) : (
                  <> 🚀 Create Account </>
                )}
              </button>

              {/* Already have account */}
              <div style={{ marginTop:"20px", textAlign:"center" }}>
                <p style={{ margin:0, color:"#94a3b8", fontSize:"13px" }}>
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    style={{ color:"#6366f1", fontWeight:700, cursor:"pointer", textDecoration:"underline" }}
                  >
                    Sign In
                  </span>
                </p>
              </div>

              {/* Trust line */}
              <div style={{ marginTop:"16px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                <span style={{ fontSize:"13px" }}>🔒</span>
                <p style={{ margin:0, color:"#94a3b8", fontSize:"12px" }}>Secure and professional access to the UniBrandConnect ecosystem</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;