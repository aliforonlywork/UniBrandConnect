const BadgeCard = ({ badge }) => {
  return (
    <div
      style={{
        padding: "15px",
        background: "#f3f4f6",
        borderRadius: "10px",
        width: "200px",
      }}
    >
      <h4>{badge.title}</h4>
      <p>{badge.description}</p>
    </div>
  );
};

export default BadgeCard;
