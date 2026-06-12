import { useEffect, useState } from "react";
import API from "../../services/api";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" });
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });

const TX_TYPE = {
  credit:  { bg:"linear-gradient(135deg,#dcfce7,#bbf7d0)", border:"#86efac", color:"#166534", icon:"↑", label:"Credit"  },
  debit:   { bg:"linear-gradient(135deg,#fee2e2,#fecaca)", border:"#fca5a5", color:"#991b1b", icon:"↓", label:"Debit"   },
  pending: { bg:"linear-gradient(135deg,#fef3c7,#fde68a)", border:"#fcd34d", color:"#92400e", icon:"⏳",label:"Pending" },
};
const getTxStyle = (type="credit") => TX_TYPE[type.toLowerCase()] || TX_TYPE.credit;

const Wallet = () => {
  const [balance,      setBalance]      = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await API.get("/wallet/my-wallet");
        setBalance(res.data.balance || 0);
        setTransactions(res.data.transactions || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  // ── derived stats ────────────────────────────────────────────────────────
const totalEarned = transactions
  .filter(tx => (tx.type || "credit").toLowerCase() === "credit")
  .reduce((sum, tx) => sum + (tx.commissionAmount || 0), 0);

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
          <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#6366f1" }}>Loading Wallet…</p>
          <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Fetching your balance & transactions</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .wallet-balance-card {
          background: linear-gradient(135deg,#1e1b4b 0%,#312e81 45%,#4f46e5 80%,#7c3aed 100%);
          border-radius: 26px; padding: 36px; color: white;
          position: relative; overflow: hidden;
          box-shadow: 0 20px 50px rgba(79,70,229,0.32);
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
        }
        .wallet-balance-card:hover { transform:translateY(-6px); box-shadow:0 28px 60px rgba(79,70,229,0.40); }

        .summary-card {
          background: #fff;
          border-radius: 26px; padding: 30px;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          position: relative; overflow: hidden;
        }
        .summary-card:hover { transform:translateY(-5px); box-shadow:0 18px 42px rgba(0,0,0,0.09); }
        .summary-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:4px;
          border-radius:26px 26px 0 0;
        }

        .tx-row {
          background: #f8fafc;
          border-radius: 20px; padding: 22px 24px;
          border: 1.5px solid #f1f5f9;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 16px;
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.2s ease, border-color 0.18s ease;
        }
        .tx-row:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.07);
          border-color: #c7d2fe;
          background: #fff;
        }

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

        {/* ── HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #1e1b4b 75%, #312e81 100%)",
          padding:"44px 48px", borderRadius:"28px", color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(15,23,42,0.30)",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", right:"-40px", top:"-40px", width:"240px", height:"240px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", right:"80px", bottom:"-70px", width:"160px", height:"160px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", left:"50%", top:"-30px", width:"120px", height:"120px", background:"rgba(99,102,241,0.12)", borderRadius:"50%" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"7px 16px", borderRadius:"999px",
              background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.18)",
              fontSize:"12px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
              marginBottom:"18px",
            }}>
              💳 Earnings & Transactions
            </div>
            <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1.15 }}>My Wallet 💳</h1>
            <p style={{ marginTop:"14px", fontSize:"16px", opacity:0.8, lineHeight:1.7, maxWidth:"560px", fontWeight:400 }}>
              Track your referral earnings, monitor transaction history, and manage your campaign commissions in one place.
            </p>
          </div>
        </div>

        {/* ── WALLET CARDS ROW ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"20px", marginBottom:"28px" }}>

          {/* Balance card */}
          <div className="wallet-balance-card">
            <div style={{ position:"absolute", right:"-30px", top:"-30px", width:"130px", height:"130px", borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
            <div style={{ position:"absolute", left:"-20px", bottom:"-20px", width:"90px", height:"90px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
                <div style={{ width:"46px", height:"46px", borderRadius:"14px", background:"rgba(255,255,255,0.14)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>💳</div>
                <div>
                  <p style={{ margin:0, fontSize:"11px", fontWeight:700, opacity:0.7, letterSpacing:"2px", textTransform:"uppercase" }}>Available Balance</p>
                </div>
              </div>
              <h1 style={{ margin:"0 0 6px", fontSize:"46px", fontWeight:800, lineHeight:1, letterSpacing:"-1px" }}>
                PKR {balance.toLocaleString()}
              </h1>
              <p style={{ margin:"14px 0 0", opacity:0.8, fontSize:"14px", lineHeight:1.7 }}>
                Current earnings from successful campaign referrals and conversions.
              </p>
            </div>
          </div>

          {/* Total transactions */}
          <div className="summary-card" style={{ "--accent":"#6366f1" }}>
            <style>{`.summary-card:nth-child(2)::before { background:linear-gradient(90deg,#6366f1,#818cf8); }`}</style>
            <div style={{ width:"46px", height:"46px", borderRadius:"14px", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", marginBottom:"16px" }}>🧾</div>
            <p style={{ margin:"0 0 6px", fontSize:"11px", fontWeight:700, color:"#94a3b8", letterSpacing:"1px", textTransform:"uppercase" }}>Total Transactions</p>
            <h2 style={{ margin:"0 0 10px", fontSize:"40px", fontWeight:800, color:"#0f172a", lineHeight:1 }}>{transactions.length}</h2>
            <p style={{ margin:0, color:"#64748b", fontSize:"13px", lineHeight:1.7 }}>Complete overview of all wallet earnings and payment activities.</p>
          </div>

          {/* Total earned */}
          <div className="summary-card">
            <div style={{ width:"46px", height:"46px", borderRadius:"14px", background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", marginBottom:"16px" }}>💰</div>
            <p style={{ margin:"0 0 6px", fontSize:"11px", fontWeight:700, color:"#94a3b8", letterSpacing:"1px", textTransform:"uppercase" }}>Total Earned</p>
            <h2 style={{ margin:"0 0 10px", fontSize:"40px", fontWeight:800, color:"#0f172a", lineHeight:1 }}>PKR {totalEarned.toLocaleString()}</h2>
            <p style={{ margin:0, color:"#64748b", fontSize:"13px", lineHeight:1.7 }}>Cumulative earnings from all credited transactions.</p>
          </div>
        </div>

        {/* ── TRANSACTIONS ── */}
        <div style={{ background:"#fff", borderRadius:"26px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>

          {/* Section header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"14px", marginBottom:"26px" }}>
            <div>
              <h2 style={{ margin:"0 0 6px", fontSize:"22px", fontWeight:800, color:"#0f172a" }}>Transaction History</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"14px", lineHeight:1.6 }}>Review all your earnings, commissions, and payment activities.</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"#f0fdf4", padding:"7px 14px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Live</span>
              </div>
              <div style={{ padding:"7px 16px", borderRadius:"999px", background:"#eef2ff", color:"#4338ca", fontWeight:700, fontSize:"13px", border:"1px solid #c7d2fe" }}>
                {transactions.length} Records
              </div>
            </div>
          </div>

          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"22px" }} />

          {/* Empty state */}
          {transactions.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", background:"#f8fafc", borderRadius:"20px", border:"1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize:"48px", marginBottom:"14px" }}>🧾</div>
              <h3 style={{ margin:"0 0 10px", color:"#0f172a", fontSize:"20px", fontWeight:800 }}>No Transactions Yet</h3>
              <p style={{ color:"#64748b", lineHeight:1.8, maxWidth:"420px", margin:"0 auto", fontSize:"14px" }}>
                Your earnings and transaction activities will appear here once campaign referrals generate revenue.
              </p>
            </div>

          ) : (
            <div style={{ display:"grid", gap:"14px" }}>
              {transactions.map((tx) => {
                const txStyle = getTxStyle(tx.type);
                return (
                  <div key={tx._id} className="tx-row">

                    {/* Left: icon + amount */}
                    <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
                      {/* Type badge */}
                      <div style={{
                        width:"46px", height:"46px", borderRadius:"14px", flexShrink:0,
                        background: txStyle.bg,
                        border:`1.5px solid ${txStyle.border}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"18px", fontWeight:800, color:txStyle.color,
                      }}>
                        {txStyle.icon}
                      </div>
                      <div>
                        <p style={{ margin:"0 0 3px", fontSize:"11px", fontWeight:700, color:"#94a3b8", letterSpacing:"1px", textTransform:"uppercase" }}>Transaction Amount</p>
                        <h2 style={{ margin:0, color:"#0f172a", fontSize:"26px", fontWeight:800, lineHeight:1 }}>
                          Rs {(tx.commissionAmount  || 0).toLocaleString()}
                        </h2>
                      </div>
                    </div>

                    {/* Right: type + date */}
                    <div style={{ textAlign:"right" }}>
                      {/* Type pill */}
                      <div style={{
                        display:"inline-flex", alignItems:"center", gap:"6px",
                        padding:"5px 14px", borderRadius:"999px", marginBottom:"8px",
                        background:txStyle.bg, border:`1.5px solid ${txStyle.border}`,
                        color:txStyle.color, fontSize:"12px", fontWeight:700,
                      }}>
                        <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:txStyle.color }} />
                        {txStyle.label}
                      </div>
                      <p style={{ margin:"0 0 2px", fontSize:"11px", color:"#94a3b8", fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>Date</p>
                      <p style={{ margin:0, color:"#0f172a", fontSize:"14px", fontWeight:700 }}>{formatDate(tx.createdAt)}</p>
                      <p style={{ margin:0, color:"#94a3b8", fontSize:"12px" }}>{formatTime(tx.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wallet;