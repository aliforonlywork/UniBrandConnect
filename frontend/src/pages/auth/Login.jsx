import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { roleRoutes } from "../../config/roleConfig";

const FEATURES = [
  { icon:"📊", title:"Smart Analytics",       desc:"Monitor campaign growth and engagement in real-time."          },
  { icon:"🔗", title:"Referral System",        desc:"Generate and manage referral links instantly."                },
  { icon:"✨", title:"AI Recommendations",     desc:"Discover campaigns intelligently personalised for you."       },
  { icon:"🔒", title:"Secure Access",          desc:"Protected login with encrypted user sessions."               },
];

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email:"", password:"" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res   = await loginUser(formData);
      const user  = res.data.user;
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      const role = user?.role;
      if (role && roleRoutes[role]) {
        navigate(roleRoutes[role]);
      } else {
        setError("Invalid role assigned. Contact admin.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin:0; padding:0; }

        body { font-family:'Sora',sans-serif; }

        .login-input {
          width:100%; padding:15px 18px;
          border-radius:14px;
          border:1.5px solid #e2e8f0;
          background:#f8fafc;
          font-size:14px; font-family:'Sora',sans-serif; font-weight:500;
          color:#0f172a; outline:none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .login-input:focus {
          border-color:#6366f1;
          box-shadow:0 0 0 4px rgba(99,102,241,0.12);
          background:#fff;
        }
        .login-input::placeholder { color:#94a3b8; }

        .login-btn {
          width:100%; padding:17px;
          border:none; border-radius:16px;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          color:white; font-size:15px; font-weight:800;
          font-family:'Sora',sans-serif;
          cursor:pointer;
          box-shadow:0 12px 32px rgba(79,70,229,0.30);
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; justify-content:center; gap:10px;
        }
        .login-btn:hover:not(:disabled) { transform:translateY(-3px); box-shadow:0 18px 40px rgba(79,70,229,0.40); filter:brightness(1.08); }
        .login-btn:active:not(:disabled){ transform:scale(0.97); filter:brightness(0.95); }
        .login-btn:disabled { opacity:0.7; cursor:not-allowed; }

        .feature-card {
          background:rgba(255,255,255,0.07);
          padding:18px 20px; border-radius:20px;
          border:1px solid rgba(255,255,255,0.10);
          backdrop-filter:blur(10px);
          transition: background 0.2s ease, transform 0.2s ease;
          cursor:default;
        }
        .feature-card:hover {
          background:rgba(255,255,255,0.12);
          transform:translateY(-3px);
        }

        .pass-toggle {
          position:absolute; right:16px; top:50%;
          transform:translateY(-50%);
          background:none; border:none; cursor:pointer;
          font-size:17px; padding:4px; color:#64748b;
          transition:color 0.15s ease;
        }
        .pass-toggle:hover { color:#6366f1; }

        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }
        @keyframes shake { 0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-6px);}40%,80%{transform:translateX(6px);} }
        .error-shake { animation:shake 0.4s ease; }
        .slide-up    { animation:slideUp 0.5s ease both; }
      `}</style>

      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        minHeight:"100vh",
        fontFamily:"'Sora',sans-serif",
      }}>

        {/* ══ LEFT PANEL ══ */}
        <div style={{
          position:"relative",
          background:"linear-gradient(135deg, #0c1525 0%, #1e1b4b 35%, #312e81 65%, #4f46e5 100%)",
          padding:"70px 60px",
          color:"white",
          display:"flex",
          alignItems:"center",
          overflow:"hidden",
        }}>
          {/* Blobs */}
          <div style={{ position:"absolute", top:"-100px", right:"-100px", width:"280px", height:"280px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
          <div style={{ position:"absolute", bottom:"-70px", left:"-70px", width:"220px", height:"220px", borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
          <div style={{ position:"absolute", top:"50%", right:"10%", width:"120px", height:"120px", borderRadius:"50%", background:"rgba(99,102,241,0.15)" }} />

          <div style={{ position:"relative", zIndex:2, width:"100%" }}>
            {/* Brand */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"10px",
              padding:"9px 18px", borderRadius:"999px",
              background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.16)",
              fontSize:"13px", fontWeight:800, marginBottom:"32px",
              letterSpacing:"0.3px",
            }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg,#6366f1,#818cf8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🎓</div>
              UniBrandConnect
            </div>

            <h1 style={{ fontSize:"52px", fontWeight:800, lineHeight:1.15, marginBottom:"20px" }}>
              Welcome<br />Back 👋
            </h1>
            <p style={{ fontSize:"16px", lineHeight:1.9, opacity:0.82, maxWidth:"480px", marginBottom:"40px", fontWeight:400 }}>
              Access your professional dashboard, manage campaigns, track referrals, and grow your brand collaborations with a premium digital experience.
            </p>

            {/* Feature cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"14px" }}>
              {FEATURES.map((f, i) => (
                <div key={i} className="feature-card slide-up" style={{ animationDelay:`${i * 0.08}s` }}>
                  <div style={{ fontSize:"22px", marginBottom:"10px" }}>{f.icon}</div>
                  <h4 style={{ margin:"0 0 6px", fontSize:"14px", fontWeight:800 }}>{f.title}</h4>
                  <p style={{ margin:0, fontSize:"13px", lineHeight:1.7, opacity:0.85 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={{
          display:"flex", justifyContent:"center", alignItems:"center",
          padding:"40px", background:"#f8fafc",
        }}>
          <div style={{
            width:"100%", maxWidth:"460px",
            background:"#fff",
            borderRadius:"28px", padding:"48px 44px",
            border:"1.5px solid #f1f5f9",
            boxShadow:"0 20px 50px rgba(0,0,0,0.08)",
          }} className="slide-up">

            {/* Form header */}
            <div style={{ textAlign:"center", marginBottom:"32px" }}>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:"6px",
                padding:"7px 18px", borderRadius:"999px",
                background:"#eef2ff", border:"1.5px solid #c7d2fe",
                color:"#4338ca", fontWeight:700, fontSize:"12px",
                letterSpacing:"1px", textTransform:"uppercase",
                marginBottom:"18px",
              }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#6366f1" }} />
                Secure Login
              </div>
              <h2 style={{ margin:"0 0 8px", fontSize:"34px", fontWeight:800, color:"#0f172a" }}>Sign In</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>Continue to your UniBrandConnect account</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Error */}
              {error && (
                <div className="error-shake" style={{
                  display:"flex", alignItems:"center", gap:"10px",
                  background:"#fef2f2", color:"#991b1b",
                  padding:"14px 16px", borderRadius:"14px",
                  marginBottom:"22px", border:"1.5px solid #fecaca",
                  fontSize:"13px", fontWeight:600,
                }}>
                  <span style={{ fontSize:"16px" }}>⚠️</span>
                  {error}
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom:"20px" }}>
                <label style={{ display:"block", marginBottom:"8px", color:"#374151", fontWeight:700, fontSize:"13px", letterSpacing:"0.3px" }}>
                  Email Address
                </label>
                <input
                  type="email" name="email"
                  placeholder="you@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required
                  className="login-input"
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom:"28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                  <label style={{ color:"#374151", fontWeight:700, fontSize:"13px", letterSpacing:"0.3px" }}>Password</label>
                </div>
                <div style={{ position:"relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    required
                    className="login-input"
                    style={{ paddingRight:"48px" }}
                  />
                  <button
                    type="button"
                    className="pass-toggle"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div style={{ width:"16px", height:"16px", borderRadius:"50%", border:"2.5px solid rgba(255,255,255,0.4)", borderTopColor:"white", animation:"spin 0.75s linear infinite" }} />
                    Signing In…
                  </>
                ) : (
                  <> 🔓 Sign In </>
                )}
              </button>

              {/* Trust footer */}
              <div style={{ marginTop:"22px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                <span style={{ fontSize:"14px" }}>🔒</span>
                <p style={{ margin:0, color:"#94a3b8", fontSize:"12px", fontWeight:500 }}>
                  Secure access powered by UniBrandConnect platform
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;