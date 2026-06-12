import { useEffect, useState } from "react";
import {
  getLeaderboard,
  getMyGamification,
} from "../../services/gamificationService";
import BadgeCard from "../../components/gamification/BadgeCard";

const StudentGamification = () => {
  const [users,  setUsers]  = useState([]);
  const [myData, setMyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderboardRes = await getLeaderboard();
        const myRes          = await getMyGamification();
        setUsers(leaderboardRes.data.users);
        setMyData(myRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const points   = myData?.points || 0;
  const goal     = 5000;
  const progress = Math.min((points / goal) * 100, 100);

  const LEVEL_CONFIG = {
    Bronze: { bg:"linear-gradient(135deg,#92400e,#b45309)", glow:"rgba(245,158,11,0.3)"   },
    Silver: { bg:"linear-gradient(135deg,#374151,#6b7280)", glow:"rgba(156,163,175,0.3)"  },
    Gold:   { bg:"linear-gradient(135deg,#78350f,#d97706)", glow:"rgba(251,191,36,0.35)"  },
  };
  const level  = myData?.level || "Bronze";
  const lvlCfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.Bronze;

  // ── rank card colors ──────────────────────────────────────────────────────
  // API may return rank as myData.rank, myData.userRank, myData.position, etc.
  const myRank       = myData?.rank ?? myData?.userRank ?? myData?.position ?? null;
  // Badges count: may be an array OR a number field (badgeCount / badgesCount)
  const myBadgeCount = Array.isArray(myData?.badges)
    ? myData.badges.length
    : (myData?.badgeCount ?? myData?.badgesCount ?? myData?.totalBadges ?? 0);

  const RANK_META = [
    { label:"Current Points",  icon:"⭐", value: points.toLocaleString(),              light:"#eef2ff", color:"#4338ca",  bar:"linear-gradient(90deg,#6366f1,#818cf8)" },
    { label:"Current Level",   icon:"🏅", value: level,                                light:"#fffbeb", color:"#92400e",  bar:"linear-gradient(90deg,#f59e0b,#fbbf24)" },
    { label:"Rank",            icon:"📊", value: myRank ? `#${myRank}` : "—",          light:"#fdf2f8", color:"#9d174d",  bar:"linear-gradient(90deg,#ec4899,#f472b6)" },
    { label:"Badges Earned",   icon:"🎖️", value: myBadgeCount,                         light:"#f0fdf4", color:"#166534",  bar:"linear-gradient(90deg,#10b981,#34d399)" },
  ];

  // ── leaderboard medal helper ──────────────────────────────────────────────
  const MEDAL = ["🥇","🥈","🥉"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .gam-card {
          background: #fff;
          border-radius: 24px;
          padding: 30px;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: box-shadow 0.22s ease, transform 0.22s cubic-bezier(.34,1.56,.64,1);
        }
        .gam-card:hover {
          box-shadow: 0 14px 40px rgba(0,0,0,0.09);
          transform: translateY(-3px);
        }

        /* ── rank stat chips ── */
        .rank-chip {
          background:#fff; border-radius:20px; padding:20px 18px;
          border:1.5px solid #f1f5f9;
          box-shadow:0 4px 14px rgba(0,0,0,0.05);
          position:relative; overflow:hidden;
          transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          cursor:default;
        }
        .rank-chip:hover { transform:translateY(-5px); box-shadow:0 16px 38px rgba(0,0,0,0.09); }
        .rank-chip::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:20px 20px 0 0; }

        /* ── badge ── */
        .badge-wrap {
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1);
          cursor: default;
        }
        .badge-wrap:hover { transform: translateY(-6px) scale(1.04); }

        /* ── progress ── */
        .progress-bar-track {
          background: #eef2ff;
          border-radius: 999px;
          height: 14px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #6366f1, #818cf8, #a78bfa, #818cf8, #6366f1);
          background-size: 300% 100%;
          animation: shimmer 2.5s linear infinite;
          transition: width 0.8s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }

        /* ── leaderboard table ── */
        .lb-row {
          transition: background 0.15s ease, transform 0.18s ease;
          cursor:default;
        }
        .lb-row:hover td { background:#f0f9ff !important; }
        .lb-row.top1:hover td { background:#fffbeb !important; }
        .lb-row.top2:hover td { background:#f8fafc !important; }
        .lb-row.top3:hover td { background:#fdf4ff !important; }

        .pulse-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #10b981;
          display: inline-block;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.45); }
        }

        .empty-state {
          width: 100%;
          padding: 32px 20px;
          border-radius: 18px;
          background: #f8fafc;
          border: 1.5px dashed #e2e8f0;
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>

      <div style={{ minHeight:"100vh", padding:"36px 40px", background:"#f8fafc", fontFamily:"'Sora', sans-serif" }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
          padding:"44px 48px", borderRadius:"28px", color:"white",
          marginBottom:"28px",
          boxShadow:"0 20px 60px rgba(99,102,241,0.30)",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", right:"-40px", top:"-40px", width:"240px", height:"240px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", right:"80px", bottom:"-70px", width:"160px", height:"160px", background:"rgba(255,255,255,0.04)", borderRadius:"50%" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
              <span className="pulse-dot" />
              <span style={{ fontSize:"12px", fontWeight:700, color:"#a5b4fc", letterSpacing:"2px", textTransform:"uppercase" }}>Live Leaderboard</span>
            </div>
            <h1 style={{ margin:0, fontSize:"38px", fontWeight:800, lineHeight:1.1 }}>Gamification Center 🏆</h1>
            <p style={{ marginTop:"14px", fontSize:"16px", opacity:0.8, maxWidth:"560px", lineHeight:1.7, fontWeight:400 }}>
              Track your achievements, climb the leaderboard, unlock rewards, and grow your influence as a top student marketer.
            </p>
          </div>
        </div>

        {/* ══ UPGRADED USER RANK SECTION ══ */}
        <div style={{ marginBottom:"28px" }}>
          {/* Rank stat chips */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:"16px", marginBottom:"20px" }}>
            {RANK_META.map((s, i) => (
              <div key={s.label} className="rank-chip">
                <style>{`.rank-chip:nth-child(${i+1})::before { background:${s.bar}; }`}</style>
                <div style={{ width:"38px", height:"38px", borderRadius:"12px", background:s.light, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", marginBottom:"12px" }}>{s.icon}</div>
                <p style={{ margin:"0 0 4px", fontSize:"11px", fontWeight:700, color:"#94a3b8", letterSpacing:"0.8px", textTransform:"uppercase" }}>{s.label}</p>
                <h2 style={{ margin:0, fontSize:"26px", fontWeight:800, color:"#0f172a", lineHeight:1 }}>{s.value}</h2>
              </div>
            ))}
          </div>

          {/* Profile rank banner */}
          <div style={{
            background:"linear-gradient(135deg,#1e1b4b,#312e81,#4338ca)",
            borderRadius:"22px", padding:"28px 32px",
            display:"flex", alignItems:"center", gap:"24px", flexWrap:"wrap",
            boxShadow:"0 12px 36px rgba(99,102,241,0.22)", position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", right:"-20px", top:"-20px", width:"120px", height:"120px", background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
            {/* Avatar */}
            <div style={{
              width:"70px", height:"70px", borderRadius:"50%", flexShrink:0,
              background:"linear-gradient(135deg,#6366f1,#ec4899)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"28px", fontWeight:800, color:"white",
              boxShadow:"0 8px 22px rgba(99,102,241,0.40)",
            }}>
              {myData?.name?.charAt(0)?.toUpperCase() || "🎓"}
            </div>
            <div style={{ flex:1, minWidth:"180px" }}>
              <p style={{ margin:"0 0 4px", fontSize:"11px", color:"#a5b4fc", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>Your Standing</p>
              <h2 style={{ margin:"0 0 6px", fontSize:"22px", fontWeight:800, color:"white" }}>
                {myData?.name || "Student"} · {level} {level === "Gold" ? "🥇" : level === "Silver" ? "🥈" : "🥉"}
              </h2>
              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                <span style={{ padding:"4px 12px", borderRadius:"999px", background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.18)", color:"#c7d2fe", fontSize:"12px", fontWeight:700 }}>
                  ⭐ {points.toLocaleString()} pts
                </span>
                {myRank && (
                  <span style={{ padding:"4px 12px", borderRadius:"999px", background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.18)", color:"#c7d2fe", fontSize:"12px", fontWeight:700 }}>
                    Rank #{myRank}
                  </span>
                )}
              </div>
            </div>
            {/* Mini progress */}
            <div style={{ minWidth:"180px", flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                <span style={{ fontSize:"12px", color:"#a5b4fc", fontWeight:600 }}>Goal Progress</span>
                <span style={{ fontSize:"12px", color:"white", fontWeight:800 }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height:"8px", borderRadius:"999px", background:"rgba(255,255,255,0.15)", overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:"999px", width:`${progress}%`, background:"linear-gradient(90deg,#818cf8,#a5b4fc)", transition:"width 0.8s ease" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px" }}>
                <span style={{ fontSize:"11px", color:"#a5b4fc" }}>{points.toLocaleString()} pts</span>
                <span style={{ fontSize:"11px", color:"#a5b4fc" }}>{goal.toLocaleString()} pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TWO-COL GRID (unchanged) ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:"22px", marginBottom:"28px" }}>

          {/* ACHIEVEMENTS */}
          <div className="gam-card">
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
              <div style={{ width:"38px", height:"38px", borderRadius:"12px", background:"linear-gradient(135deg,#fbbf24,#f59e0b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", boxShadow:"0 4px 12px rgba(251,191,36,0.35)" }}>🎖️</div>
              <h2 style={{ margin:0, fontSize:"20px", fontWeight:800, color:"#0f172a" }}>Achievements</h2>
            </div>
            <p style={{ margin:"8px 0 18px", color:"#64748b", fontSize:"14px", lineHeight:1.6 }}>Unlock badges by completing campaigns and improving your marketing performance.</p>
            <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"18px" }} />
            <div style={{ display:"flex", gap:"14px", flexWrap:"wrap" }}>
              {myData?.badges?.length > 0 ? (
                myData.badges.map((badge, index) => (
                  <div key={index} className="badge-wrap"><BadgeCard badge={badge} /></div>
                ))
              ) : (
                <div className="empty-state">
                  <div style={{ fontSize:"28px", marginBottom:"8px" }}>🔒</div>
                  No badges unlocked yet. Complete campaigns to earn your first badge!
                </div>
              )}
            </div>
          </div>

          {/* REWARDS PROGRESS */}
          <div className="gam-card">
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
              <div style={{ width:"38px", height:"38px", borderRadius:"12px", background:"linear-gradient(135deg,#6366f1,#818cf8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", boxShadow:"0 4px 12px rgba(99,102,241,0.35)" }}>🚀</div>
              <h2 style={{ margin:0, fontSize:"20px", fontWeight:800, color:"#0f172a" }}>Rewards Progress</h2>
            </div>
            <p style={{ margin:"8px 0 18px", color:"#64748b", fontSize:"14px", lineHeight:1.6 }}>Reach {goal.toLocaleString()} points to unlock the exclusive Gold Student Reward.</p>
            <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"20px" }} />
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
              <span style={{ fontSize:"13px", fontWeight:600, color:"#64748b", letterSpacing:"0.5px", textTransform:"uppercase" }}>Progress</span>
              <span style={{ fontSize:"13px", fontWeight:700, color:"#6366f1" }}>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px" }}>
              <span style={{ fontSize:"14px", fontWeight:700, color:"#0f172a" }}>{points.toLocaleString()} pts</span>
              <span style={{ fontSize:"13px", color:"#94a3b8" }}>Goal: {goal.toLocaleString()}</span>
            </div>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"22px" }}>
              {[250,500,750,1000].map((m) => {
                const reached = points >= m;
                return (
                  <div key={m} style={{ padding:"5px 14px", borderRadius:"999px", fontSize:"12px", fontWeight:700, background: reached ? "linear-gradient(135deg,#6366f1,#818cf8)" : "#f1f5f9", color: reached ? "#fff" : "#94a3b8", boxShadow: reached ? "0 3px 10px rgba(99,102,241,0.3)" : "none", transition:"0.3s" }}>
                    {reached ? "✓ " : ""}{m}
                  </div>
                );
              })}
            </div>
            <div style={{ padding:"26px", borderRadius:"20px", background:lvlCfg.bg, color:"white", boxShadow:`0 12px 30px ${lvlCfg.glow}`, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:"-20px", top:"-20px", width:"100px", height:"100px", background:"rgba(255,255,255,0.06)", borderRadius:"50%" }} />
              <p style={{ margin:0, fontSize:"12px", fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", opacity:0.75 }}>Current Level</p>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"10px 0" }}>
                <span style={{ fontSize:"40px", fontWeight:800, lineHeight:1 }}>{level}</span>
                <span style={{ fontSize:"28px" }}>{level === "Gold" ? "🥇" : level === "Silver" ? "🥈" : "🥉"}</span>
              </div>
              <p style={{ margin:0, fontSize:"13px", opacity:0.8, lineHeight:1.6 }}>Keep participating in campaigns and earning points to unlock higher reward tiers.</p>
            </div>
          </div>
        </div>

        {/* ══ UPGRADED LEADERBOARD ══ */}
        <div className="gam-card" style={{ padding:"34px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"22px", flexWrap:"wrap", gap:"12px" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
                <div style={{ width:"38px", height:"38px", borderRadius:"12px", background:"linear-gradient(135deg,#ec4899,#f472b6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", boxShadow:"0 4px 12px rgba(236,72,153,0.35)" }}>👑</div>
                <h2 style={{ margin:0, fontSize:"20px", fontWeight:800, color:"#0f172a" }}>Leaderboard</h2>
              </div>
              <p style={{ margin:"4px 0 0", color:"#64748b", fontSize:"14px", lineHeight:1.6 }}>Top-performing student marketers ranked by activity, referrals, earnings, and campaign performance.</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"#f0fdf4", padding:"8px 16px", borderRadius:"100px", border:"1px solid #bbf7d0", flexShrink:0 }}>
              <span className="pulse-dot" />
              <span style={{ fontSize:"13px", fontWeight:600, color:"#16a34a" }}>Live</span>
            </div>
          </div>
          <div style={{ height:"1px", background:"#f1f5f9", marginBottom:"22px" }} />

          {users.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize:"32px", marginBottom:"10px" }}>👑</div>
              No leaderboard data yet. Start engaging to appear here!
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 10px", minWidth:"500px" }}>
              <thead>
                <tr>
                  {["Rank","Student","Points","Level","Badges"].map((h) => (
                    <th key={h} style={{ textAlign:"left", padding:"8px 16px", color:"#94a3b8", fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const isTop = index < 3;
                  const topClass = index === 0 ? "top1" : index === 1 ? "top2" : index === 2 ? "top3" : "";
                  const rowBg = index === 0
                    ? "linear-gradient(135deg,#fffbeb,#fef3c7)"
                    : index === 1
                    ? "#f8fafc"
                    : index === 2
                    ? "linear-gradient(135deg,#fdf4ff,#fce7f3)"
                    : "#f8fafc";
                  const rankColor = index === 0 ? "#92400e" : index === 1 ? "#374151" : index === 2 ? "#6d28d9" : "#94a3b8";
                  const rankBorder = index === 0 ? "#fcd34d" : index === 1 ? "#d1d5db" : index === 2 ? "#ddd6fe" : "#f1f5f9";

                  return (
                    <tr key={user._id || index} className={`lb-row ${topClass}`}>
                      {/* Rank */}
                      <td style={{ padding:"14px 16px", background:rowBg, borderRadius:"16px 0 0 16px", borderTop:`1.5px solid ${rankBorder}`, borderBottom:`1.5px solid ${rankBorder}`, borderLeft:`1.5px solid ${rankBorder}` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                          {isTop ? (
                            <span style={{ fontSize:"22px" }}>{MEDAL[index]}</span>
                          ) : (
                            <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:800, color:"#64748b" }}>
                              {index + 1}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Student */}
                      <td style={{ padding:"14px 16px", background:rowBg, borderTop:`1.5px solid ${rankBorder}`, borderBottom:`1.5px solid ${rankBorder}` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                          <div style={{
                            width:"36px", height:"36px", borderRadius:"50%", flexShrink:0,
                            background: index === 0
                              ? "linear-gradient(135deg,#f59e0b,#fbbf24)"
                              : index === 1
                              ? "linear-gradient(135deg,#64748b,#94a3b8)"
                              : index === 2
                              ? "linear-gradient(135deg,#a855f7,#d8b4fe)"
                              : "linear-gradient(135deg,#6366f1,#818cf8)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            color:"white", fontWeight:800, fontSize:"14px",
                            boxShadow: isTop ? `0 4px 10px ${rankColor}44` : "none",
                          }}>
                            {(user.name||"S").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ margin:0, fontWeight:700, color:"#0f172a", fontSize:"14px" }}>{user.name || "Student"}</p>
                            <p style={{ margin:0, fontSize:"11px", color:"#94a3b8" }}>{user.email || "student@uni.edu"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Points */}
                      <td style={{ padding:"14px 16px", background:rowBg, borderTop:`1.5px solid ${rankBorder}`, borderBottom:`1.5px solid ${rankBorder}` }}>
                        <div style={{
                          display:"inline-flex", alignItems:"center", gap:"5px",
                          padding:"5px 14px", borderRadius:"999px",
                          background: index === 0 ? "linear-gradient(135deg,#fef3c7,#fde68a)" : "linear-gradient(135deg,#eef2ff,#e0e7ff)",
                          border: index === 0 ? "1px solid #fcd34d" : "1px solid #c7d2fe",
                          color: index === 0 ? "#92400e" : "#4338ca",
                          fontSize:"13px", fontWeight:800,
                        }}>
                          ⭐ {(user.points || 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Level */}
                      <td style={{ padding:"14px 16px", background:rowBg, borderTop:`1.5px solid ${rankBorder}`, borderBottom:`1.5px solid ${rankBorder}` }}>
                        <span style={{ fontSize:"13px", fontWeight:700, color:rankColor }}>
                          {user.level || "Bronze"}
                        </span>
                      </td>

                      {/* Badges */}
                          {/* Badges */}
                      <td style={{ padding:"14px 16px", background:rowBg, borderRadius:"0 16px 16px 0", borderTop:`1.5px solid ${rankBorder}`, borderBottom:`1.5px solid ${rankBorder}`, borderRight:`1.5px solid ${rankBorder}` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                          <span style={{ fontSize:"16px" }}>🎖️</span>
                          <span style={{ fontSize:"13px", fontWeight:700, color:"#0f172a" }}>
                            {Array.isArray(user.badges)
                              ? user.badges.length
                              : (user.badgeCount ?? user.badgesCount ?? user.totalBadges ?? user.badges ?? 0)}
                          </span>
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

export default StudentGamification;