const Leaderboard = require(
  "../models/leaderboard"
);

// ==========================================
// GET LEADERBOARD
// ==========================================

const getLeaderboard = async (
  req,
  res
) => {

  try {

    const users =
      await Leaderboard.find()

      .populate(
        "student",
        "name university"
      )

      .sort({
        points: -1,
      });

    // Remove broken/null users
    const validUsers =
      users.filter(
        (u) => u.student
      );

    const formatted =
      validUsers.map(
        (u, index) => ({

          _id: u._id,

          rank: index + 1,

          name:
            u.student?.name ||
            "Unknown",

          university:
            u.student?.university ||
            "N/A",

          points: u.points,

          level: u.level,
        })
      );

    res.status(200).json({
      users: formatted,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET MY GAMIFICATION
// ==========================================

const getMyGamification =
  async (req, res) => {

    try {

      const studentId =
        req.user.id;

      // ====================================
      // FIND CURRENT USER
      // ====================================

      let currentUser =
        await Leaderboard.findOne({

          student: studentId,
        })

        .populate(
          "student",
          "name university"
        );

      // ====================================
      // AUTO CREATE PROFILE
      // ====================================

      if (!currentUser) {

        currentUser =
          await Leaderboard.create({

            student: studentId,

            points: 50,

            level: "Beginner",

            badges: [
              {
                title:
                  "Welcome Badge",

                description:
                  "Joined Gamification System",
              },
            ],

            achievements: [
              "First Login",
            ],

            referralsCompleted: 0,

            campaignsJoined: 0,
          });

        currentUser =
          await Leaderboard.findOne({

            student: studentId,
          })

          .populate(
            "student",
            "name university"
          );
      }

      // ====================================
      // GET ALL USERS
      // ====================================

      const allUsers =
        await Leaderboard.find()

        .populate(
          "student",
          "name university"
        )

        .sort({
          points: -1,
        });

      // ====================================
      // REMOVE INVALID USERS
      // ====================================

      const validUsers =
        allUsers.filter(
          (u) => u.student
        );

      // ====================================
      // FIND POSITION
      // ====================================

      const position =
        validUsers.findIndex(
          (u) =>
            u.student._id.toString() ===
            studentId
        ) + 1;

      // ====================================
      // RESPONSE
      // ====================================

      res.status(200).json({

        position,

        points:
          currentUser.points,

        level:
          currentUser.level,

        badges:
          currentUser.badges,

        achievements:
          currentUser.achievements,

        referralsCompleted:
          currentUser.referralsCompleted,

        campaignsJoined:
          currentUser.campaignsJoined,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  getLeaderboard,
  getMyGamification,
};