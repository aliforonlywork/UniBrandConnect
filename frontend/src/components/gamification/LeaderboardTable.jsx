const LeaderboardTable = ({ users }) => {
  return (
    <table
      border="1"
      cellPadding="10"
      width="100%"
      style={{ background: "white" }}
    >
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>University</th>
          <th>Level</th>
          <th>Points</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u, index) => (
          <tr key={u._id}>
            <td>
  {index === 0 && "🥇"}
  {index === 1 && "🥈"}
  {index === 2 && "🥉"}

  {index > 2 && index + 1}
</td>
            <td>{u.name}</td>
            <td>{u.university}</td>
            <td>{u.level}</td>
            <td>{u.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
