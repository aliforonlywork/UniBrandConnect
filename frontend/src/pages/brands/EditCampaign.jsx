import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateCampaign, getCampaignById } from "../../services/campaignService";

const EditCampaign = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({ title:"", description:"", commission:"", price:"" });
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await getCampaignById(id);
        setFormData(res.data.campaign);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateCampaign(id, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3200);
    } catch (error) {
      console.log(error);
      alert("Failed to update campaign");
    } finally {
      setSaving(false);
    }
  };

  const price      = parseFloat(formData.price)      || 0;
  const commission = parseFloat(formData.commission) || 0;
  const earnPerSale = price > 0 && commission > 0 ? ((price * commission) / 100).toFixed(2) : null;

  // ── loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
      <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ background:"white", padding:"44px 60px", borderRadius:"28px", boxShadow:"0 10px 44px rgba(0,0,0,0.09)", textAlign:"center", border:"1.5px solid #f1f5f9" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"50%", border:"3px solid #eef2ff", borderTopColor:"#6366f1", animation:"spin 0.85s linear infinite", margin:"0 auto 18px" }} />
          <p style={{ margin:0, fontSize:"16px", fontWeight:700, color:"#6366f1" }}>Loading Campaign Editor…</p>
          <p style={{ margin:"6px 0 0", fontSize:"13px", color:"#94a3b8" }}>Preparing your campaign data</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .ec-input {
          width:100%; padding:14px 18px;
          border-radius:14px; border:1.5px solid #e2e8f0;
          background:#f8fafc; font-size:14px;
          font-family:'Sora',sans-serif; font-weight:500;
          color:#0f172a; outline:none;
          transition:border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .ec-input:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.11); background:#fff; }
        .ec-input::placeholder { color:#94a3b8; }

        .ec-textarea {
          width:100%; padding:14px 18px;
          border-radius:14px; border:1.5px solid #e2e8f0;
          background:#f8fafc; font-size:14px;
          font-family:'Sora',sans-serif; font-weight:500;
          color:#0f172a; outline:none; resize:vertical;
          transition:border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .ec-textarea:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.11); background:#fff; }
        .ec-textarea::placeholder { color:#94a3b8; }

        .save-btn {
          flex:1; padding:16px;
          border:none; border-radius:16px;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          color:white; font-weight:800; font-size:15px;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 10px 28px rgba(79,70,229,0.28);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .save-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 16px 36px rgba(79,70,229,0.40); filter:brightness(1.08); }
        .save-btn:active:not(:disabled){ transform:scale(0.97); filter:brightness(0.95); }
        .save-btn:disabled { opacity:0.7; cursor:not-allowed; }

        .cancel-btn {
          flex:1; padding:16px;
          border-radius:16px; border:1.5px solid #e2e8f0;
          background:white; color:#0f172a;
          font-weight:700; font-size:15px;
          font-family:'Sora',sans-serif; cursor:pointer;
          transition:background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .cancel-btn:hover  { background:#f8fafc; border-color:#c7d2fe; transform:translateY(-1px); }
        .cancel-btn:active { transform:scale(0.97); }

        .success-toast {
          position:fixed; bottom:30px; right:30px; z-index:999;
          background:linear-gradient(135deg,#10b981,#059669);
          color:white; padding:16px 24px; border-radius:16px;
          font-weight:700; font-size:14px; font-family:'Sora',sans-serif;
          box-shadow:0 12px 30px rgba(16,185,129,0.35);
          display:flex; align-items:center; gap:10px;
          animation:slideToast 0.35s ease both;
        }
        @keyframes slideToast { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
        @keyframes spin { to{transform:rotate(360deg);} }

        .section-label {
          font-size:11px; font-weight:700; color:#94a3b8;
          letter-spacing:1.5px; text-transform:uppercase;
          margin-bottom:14px; display:flex; align-items:center; gap:8px;
        }
        .section-label::after { content:''; flex:1; height:1px; background:#f1f5f9; }
      `}</style>

      {success && (
        <div className="success-toast">✅ Campaign Updated Successfully!</div>
      )}

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
              ✏️ Campaign Editor
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Edit Campaign</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Update your campaign details, optimize product performance, and improve your brand engagement across the UniBrandConnect platform.
            </p>
          </div>

          {/* Status card */}
          <div style={{
            background:"rgba(255,255,255,0.10)", border:"1.5px solid rgba(255,255,255,0.18)",
            padding:"22px 28px", borderRadius:"20px", backdropFilter:"blur(10px)",
            position:"relative", zIndex:1, minWidth:"200px",
          }}>
            <p style={{ margin:"0 0 6px", fontSize:"11px", color:"#a5b4fc", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>Campaign Editor</p>
            <h2 style={{ margin:0, fontSize:"20px", fontWeight:800 }}>Live Update Mode ✨</h2>
            {earnPerSale && (
              <div style={{ marginTop:"10px", background:"rgba(16,185,129,0.15)", borderRadius:"10px", padding:"8px 12px" }}>
                <p style={{ margin:0, fontSize:"12px", color:"#86efac", fontWeight:600 }}>Est. earn/sale: <strong>PKR {earnPerSale}</strong></p>
              </div>
            )}
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div style={{ background:"#fff", borderRadius:"28px", padding:"40px", border:"1.5px solid #f1f5f9", boxShadow:"0 8px 32px rgba(0,0,0,0.06)" }}>
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"28px" }}>

            {/* ─ CONTENT ─ */}
            <div>
              <p className="section-label">📝 Campaign Content</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
                <div>
                  <label style={{ display:"block", marginBottom:"8px", color:"#374151", fontWeight:700, fontSize:"13px" }}>Campaign Title</label>
                  <input type="text" name="title" placeholder="Enter campaign title" value={formData.title || ""} onChange={handleChange} className="ec-input" />
                </div>
                <div>
                  <label style={{ display:"block", marginBottom:"8px", color:"#374151", fontWeight:700, fontSize:"13px" }}>Campaign Description</label>
                  <textarea name="description" placeholder="Describe your campaign, product benefits, and target audience…" value={formData.description || ""} onChange={handleChange} rows={6} className="ec-textarea" />
                </div>
              </div>
            </div>

            {/* ─ FINANCIALS ─ */}
            <div>
              <p className="section-label">💰 Financial Details</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div>
                  <label style={{ display:"block", marginBottom:"8px", color:"#374151", fontWeight:700, fontSize:"13px" }}>
                    Product Price <span style={{ color:"#94a3b8", fontWeight:500 }}>(PKR)</span>
                  </label>
                  <input type="number" name="price" placeholder="0" value={formData.price || ""} onChange={handleChange} className="ec-input" min="0" />
                </div>
                <div>
                  <label style={{ display:"block", marginBottom:"8px", color:"#374151", fontWeight:700, fontSize:"13px" }}>
                    Commission Rate <span style={{ color:"#94a3b8", fontWeight:500 }}>(%)</span>
                  </label>
                  <input type="number" name="commission" placeholder="0" value={formData.commission || ""} onChange={handleChange} className="ec-input" min="0" max="100" />
                </div>
              </div>

              {/* Live financial preview */}
              {(price > 0 || commission > 0) && (
                <div style={{
                  marginTop:"16px", padding:"18px 20px", borderRadius:"16px",
                  background:"linear-gradient(135deg,#ecfdf5,#d1fae5)",
                  border:"1.5px solid #bbf7d0",
                  display:"flex", gap:"28px", flexWrap:"wrap", alignItems:"center",
                }}>
                  {price > 0 && <div><p style={{ margin:"0 0 2px", fontSize:"11px", color:"#166534", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>Product Price</p><p style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#065f46" }}>PKR {price.toLocaleString()}</p></div>}
                  {earnPerSale && <div><p style={{ margin:"0 0 2px", fontSize:"11px", color:"#166534", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>Student Earns / Sale</p><p style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#065f46" }}>PKR {earnPerSale}</p></div>}
                  {commission > 0 && <div><p style={{ margin:"0 0 2px", fontSize:"11px", color:"#166534", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>Commission Rate</p><p style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#065f46" }}>{commission}%</p></div>}
                </div>
              )}
            </div>

            {/* ─ BUTTONS ─ */}
            <div style={{ height:"1px", background:"#f1f5f9" }} />
            <div style={{ display:"flex", gap:"14px", flexWrap:"wrap" }}>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? (
                  <>
                    <div style={{ width:"16px", height:"16px", borderRadius:"50%", border:"2.5px solid rgba(255,255,255,0.4)", borderTopColor:"white", animation:"spin 0.75s linear infinite" }} />
                    Saving Changes…
                  </>
                ) : (
                  <> 💾 Save Changes </>
                )}
              </button>
              <button type="button" className="cancel-btn" onClick={() => window.history.back()}>
                ← Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCampaign;