import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={navStyle}>
      <h2>UniBrandConnect</h2>
      {user && (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
};

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px",
  background: "#333",
  color: "#fff",
};

export default Navbar;