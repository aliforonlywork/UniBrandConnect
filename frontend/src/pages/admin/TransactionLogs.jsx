import { useEffect, useState } from "react";
import { getAllTransactions } from "../../services/transactionService";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" }) : "N/A";
const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" }) : "";

const TYPE_CONFIG = {
  credit:  { bg:"linear-gradient(135deg,#dcfce7,#bbf7d0)", border:"#86efac", color:"#166534", dot:"#22c55e", icon:"↑" },
  debit:   { bg:"linear-gradient(135deg,#fee2e2,#fecaca)", border:"#fca5a5", color:"#991b1b", dot:"#ef4444", icon:"↓" },
};
const getType = (t="credit") => TYPE_CONFIG[t.toLowerCase()] || TYPE_CONFIG.credit;

const TransactionLogs = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setTypeFilter]   = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getAllTransactions();
        setTransactions(res.data.transactions || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalAmount = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const credits     = transactions.filter(t => (t.type||"").toLowerCase() === "credit");
  const debits      = transactions.filter(t => (t.type||"").toLowerCase() === "debit");

  const filtered = transactions.filter((t) => {
    const matchType   = typeFilter === "all" || (t.type||"").toLowerCase() === typeFilter;
    const matchSearch = [t.user?.name, t.user?.email].some((f) =>
      (f||"").toLowerCase().includes(search.toLowerCase())
    );
    return matchType && matchSearch;
  });

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ width:"40px", height:"40px", border:"3px solid #dbeafe", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.85s linear infinite", marginBottom:"18px" }} />
        <p style={{ margin:0, fontWeight:700, color:"#2563eb", fontSize:"16px" }}>Loading Transactions…</p>
        <p style={{ margin:"6px 0 0", color:"#94a3b8", fontSize:"13px" }}>Fetching platform transaction logs</p>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .tx-row {
          transition:background 0.15s ease;
          cursor:default;
        }
        .tx-row:hover td { background:#f0f9ff !important; }

        .search-input {
          padding:10px 18px 10px 42px;
          border-radius:13px; border:1.5px solid #e2e8f0;
          background:#f8fafc; font-size:13px;
          font-family:'Sora',sans-serif; font-weight:500;
          color:#0f172a; outline:none; width:240px;
          transition:border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .search-input:focus { border-color:#2563eb; box-shadow:0 0 0 4px rgba(37,99,235,0.10); background:#fff; }
        .search-input::placeholder { color:#94a3b8; }

        .type-pill {
          padding:6px 16px; border-radius:999px;
          border:1.5px solid #e2e8f0; background:white;
          font-size:12px; font-weight:700; font-family:'Sora',sans-serif;
          cursor:pointer; color:#64748b; text-transform:capitalize;
          transition:all 0.16s ease;
        }
        .type-pill:hover  { border-color:#818cf8; color:#4338ca; background:#eef2ff; }
        .type-pill.active { background:linear-gradient(135deg,#2563eb,#4f46e5); color:white; border-color:transparent; box-shadow:0 4px 12px rgba(37,99,235,0.28); }

        .stat-card {
          background:#fff; border-radius:20px; padding:22px;
          border:1.5px solid #f1f5f9; box-shadow:0 4px 14px rgba(0,0,0,0.05);
          position:relative; overflow:hidden;
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
        }
        .stat-card:hover { transform:translateY(-5px); box-shadow:0 16px 38px rgba(0,0,0,0.09); }
        .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; border-radius:20px 20px 0 0; }

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
              <span className="pulse-dot" /> Finance Logs
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Transaction Logs 🧾</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              View all platform payment and commission transactions in real-time.
            </p>
          </div>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div style={{ display:"flex", alignItems:"center", gap:"10px", background:"#fef2f2", color:"#991b1b", padding:"14px 18px", borderRadius:"14px", marginBottom:"22px", border:"1.5px solid #fecaca", fontSize:"14px", fontWeight:600 }}>
            <span>⚠️</span>{error}
          </div>
        )}

        {/* ── STAT CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(190px, 1fr))", gap:"16px", marginBottom:"28px" }}>
          {[
            { label:"Total Transactions", value:transactions.length,            icon:"🧾", light:"#eef2ff", bar:"linear-gradient(90deg,#6366f1,#818cf8)" },
            { label:"Total Amount",       value:`PKR ${totalAmount.toLocaleString()}`, icon:"💰", light:"#fffbeb", bar:"linear-gradient(90deg,#f59e0b,#fbbf24)" },
            { label:"Credits",            value:credits.length,                 icon:"↑",  light:"#f0fdf4", bar:"linear-gradient(90deg,#10b981,#34d399)" },
            { label:"Debits",             value:debits.length,                  icon:"↓",  light:"#fef2f2", bar:"linear-gradient(90deg,#ef4444,#f87171)" },
          ].map((s, i) => (
            <div key={s.label} className="stat-card">
              <style>{`.stat-card:nth-child(${i+1})::before { background:${s.bar}; }`}</style>
              <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:s.light, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", marginBottom:"12px" }}>{s.icon}</div>
              <p style={{ margin:"0 0 4px", color:"#94a3b8", fontSize:"11px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>{s.label}</p>
              <h2 style={{ margin:0, fontSize:"26px", fontWeight:800, color:"#0f172a", lineHeight:1 }}>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* ── EMPTY STATE ── */}
        {transactions.length === 0 ? (
          <div style={{ background:"white", padding:"70px 30px", borderRadius:"24px", textAlign:"center", border:"1.5px dashed #e2e8f0", boxShadow:"0 4px 18px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:"52px", marginBottom:"16px" }}>🧾</div>
            <h2 style={{ color:"#0f172a", margin:"0 0 10px", fontSize:"22px", fontWeight:800 }}>No Transactions Found</h2>
            <p style={{ color:"#64748b", margin:0, fontSize:"15px", lineHeight:1.7, maxWidth:"400px", marginInline:"auto" }}>
              Transactions will appear here after users complete purchases or payments.
            </p>
          </div>

        ) : (
          <div style={{ background:"#fff", borderRadius:"26px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 22px rgba(0,0,0,0.05)", overflowX:"auto" }}>

            {/* Section header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"14px", marginBottom:"18px" }}>
              <div>
                <h2 style={{ margin:"0 0 4px", fontSize:"20px", fontWeight:800, color:"#0f172a" }}>All Transactions</h2>
                <p style={{ margin:0, color:"#64748b", fontSize:"13px" }}>{filtered.length} of {transactions.length} shown</p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"14px", pointerEvents:"none" }}>🔍</span>
                  <input type="text" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"#f0fdf4", padding:"7px 14px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                  <span className="pulse-dot" />
                  <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Live</span>
                </div>
              </div>
            </div>

            {/* Type filter pills */}
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"16px" }}>
              {["all","credit","debit"].map((t) => (
                <button key={t} className={`type-pill${typeFilter===t ? " active" : ""}`} onClick={() => setTypeFilter(t)}>
                  {t === "all" ? "All Types" : t === "credit" ? "↑ Credits" : "↓ Debits"}
                </button>
              ))}
            </div>

            <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"14px" }} />

            {/* Empty filtered */}
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 20px", background:"#f8fafc", borderRadius:"16px", border:"1.5px dashed #e2e8f0" }}>
                <div style={{ fontSize:"40px", marginBottom:"10px" }}>🔍</div>
                <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>No transactions match your search.</p>
              </div>
            ) : (
              <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 8px", minWidth:"900px" }}>
                <thead>
                  <tr>
                    {["User","Amount","Type","Date","Status"].map((h) => (
                      <th key={h} style={{ textAlign:"left", padding:"10px 18px", color:"#94a3b8", fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((txn) => {
                    const typeCfg = getType(txn.type);
                    return (
                      <tr key={txn._id} className="tx-row">

                        {/* User */}
                        <td style={{ padding:"14px 18px", background:"#f8fafc", borderRadius:"16px 0 0 16px", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", borderLeft:"1.5px solid #f1f5f9", transition:"background 0.15s ease" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                            <div style={{ width:"38px", height:"38px", borderRadius:"50%", flexShrink:0, background:"linear-gradient(135deg,#6366f1,#818cf8)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800, fontSize:"14px" }}>
                              {(txn.user?.name||"U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ margin:0, fontWeight:700, color:"#0f172a", fontSize:"14px" }}>{txn.user?.name || "Unknown User"}</p>
                              <p style={{ margin:"2px 0 0", fontSize:"12px", color:"#94a3b8" }}>{txn.user?.email || "No email"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td style={{ padding:"14px 18px", background:"#f8fafc", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", transition:"background 0.15s ease" }}>
                          <span style={{ fontWeight:800, color:"#166534", fontSize:"15px" }}>
                            PKR {(txn.amount||0).toLocaleString()}
                          </span>
                        </td>

                        {/* Type */}
                        <td style={{ padding:"14px 18px", background:"#f8fafc", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", transition:"background 0.15s ease" }}>
                          <span style={{
                            display:"inline-flex", alignItems:"center", gap:"6px",
                            padding:"5px 14px", borderRadius:"999px",
                            background:typeCfg.bg, border:`1.5px solid ${typeCfg.border}`,
                            color:typeCfg.color, fontSize:"12px", fontWeight:800, textTransform:"capitalize",
                          }}>
                            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:typeCfg.dot }} />
                            {txn.type || "N/A"}
                          </span>
                        </td>

                        {/* Date */}
                        <td style={{ padding:"14px 18px", background:"#f8fafc", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", transition:"background 0.15s ease" }}>
                          <p style={{ margin:0, fontSize:"13px", fontWeight:700, color:"#0f172a" }}>{formatDate(txn.createdAt)}</p>
                          <p style={{ margin:"2px 0 0", fontSize:"12px", color:"#94a3b8" }}>{formatTime(txn.createdAt)}</p>
                        </td>

                        {/* Status */}
                        <td style={{ padding:"14px 18px", background:"#f8fafc", borderRadius:"0 16px 16px 0", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", borderRight:"1.5px solid #f1f5f9", transition:"background 0.15s ease" }}>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", background:"linear-gradient(135deg,#dbeafe,#bfdbfe)", border:"1.5px solid #93c5fd", color:"#1d4ed8", padding:"5px 12px", borderRadius:"999px", fontSize:"11px", fontWeight:700 }}>
                            <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#3b82f6" }} />
                            Completed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionLogs;