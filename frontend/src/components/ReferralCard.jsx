import { useState } from "react";

const ReferralCard = ({ referralCode, totalReferrals }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={cardStyle}>
      <h3>Your Referral Code</h3>

      <div style={codeBox}>
        <span>{referralCode}</span>
        <button onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p>Total Referrals: <strong>{totalReferrals}</strong></p>
    </div>
  );
};

const cardStyle = {
  background: "#fff3cd",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
};

const codeBox = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
  marginBottom: "10px",
  padding: "10px",
  background: "#fff",
  borderRadius: "6px",
};

export default ReferralCard;