import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { createPaymentSession } from "../../services/paymentService";

const STRIPE_PK = import.meta.env.VITE_STRIPE_PK;
console.log("Stripe Key:", STRIPE_PK);

const FEATURES = [
  { icon:"🔒", title:"Secure Payment",    desc:"Protected Stripe checkout with end-to-end encrypted transactions."     },
  { icon:"✅", title:"Trusted Campaign",  desc:"Verified campaign managed through the UniBrandConnect platform."        },
  { icon:"⚡", title:"Fast Checkout",     desc:"Smooth, optimised one-click purchase experience — no friction."         },
  { icon:"🔄", title:"Instant Redirect",  desc:"You're taken directly to Stripe's hosted checkout — safe & compliant."  },
];

const PublicProductPage = () => {
  const { id } = useParams();

  const [campaign, setCampaign] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [paying,   setPaying]   = useState(false);
  const [imgHover, setImgHover] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await API.get(`/campaigns/${id}`);
        setCampaign(res.data.campaign);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handlePayment = async () => {
    try {
      setPaying(true);
      console.log("Buy Now Clicked");
      const campaignId = campaign._id;
const studentId  = localStorage.getItem("referralStudentId");
const referralId = localStorage.getItem("referralId");

if (!studentId || !referralId) {
  alert("Referral link required to purchase this product.");
  setPaying(false);
  return;
}
      const product    = { _id: campaign._id, name: campaign.title, price: campaign.price };
      const data = await createPaymentSession({ product, studentId, campaignId, referralId });
      console.log("Session Data:", data);
      window.location.href = data.url;
    } catch (error) {
      console.log("Payment Error:", error);
      alert("Payment initialization failed");
    } finally {
      setPaying(false);
    }
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
          <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#6366f1" }}>Loading Product…</p>
          <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Preparing your campaign page</p>
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
          <div style={{ fontSize:"52px", marginBottom:"16px" }}>📦</div>
          <h2 style={{ margin:"0 0 10px", color:"#0f172a", fontSize:"22px", fontWeight:800 }}>Product Not Found</h2>
          <p style={{ color:"#64748b" }}>The requested campaign could not be loaded.</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .product-img-card {
          background: #fff; border-radius: 28px;
          padding: 20px; border: 1.5px solid #f1f5f9;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease;
          overflow: hidden;
        }
        .product-img-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 56px rgba(0,0,0,0.11);
        }

        .details-card {
          background: #fff; border-radius: 28px; padding: 38px;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }

        .feature-row {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 16px 18px; border-radius: 16px;
          background: #f8fafc; border: 1.5px solid #f1f5f9;
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .feature-row:hover {
          background: #f0f9ff; border-color: #bae6fd;
          transform: translateX(4px);
        }

        .buy-btn {
          width: 100%; padding: 19px;
          border-radius: 18px; border: none;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          color: white; font-size: 17px; font-weight: 800;
          font-family: 'Sora',sans-serif; cursor: pointer;
          box-shadow: 0 14px 36px rgba(79,70,229,0.30);
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.22s ease, filter 0.22s ease;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .buy-btn:hover:not(:disabled)  { transform:translateY(-3px); box-shadow:0 20px 44px rgba(79,70,229,0.40); filter:brightness(1.08); }
        .buy-btn:active:not(:disabled) { transform:scale(0.97); box-shadow:0 6px 18px rgba(79,70,229,0.25); filter:brightness(0.96); }
        .buy-btn:disabled { background:linear-gradient(135deg,#94a3b8,#64748b); cursor:not-allowed; box-shadow:none; }

        .price-badge {
          background: linear-gradient(135deg,#eef2ff,#ede9fe);
          padding: 26px 28px; border-radius: 22px;
          border: 1.5px solid #c7d2fe;
          margin-bottom: 28px;
        }

        @keyframes spin  { to { transform:rotate(360deg); } }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.45); }
        }
        .pulse-dot {
          width:8px; height:8px; border-radius:50%;
          background:#10b981; display:inline-block;
          animation: pulse 2s infinite;
        }
        @keyframes shimmer {
          0%   { background-position:200% 0; }
          100% { background-position:-200% 0; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ── HERO BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #0c1525 0%, #1e1b4b 40%, #312e81 70%, #4f46e5 100%)",
          borderRadius:"28px", padding:"48px 52px", color:"white",
          marginBottom:"32px",
          boxShadow:"0 20px 60px rgba(15,23,42,0.35)",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"260px", height:"260px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", bottom:"-50px", left:"-50px", width:"180px", height:"180px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", top:"30%", right:"20%", width:"100px", height:"100px", background:"rgba(99,102,241,0.15)", borderRadius:"50%" }} />

          <div style={{ position:"relative", zIndex:2 }}>
            {/* Breadcrumb badge */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"7px 16px", borderRadius:"999px",
              background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.18)",
              fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
              marginBottom:"20px",
            }}>
              🛒 Featured Campaign Product
            </div>

            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:"20px" }}>
              <div style={{ flex:1, minWidth:"280px" }}>
                <h1 style={{ margin:0, fontSize:"40px", fontWeight:800, lineHeight:1.2, maxWidth:"700px" }}>
                  {campaign.title}
                </h1>
                <p style={{ marginTop:"16px", fontSize:"16px", opacity:0.8, lineHeight:1.8, maxWidth:"580px", fontWeight:400 }}>
                  Premium campaign experience designed to deliver quality, value, and trusted purchasing through the UniBrandConnect referral ecosystem.
                </p>
              </div>

              {/* Price hero badge */}
              <div style={{
                background:"rgba(255,255,255,0.10)",
                border:"1.5px solid rgba(255,255,255,0.2)",
                borderRadius:"22px", padding:"22px 28px",
                backdropFilter:"blur(10px)", textAlign:"center", flexShrink:0,
              }}>
                <p style={{ margin:"0 0 6px", fontSize:"11px", fontWeight:700, opacity:0.7, letterSpacing:"2px", textTransform:"uppercase" }}>Campaign Price</p>
                <h2 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1 }}>PKR {campaign.price?.toLocaleString()}</h2>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", marginTop:"10px" }}>
                  <span className="pulse-dot" />
                  <span style={{ fontSize:"12px", fontWeight:700, color:"#86efac" }}>Available Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PRODUCT GRID ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(340px, 1fr))", gap:"28px", alignItems:"start" }}>

          {/* Image card */}
          <div className="product-img-card">
            <div style={{ borderRadius:"20px", overflow:"hidden", position:"relative" }}>
              <img
                src={`http://localhost:5000${campaign.image}`}
                alt={campaign.title}
                style={{
                  width:"100%", height:"460px", objectFit:"cover", display:"block",
                  transition:"transform 0.5s ease",
                  transform: imgHover ? "scale(1.04)" : "scale(1)",
                }}
                onMouseEnter={() => setImgHover(true)}
                onMouseLeave={() => setImgHover(false)}
              />
              {/* Image overlay tag */}
              <div style={{
                position:"absolute", bottom:"16px", left:"16px",
                background:"rgba(15,23,42,0.75)", backdropFilter:"blur(10px)",
                padding:"8px 16px", borderRadius:"999px",
                color:"white", fontSize:"12px", fontWeight:700, letterSpacing:"0.5px",
              }}>
                {campaign.category || "General"}
              </div>
            </div>

            {/* Brand row */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"18px", padding:"0 4px" }}>
              <div style={{ width:"34px", height:"34px", borderRadius:"10px", background:"linear-gradient(135deg,#6366f1,#818cf8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>🏷️</div>
              <div>
                <p style={{ margin:0, fontSize:"11px", color:"#94a3b8", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Brand</p>
                <p style={{ margin:0, fontSize:"14px", color:"#0f172a", fontWeight:700 }}>{campaign.brandId?.name || "UniBrandConnect"}</p>
              </div>
              {/* Commission badge */}
              <div style={{
                marginLeft:"auto",
                padding:"6px 14px", borderRadius:"999px",
                background:"linear-gradient(135deg,#dcfce7,#bbf7d0)",
                border:"1px solid #86efac", color:"#166534",
                fontSize:"12px", fontWeight:800,
              }}>
                {campaign.commissionRate}% Commission
              </div>
            </div>
          </div>

          {/* Details card */}
          <div className="details-card">
            {/* Title */}
            <h2 style={{ marginTop:0, marginBottom:"6px", fontSize:"28px", fontWeight:800, color:"#0f172a", lineHeight:1.2 }}>
              {campaign.title}
            </h2>
            <p style={{ margin:"0 0 22px", fontSize:"12px", color:"#94a3b8", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>
              By {campaign.brandId?.name || "Brand"}
            </p>

            {/* Description */}
            <p style={{ color:"#475569", lineHeight:1.9, fontSize:"15px", marginBottom:"26px" }}>
              {campaign.description}
            </p>

            <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"24px" }} />

            {/* Price section */}
            <div className="price-badge">
              <p style={{ margin:"0 0 8px", color:"#64748b", fontSize:"12px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Campaign Price</p>
              <div style={{ display:"flex", alignItems:"flex-end", gap:"12px" }}>
                <h1 style={{ margin:0, color:"#4f46e5", fontSize:"46px", fontWeight:800, lineHeight:1, letterSpacing:"-1px" }}>
                  PKR {campaign.price?.toLocaleString()}
                </h1>
                <span style={{
                  marginBottom:"6px",
                  padding:"4px 12px", borderRadius:"999px",
                  background:"linear-gradient(135deg,#dcfce7,#bbf7d0)",
                  border:"1px solid #86efac", color:"#166534",
                  fontSize:"12px", fontWeight:800,
                }}>
                  {campaign.commissionRate}% commission
                </span>
              </div>
            </div>

            {/* Features */}
            <div style={{ display:"grid", gap:"12px", marginBottom:"28px" }}>
              {FEATURES.map((f, i) => (
                <div key={i} className="feature-row">
                  <div style={{
                    width:"38px", height:"38px", borderRadius:"12px", flexShrink:0,
                    background:"linear-gradient(135deg,#6366f1,#818cf8)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"17px", boxShadow:"0 4px 10px rgba(99,102,241,0.25)",
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <h4 style={{ margin:"0 0 4px", color:"#0f172a", fontSize:"14px", fontWeight:800 }}>{f.title}</h4>
                    <p style={{ margin:0, color:"#64748b", lineHeight:1.6, fontSize:"13px" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Buy button */}
            <button className="buy-btn" onClick={handlePayment} disabled={paying}>
              {paying ? (
                <>
                  <div style={{ width:"18px", height:"18px", borderRadius:"50%", border:"2.5px solid rgba(255,255,255,0.4)", borderTopColor:"white", animation:"spin 0.75s linear infinite" }} />
                  Processing Payment…
                </>
              ) : (
                <> 🛒 Buy Now — PKR {campaign.price?.toLocaleString()} </>
              )}
            </button>

            {/* Trust line */}
            <div style={{ marginTop:"16px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
              <span style={{ fontSize:"14px" }}>🔒</span>
              <p style={{ margin:0, color:"#94a3b8", fontSize:"13px", fontWeight:500 }}>
                Secure payment powered by Stripe checkout infrastructure
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicProductPage;