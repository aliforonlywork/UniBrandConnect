import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

const CampaignAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  const { campaignId  } = useParams();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
         if (!campaignId) return; 
        const res = await API.get(`/analytics/campaign/${campaignId}?t=${Date.now()}`);
        setAnalytics(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAnalytics();
  }, [campaignId]);

  if (!analytics) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
      <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ background:"white", padding:"44px 60px", borderRadius:"28px", boxShadow:"0 10px 44px rgba(0,0,0,0.09)", textAlign:"center", border:"1.5px solid #f1f5f9" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"50%", border:"3px solid #eef2ff", borderTopColor:"#6366f1", animation:"spin 0.85s linear infinite", margin:"0 auto 18px" }} />
          <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#6366f1" }}>Loading Analytics…</p>
          <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Preparing your campaign insights</p>
        </div>
      </div>
    </>
  );

    const PROGRESS_BARS = [
  {
    label: "Engagement Rate",
    pct: analytics.engagementRate || 0,
    bar:"linear-gradient(90deg,#3b82f6,#6366f1)",
    track:"#dbeafe",
    color:"#1d4ed8"
  },
  {
    label: "Conversion Efficiency",
    pct: analytics.conversionRate || 0,
    bar:"linear-gradient(90deg,#10b981,#059669)",
    track:"#d1fae5",
    color:"#065f46"
  },
  {
    label: "Revenue Performance",
    pct: analytics.revenuePerformance || 0,
    bar:"linear-gradient(90deg,#f59e0b,#d97706)",
    track:"#fef3c7",
    color:"#92400e"
  },
];

  const analyticsCards = [
    { title:"Total Clicks",      value: analytics.totalClicks      || 0,                          icon:"👆", color:"#1d4ed8", bg:"linear-gradient(135deg,#dbeafe,#eff6ff)", bar:"linear-gradient(90deg,#3b82f6,#6366f1)",  light:"#eff6ff" },
    { title:"Total Conversions", value: analytics.totalConversions || 0,                          icon:"🎯", color:"#166534", bg:"linear-gradient(135deg,#d1fae5,#ecfdf5)", bar:"linear-gradient(90deg,#10b981,#34d399)",  light:"#f0fdf4" },
    { title:"Total Revenue",     value:`Rs ${(analytics.totalRevenue     || 0).toLocaleString()}`,icon:"💰", color:"#92400e", bg:"linear-gradient(135deg,#fef3c7,#fffbeb)", bar:"linear-gradient(90deg,#f59e0b,#fbbf24)",  light:"#fffbeb" },
    { title:"Commission Paid",   value:`Rs ${(analytics.totalCommission  || 0).toLocaleString()}`,icon:"🏆", color:"#6d28d9", bg:"linear-gradient(135deg,#ede9fe,#f5f3ff)", bar:"linear-gradient(90deg,#8b5cf6,#a78bfa)",  light:"#f5f3ff" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .analytics-card {
          border-radius:22px; padding:26px;
          border:1.5px solid transparent;
          box-shadow:0 4px 18px rgba(0,0,0,0.05);
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.2s ease;
          cursor:default; position:relative; overflow:hidden;
        }
        .analytics-card:hover { transform:translateY(-6px); box-shadow:0 20px 46px rgba(0,0,0,0.10); }
        .analytics-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; border-radius:22px 22px 0 0; }

        .progress-track {
          width:100%; height:12px; border-radius:999px; overflow:hidden; margin-bottom:4px;
        }
        .progress-fill {
          height:100%; border-radius:999px;
          background-size:300% 100%;
          animation:shimmer 2.5s linear infinite;
          transition:width 0.8s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes shimmer { 0%{background-position:100% 0;}100%{background-position:-100% 0;} }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%; background:#10b981;
          display:inline-block; animation:pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.45);} }

        .section-label {
          font-size:11px; font-weight:700; color:#94a3b8;
          letter-spacing:1.5px; text-transform:uppercase;
          margin-bottom:20px; display:flex; align-items:center; gap:8px;
        }
        .section-label::after { content:''; flex:1; height:1px; background:#f1f5f9; }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
          padding:"44px 48px", borderRadius:"28px", color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(99,102,241,0.30)",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", right:"-40px", top:"-40px", width:"240px", height:"240px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", right:"80px", bottom:"-70px", width:"160px", height:"160px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"7px 16px", borderRadius:"999px",
              background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.18)",
              fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
              marginBottom:"18px",
            }}>
              <span className="pulse-dot" /> Real-Time Analytics
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Campaign Analytics 📊</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Track campaign growth, conversions, engagement, and revenue performance in real time.
            </p>
          </div>
        </div>

        {/* ── OVERVIEW CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:"18px", marginBottom:"28px" }}>
          {analyticsCards.map((item, i) => (
            <div
              key={i}
              className="analytics-card"
              style={{ background:item.bg }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = item.color + "44"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
            >
              <style>{`.analytics-card:nth-child(${i+1})::before { background:${item.bar}; }`}</style>

              {/* Icon + live dot */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:"rgba(255,255,255,0.7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                  {item.icon}
                </div>
                <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:item.color, boxShadow:`0 0 0 3px ${item.color}22` }} />
              </div>

              <h2 style={{ margin:"0 0 6px", fontSize:"32px", fontWeight:800, color:"#0f172a", lineHeight:1, letterSpacing:"-0.5px" }}>
                {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
              </h2>
              <p style={{ margin:0, color:item.color, fontSize:"12px", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>{item.title}</p>
            </div>
          ))}
        </div>

        {/* ── PERFORMANCE SUMMARY ── */}
        <div style={{ background:"#fff", borderRadius:"28px", padding:"36px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 22px rgba(0,0,0,0.05)" }}>

          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:"14px", marginBottom:"24px" }}>
            <div>
              <h2 style={{ margin:"0 0 8px", fontSize:"22px", fontWeight:800, color:"#0f172a" }}>Performance Summary</h2>
              <p style={{ margin:0, color:"#64748b", lineHeight:1.8, fontSize:"14px", maxWidth:"620px" }}>
                Your campaigns are generating engagement and attracting student participation across the platform. Monitor conversion trends and optimize campaigns to maximize brand visibility and revenue growth.
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"#f0fdf4", padding:"8px 16px", borderRadius:"999px", border:"1px solid #bbf7d0", flexShrink:0 }}>
              <span className="pulse-dot" />
              <span style={{ fontSize:"13px", fontWeight:700, color:"#16a34a" }}>Live</span>
            </div>
          </div>

          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"28px" }} />

          <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
            {PROGRESS_BARS.map((p, i) => (
              <div key={i}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:p.color, flexShrink:0 }} />
                    <span style={{ color:"#374151", fontWeight:700, fontSize:"14px" }}>{p.label}</span>
                  </div>
                  <span style={{ color:p.color, fontWeight:800, fontSize:"14px" }}>{p.pct}%</span>
                </div>
                <div className="progress-track" style={{ background:p.track }}>
                  <div
                    className="progress-fill"
                    style={{ width:`${p.pct}%`, background:p.bar, backgroundSize:"300% 100%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary chips */}
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginTop:"28px" }}>
            {analyticsCards.map((c, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:"8px",
                padding:"9px 16px", borderRadius:"999px",
                background:c.light, border:`1.5px solid ${c.color}33`,
                color:c.color, fontSize:"13px", fontWeight:700,
              }}>
                <span>{c.icon}</span>
                <span>{c.title}: {typeof c.value === "number" ? c.value.toLocaleString() : c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignAnalytics;