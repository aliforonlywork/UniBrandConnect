import { useEffect, useState } from "react";
import { getPlatformAnalytics } from "../../services/analyticsService";
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const STAT_CONFIG = [
  { key:"totalClicks",      label:"Total Clicks",      icon:"🖱️", light:"#eff6ff", color:"#1d4ed8", bar:"linear-gradient(90deg,#3b82f6,#60a5fa)", prefix:"" },
  { key:"totalConversions", label:"Total Conversions",  icon:"🎯", light:"#f0fdf4", color:"#166634", bar:"linear-gradient(90deg,#10b981,#34d399)", prefix:"" },
  { key:"totalRevenue",     label:"Total Revenue",      icon:"💰", light:"#fffbeb", color:"#92400e", bar:"linear-gradient(90deg,#f59e0b,#fbbf24)", prefix:"Rs " },
];

const INSIGHT_CONFIG = [
  {
    icon:"👆", title:"User Engagement",
    bg:"#eff6ff", border:"#bfdbfe", color:"#1d4ed8",
    key:"totalClicks", unit:"clicks",
    text:(v) => `Platform campaigns generated ${v} total engagement clicks from students and referral visitors.`,
  },
  {
    icon:"🎯", title:"Campaign Success",
    bg:"#f0fdf4", border:"#bbf7d0", color:"#166534",
    key:"totalConversions", unit:"conversions",
    text:(v) => `Total successful campaign conversions reached ${v} across the platform.`,
  },
  {
    icon:"💰", title:"Revenue Generated",
    bg:"#fffbeb", border:"#fde68a", color:"#92400e",
    key:"totalRevenue", unit:"",
    text:(v) => `UniBrandConnect has generated Rs ${v} total revenue through campaign referrals and purchases.`,
  },
];

// ── custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const colors = { Clicks:"#3b82f6", Conversions:"#10b981", Revenue:"#f59e0b" };
  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:"14px", padding:"14px 20px", boxShadow:"0 20px 40px rgba(0,0,0,0.12)", fontFamily:"'Sora',sans-serif" }}>
      <p style={{ margin:0, fontSize:"12px", color:"#64748b", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>{label}</p>
      <p style={{ margin:"6px 0 0", fontSize:"24px", fontWeight:800, color:colors[label]||"#2563eb" }}>
        {label === "Revenue" ? `Rs ${payload[0].value}` : payload[0].value}
      </p>
    </div>
  );
}

const PlatformAnalytics = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getPlatformAnalytics();
        setData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ width:"40px", height:"40px", border:"3px solid #dbeafe", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.85s linear infinite", marginBottom:"18px" }} />
        <p style={{ margin:0, fontWeight:700, color:"#2563eb", fontSize:"16px" }}>Loading Analytics…</p>
        <p style={{ margin:"6px 0 0", color:"#94a3b8", fontSize:"13px" }}>Fetching platform-wide data</p>
      </div>
    </>
  );

  const chartData = [
    { name:"Clicks",      value: data?.totalClicks      || 0 },
    { name:"Conversions", value: data?.totalConversions || 0 },
    { name:"Revenue",     value: data?.totalRevenue     || 0 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .stat-card {
          background:#fff; border-radius:22px; padding:24px 22px;
          border:1.5px solid #f1f5f9; box-shadow:0 4px 18px rgba(0,0,0,0.05);
          position:relative; overflow:hidden;
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          cursor:default;
        }
        .stat-card:hover { transform:translateY(-6px); box-shadow:0 18px 44px rgba(0,0,0,0.09); }
        .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; border-radius:22px 22px 0 0; }

        .insight-card {
          border-radius:20px; padding:24px;
          border:1.5px solid;
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          cursor:default;
        }
        .insight-card:hover { transform:translateY(-4px); box-shadow:0 14px 36px rgba(0,0,0,0.08); }

        .progress-track {
          width:100%; height:10px; border-radius:999px;
          background:#f1f5f9; overflow:hidden; margin-top:10px;
        }
        .progress-fill {
          height:100%; border-radius:999px;
          background-size:300% 100%;
          animation:shimmer 2.5s linear infinite;
        }
        @keyframes shimmer { 0%{background-position:100% 0;}100%{background-position:-100% 0;} }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%; background:#10b981;
          display:inline-block; animation:pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.45);} }
        @keyframes spin   { to{transform:rotate(360deg);} }

        .section-label {
          font-size:11px; font-weight:700; color:#94a3b8;
          letter-spacing:1.5px; text-transform:uppercase;
          margin-bottom:16px; display:flex; align-items:center; gap:8px;
        }
        .section-label::after { content:''; flex:1; height:1px; background:#f1f5f9; }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #0c1525 0%, #1e293b 35%, #1e3a8a 65%, #2563eb 100%)",
          padding:"44px 48px", borderRadius:"28px", color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(37,99,235,0.28)",
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
              <span className="pulse-dot" /> Admin Analytics
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Platform Analytics 📊</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Monitor overall platform engagement, campaign performance, conversions, and revenue generated across UniBrandConnect.
            </p>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <p className="section-label">📈 Key Metrics</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:"18px", marginBottom:"28px" }}>
          {STAT_CONFIG.map((s, i) => (
            <div key={s.key} className="stat-card">
              <style>{`.stat-card:nth-child(${i+1})::before { background:${s.bar}; }`}</style>
              <div style={{ width:"44px", height:"44px", borderRadius:"13px", background:s.light, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", marginBottom:"14px" }}>{s.icon}</div>
              <p style={{ margin:"0 0 6px", fontSize:"11px", fontWeight:700, color:"#94a3b8", letterSpacing:"1px", textTransform:"uppercase" }}>{s.label}</p>
              <h2 style={{ margin:0, fontSize:"34px", fontWeight:800, color:"#0f172a", lineHeight:1, letterSpacing:"-0.5px" }}>
                {s.prefix}{(data?.[s.key] || 0).toLocaleString()}
              </h2>
              {/* Mini progress bar */}
              <div className="progress-track">
                <div className="progress-fill" style={{ width:`${Math.min(((data?.[s.key]||0)/Math.max(...STAT_CONFIG.map(x=>data?.[x.key]||0),1))*100,100)}%`, background:s.bar, backgroundSize:"300% 100%" }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── CHART ── */}
        <div style={{ background:"#fff", borderRadius:"26px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 22px rgba(0,0,0,0.05)", marginBottom:"24px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"22px" }}>
            <div>
              <h2 style={{ margin:"0 0 6px", fontSize:"22px", fontWeight:800, color:"#0f172a" }}>Analytics Overview</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>Clicks, conversions, and revenue at a glance.</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"#f0fdf4", padding:"8px 16px", borderRadius:"100px", border:"1px solid #bbf7d0" }}>
              <span className="pulse-dot" />
              <span style={{ fontSize:"13px", fontWeight:700, color:"#16a34a" }}>Live Data</span>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"22px" }}>
            {chartData.map((d, i) => {
              const colors = ["#3b82f6","#10b981","#f59e0b"];
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <div style={{ width:"10px", height:"10px", borderRadius:"3px", background:colors[i] }} />
                  <span style={{ fontSize:"12px", color:"#64748b", fontWeight:500 }}>{d.name}</span>
                </div>
              );
            })}
          </div>

          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false}
                tick={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:600, fill:"#64748b" }}
              />
              <YAxis
                stroke="#94a3b8" axisLine={false} tickLine={false}
                tick={{ fontFamily:"'Sora',sans-serif", fontSize:12, fill:"#94a3b8" }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(37,99,235,0.05)", radius:8 }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[10,10,0,0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── INSIGHTS ── */}
        <p className="section-label">💡 Platform Insights</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))", gap:"16px" }}>
          {INSIGHT_CONFIG.map((ins, i) => (
            <div key={i} className="insight-card" style={{ background:ins.bg, borderColor:ins.border }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
                <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:"rgba(255,255,255,0.6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>
                  {ins.icon}
                </div>
                <h3 style={{ margin:0, fontSize:"15px", fontWeight:800, color:"#0f172a" }}>{ins.title}</h3>
              </div>
              <p style={{ margin:0, color:"#475569", lineHeight:1.8, fontSize:"14px" }}>
                {ins.text((data?.[ins.key]||0).toLocaleString())}
              </p>
              <div style={{ marginTop:"14px", fontSize:"24px", fontWeight:800, color:ins.color }}>
                {ins.key === "totalRevenue" ? `Rs ${(data?.[ins.key]||0).toLocaleString()}` : (data?.[ins.key]||0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlatformAnalytics;