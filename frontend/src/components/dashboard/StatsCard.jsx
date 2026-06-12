function StatsCard({ title, value }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "20px",
      borderRadius: "10px",
      margin: "10px"
    }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default StatsCard;