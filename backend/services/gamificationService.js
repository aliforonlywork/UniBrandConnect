const Leaderboard = require(
  "../models/leaderboard"
);

const calculateLevel = (
  points
) => {

  if (points >= 1000)
    return "Brand Ambassador";

  if (points >= 500)
    return "Campus Influencer";

  if (points >= 250)
    return "Advanced";

  if (points >= 100)
    return "Intermediate";

  return "Beginner";
};

const updateGamification =
  async (
    studentId,
    pointsToAdd
  ) => {

    let user =
      await Leaderboard.findOne({
        student: studentId,
      });

    // Auto create
    if (!user) {

      user =
        await Leaderboard.create({
          student: studentId,
          points: 0,
          badges: [],
          achievements: [],
          referralsCompleted: 0,
          campaignsJoined: 0,
        });
    }

    // Add points
    user.points += pointsToAdd;

    // Update level
    user.level =
      calculateLevel(
        user.points
      );

    // Badge system
    if (
      user.points >= 100 &&
      !user.badges.some(
        (b) =>
          b.title ===
          "Rising Star"
      )
    ) {

      user.badges.push({
        title: "Rising Star",
        description:
          "Reached 100 points",
      });
    }

    if (
      user.points >= 500 &&
      !user.badges.some(
        (b) =>
          b.title ===
          "Top Influencer"
      )
    ) {

      user.badges.push({
        title:
          "Top Influencer",

        description:
          "Reached 500 points",
      });
    }

    await user.save();

    return user;
  };

module.exports = {
  updateGamification,
};