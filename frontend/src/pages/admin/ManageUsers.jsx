import { useEffect, useState } from "react";
import API from "../../services/api";

const ROLE_CONFIG = {
  student:    { bg:"linear-gradient(135deg,#dcfce7,#bbf7d0)", border:"#86efac",  color:"#166534", dot:"#22c55e",  icon:"🎓" },
  brand:      { bg:"linear-gradient(135deg,#dbeafe,#bfdbfe)", border:"#93c5fd",  color:"#1d4ed8", dot:"#3b82f6",  icon:"🏷️" },
  university: { bg:"linear-gradient(135deg,#ede9fe,#ddd6fe)", border:"#c4b5fd",  color:"#6d28d9", dot:"#7c3aed",  icon:"🏫" },
  admin:      { bg:"linear-gradient(135deg,#fee2e2,#fecaca)", border:"#fca5a5",  color:"#991b1b", dot:"#ef4444",  icon:"👑" },
};
const getRole = (r="student") => ROLE_CONFIG[r] || ROLE_CONFIG.student;

const STAT_CARDS = [
  { key:"total",      label:"Total Users",  icon:"👥", light:"#eef2ff", color:"#4338ca", bar:"linear-gradient(90deg,#6366f1,#818cf8)" },
  { key:"student",    label:"Students",     icon:"🎓", light:"#f0fdf4", color:"#166534", bar:"linear-gradient(90deg,#10b981,#34d399)" },
  { key:"brand",      label:"Brands",       icon:"🏷️", light:"#eff6ff", color:"#1d4ed8", bar:"linear-gradient(90deg,#3b82f6,#60a5fa)" },
  { key:"university", label:"Universities", icon:"🏫", light:"#f5f3ff", color:"#6d28d9", bar:"linear-gradient(90deg,#7c3aed,#a78bfa)" },
  { key:"admin",      label:"Admins",       icon:"👑", light:"#fef2f2", color:"#991b1b", bar:"linear-gradient(90deg,#ef4444,#f87171)" },
];

const ManageUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        console.log("USERS:", res.data);
        setUsers(res.data.users || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const counts = {
    total:      users.length,
    student:    users.filter(u => u.role === "student").length,
    brand:      users.filter(u => u.role === "brand").length,
    university: users.filter(u => u.role === "university").length,
    admin:      users.filter(u => u.role === "admin").length,
  };

  const filtered = users.filter((u) => {
    const matchRole   = filter === "all" || u.role === filter;
    const matchSearch = [u.name, u.email, u.university, u.role].some((f) =>
      (f || "").toLowerCase().includes(search.toLowerCase())
    );
    return matchRole && matchSearch;
  });

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background:"#f8fafc", fontFamily:"'Sora',sans-serif" }}>
        <div style={{ width:"40px", height:"40px", border:"3px solid #dbeafe", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.85s linear infinite", marginBottom:"18px" }} />
        <p style={{ margin:0, fontWeight:700, color:"#2563eb", fontSize:"16px" }}>Loading Users…</p>
        <p style={{ margin:"6px 0 0", color:"#94a3b8", fontSize:"13px" }}>Fetching platform users</p>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; }

        .stat-chip {
          background:#fff; border-radius:20px; padding:20px 22px;
          border:1.5px solid #f1f5f9; box-shadow:0 4px 14px rgba(0,0,0,0.05);
          cursor:pointer; position:relative; overflow:hidden;
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.18s ease;
        }
        .stat-chip:hover   { transform:translateY(-5px); box-shadow:0 16px 38px rgba(0,0,0,0.09); }
        .stat-chip.active  { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.14); }
        .stat-chip::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:20px 20px 0 0; }

        .user-row {
          transition:background 0.15s ease;
        }
        .user-row:hover td { background:#f0f9ff !important; }

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

        .filter-pill {
          padding:6px 16px; border-radius:999px;
          border:1.5px solid #e2e8f0; background:white;
          font-size:12px; font-weight:700; font-family:'Sora',sans-serif;
          cursor:pointer; color:#64748b; text-transform:capitalize;
          transition:all 0.16s ease;
        }
        .filter-pill:hover  { border-color:#818cf8; color:#4338ca; background:#eef2ff; }
        .filter-pill.active { background:linear-gradient(135deg,#2563eb,#4f46e5); color:white; border-color:transparent; box-shadow:0 4px 12px rgba(37,99,235,0.28); }

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
              <span className="pulse-dot" /> User Management
            </div>
            <h1 style={{ margin:0, fontSize:"36px", fontWeight:800, lineHeight:1.15 }}>User Management 👥</h1>
            <p style={{ marginTop:"12px", fontSize:"15px", opacity:0.82, lineHeight:1.7, maxWidth:"520px", fontWeight:400 }}>
              Manage students, brands, universities, and admins registered on the UniBrandConnect platform.
            </p>
          </div>
        </div>

        {/* ── STAT CHIPS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(170px, 1fr))", gap:"14px", marginBottom:"28px" }}>
          {STAT_CARDS.map((s, i) => (
            <div
              key={s.key}
              className={`stat-chip${filter === s.key || (s.key==="total" && filter==="all") ? " active" : ""}`}
              onClick={() => setFilter(s.key === "total" ? "all" : s.key)}
            >
              <style>{`.stat-chip:nth-child(${i+1})::before { background:${s.bar}; }`}</style>
              <div style={{ width:"36px", height:"36px", borderRadius:"11px", background:s.light, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", marginBottom:"10px" }}>{s.icon}</div>
              <h2 style={{ margin:"0 0 4px", fontSize:"28px", fontWeight:800, color:"#0f172a", lineHeight:1 }}>{counts[s.key]}</h2>
              <p style={{ margin:0, color:"#94a3b8", fontSize:"11px", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── TABLE CARD ── */}
        <div style={{ background:"#fff", borderRadius:"26px", padding:"34px", border:"1.5px solid #f1f5f9", boxShadow:"0 4px 22px rgba(0,0,0,0.05)", overflowX:"auto" }}>

          {/* Header row */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"14px", marginBottom:"18px" }}>
            <div>
              <h2 style={{ margin:"0 0 4px", fontSize:"20px", fontWeight:800, color:"#0f172a" }}>Registered Users</h2>
              <p style={{ margin:0, color:"#64748b", fontSize:"13px" }}>
                {filtered.length} of {users.length} users shown
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
              {/* Search */}
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"14px", pointerEvents:"none" }}>🔍</span>
                <input type="text" placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
              </div>
              {/* Live badge */}
              <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"#f0fdf4", padding:"7px 14px", borderRadius:"999px", border:"1px solid #bbf7d0" }}>
                <span className="pulse-dot" />
                <span style={{ fontSize:"12px", fontWeight:700, color:"#16a34a" }}>Live</span>
              </div>
            </div>
          </div>

          {/* Role filter pills */}
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"18px" }}>
            {["all","student","brand","university","admin"].map((r) => (
              <button key={r} className={`filter-pill${filter===r ? " active" : ""}`} onClick={() => setFilter(r)} style={{ textTransform:"capitalize" }}>
                {r === "all" ? "All Roles" : r}
              </button>
            ))}
          </div>

          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"14px" }} />

          {/* Empty */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"50px 20px", background:"#f8fafc", borderRadius:"18px", border:"1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize:"44px", marginBottom:"12px" }}>👥</div>
              <h3 style={{ margin:"0 0 6px", color:"#0f172a", fontSize:"18px", fontWeight:800 }}>
                {search || filter !== "all" ? "No Results Found" : "No Users Found"}
              </h3>
              <p style={{ color:"#64748b", margin:0, fontSize:"14px" }}>
                {search ? `No users match "${search}".` : "No user records available."}
              </p>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 8px", minWidth:"800px" }}>
              <thead>
                <tr>
                  {["User","Email","Role","University","Status"].map((h) => (
                    <th key={h} style={{ textAlign:"left", padding:"10px 18px", color:"#94a3b8", fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const roleCfg = getRole(user.role);
                  return (
                    <tr key={user._id} className="user-row">

                      {/* User */}
                      <td style={{ padding:"14px 18px", background:"#f8fafc", borderRadius:"16px 0 0 16px", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", borderLeft:"1.5px solid #f1f5f9", transition:"background 0.15s ease" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                          <div style={{
                            width:"38px", height:"38px", borderRadius:"50%", flexShrink:0,
                            background:`linear-gradient(135deg,${roleCfg.dot},${roleCfg.dot}aa)`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            color:"white", fontWeight:800, fontSize:"14px",
                          }}>
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p style={{ margin:0, fontWeight:700, color:"#0f172a", fontSize:"14px" }}>{user.name}</p>
                            <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#94a3b8", fontWeight:500, textTransform:"capitalize" }}>{user.role} account</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding:"14px 18px", background:"#f8fafc", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", transition:"background 0.15s ease" }}>
                        <span style={{ color:"#334155", fontSize:"13px", fontWeight:500 }}>{user.email}</span>
                      </td>

                      {/* Role */}
                      <td style={{ padding:"14px 18px", background:"#f8fafc", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", transition:"background 0.15s ease" }}>
                        <span style={{
                          display:"inline-flex", alignItems:"center", gap:"5px",
                          padding:"5px 12px", borderRadius:"999px",
                          background:roleCfg.bg, border:`1.5px solid ${roleCfg.border}`,
                          color:roleCfg.color, fontSize:"11px", fontWeight:700, textTransform:"capitalize",
                        }}>
                          <span style={{ fontSize:"13px" }}>{roleCfg.icon}</span>
                          {user.role}
                        </span>
                      </td>

                      {/* University */}
                      <td style={{ padding:"14px 18px", background:"#f8fafc", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", transition:"background 0.15s ease" }}>
                        {user.university ? (
                          <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"5px 12px", borderRadius:"999px", background:"#eef2ff", border:"1px solid #c7d2fe", color:"#4338ca", fontSize:"12px", fontWeight:700 }}>
                            🏫 {user.university}
                          </span>
                        ) : (
                          <span style={{ color:"#94a3b8", fontSize:"13px" }}>—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding:"14px 18px", background:"#f8fafc", borderRadius:"0 16px 16px 0", borderTop:"1.5px solid #f1f5f9", borderBottom:"1.5px solid #f1f5f9", borderRight:"1.5px solid #f1f5f9", transition:"background 0.15s ease" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", background:"linear-gradient(135deg,#dcfce7,#bbf7d0)", border:"1px solid #86efac", color:"#166534", padding:"5px 12px", borderRadius:"999px", fontSize:"11px", fontWeight:700 }}>
                          <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#22c55e" }} />
                          Active
                        </span>
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

export default ManageUsers;