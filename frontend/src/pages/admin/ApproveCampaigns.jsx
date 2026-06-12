import { useEffect, useState } from "react";
import API from "../../services/api";

const ApproveCampaigns = () => {
  const [pendingCampaigns,  setPendingCampaigns]  = useState([]);
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [approving,         setApproving]         = useState({});

  const fetchCampaigns = async () => {
    try {
      const res = await API.get("/admin/campaigns");
      setPendingCampaigns(res.data.pendingCampaigns   || []);
      setApprovedCampaigns(res.data.approvedCampaigns || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const approveCampaign = async (id) => {
    try {
      setApproving((p) => ({ ...p, [id]:true }));
      await API.patch(`/admin/campaigns/${id}/approve`);
      fetchCampaigns();
    } catch (error) { console.log(error); }
    finally { setApproving((p) => ({ ...p, [id]:false })); }
  };

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ width:"40px", height:"40px", border:"3px solid #dbeafe", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.85s linear infinite", marginBottom:"18px" }} />
        <p style={{ margin:0, fontWeight:700, color:"#2563eb", fontSize:"16px" }}>Loading Campaigns…</p>
        <p style={{ margin:"6px 0 0", color:"#94a3b8", fontSize:"13px" }}>Fetching campaign submissions</p>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .camp-card {
          border-radius:22px; overflow:hidden;
          border:1.5px solid;
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          display:flex; flex-direction:column;
        }
        .camp-card.pending  { background:#fff; border-color:#f1f5f9; box-shadow:0 4px 18px rgba(0,0,0,0.05); }
        .camp-card.pending:hover  { transform:translateY(-5px); box-shadow:0 18px 42px rgba(0,0,0,0.09); border-color:#c7d2fe; }
        .camp-card.approved { background:linear-gradient(145deg,#f0fdf4,#fff); border-color:#bbf7d0; box-shadow:0 4px 16px rgba(16,185,129,0.08); }
        .camp-card.approved:hover { transform:translateY(-5px); box-shadow:0 16px 38px rgba(16,185,129,0.14); }

        .approve-btn {
          width:100%; padding:13px; border:none; border-radius:14px;
          background:linear-gradient(135deg,#10b981,#059669);
          color:white; font-weight:800; font-size:14px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 6px 18px rgba(16,185,129,0.25);
          transition:transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .approve-btn:hover:not(:disabled)  { transform:translateY(-2px); box-shadow:0 12px 26px rgba(16,185,129,0.38); filter:brightness(1.08); }
        .approve-btn:active:not(:disabled) { transform:scale(0.97); filter:brightness(0.95); }
        .approve-btn:disabled { opacity:0.65; cursor:not-allowed; }

        .detail-chip {
          display:flex; justify-content:space-between; align-items:center;
          padding:9px 0; border-bottom:1px solid #f1f5f9;
        }
        .detail-chip:last-child { border-bottom:none; }

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
              <span className="pulse-dot" /> Campaign Approvals
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Campaign Approval Center 📣</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Review submitted campaigns, approve valid ones, and monitor approved advertisements across the UniBrandConnect platform.
            </p>
          </div>
          {/* Stat badges */}
          <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", position:"relative", zIndex:1 }}>
            <div style={{ background:"linear-gradient(135deg,#f59e0b,#f97316)", padding:"18px 26px", borderRadius:"18px", minWidth:"140px", boxShadow:"0 10px 28px rgba(249,115,22,0.28)" }}>
              <p style={{ margin:"0 0 6px", fontSize:"11px", fontWeight:700, opacity:0.85, letterSpacing:"1.5px", textTransform:"uppercase" }}>Pending</p>
              <h2 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1 }}>{pendingCampaigns.length}</h2>
            </div>
            <div style={{ background:"linear-gradient(135deg,#10b981,#059669)", padding:"18px 26px", borderRadius:"18px", minWidth:"140px", boxShadow:"0 10px 28px rgba(16,185,129,0.28)" }}>
              <p style={{ margin:"0 0 6px", fontSize:"11px", fontWeight:700, opacity:0.85, letterSpacing:"1.5px", textTransform:"uppercase" }}>Approved</p>
              <h2 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1 }}>{approvedCampaigns.length}</h2>
            </div>
          </div>
        </div>

        {/* ── PENDING SECTION ── */}
        <div style={{ background:"#fff", borderRadius:"26px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 22px rgba(0,0,0,0.05)", marginBottom:"24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"14px", marginBottom:"22px" }}>
            <div>
              <h2 style={{ margin:"0 0 6px", fontSize:"20px", fontWeight:800, color:"#0f172a" }}>Pending Campaigns</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"13px" }}>Review submissions before granting platform visibility.</p>
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"#fff7ed", border:"1.5px solid #fed7aa", color:"#ea580c", padding:"7px 16px", borderRadius:"999px", fontSize:"12px", fontWeight:700 }}>
              <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#f97316" }} />
              Needs Review · {pendingCampaigns.length}
            </div>
          </div>
          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"22px" }} />

          {pendingCampaigns.length === 0 ? (
            <div style={{ textAlign:"center", padding:"50px 20px", background:"#f8fafc", borderRadius:"18px", border:"1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize:"44px", marginBottom:"12px" }}>✅</div>
              <h3 style={{ margin:"0 0 6px", color:"#0f172a", fontSize:"18px", fontWeight:800 }}>All Caught Up!</h3>
              <p style={{ color:"#64748b", margin:0, fontSize:"14px" }}>No pending campaigns for approval.</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(310px, 1fr))", gap:"18px" }}>
              {pendingCampaigns.map((campaign) => (
                <div key={campaign._id} className="camp-card pending">
                  {/* Image */}
                  {campaign.image ? (
                    <div style={{ position:"relative" }}>
                      <img src={`http://localhost:5000${campaign.image}`} alt={campaign.title} style={{ width:"100%", height:"190px", objectFit:"cover", display:"block" }} />
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60px", background:"linear-gradient(to top,rgba(15,23,42,0.35),transparent)" }} />
                      <div style={{ position:"absolute", top:"12px", right:"12px", padding:"5px 12px", borderRadius:"999px", background:"rgba(249,115,22,0.9)", backdropFilter:"blur(8px)", color:"white", fontSize:"11px", fontWeight:700 }}>
                        ⏳ Pending
                      </div>
                    </div>
                  ) : (
                    <div style={{ height:"120px", background:"linear-gradient(135deg,#1e1b4b,#4338ca,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"44px" }}>📣</div>
                  )}

                  {/* Content */}
                  <div style={{ padding:"20px", display:"flex", flexDirection:"column", flex:1 }}>
                    {/* Title + status */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"8px", marginBottom:"8px" }}>
                      <h3 style={{ margin:0, fontSize:"16px", fontWeight:800, color:"#0f172a", lineHeight:1.25 }}>{campaign.title}</h3>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"4px 10px", borderRadius:"999px", background:"#fef3c7", border:"1px solid #fcd34d", color:"#92400e", fontSize:"10px", fontWeight:700, flexShrink:0 }}>
                        <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#f59e0b" }} />
                        {campaign.status}
                      </span>
                    </div>

                    <p style={{ margin:"0 0 16px", color:"#64748b", fontSize:"13px", lineHeight:1.6 }}>
                      {campaign.description?.slice(0, 100)}{campaign.description?.length > 100 ? "…" : ""}
                    </p>

                    {/* Detail chips */}
                    <div style={{ background:"#f8fafc", borderRadius:"14px", padding:"12px 14px", marginBottom:"16px", border:"1px solid #f1f5f9" }}>
                      {[
                        { label:"Category",   value: campaign.category || "General" },
                        { label:"Price",      value:`Rs ${(campaign.price||0).toLocaleString()}` },
                        { label:"Commission", value:`${campaign.commissionRate || 0}%` },
                        { label:"Budget",     value:`Rs ${(campaign.totalBudget||0).toLocaleString()}` },
                      ].map((d, i, arr) => (
                        <div key={d.label} className="detail-chip" style={{ borderBottom: i < arr.length-1 ? "1px solid #f1f5f9" : "none" }}>
                          <span style={{ color:"#94a3b8", fontSize:"11px", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>{d.label}</span>
                          <span style={{ color:"#0f172a", fontSize:"13px", fontWeight:700 }}>{d.value}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop:"auto" }}>
                      <button className="approve-btn" onClick={() => approveCampaign(campaign._id)} disabled={approving[campaign._id]}>
                        {approving[campaign._id] ? (
                          <>
                            <div style={{ width:"14px", height:"14px", borderRadius:"50%", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"white", animation:"spin 0.7s linear infinite" }} />
                            Approving…
                          </>
                        ) : "✓ Approve Campaign"}
                      </button>
                    </div>
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
              <h2 style={{ margin:"0 0 6px", fontSize:"20px", fontWeight:800, color:"#0f172a" }}>Approved Campaigns</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"13px" }}>Live campaigns currently visible to students on the platform.</p>
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"#f0fdf4", border:"1.5px solid #bbf7d0", color:"#166534", padding:"7px 16px", borderRadius:"999px", fontSize:"12px", fontWeight:700 }}>
              <span className="pulse-dot" />
              Live · {approvedCampaigns.length}
            </div>
          </div>
          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"22px" }} />

          {approvedCampaigns.length === 0 ? (
            <div style={{ textAlign:"center", padding:"50px 20px", background:"#f8fafc", borderRadius:"18px", border:"1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize:"44px", marginBottom:"12px" }}>📣</div>
              <h3 style={{ margin:"0 0 6px", color:"#0f172a", fontSize:"18px", fontWeight:800 }}>No Approved Campaigns</h3>
              <p style={{ color:"#64748b", margin:0, fontSize:"14px" }}>Approved campaigns will appear here.</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(310px, 1fr))", gap:"18px" }}>
              {approvedCampaigns.map((campaign) => (
                <div key={campaign._id} className="camp-card approved">
                  {campaign.image ? (
                    <div style={{ position:"relative" }}>
                      <img src={`http://localhost:5000${campaign.image}`} alt={campaign.title} style={{ width:"100%", height:"190px", objectFit:"cover", display:"block" }} />
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60px", background:"linear-gradient(to top,rgba(15,23,42,0.35),transparent)" }} />
                      <div style={{ position:"absolute", top:"12px", right:"12px", padding:"5px 12px", borderRadius:"999px", background:"rgba(16,185,129,0.9)", backdropFilter:"blur(8px)", color:"white", fontSize:"11px", fontWeight:700 }}>
                        ✓ Approved
                      </div>
                    </div>
                  ) : (
                    <div style={{ height:"120px", background:"linear-gradient(135deg,#052e16,#059669,#10b981)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"44px" }}>📣</div>
                  )}

                  <div style={{ padding:"20px", display:"flex", flexDirection:"column", flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"8px", marginBottom:"8px" }}>
                      <h3 style={{ margin:0, fontSize:"16px", fontWeight:800, color:"#0f172a", lineHeight:1.25 }}>{campaign.title}</h3>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"4px 10px", borderRadius:"999px", background:"#dcfce7", border:"1px solid #86efac", color:"#166534", fontSize:"10px", fontWeight:700, flexShrink:0 }}>
                        <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#22c55e" }} />
                        Approved
                      </span>
                    </div>

                    <p style={{ margin:"0 0 16px", color:"#64748b", fontSize:"13px", lineHeight:1.6 }}>
                      {campaign.description?.slice(0, 100)}{campaign.description?.length > 100 ? "…" : ""}
                    </p>

                    <div style={{ background:"#f0fdf4", borderRadius:"14px", padding:"12px 14px", border:"1px solid #d1fae5" }}>
                      {[
                        { label:"Category",   value: campaign.category || "General" },
                        { label:"Price",      value:`Rs ${(campaign.price||0).toLocaleString()}` },
                        { label:"Commission", value:`${campaign.commissionRate || 0}%` },
                        { label:"Budget",     value:`Rs ${(campaign.totalBudget||0).toLocaleString()}` },
                      ].map((d, i, arr) => (
                        <div key={d.label} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom: i < arr.length-1 ? "1px solid #d1fae5" : "none" }}>
                          <span style={{ color:"#166534", fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>{d.label}</span>
                          <span style={{ color:"#065f46", fontSize:"13px", fontWeight:700 }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
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

export default ApproveCampaigns;