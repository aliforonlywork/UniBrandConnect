import { useEffect, useState } from "react";
import API from "../../services/api";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" }) : "—";

const getPerf = (earnings, clicks) => {
  if (earnings > 500)  return { label:"Top Performer", bg:"linear-gradient(135deg,#dcfce7,#bbf7d0)", border:"#86efac", color:"#166534", dot:"#22c55e" };
  if (earnings > 0)    return { label:"Performing",    bg:"linear-gradient(135deg,#dbeafe,#bfdbfe)", border:"#93c5fd", color:"#1d4ed8", dot:"#3b82f6" };
  if (clicks > 0)      return { label:"Getting Clicks",bg:"linear-gradient(135deg,#fef3c7,#fde68a)", border:"#fcd34d", color:"#92400e", dot:"#f59e0b" };
  return               { label:"Low Activity",         bg:"linear-gradient(135deg,#fee2e2,#fecaca)", border:"#fca5a5", color:"#991b1b", dot:"#ef4444" };
};

const EarningsReport = () => {
  const [referrals, setReferrals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refRes, txRes] = await Promise.all([
          API.get("/referrals/my"),
          API.get("/wallet/my-wallet") // get transactions too
        ]);
        setReferrals(refRes.data.referrals || []);
        setTransactions(txRes.data.transactions || []);
        setTransactions(txRes.data.transactions || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 const totalEarnings = transactions
   .filter(tx => tx.type === "credit")
   .reduce((t, tx) => t + (tx.commissionAmount || 0), 0);

  const totalClicks = referrals.reduce((t, r) => t + (r.clicks || 0), 0);
  const topEarner = referrals.reduce((best, r) => (r.earnings||0) > (best?.earnings||0)? r : best, null);
    // ── loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
      <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ background:"white", padding:"44px 60px", borderRadius:"28px", boxShadow:"0 10px 44px rgba(0,0,0,0.09)", textAlign:"center", border:"1.5px solid #f1f5f9" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"50%", border:"3px solid #ecfdf5", borderTopColor:"#10b981", animation:"spin 0.85s linear infinite", margin:"0 auto 18px" }} />
          <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#10b981" }}>Loading Earnings Report…</p>
          <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Crunching your referral numbers</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .earn-stat-card {
          border-radius: 26px; padding: 32px; color: white;
          position: relative; overflow: hidden;
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
        }
        .earn-stat-card:hover { transform:translateY(-7px); box-shadow:0 26px 54px rgba(0,0,0,0.20); }
        .earn-stat-card::before {
          content:''; position:absolute; right:-30px; top:-30px;
          width:120px; height:120px; border-radius:50%;
          background:rgba(255,255,255,0.08);
        }
        .earn-stat-card::after {
          content:''; position:absolute; left:-20px; bottom:-20px;
          width:80px; height:80px; border-radius:50%;
          background:rgba(255,255,255,0.05);
        }

        .table-row {
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.2s ease, background 0.15s ease;
          cursor: default;
        }
        .table-row:hover { transform:translateY(-3px); }
        .table-row:hover td { background:#fff !important; box-shadow: 0 10px 28px rgba(0,0,0,0.07); }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%;
          background:#10b981; display:inline-block;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.45); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ── HEADER BANNER — green identity for Earnings ── */}
        <div style={{
          background:"linear-gradient(135deg, #052e16 0%, #065f46 40%, #059669 75%, #10b981 100%)",
          padding:"44px 48px", borderRadius:"28px", color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(5,150,105,0.30)",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", right:"-40px", top:"-40px", width:"240px", height:"240px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", right:"80px", bottom:"-70px", width:"160px", height:"160px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", left:"40%", top:"-20px", width:"100px", height:"100px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"7px 16px", borderRadius:"999px",
              background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.18)",
              fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
              marginBottom:"18px",
            }}>
              📊 Referral Analytics
            </div>
            <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1.15 }}>Earnings Report 📊</h1>
            <p style={{ marginTop:"14px", fontSize:"16px", opacity:0.82, lineHeight:1.7, maxWidth:"560px", fontWeight:400 }}>
              Analyze campaign performance, referral clicks, and commission earnings through a detailed financial overview.
            </p>
          </div>
        </div>

        {/* ── SUMMARY CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"20px", marginBottom:"28px" }}>

          <div className="earn-stat-card" style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ fontSize:"22px", marginBottom:"14px" }}>💰</div>
              <p style={{ margin:"0 0 10px", fontSize:"12px", fontWeight:700, opacity:0.75, letterSpacing:"1.5px", textTransform:"uppercase" }}>Total Earnings</p>
              <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1, letterSpacing:"-0.5px" }}>PKR {totalEarnings.toLocaleString()}</h1>
            </div>
          </div>

          <div className="earn-stat-card" style={{ background:"linear-gradient(135deg,#0891b2,#2563eb)" }}>
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ fontSize:"22px", marginBottom:"14px" }}>🖱️</div>
              <p style={{ margin:"0 0 10px", fontSize:"12px", fontWeight:700, opacity:0.75, letterSpacing:"1.5px", textTransform:"uppercase" }}>Total Clicks</p>
              <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1 }}>{totalClicks.toLocaleString()}</h1>
            </div>
          </div>

          <div className="earn-stat-card" style={{ background:"linear-gradient(135deg,#059669,#10b981)" }}>
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ fontSize:"22px", marginBottom:"14px" }}>📣</div>
              <p style={{ margin:"0 0 10px", fontSize:"12px", fontWeight:700, opacity:0.75, letterSpacing:"1.5px", textTransform:"uppercase" }}>Campaign Referrals</p>
              <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1 }}>{referrals.length}</h1>
            </div>
          </div>

          {topEarner && (
            <div className="earn-stat-card" style={{ background:"linear-gradient(135deg,#78350f,#d97706)" }}>
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:"22px", marginBottom:"14px" }}>🏆</div>
                <p style={{ margin:"0 0 10px", fontSize:"12px", fontWeight:700, opacity:0.75, letterSpacing:"1.5px", textTransform:"uppercase" }}>Top Campaign</p>
                <h2 style={{ margin:0, fontSize:"20px", fontWeight:800, lineHeight:1.2 }}>
                  {topEarner.campaignId?.title || "—"}
                </h2>
                <p style={{ margin:"8px 0 0", opacity:0.8, fontSize:"13px" }}>PKR {(topEarner.earnings||0).toLocaleString()} earned</p>
              </div>
            </div>
          )}
        </div>

        {/* ── TABLE SECTION ── */}
        <div style={{ background:"#fff", borderRadius:"26px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 20px rgba(0,0,0,0.05)", overflowX:"auto" }}>

          {/* Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"14px", marginBottom:"24px" }}>
            <div>
              <h2 style={{ margin:"0 0 6px", fontSize:"22px", fontWeight:800, color:"#0f172a" }}>Earnings Table</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"14px", lineHeight:1.6 }}>Detailed breakdown of campaign referral activity and earnings.</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"#f0fdf4", padding:"7px 14px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Live</span>
              </div>
              <div style={{ padding:"7px 16px", borderRadius:"999px", background:"#ecfdf5", color:"#047857", fontWeight:700, fontSize:"13px", border:"1px solid #bbf7d0" }}>
                {referrals.length} Records
              </div>
            </div>
          </div>

          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"20px" }} />

          {/* Empty state */}
          {referrals.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", background:"#f8fafc", borderRadius:"20px", border:"1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize:"48px", marginBottom:"14px" }}>📊</div>
              <h3 style={{ margin:"0 0 10px", color:"#0f172a", fontSize:"20px", fontWeight:800 }}>No Earnings Data Yet</h3>
              <p style={{ color:"#64748b", lineHeight:1.8, maxWidth:"440px", margin:"0 auto", fontSize:"14px" }}>
                Your campaign referral performance and earnings will appear here once users start engaging with your referral links.
              </p>
            </div>

          ) : (
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 12px", minWidth:"680px" }}>
              {/* Head */}
              <thead>
                <tr>
                  {["Campaign", "Clicks", "Performance"].map((h) => (
                    <th key={h} style={{
                      textAlign:"left", padding:"10px 18px",
                      color:"#94a3b8", fontSize:"11px", fontWeight:700,
                      textTransform:"uppercase", letterSpacing:"1px",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {referrals.map((ref) => {
                  const perf = getPerf(ref.earnings, ref.clicks);
                  return (
                    <tr key={ref._id} className="table-row">

                      {/* Campaign */}
                      <td style={{
                        padding:"20px 18px", background:"#f8fafc",
                        borderRadius:"18px 0 0 18px",
                        borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9",
                        borderLeft:"1.5px solid #f1f5f9",
                        transition:"background 0.15s ease, box-shadow 0.2s ease",
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                          <div style={{
                            width:"40px", height:"40px", borderRadius:"12px", flexShrink:0,
                            background:"linear-gradient(135deg,#059669,#10b981)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"18px", boxShadow:"0 4px 12px rgba(5,150,105,0.25)",
                          }}>📣</div>
                          <div>
                            <h3 style={{ margin:0, color:"#0f172a", fontSize:"15px", fontWeight:800, lineHeight:1.2 }}>
                              {ref.campaignId?.title || "Unknown Campaign"}
                            </h3>
                            <p style={{ margin:"3px 0 0", color:"#94a3b8", fontSize:"12px", fontWeight:600 }}>Campaign Referral</p>
                          </div>
                        </div>
                      </td>

                      {/* Clicks */}
                      <td style={{
                        padding:"20px 18px", background:"#f8fafc",
                        borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9",
                        transition:"background 0.15s ease",
                      }}>
                        <div style={{
                          display:"inline-flex", alignItems:"center", gap:"6px",
                          padding:"7px 16px", borderRadius:"999px",
                          background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",
                          border:"1px solid #93c5fd",
                          color:"#1d4ed8", fontWeight:800, fontSize:"14px",
                        }}>
                          🖱️ {ref.clicks || 0}
                        </div>
                      </td>

                      {/* 
<td style={{
  padding:"20px 18px", background:"#f8fafc",
  borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9",
  transition:"background 0.15s ease",
}}>
  <div style={{
    display:"inline-flex", alignItems:"center", gap:"6px",
    padding:"7px 18px", borderRadius:"999px",
    background:"linear-gradient(135deg,#dcfce7,#bbf7d0)",
    border:"1px solid #86efac",
    color:"#166534", fontWeight:800, fontSize:"14px",
  }}>
    💰 PKR {(ref.earnings  || 0).toLocaleString()}
  </div>
</td>
*/}

                      {/* Performance */}
                      <td style={{
                        padding:"20px 18px", background:"#f8fafc",
                        borderRadius:"0 18px 18px 0",
                        borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9",
                        borderRight:"1.5px solid #f1f5f9",
                        transition:"background 0.15s ease",
                      }}>
                        <div style={{
                          display:"inline-flex", alignItems:"center", gap:"7px",
                          padding:"7px 16px", borderRadius:"999px",
                          background:perf.bg, border:`1.5px solid ${perf.border}`,
                          color:perf.color, fontWeight:700, fontSize:"13px",
                        }}>
                          <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:perf.dot, flexShrink:0 }} />
                          {perf.label}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default EarningsReport;