import { useEffect, useState } from "react";
import API from "../../services/api";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" });

const MyReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [copiedId,  setCopiedId]  = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [refRes, walletRes] = await Promise.all([
        API.get("/referrals/my"),
        API.get("/wallet/my-wallet") // ← ADD THIS
      ]);
      setReferrals(refRes.data.referrals || []);
      setTransactions(walletRes.data.transactions || []); // ← ADD THIS
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  const totalClicks   = referrals.reduce((t, r) => t + (r.clicks   || 0), 0);
  const totalEarnings = transactions
  .filter(tx => tx.type === "credit")
  .reduce((t, tx) => t + (tx.commissionAmount || 0), 0);

  const handleCopy = (id, link) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
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
          <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#6366f1" }}>Loading Referrals…</p>
          <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Fetching your referral activity</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .ref-stat-card {
          border-radius: 26px; padding: 30px; color: white;
          position: relative; overflow: hidden;
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
        }
        .ref-stat-card:hover { transform:translateY(-7px); box-shadow:0 26px 54px rgba(0,0,0,0.20); }
        .ref-stat-card::before {
          content:''; position:absolute; right:-30px; top:-30px;
          width:120px; height:120px; border-radius:50%; background:rgba(255,255,255,0.08);
        }
        .ref-stat-card::after {
          content:''; position:absolute; left:-20px; bottom:-20px;
          width:80px; height:80px; border-radius:50%; background:rgba(255,255,255,0.05);
        }

        .table-row { transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease; cursor:default; }
        .table-row:hover { transform:translateY(-3px); }
        .table-row:hover td { background:#fff !important; box-shadow:0 10px 28px rgba(0,0,0,0.07); }

        .copy-btn {
          padding: 11px 18px; border:none; border-radius:14px;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          color:white; font-weight:800; font-size:13px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 6px 18px rgba(79,70,229,0.28);
          transition: transform 0.18s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.18s ease, filter 0.18s ease;
          display:flex; align-items:center; gap:6px; white-space:nowrap;
        }
        .copy-btn:hover  { transform:translateY(-2px); box-shadow:0 10px 24px rgba(79,70,229,0.38); filter:brightness(1.08); }
        .copy-btn:active { transform:scale(0.95); filter:brightness(0.94); }
        .copy-btn.copied { background:linear-gradient(135deg,#10b981,#059669); box-shadow:0 6px 18px rgba(16,185,129,0.30); }

        .ref-link-input {
          width:100%; min-width:220px;
          padding:11px 14px; border-radius:12px;
          border:1.5px solid #c7d2fe; background:white;
          outline:none; font-size:13px; font-family:'Sora',sans-serif;
          font-weight:500; color:#374151;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .ref-link-input:focus { border-color:#818cf8; box-shadow:0 0 0 3px rgba(129,140,248,0.15); }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%;
          background:#10b981; display:inline-block;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.45);} }
        @keyframes spin  { to{transform:rotate(360deg);} }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #7c3aed 100%)",
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
            }}>🔗 Referral Management</div>
            <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1.15 }}>My Referrals 🔗</h1>
            <p style={{ marginTop:"14px", fontSize:"16px", opacity:0.82, lineHeight:1.7, maxWidth:"560px", fontWeight:400 }}>
              Monitor referral performance, manage campaign links, and track clicks and earnings from your promotional activities.
            </p>
          </div>
        </div>

        {/* ── SUMMARY CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"20px", marginBottom:"28px" }}>
          {[
            { title:"Total Referrals",  value:referrals.length,                   icon:"🔗", bg:"linear-gradient(135deg,#4f46e5,#7c3aed)" },
            { title:"Total Clicks",     value:totalClicks.toLocaleString(),        icon:"🖱️", bg:"linear-gradient(135deg,#0891b2,#2563eb)" },
            { title:"Total Earnings",   value:`PKR ${totalEarnings.toLocaleString()}`, icon:"💰", bg:"linear-gradient(135deg,#059669,#10b981)" },
          ].map((card) => (
            <div key={card.title} className="ref-stat-card" style={{ background:card.bg }}>
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:"22px", marginBottom:"14px" }}>{card.icon}</div>
                <p style={{ margin:"0 0 10px", fontSize:"12px", fontWeight:700, opacity:0.75, letterSpacing:"1.5px", textTransform:"uppercase" }}>{card.title}</p>
                <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1, letterSpacing:"-0.5px" }}>{card.value}</h1>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLE SECTION ── */}
        <div style={{ background:"#fff", borderRadius:"26px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 20px rgba(0,0,0,0.05)", overflowX:"auto" }}>

          {/* Section header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"14px", marginBottom:"22px" }}>
            <div>
              <h2 style={{ margin:"0 0 6px", fontSize:"22px", fontWeight:800, color:"#0f172a" }}>Referral Records</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"14px", lineHeight:1.6 }}>Complete overview of all generated referral links and campaign engagement.</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"#f0fdf4", padding:"7px 14px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Live</span>
              </div>
              <div style={{ padding:"7px 16px", borderRadius:"999px", background:"#eef2ff", color:"#4338ca", fontWeight:700, fontSize:"13px", border:"1px solid #c7d2fe" }}>
                {referrals.length} Records
              </div>
            </div>
          </div>

          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"20px" }} />

          {/* Empty state */}
          {referrals.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", background:"#f8fafc", borderRadius:"20px", border:"1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize:"48px", marginBottom:"14px" }}>🔗</div>
              <h3 style={{ margin:"0 0 10px", color:"#0f172a", fontSize:"20px", fontWeight:800 }}>No Referrals Yet</h3>
              <p style={{ color:"#64748b", lineHeight:1.8, maxWidth:"420px", margin:"0 auto", fontSize:"14px" }}>
                Your referral links and campaign activity will appear here once you start promoting campaigns.
              </p>
            </div>

          ) : (
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 12px", minWidth:"950px" }}>
              <thead>
                <tr>
                  {["Campaign","Referral Link","Clicks","Created","Action"].map((h) => (
                    <th key={h} style={{ textAlign:"left", padding:"10px 18px", color:"#94a3b8", fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {referrals.map((ref) => {
                  const link    = `http://127.0.0.1:5173/ref/${ref.referralCode}`;
                  const isCopied = copiedId === ref._id;

                  const cellBase = {
                    padding:"18px", background:"#f8fafc",
                    borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9",
                    transition:"background 0.15s ease",
                  };

                  return (
                    <tr key={ref._id} className="table-row">

                      {/* Campaign */}
                      <td style={{ ...cellBase, borderLeft:"1.5px solid #f1f5f9", borderRadius:"18px 0 0 18px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                          <div style={{
                            width:"38px", height:"38px", borderRadius:"12px", flexShrink:0,
                            background:"linear-gradient(135deg,#6366f1,#818cf8)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"16px", boxShadow:"0 4px 10px rgba(99,102,241,0.25)",
                          }}>📣</div>
                          <div>
                            <h3 style={{ margin:0, color:"#0f172a", fontSize:"14px", fontWeight:800, lineHeight:1.2 }}>
                              {ref.campaignId?.title || "Campaign"}
                            </h3>
                            <p style={{ margin:"3px 0 0", color:"#94a3b8", fontSize:"11px", fontWeight:600 }}>Active Referral</p>
                          </div>
                        </div>
                      </td>

                      {/* Link input */}
                      <td style={cellBase}>
                        <input type="text" value={link} readOnly className="ref-link-input" />
                      </td>

                      {/* Clicks */}
                      <td style={cellBase}>
                        <div style={{
                          display:"inline-flex", alignItems:"center", gap:"6px",
                          padding:"7px 16px", borderRadius:"999px",
                          background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",
                          border:"1px solid #93c5fd",
                          color:"#1d4ed8", fontWeight:800, fontSize:"13px",
                        }}>
                          🖱️ {ref.clicks || 0}
                        </div>
                      </td>

                      
{/* 
<td style={cellBase}>
  <div style={{
    display:"inline-flex", alignItems:"center", gap:"6px",
    padding:"7px 16px", borderRadius:"999px",
    background:"linear-gradient(135deg,#dcfce7,#bbf7d0)",
    border:"1px solid #86efac",
    color:"#166534", fontWeight:800, fontSize:"13px",
  }}>
    💰 PKR {(ref.earnings || 0).toLocaleString()}
  </div>
</td>
*/}

                      {/* Date */}
                      <td style={cellBase}>
                        <div>
                          <p style={{ margin:0, color:"#0f172a", fontSize:"13px", fontWeight:700 }}>{formatDate(ref.createdAt)}</p>
                          <p style={{ margin:"2px 0 0", color:"#94a3b8", fontSize:"11px" }}>
                            {new Date(ref.createdAt).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                          </p>
                        </div>
                      </td>

                      {/* Action */}
                      <td style={{ ...cellBase, borderRight:"1.5px solid #f1f5f9", borderRadius:"0 18px 18px 0" }}>
                        <button
                          className={`copy-btn${isCopied ? " copied" : ""}`}
                          onClick={() => handleCopy(ref._id, link)}
                        >
                          {isCopied ? "✓ Copied!" : "📋 Copy"}
                        </button>
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

export default MyReferrals;