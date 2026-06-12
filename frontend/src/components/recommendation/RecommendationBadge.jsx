const RecommendationBadge = () => {
  return (
    <span style={badge}>
      AI Recommended
    </span>
  );
};

const badge = {
  background: "#4CAF50",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: "5px",
  fontSize: "12px",
};

export default RecommendationBadge;