import { useEffect, useState } from "react";
import API from "../../services/api";

const getPerf = (clicks, conversions, revenue) => {
  const rate = Math.min(clicks > 100 ? 100 : clicks || 0, 100);
  if (revenue > 500 || conversions > 10) return { label:"Top Performer", bg:"linear-gradient(135deg,#dcfce7,#bbf7d0)", border:"#86efac", color:"#166534", dot:"#22c55e", barBg:"linear-gradient(90deg,#10b981,#34d399)" };
  if (conversions > 0)                   return { label:"Converting",    bg:"linear-gradient(135deg,#dbeafe,#bfdbfe)", border:"#93c5fd", color:"#1d4ed8", dot:"#3b82f6", barBg:"linear-gradient(90deg,#6366f1,#818cf8)" };
  if (clicks > 0)                        return { label:"Getting Clicks", bg:"linear-gradient(135deg,#fef3c7,#fde68a)", border:"#fcd34d", color:"#92400e", dot:"#f59e0b", barBg:"linear-gradient(90deg,#f59e0b,#fbbf24)" };
  return                                        { label:"Low Activity",   bg:"linear-gradient(135deg,#fee2e2,#fecaca)", border:"#fca5a5", color:"#991b1b", dot:"#ef4444", barBg:"linear-gradient(90deg,#ef4444,#f87171)" };
};

