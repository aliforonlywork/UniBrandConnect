import { useNavigate } from "react-router-dom";

function UniversityDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "230px",
        height: "100vh",
        background: "#2c3e50",
        color: "white",
        padding: "20px"
      }}>
        <h3>University Panel</h3>

        <p onClick={() => navigate("/university/dashboard")} style={link}>Dashboard</p>
        <p onClick={() => navigate("/university/students")} style={link}>Manage Students</p>
        <p onClick={() => navigate("/university/studentsList")} style={link}>Student List</p>
        <p onClick={() => navigate("/university/campaigns")} style={link}>Campaigns</p>
        <p onClick={() => navigate("/university/analytics")} style={link}>Analytics</p>

        <p onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }} style={{...link, color: "red"}}>Logout</p>
      </div>

      {/* Main */}
      <div style={{ padding: "20px", flex: 1 }}>
        <h1>Welcome {user?.name || "University"} 🎓</h1>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          
          <div style={card}>
            <h3>Students</h3>
            <button onClick={() => navigate("/university/students")}>View</button>
          </div>

          <div style={card}>
            <h3>Campaigns</h3>
            <button onClick={() => navigate("/university/campaigns")}>View</button>
          </div>

          <div style={card}>
            <h3>Analytics</h3>
            <button onClick={() => navigate("/university/analytics")}>View</button>
          </div>

        </div>
      </div>
    </div>
  );
}

const link = { cursor: "pointer", margin: "10px 0" };

const card = {
  border: "1px solid #ccc",
  padding: "20px",
  borderRadius: "10px",
  width: "220px",
  textAlign: "center"
};

export default UniversityDashboard;