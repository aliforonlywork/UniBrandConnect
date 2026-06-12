const UserRankCard = ({ rank }) => {
  if (!rank) return null;

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
      }}
    >
      <h2>Your Gamification Stats</h2>

      <p>
        <strong>Rank:</strong> #{rank.position}
      </p>

      <p>
        <strong>Points:</strong> {rank.points}
      </p>

      <p>
        <strong>Level:</strong>
        {" "}
        {rank.level}
      </p>

      <p>
        <strong>Level:</strong> {rank.level}
      </p>

      <p>
        <strong>Referrals:</strong> {rank.referralsCompleted}
      </p>

      <p>
        <strong>Campaigns Joined:</strong> {rank.campaignsJoined}
      </p>
    </div>
  );
};

export default UserRankCard;
