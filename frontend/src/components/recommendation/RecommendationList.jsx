import { useNavigate } from "react-router-dom";

const CATEGORY_COLORS = {
  General:   { bg:"#eef2ff", color:"#4338ca", dot:"#6366f1" },
  Fashion:   { bg:"#fdf2f8", color:"#9d174d", dot:"#ec4899" },
  Tech:      { bg:"#eff6ff", color:"#1e40af", dot:"#3b82f6" },
  Food:      { bg:"#fff7ed", color:"#9a3412", dot:"#f97316" },
  Health:    { bg:"#f0fdf4", color:"#166534", dot:"#22c55e" },
  Beauty:    { bg:"#fdf4ff", color:"#7e22ce", dot:"#a855f7" },
  Sports:    { bg:"#ecfdf5", color:"#065f46", dot:"#10b981" },
  Education: { bg:"#fefce8", color:"#854d0e", dot:"#eab308" },
};

const getCatStyle = (cat) =>
  CATEGORY_COLORS[cat] ||
  CATEGORY_COLORS.General;

const RecommendationList = ({
  recommendations = [],
}) => {

  const navigate = useNavigate();

  // ==========================================
  // NO RECOMMENDATIONS
  // ==========================================

  if (!recommendations.length) {

    return (
      <p>
        No recommendations available.
      </p>
    );
  }

  return (
    <>
      <style>{`

        .campaign-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);

          transition:
            transform 0.25s cubic-bezier(.34,1.56,.64,1),
            box-shadow 0.25s ease,
            border-color 0.2s ease;

          display: flex;
          flex-direction: column;
        }

        .campaign-card:hover {
          transform: translateY(-8px);

          box-shadow:
            0 24px 50px rgba(0,0,0,0.11);

          border-color: #c7d2fe;
        }

        .view-btn {
          width: 100%;
          padding: 15px;
          border-radius: 16px;
          border: none;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          color: white;

          font-weight: 700;
          font-size: 14px;
          cursor: pointer;

          box-shadow:
            0 8px 22px rgba(79,70,229,0.28);

          transition:
            transform 0.2s cubic-bezier(.34,1.56,.64,1),
            box-shadow 0.2s ease,
            filter 0.2s ease;
        }

        .view-btn:hover {
          transform: translateY(-2px);

          box-shadow:
            0 14px 30px rgba(79,70,229,0.38);

          filter: brightness(1.08);
        }

        .info-chip {
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          background: #f8fafc;
        }

      `}</style>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fill, minmax(320px, 1fr))",

          gap: "24px",
        }}
      >

        {recommendations.map((item) => {

          // recommendation structure support
          const campaign =
            item.campaign || item;

          const catStyle =
            getCatStyle(
              campaign.category || "General"
            );

          return (

            <div
              key={campaign._id}
              className="campaign-card"

              onClick={() =>
                navigate(
                  `/student/campaign/${campaign._id}`
                )
              }
            >

              {/* ================================= */}
              {/* IMAGE */}
              {/* ================================= */}

              <div
                style={{
                  position: "relative",
                }}
              >

                {campaign.image ? (

                  <img
                    src={`http://localhost:5000${campaign.image}`}

                    alt={campaign.title}

                    style={{
                      width: "100%",
                      height: "210px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                ) : (

                  <div
                    style={{
                      height: "210px",

                      background:
                        "linear-gradient(135deg, #1e1b4b, #4338ca, #6366f1)",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      fontSize: "52px",
                    }}
                  >
                    ✨
                  </div>
                )}

                {/* Gradient overlay */}

                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,

                    height: "60px",

                    background:
                      "linear-gradient(to top, rgba(15,23,42,0.35), transparent)",
                  }}
                />

                {/* Category badge */}

                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",

                    background: catStyle.bg,
                    color: catStyle.color,

                    padding: "6px 14px",

                    borderRadius: "999px",

                    fontSize: "12px",
                    fontWeight: "700",

                    display: "flex",
                    alignItems: "center",
                    gap: "6px",

                    boxShadow:
                      "0 2px 10px rgba(0,0,0,0.12)",
                  }}
                >

                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: catStyle.dot,
                    }}
                  />

                  {campaign.category || "General"}

                </div>

              </div>

              {/* ================================= */}
              {/* CONTENT */}
              {/* ================================= */}

              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >

                {/* Brand */}

                <p
                  style={{
                    margin: "0 0 6px",

                    fontSize: "12px",

                    color: "#94a3b8",

                    fontWeight: "700",

                    letterSpacing: "1px",

                    textTransform: "uppercase",
                  }}
                >
                  By {campaign.brandId?.name || "Brand"}
                </p>

                {/* Title */}

                <h2
                  style={{
                    margin: "0 0 16px",

                    fontSize: "20px",

                    fontWeight: "800",

                    color: "#0f172a",

                    lineHeight: 1.3,
                  }}
                >
                  {campaign.title}
                </h2>

                {/* Divider */}

                <div
                  style={{
                    height: "1px",
                    background: "#f1f5f9",
                    marginBottom: "16px",
                  }}
                />

                {/* Info section */}

                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns: "1fr 1fr",

                    gap: "10px",

                    marginBottom: "12px",
                  }}
                >

                  {/* Price */}

                  <div className="info-chip">

                    <p
                      style={{
                        margin: "0 0 4px",

                        fontSize: "11px",

                        color: "#94a3b8",

                        fontWeight: "700",

                        letterSpacing: "0.8px",

                        textTransform: "uppercase",
                      }}
                    >
                      Price
                    </p>

                    <p
                      style={{
                        margin: 0,

                        fontSize: "17px",

                        fontWeight: "800",

                        color: "#0f172a",
                      }}
                    >
                      Rs. {campaign.price}
                    </p>

                  </div>

                  {/* Commission */}

                  <div
                    style={{
                      padding: "14px 16px",

                      borderRadius: "16px",

                      background:
                        "linear-gradient(135deg,#dcfce7,#bbf7d0)",

                      border: "1px solid #86efac",
                    }}
                  >

                    <p
                      style={{
                        margin: "0 0 4px",

                        fontSize: "11px",

                        color: "#166534",

                        fontWeight: "700",

                        letterSpacing: "0.8px",

                        textTransform: "uppercase",
                      }}
                    >
                      Commission
                    </p>

                    <p
                      style={{
                        margin: 0,

                        fontSize: "17px",

                        fontWeight: "800",

                        color: "#166534",
                      }}
                    >
                      {campaign.commissionRate}%
                    </p>

                  </div>

                </div>

                {/* AI SCORE */}

                <div
                  style={{
                    marginBottom: "20px",

                    background:
                      "linear-gradient(135deg,#ede9fe,#ddd6fe)",

                    border: "1px solid #c4b5fd",

                    borderRadius: "16px",

                    padding: "14px 16px",
                  }}
                >

                  <p
                    style={{
                      margin: "0 0 4px",

                      fontSize: "11px",

                      color: "#6d28d9",

                      fontWeight: "700",

                      letterSpacing: "0.8px",

                      textTransform: "uppercase",
                    }}
                  >
                    AI Match Score
                  </p>

                  <p
                    style={{
                      margin: 0,

                      fontSize: "18px",

                      fontWeight: "800",

                      color: "#5b21b6",
                    }}
                  >
                    {item.recommendationScore || 0}
                  </p>

                </div>

                {/* BUTTON */}

                <div style={{ marginTop: "auto" }}>

                  <button
                    className="view-btn"

                    onClick={(e) => {

                      e.stopPropagation();

                      navigate(
                        `/student/campaign/${campaign._id}`
                      );
                    }}
                  >
                    View Campaign Details →
                  </button>

                </div>

              </div>

            </div>
          );
        })}
      </div>
    </>
  );
};

export default RecommendationList;