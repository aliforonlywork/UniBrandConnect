const ErrorMessage = ({ message }) => {
  return (
    <div style={{ color: "red", padding: "10px" }}>
      {message}
    </div>
  );
};

export default ErrorMessage;