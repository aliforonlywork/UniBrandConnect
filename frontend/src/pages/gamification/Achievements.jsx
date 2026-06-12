import { useEffect, useState } from "react";
import { getAchievements } from "../../services/gamificationService";
import BadgeCard from "../../components/gamification/BadgeCard";

const Achievements = () => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAchievements();
      setBadges(res.data.badges);
    };

    fetch();
  }, []);

  return (
    <div>
      <h2>Achievements</h2>

      {badges.map((b) => (
        <BadgeCard key={b._id} badge={b} />
      ))}
    </div>
  );
};

export default Achievements;