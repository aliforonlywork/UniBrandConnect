import { useEffect, useState } from "react";
import API from "../../services/api";

const ApproveBrands = () => {
  const [pendingBrands,  setPendingBrands]  = useState([]);
  const [approvedBrands, setApprovedBrands] = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [approving,      setApproving]      = useState({});
  const [rejecting,      setRejecting]      = useState({});

  const fetchBrands = async () => {
    try {
      const res = await API.get("/admin/brands/pending");
      setPendingBrands(res.data.pendingBrands   || []);
      setApprovedBrands(res.data.approvedBrands || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const approve = async (id) => {
    try {
      setApproving((p) => ({ ...p, [id]:true }));
      await API.put(`/admin/brands/${id}/approve`);
      fetchBrands();
    } catch (error) { console.log(error); }
    finally { setApproving((p) => ({ ...p, [id]:false })); }
  };

  const reject = async (id) => {
    try {
      setRejecting((p) => ({ ...p, [id]:true }));
      await API.put(`/admin/brands/${id}/reject`);
      fetchBrands();
    } catch (error) { console.log(error); }
    finally { setRejecting((p) => ({ ...p, [id]:false })); }
  };

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ width:"40px", height:"40px", border:"3px solid #dbeafe", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.85s linear infinite", marginBottom:"18px" }} />
        <p style={{ margin:0, fontWeight:700, color:"#2563eb", fontSize:"16px" }}>Loading Brand Approvals…</p>
        <p style={{ margin:"6px 0 0", color:"#94a3b8", fontSize:"13px" }}>Fetching brand requests</p>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .brand-card {
          border-radius:22px; padding:26px;
          border:1.5px solid;
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          cursor:default;
        }
        .brand-card.pending  { background:#fff; border-color:#f1f5f9; box-shadow:0 4px 18px rgba(0,0,0,0.05); }
        .brand-card.pending:hover  { transform:translateY(-5px); box-shadow:0 18px 42px rgba(0,0,0,0.09); border-color:#c7d2fe; }
        .brand-card.approved { background:linear-gradient(145deg,#f0fdf4,#fff); border-color:#bbf7d0; box-shadow:0 4px 18px rgba(16,185,129,0.08); }
        .brand-card.approved:hover { transform:translateY(-5px); box-shadow:0 16px 38px rgba(16,185,129,0.14); }

        .approve-btn {
          flex:1; border:none; padding:12px;
          border-radius:14px;
          background:linear-gradient(135deg,#10b981,#059669);
          color:white; font-weight:800; font-size:13px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 6px 18px rgba(16,185,129,0.25);
          transition:transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
          display:flex; align-items:center; justify-content:center; gap:6px;
        }
        .approve-btn:hover:not(:disabled)  { transform:translateY(-2px); box-shadow:0 10px 24px rgba(16,185,129,0.38); filter:brightness(1.07); }
        .approve-btn:active:not(:disabled) { transform:scale(0.96); filter:brightness(0.95); }
        .approve-btn:disabled { opacity:0.65; cursor:not-allowed; }

        .reject-btn {
          flex:1; border:none; padding:12px;
          border-radius:14px;
          background:linear-gradient(135deg,#ef4444,#dc2626);
          color:white; font-weight:800; font-size:13px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 6px 18px rgba(239,68,68,0.22);
          transition:transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
          display:flex; align-items:center; justify-content:center; gap:6px;
        }
        .reject-btn:hover:not(:disabled)  { transform:translateY(-2px); box-shadow:0 10px 24px rgba(239,68,68,0.36); filter:brightness(1.07); }
        .reject-btn:active:not(:disabled) { transform:scale(0.96); filter:brightness(0.95); }
        .reject-btn:disabled { opacity:0.65; cursor:not-allowed; }

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
              <span className="pulse-dot" /> Brand Approvals
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Brand Approval Center 🏷️</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Review, approve, and manage brand accounts joining the UniBrandConnect platform.
            </p>
          </div>

          {/* Stat badges */}
          <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", position:"relative", zIndex:1 }}>
            <div style={{ background:"linear-gradient(135deg,#f59e0b,#f97316)", padding:"18px 26px", borderRadius:"18px", minWidth:"140px", boxShadow:"0 10px 28px rgba(249,115,22,0.28)" }}>
              <p style={{ margin:"0 0 6px", fontSize:"11px", fontWeight:700, opacity:0.85, letterSpacing:"1.5px", textTransform:"uppercase" }}>Pending</p>
              <h2 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1 }}>{pendingBrands.length}</h2>
            </div>
            <div style={{ background:"linear-gradient(135deg,#10b981,#059669)", padding:"18px 26px", borderRadius:"18px", minWidth:"140px", boxShadow:"0 10px 28px rgba(16,185,129,0.28)" }}>
              <p style={{ margin:"0 0 6px", fontSize:"11px", fontWeight:700, opacity:0.85, letterSpacing:"1.5px", textTransform:"uppercase" }}>Approved</p>
              <h2 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1 }}>{approvedBrands.length}</h2>
            </div>
          </div>
        </div>

        {/* ── PENDING SECTION ── */}
        <div style={{ background:"#fff", borderRadius:"26px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 22px rgba(0,0,0,0.05)", marginBottom:"24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"14px", marginBottom:"22px" }}>
            <div>
              <h2 style={{ margin:"0 0 6px", fontSize:"20px", fontWeight:800, color:"#0f172a" }}>Pending Brand Requests</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"13px" }}>Review applications before granting platform access.</p>
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"#fff7ed", border:"1.5px solid #fed7aa", color:"#ea580c", padding:"7px 16px", borderRadius:"999px", fontSize:"12px", fontWeight:700 }}>
              <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#f97316" }} />
              Needs Review · {pendingBrands.length}
            </div>
          </div>
          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"22px" }} />

          {pendingBrands.length === 0 ? (
            <div style={{ textAlign:"center", padding:"50px 20px", background:"#f8fafc", borderRadius:"18px", border:"1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize:"44px", marginBottom:"12px" }}>✅</div>
              <h3 style={{ margin:"0 0 6px", color:"#0f172a", fontSize:"18px", fontWeight:800 }}>All Caught Up!</h3>
              <p style={{ color:"#64748b", margin:0, fontSize:"14px" }}>All brand requests have been processed.</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:"18px" }}>
              {pendingBrands.map((brand) => (
                <div key={brand._id} className="brand-card pending">
                  {/* Avatar */}
                  <div style={{
                    width:"56px", height:"56px", borderRadius:"16px",
                    background:"linear-gradient(135deg,#3b82f6,#6366f1)",
                    color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"22px", fontWeight:800, marginBottom:"16px",
                    boxShadow:"0 6px 16px rgba(59,130,246,0.28)",
                  }}>
                    {brand.name?.charAt(0)?.toUpperCase()}
                  </div>
                  {/* Pending badge */}
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"4px 12px", borderRadius:"999px", background:"#fff7ed", border:"1px solid #fed7aa", color:"#ea580c", fontSize:"11px", fontWeight:700, marginBottom:"12px" }}>
                    <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#f97316" }} />
                    Pending Review
                  </div>
                  <h3 style={{ margin:"0 0 6px", fontSize:"18px", fontWeight:800, color:"#0f172a" }}>{brand.name}</h3>
                  <p style={{ margin:"0 0 20px", color:"#64748b", fontSize:"13px", wordBreak:"break-word" }}>{brand.email}</p>
                  <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"16px" }} />
                  <div style={{ display:"flex", gap:"10px" }}>
                    <button className="approve-btn" onClick={() => approve(brand._id)} disabled={approving[brand._id]}>
                      {approving[brand._id] ? "…" : "✓ Approve"}
                    </button>
                    <button className="reject-btn" onClick={() => reject(brand._id)} disabled={rejecting[brand._id]}>
                      {rejecting[brand._id] ? "…" : "✕ Reject"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── APPROVED SECTION ── */}
        <div style={{ background:"#fff", borderRadius:"26px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 22px rgba(0,0,0,0.05)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"14px", marginBottom:"22px" }}>
            <div>
              <h2 style={{ margin:"0 0 6px", fontSize:"20px", fontWeight:800, color:"#0f172a" }}>Approved Brands</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"13px" }}>Verified brands currently active on the platform.</p>
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"#f0fdf4", border:"1.5px solid #bbf7d0", color:"#166534", padding:"7px 16px", borderRadius:"999px", fontSize:"12px", fontWeight:700 }}>
              <span className="pulse-dot" />
              Verified · {approvedBrands.length}
            </div>
          </div>
          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"22px" }} />

          {approvedBrands.length === 0 ? (
            <div style={{ textAlign:"center", padding:"50px 20px", background:"#f8fafc", borderRadius:"18px", border:"1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize:"44px", marginBottom:"12px" }}>🏷️</div>
              <h3 style={{ margin:"0 0 6px", color:"#0f172a", fontSize:"18px", fontWeight:800 }}>No Approved Brands Yet</h3>
              <p style={{ color:"#64748b", margin:0, fontSize:"14px" }}>Approved brands will appear here.</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:"18px" }}>
              {approvedBrands.map((brand) => (
                <div key={brand._id} className="brand-card approved">
                  <div style={{
                    width:"56px", height:"56px", borderRadius:"16px",
                    background:"linear-gradient(135deg,#10b981,#059669)",
                    color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"22px", fontWeight:800, marginBottom:"16px",
                    boxShadow:"0 6px 16px rgba(16,185,129,0.28)",
                  }}>
                    {brand.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"4px 12px", borderRadius:"999px", background:"#dcfce7", border:"1px solid #86efac", color:"#166534", fontSize:"11px", fontWeight:700, marginBottom:"12px" }}>
                    <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#22c55e" }} />
                    Verified & Active
                  </div>
                  <h3 style={{ margin:"0 0 6px", fontSize:"18px", fontWeight:800, color:"#0f172a" }}>{brand.name}</h3>
                  <p style={{ margin:"0 0 16px", color:"#64748b", fontSize:"13px", wordBreak:"break-word" }}>{brand.email}</p>
                  <div style={{ height:"1px", background:"#d1fae5", marginBottom:"14px" }} />
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"linear-gradient(135deg,#dcfce7,#bbf7d0)", border:"1.5px solid #86efac", color:"#166534", padding:"8px 18px", borderRadius:"999px", fontSize:"13px", fontWeight:800 }}>
                    ✓ Approved & Active
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApproveBrands;