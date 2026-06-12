const RecommendationCard = ({ item }) => {
  return (
    <div style={card}>
      <h3>{item.campaign.title}</h3>
      <p>{item.campaign.description}</p>
      <p><strong>AI Score:</strong> {item.score}</p>
    </div>
  );
};

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "8px",
  background: "#fff",
};

export default RecommendationCard;