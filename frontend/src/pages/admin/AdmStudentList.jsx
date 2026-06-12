import { useEffect, useState } from "react";
import API from "../../services/api";

const AdmStudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/admin/admstudentlist");
        setStudents(res.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter((s) =>
    [s.name, s.email, s.university].some((f) =>
      (f || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ width:"40px", height:"40px", border:"3px solid #dbeafe", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.85s linear infinite", marginBottom:"18px" }} />
        <p style={{ margin:0, fontWeight:700, color:"#2563eb", fontSize:"16px" }}>Loading Students…</p>
        <p style={{ margin:"6px 0 0", color:"#94a3b8", fontSize:"13px" }}>Fetching student records</p>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .student-row {
          transition:background 0.15s ease, box-shadow 0.15s ease;
        }
        .student-row:hover td { background:#f0f9ff !important; }

        .search-input {
          padding:11px 18px 11px 42px;
          border-radius:14px; border:1.5px solid #e2e8f0;
          background:#f8fafc; font-size:14px;
          font-family:'Sora',sans-serif; font-weight:500;
          color:#0f172a; outline:none; width:260px;
          transition:border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .search-input:focus { border-color:#2563eb; box-shadow:0 0 0 4px rgba(37,99,235,0.10); background:#fff; }
        .search-input::placeholder { color:#94a3b8; }

        .pulse-dot {
          width:8px; height:8px; border-radius:50%; background:#10b981;
          display:inline-block; animation:pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.45);} }
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
              <span className="pulse-dot" /> Student Management
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>Student Management 🎓</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Monitor registered students, universities, and platform activity in one professional dashboard.
            </p>
          </div>

          {/* Count card */}
          <div style={{
            background:"rgba(255,255,255,0.10)", border:"1.5px solid rgba(255,255,255,0.18)",
            padding:"22px 32px", borderRadius:"20px", backdropFilter:"blur(10px)",
            position:"relative", zIndex:1, textAlign:"center", minWidth:"180px",
          }}>
            <p style={{ margin:"0 0 6px", fontSize:"11px", color:"#93c5fd", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>Total Students</p>
            <h2 style={{ margin:0, fontSize:"44px", fontWeight:800, lineHeight:1 }}>{students.length}</h2>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", marginTop:"8px" }}>
              <span className="pulse-dot" />
              <span style={{ fontSize:"11px", fontWeight:700, color:"#86efac" }}>Active</span>
            </div>
          </div>
        </div>

        {/* ── TABLE CARD ── */}
        <div style={{ background:"#fff", borderRadius:"26px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 22px rgba(0,0,0,0.05)", overflowX:"auto" }}>

          {/* Table header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"14px", marginBottom:"22px" }}>
            <div>
              <h2 style={{ margin:"0 0 4px", fontSize:"20px", fontWeight:800, color:"#0f172a" }}>Registered Students</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"13px" }}>
                {filtered.length} of {students.length} students shown
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
              {/* Search */}
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"15px", pointerEvents:"none" }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, email, university…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
              {/* Status badge */}
              <div style={{ display:"flex", alignItems:"center", gap:"7px", background:"#f0fdf4", padding:"8px 16px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"13px", fontWeight:700, color:"#16a34a" }}>Active Database</span>
              </div>
            </div>
          </div>

          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"16px" }} />

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", background:"#f8fafc", borderRadius:"18px", border:"1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize:"48px", marginBottom:"14px" }}>🎓</div>
              <h3 style={{ margin:"0 0 8px", color:"#0f172a", fontSize:"20px", fontWeight:800 }}>
                {search ? "No Results Found" : "No Students Found"}
              </h3>
              <p style={{ color:"#64748b", margin:0, fontSize:"14px" }}>
                {search ? `No students match "${search}".` : "No student records are available at the moment."}
              </p>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 8px", minWidth:"800px" }}>
              <thead>
                <tr>
                  {["Student","Email Address","University","Status"].map((h) => (
                    <th key={h} style={{ textAlign:"left", padding:"10px 18px", color:"#94a3b8", fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student._id} className="student-row">

                    {/* Student */}
                    <td style={{ padding:"16px 18px", background:"#f8fafc", borderRadius:"16px 0 0 16px", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", borderLeft:"1.5px solid #f1f5f9" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                        <div style={{
                          width:"42px", height:"42px", borderRadius:"50%", flexShrink:0,
                          background:"linear-gradient(135deg,#3b82f6,#6366f1)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color:"white", fontWeight:800, fontSize:"16px",
                          boxShadow:"0 4px 12px rgba(59,130,246,0.28)",
                        }}>
                          {student.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                        <div>
                          <p style={{ margin:0, fontWeight:700, color:"#0f172a", fontSize:"14px" }}>{student.name}</p>
                          <p style={{ margin:"2px 0 0", fontSize:"12px", color:"#94a3b8", fontWeight:500 }}>Student Account</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding:"16px 18px", background:"#f8fafc", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9" }}>
                      <span style={{ color:"#334155", fontWeight:600, fontSize:"13px" }}>{student.email}</span>
                    </td>

                    {/* University */}
                    <td style={{ padding:"16px 18px", background:"#f8fafc", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9" }}>
                      <span style={{
                        display:"inline-flex", alignItems:"center", gap:"6px",
                        background:"#eef2ff", color:"#4338ca",
                        padding:"6px 14px", borderRadius:"999px",
                        fontSize:"12px", fontWeight:700, border:"1px solid #c7d2fe",
                      }}>
                        🏫 {student.university || "N/A"}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding:"16px 18px", background:"#f8fafc", borderRadius:"0 16px 16px 0", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", borderRight:"1.5px solid #f1f5f9" }}>
                      {student.status === "Inactive" ? (
                        <span style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"linear-gradient(135deg,#fee2e2,#fecaca)", border:"1px solid #fca5a5", color:"#991b1b", padding:"6px 14px", borderRadius:"999px", fontSize:"12px", fontWeight:700 }}>
                          <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#ef4444" }} />
                          Inactive
                        </span>
                      ) : (
                        <span style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"linear-gradient(135deg,#dcfce7,#bbf7d0)", border:"1px solid #86efac", color:"#166534", padding:"6px 14px", borderRadius:"999px", fontSize:"12px", fontWeight:700 }}>
                          <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e" }} />
                          {student.status || "Active"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default AdmStudentList;