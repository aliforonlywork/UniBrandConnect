const WalletCard = ({ balance }) => {
  return (
    <div style={cardStyle}>
      <h3>Wallet Balance</h3>
      <h2>Rs {balance}</h2>
    </div>
  );
};

const cardStyle = {
  background: "#e0f7fa",
  padding: "20px",
  borderRadius: "8px",
};

export default WalletCard;