import { useEffect, useState } from "react";
import { getLeaderboard, getUserRank } from "../../services/gamificationService";
import LeaderboardTable from "../../components/gamification/LeaderboardTable";
import UserRankCard from "../../components/gamification/UserRankCard";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [rank, setRank] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const lb = await getLeaderboard();
      const myRank = await getUserRank();

      setUsers(lb.data.users);
      setRank(myRank.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>

      <UserRankCard rank={rank} />

      <LeaderboardTable users={users} />
    </div>
  );
};

export default Leaderboard;