const Toast = ({ message }) => {
  return (
    <div style={toastStyle}>
      {message}
    </div>
  );
};

const toastStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  background: "#333",
  color: "#fff",
  padding: "10px",
  borderRadius: "5px",
};

export default Toast;