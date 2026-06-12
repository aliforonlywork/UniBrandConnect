import { useState } from "react";
import API from "../../services/api";

const CATEGORIES = [
  "Technology","Fashion","Sports","Education",
  "Gaming","Beauty","Food","Fitness","Travel","Finance",
];

const CAT_ICONS = {
  Technology:"💻", Fashion:"👗", Sports:"⚽", Education:"📚",
  Gaming:"🎮", Beauty:"💄", Food:"🍔", Fitness:"💪", Travel:"✈️", Finance:"💹",
};

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title:"", description:"", category:"", tags:"",
    price:"", commissionRate:"", totalBudget:"",
  });
  const [image,    setImage]    = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title",          formData.title);
      data.append("description",    formData.description);
      data.append("category",       formData.category);
      data.append("price",          formData.price);
      data.append("commissionRate", formData.commissionRate);
      data.append("totalBudget",    formData.totalBudget);
      const tagsArray = formData.tags.split(",").map((t) => t.trim());
      data.append("tags", JSON.stringify(tagsArray));
      if (image) data.append("image", image);
      await API.post("/campaigns", data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
      setFormData({ title:"", description:"", category:"", tags:"", price:"", commissionRate:"", totalBudget:"" });
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert("Error creating campaign");
    } finally {
      setLoading(false);
    }
  };

  const commission = parseFloat(formData.commissionRate) || 0;
  const price      = parseFloat(formData.price) || 0;
  const earnPerSale = commission > 0 && price > 0 ? ((price * commission) / 100).toFixed(2) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .cc-input {
          width:100%; padding:14px 18px;
          border-radius:14px; border:1.5px solid #e2e8f0;
          background:#f8fafc; font-size:14px;
          font-family:'Sora',sans-serif; font-weight:500;
          color:#0f172a; outline:none;
          transition:border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .cc-input:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.11); background:#fff; }
        .cc-input::placeholder { color:#94a3b8; }

        .cc-textarea {
          width:100%; padding:14px 18px;
          border-radius:14px; border:1.5px solid #e2e8f0;
          background:#f8fafc; font-size:14px;
          font-family:'Sora',sans-serif; font-weight:500;
          color:#0f172a; outline:none; resize:vertical;
          transition:border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .cc-textarea:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.11); background:#fff; }
        .cc-textarea::placeholder { color:#94a3b8; }

        .cc-select {
          width:100%; padding:14px 18px;
          border-radius:14px; border:1.5px solid #e2e8f0;
          background:#f8fafc; font-size:14px;
          font-family:'Sora',sans-serif; font-weight:600;
          color:#0f172a; outline:none; cursor:pointer;
          appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 16px center;
          transition:border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .cc-select:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.11); background-color:#fff; }

        .cat-pill {
          padding:9px 16px; border-radius:12px;
          border:1.5px solid #e2e8f0; background:#f8fafc;
          cursor:pointer; font-size:13px; font-weight:700;
          font-family:'Sora',sans-serif; color:#64748b;
          transition:all 0.16s ease; text-align:center;
          display:flex; align-items:center; gap:6px;
        }
        .cat-pill:hover   { border-color:#818cf8; color:#4338ca; background:#eef2ff; }
        .cat-pill.selected{ border-color:#6366f1; background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.28); }

        .upload-zone {
          border:2px dashed #c7d2fe;
          padding:32px 20px; border-radius:20px;
          background:#f8fafc; text-align:center;
          transition:border-color 0.2s ease, background 0.2s ease;
          cursor:pointer;
        }
        .upload-zone.drag-over { border-color:#6366f1; background:#eef2ff; }

        .submit-btn {
          width:100%; padding:17px;
          border:none; border-radius:16px;
          background:linear-gradient(135deg,#4f46e5,#7c3aed);
          color:white; font-size:15px; font-weight:800;
          font-family:'Sora',sans-serif; cursor:pointer;
          box-shadow:0 12px 32px rgba(79,70,229,0.30);
          transition:transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease, filter 0.2s ease;
          display:flex; align-items:center; justify-content:center; gap:10px;
        }
        .submit-btn:hover:not(:disabled) { transform:translateY(-3px); box-shadow:0 18px 40px rgba(79,70,229,0.42); filter:brightness(1.08); }
        .submit-btn:active:not(:disabled){ transform:scale(0.97); filter:brightness(0.95); }
        .submit-btn:disabled { opacity:0.7; cursor:not-allowed; }

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
        .section-label::after {
          content:''; flex:1; height:1px; background:#f1f5f9;
        }
      `}</style>

      {/* Success toast */}
      {success && (
        <div className="success-toast">
          ✅ Campaign Created Successfully!
        </div>
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
              📣 Campaign Builder
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Create Product Campaign</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Launch professional referral campaigns, connect with students, and grow your brand visibility through the UniBrandConnect ecosystem.
            </p>
          </div>

          {/* Status card */}
          <div style={{
            background:"rgba(255,255,255,0.10)", border:"1.5px solid rgba(255,255,255,0.18)",
            padding:"22px 28px", borderRadius:"20px", backdropFilter:"blur(10px)",
            position:"relative", zIndex:1, minWidth:"200px",
          }}>
            <p style={{ margin:"0 0 6px", fontSize:"11px", color:"#a5b4fc", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>Campaign Status</p>
            <h2 style={{ margin:0, fontSize:"22px", fontWeight:800 }}>Ready to Launch 🚀</h2>
            {earnPerSale && (
              <div style={{ marginTop:"10px", background:"rgba(16,185,129,0.15)", borderRadius:"10px", padding:"8px 12px" }}>
                <p style={{ margin:0, fontSize:"12px", color:"#86efac", fontWeight:600 }}>Est. earn/sale: <strong>${earnPerSale}</strong></p>
              </div>
            )}
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div style={{ background:"#fff", borderRadius:"28px", padding:"40px", border:"1.5px solid #f1f5f9", boxShadow:"0 8px 32px rgba(0,0,0,0.06)" }}>
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"28px" }}>

            {/* ─ BASIC INFO ─ */}
            <div>
              <p className="section-label">📝 Basic Information</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
                <div>
                  <label style={{ display:"block", marginBottom:"8px", color:"#374151", fontWeight:700, fontSize:"13px" }}>Product Title</label>
                  <input type="text" name="title" value={formData.title} placeholder="Enter a compelling campaign title" onChange={handleChange} required className="cc-input" />
                </div>
                <div>
                  <label style={{ display:"block", marginBottom:"8px", color:"#374151", fontWeight:700, fontSize:"13px" }}>Description</label>
                  <textarea name="description" value={formData.description} placeholder="Describe your campaign, product benefits, and target audience…" onChange={handleChange} required rows={5} className="cc-textarea" />
                </div>
              </div>
            </div>

            {/* ─ CATEGORY ─ */}
            <div>
              <p className="section-label">🏷️ Campaign Category</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))", gap:"10px" }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat} type="button"
                    className={`cat-pill${formData.category === cat ? " selected" : ""}`}
                    onClick={() => setFormData({ ...formData, category:cat })}
                  >
                    <span>{CAT_ICONS[cat]}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
              {/* Hidden native select for form validation */}
              <input type="hidden" name="category" value={formData.category} required />
            </div>

            {/* ─ TAGS ─ */}
            <div>
              <p className="section-label">🔖 Product Tags</p>
              <input type="text" name="tags" value={formData.tags} placeholder="e.g. gaming, laptop, premium (comma-separated)" onChange={handleChange} className="cc-input" />
              {formData.tags && (
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginTop:"10px" }}>
                  {formData.tags.split(",").filter(t=>t.trim()).map((tag, i) => (
                    <span key={i} style={{ padding:"4px 14px", borderRadius:"999px", background:"#eef2ff", border:"1px solid #c7d2fe", color:"#4338ca", fontSize:"12px", fontWeight:700 }}>
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ─ IMAGE UPLOAD ─ */}
            <div>
              <p className="section-label">🖼️ Campaign Image</p>
              <div
                className={`upload-zone${dragOver ? " drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById("img-upload").click()}
              >
                <input id="img-upload" type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files[0])} style={{ display:"none" }} />
                {preview ? (
                  <div>
                    <img src={preview} alt="Preview" style={{ maxHeight:"200px", borderRadius:"14px", objectFit:"cover", maxWidth:"100%" }} />
                    <p style={{ marginTop:"10px", color:"#6366f1", fontSize:"13px", fontWeight:700 }}>Click to change image</p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize:"40px", marginBottom:"12px" }}>📸</div>
                    <p style={{ margin:0, color:"#0f172a", fontWeight:700, fontSize:"14px" }}>Drop image here or click to upload</p>
                    <p style={{ margin:"6px 0 0", color:"#94a3b8", fontSize:"13px" }}>Upload a high-quality product banner or campaign image</p>
                  </>
                )}
              </div>
            </div>

            {/* ─ FINANCIALS ─ */}
            <div>
              <p className="section-label">💰 Financial Details</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"16px" }}>
                <div>
                  <label style={{ display:"block", marginBottom:"8px", color:"#374151", fontWeight:700, fontSize:"13px" }}>
                    Product Price <span style={{ color:"#94a3b8", fontWeight:500 }}>(PKR)</span>
                  </label>
                  <input type="number" name="price" value={formData.price} placeholder="0" onChange={handleChange} className="cc-input" min="0" />
                </div>
                <div>
                  <label style={{ display:"block", marginBottom:"8px", color:"#374151", fontWeight:700, fontSize:"13px" }}>
                    Commission Rate <span style={{ color:"#94a3b8", fontWeight:500 }}>(%)</span>
                  </label>
                  <input type="number" name="commissionRate" value={formData.commissionRate} placeholder="0" onChange={handleChange} className="cc-input" min="0" max="100" />
                </div>
                <div>
                  <label style={{ display:"block", marginBottom:"8px", color:"#374151", fontWeight:700, fontSize:"13px" }}>
                    Total Budget <span style={{ color:"#94a3b8", fontWeight:500 }}>(PKR)</span>
                  </label>
                  <input type="number" name="totalBudget" value={formData.totalBudget} placeholder="0" onChange={handleChange} className="cc-input" min="0" />
                </div>
              </div>

              {/* Live financial preview */}
              {(price > 0 || commission > 0) && (
                <div style={{
                  marginTop:"16px", padding:"18px 20px", borderRadius:"16px",
                  background:"linear-gradient(135deg,#ecfdf5,#d1fae5)",
                  border:"1.5px solid #bbf7d0",
                  display:"flex", gap:"24px", flexWrap:"wrap",
                }}>
                  {price > 0 && <div><p style={{ margin:"0 0 2px", fontSize:"11px", color:"#166534", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>Product Price</p><p style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#065f46" }}>PKR {price.toLocaleString()}</p></div>}
                  {earnPerSale && <div><p style={{ margin:"0 0 2px", fontSize:"11px", color:"#166534", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>Student Earns / Sale</p><p style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#065f46" }}>PKR {earnPerSale}</p></div>}
                  {commission > 0 && <div><p style={{ margin:"0 0 2px", fontSize:"11px", color:"#166534", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>Commission Rate</p><p style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#065f46" }}>{commission}%</p></div>}
                </div>
              )}
            </div>

            {/* ─ SUBMIT ─ */}
            <div style={{ height:"1px", background:"#f1f5f9" }} />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div style={{ width:"16px", height:"16px", borderRadius:"50%", border:"2.5px solid rgba(255,255,255,0.4)", borderTopColor:"white", animation:"spin 0.75s linear infinite" }} />
                  Creating Campaign…
                </>
              ) : (
                <> 🚀 Create Campaign </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCampaign;