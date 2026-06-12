import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={sidebarStyle}>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/campaigns">Campaigns</Link>
      <Link to="/wallet">Wallet</Link>
    </div>
  );
};

const sidebarStyle = {
  width: "200px",
  padding: "20px",
  background: "#f5f5f5",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export default Sidebar;