const CampaignPerformance = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await API.get("/campaigns/performance");
        setCampaigns(res.data.performance || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  const totalRevenue     = campaigns.reduce((a, i) => a + (i.revenue     || 0), 0);
  const totalClicks      = campaigns.reduce((a, i) => a + (i.clicks      || 0), 0);
  const totalConversions = campaigns.reduce((a, i) => a + (i.conversions || 0), 0);

  const SUMMARY_CARDS = [
    { label:"Total Revenue",     value:`Rs ${totalRevenue.toLocaleString()}`, icon:"💰", light:"#fffbeb", color:"#92400e", bar:"linear-gradient(90deg,#f59e0b,#fbbf24)" },
    { label:"Total Clicks",      value:totalClicks.toLocaleString(),          icon:"🖱️", light:"#eff6ff", color:"#1d4ed8", bar:"linear-gradient(90deg,#3b82f6,#60a5fa)" },
    { label:"Total Conversions", value:totalConversions.toLocaleString(),     icon:"✅", light:"#f0fdf4", color:"#166534", bar:"linear-gradient(90deg,#10b981,#34d399)" },
  ];

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
      <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ background:"white", padding:"44px 60px", borderRadius:"28px", boxShadow:"0 10px 44px rgba(0,0,0,0.09)", textAlign:"center", border:"1.5px solid #f1f5f9" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"50%", border:"3px solid #eef2ff", borderTopColor:"#6366f1", animation:"spin 0.85s linear infinite", margin:"0 auto 18px" }} />
          <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#6366f1" }}>Loading Performance…</p>
          <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Preparing campaign analytics</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .perf-stat-card {
          background:#fff; border-radius:22px; padding:26px 24px;
          border:1.5px solid #f1f5f9; box-shadow:0 4px 18px rgba(0,0,0,0.05);
          position:relative; overflow:hidden;
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
        }
        .perf-stat-card:hover { transform:translateY(-6px); box-shadow:0 18px 44px rgba(0,0,0,0.09); }
        .perf-stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; border-radius:22px 22px 0 0; }

        .campaign-card {
          background:#fff; border-radius:24px; padding:26px;
          border:1.5px solid #f1f5f9; box-shadow:0 4px 18px rgba(0,0,0,0.05);
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.2s ease;
          display:flex; flex-direction:column;
        }
        .campaign-card:hover { transform:translateY(-6px); box-shadow:0 20px 46px rgba(0,0,0,0.09); border-color:#c7d2fe; }

        .progress-bar-track {
          width:100%; height:10px; border-radius:999px;
          background:#f1f5f9; overflow:hidden;
        }
        .progress-bar-fill {
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
        @keyframes spin   { to{transform:rotate(360deg);} }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
          padding:"44px 48px", borderRadius:"28px", color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(99,102,241,0.30)",
          position:"relative", overflow:"hidden",
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"24px",
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
              <span className="pulse-dot" /> Brand Insights
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Campaign Performance 📈</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Track campaign growth, monitor conversions, analyze engagement, and optimize brand performance through real-time analytics.
            </p>
          </div>
          {/* Live Analytics status card */}
          <div style={{
            background:"rgba(255,255,255,0.10)", border:"1.5px solid rgba(255,255,255,0.18)",
            padding:"22px 28px", borderRadius:"20px", backdropFilter:"blur(10px)",
            position:"relative", zIndex:1, minWidth:"200px",
          }}>
            <p style={{ margin:"0 0 6px", fontSize:"11px", color:"#a5b4fc", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>Brand Insights</p>
            <h2 style={{ margin:"0 0 10px", fontSize:"20px", fontWeight:800 }}>Live Analytics 📈</h2>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"rgba(16,185,129,0.15)", borderRadius:"999px", padding:"5px 12px", width:"fit-content" }}>
              <span className="pulse-dot" />
              <span style={{ fontSize:"11px", fontWeight:700, color:"#86efac" }}>{campaigns.length} Campaign{campaigns.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* ── SUMMARY STATS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(210px, 1fr))", gap:"18px", marginBottom:"28px" }}>
          {SUMMARY_CARDS.map((s, i) => (
            <div key={i} className="perf-stat-card">
              <style>{`.perf-stat-card:nth-child(${i+1})::before { background:${s.bar}; }`}</style>
              <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:s.light, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", marginBottom:"14px" }}>{s.icon}</div>
              <p style={{ margin:"0 0 6px", fontSize:"11px", fontWeight:700, color:"#94a3b8", letterSpacing:"1px", textTransform:"uppercase" }}>{s.label}</p>
              <h2 style={{ margin:0, fontSize:"32px", fontWeight:800, color:"#0f172a", lineHeight:1 }}>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* ── EMPTY STATE ── */}
        {campaigns.length === 0 ? (
          <div style={{ background:"white", padding:"70px 30px", borderRadius:"24px", textAlign:"center", border:"1.5px dashed #e2e8f0", boxShadow:"0 4px 18px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:"52px", marginBottom:"16px" }}>📈</div>
            <h2 style={{ color:"#0f172a", margin:"0 0 10px", fontSize:"22px", fontWeight:800 }}>No Performance Data Yet</h2>
            <p style={{ color:"#64748b", maxWidth:"420px", margin:"0 auto", fontSize:"15px", lineHeight:1.7 }}>
              Your campaign analytics will appear here once users begin interacting with your campaigns.
            </p>
          </div>

        ) : (
          <>
            {/* Section header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"18px", flexWrap:"wrap", gap:"10px" }}>
              <h3 style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#0f172a" }}>
                Campaign Breakdown
                <span style={{ marginLeft:"10px", fontSize:"14px", fontWeight:600, color:"#94a3b8" }}>({campaigns.length})</span>
              </h3>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"#f0fdf4", padding:"7px 14px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Live</span>
              </div>
            </div>

            {/* ── GRID ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:"20px" }}>
              {campaigns.map((item) => {
                const clicks      = item.clicks      || 0;
                const conversions = item.conversions || 0;
                const revenue     = item.revenue     || 0;
                const engRate     = Math.min(clicks > 100 ? 100 : clicks, 100);
                const perf        = getPerf(clicks, conversions, revenue);

                return (
                  <div key={item._id} className="campaign-card">

                    {/* Colored top bar */}
                    <div style={{ height:"4px", background:perf.barBg, borderRadius:"22px 22px 0 0", margin:"-26px -26px 22px" }} />

                    {/* Top row */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
                      <div style={{
                        display:"inline-flex", alignItems:"center", gap:"7px",
                        padding:"6px 14px", borderRadius:"999px",
                        background:perf.bg, border:`1.5px solid ${perf.border}`,
                        color:perf.color, fontSize:"12px", fontWeight:700,
                      }}>
                        <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:perf.dot }} />
                        {perf.label}
                      </div>
                      <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 0 3px rgba(34,197,94,0.18)" }} />
                    </div>

                    {/* Title */}
                    <h2 style={{ margin:"0 0 16px", fontSize:"18px", fontWeight:800, color:"#0f172a", lineHeight:1.3 }}>
                      {item.campaignTitle}
                    </h2>

                    {/* Metrics */}
                    <div style={{ background:"#f8fafc", borderRadius:"16px", padding:"14px 16px", marginBottom:"18px", border:"1px solid #f1f5f9" }}>
                      {[
                        { label:"Revenue",     value:`Rs ${revenue.toLocaleString()}`,   icon:"💰" },
                        { label:"Conversions", value:conversions.toLocaleString(),        icon:"✅" },
                        { label:"Clicks",      value:clicks.toLocaleString(),             icon:"🖱️" },
                      ].map((m, i, arr) => (
                        <div key={m.label}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0" }}>
                            <span style={{ color:"#94a3b8", fontSize:"12px", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:"6px" }}>
                              <span>{m.icon}</span>{m.label}
                            </span>
                            <span style={{ color:"#0f172a", fontSize:"15px", fontWeight:800 }}>{m.value}</span>
                          </div>
                          {i < arr.length - 1 && <div style={{ height:"1px", background:"#f1f5f9" }} />}
                        </div>
                      ))}
                    </div>

                    {/* Engagement rate progress */}
                    <div style={{ marginTop:"auto" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
                        <span style={{ color:"#64748b", fontSize:"12px", fontWeight:600 }}>Engagement Rate</span>
                        <span style={{ color:perf.color, fontWeight:800, fontSize:"13px" }}>{engRate}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width:`${engRate}%`,
                            background:perf.barBg,
                            backgroundSize:"300% 100%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CampaignPerformance;