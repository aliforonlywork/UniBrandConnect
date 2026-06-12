const crypto = require("crypto");

const Click = require("../models/Click");

const gamificationService = require(
  "../services/gamificationService"
);

const Referral = require(
  "../models/Referral"
);

const Campaign = require(
  "../models/Campaign"
);

const analyticsService = require(
  "../services/analyticsService"
);

const engagementService = require(
  "../services/engagementService"
);

const Leaderboard = require(
  "../models/leaderboard"
);

// ==========================================
// GENERATE REFERRAL
// ==========================================

exports.generateReferral = async (
  req,
  res,
  next
) => {

  try {

    const { campaignId } = req.body;

    if (!campaignId) {

      return res.status(400).json({
        message: "Campaign ID required",
      });
    }

    // ======================================
    // GET CAMPAIGN
    // ======================================

    const campaign =
      await Campaign.findById(
        campaignId
      );

    if (!campaign) {

      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    // ======================================
    // GENERATE REFERRAL CODE
    // ======================================

    const referralCode =
      crypto.randomBytes(4)
      .toString("hex");

    // ======================================
    // CREATE REFERRAL
    // ======================================

    const referral =
      await Referral.create({

        studentId: req.user.id,

        campaignId,

        referralCode,

        clicks: 0,

        earnings: 0,
      });

    // ======================================
    // TRACK CONVERSION
    // ======================================

    await analyticsService.trackConversion({
      userId: req.user.id,
      campaignId,
    });

    // ======================================
    // UPDATE ENGAGEMENT
    // ======================================

    await engagementService.updateEngagement(
      req.user.id,
      "conversion",
      campaign.category
    );

    let leaderboard =
  await Leaderboard.findOne({
    student: req.user.id,
  });

if (!leaderboard) {

  leaderboard =
    await Leaderboard.create({

      student: req.user.id,

      points: 20,

      level: "Beginner",

      badges: [
        {
          title: "First Referral",
          description:
            "Generated first referral link",
        },
      ],

      achievements: [
        "Generated Referral Link",
      ],

      referralsCompleted: 1,
    });

} else {

  leaderboard.points += 20;

  leaderboard.referralsCompleted += 1;

  if (leaderboard.points >= 100) {

    leaderboard.level = "Intermediate";
  }

  if (leaderboard.points >= 300) {

    leaderboard.level = "Advanced";
  }

  await leaderboard.save();
}

    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({

      success: true,

      referral,

      link:
        `http://127.0.0.1:5173/ref/${referralCode}`,
    });

  } catch (error) {

    next(error);
  }
};

// ==========================================
// TRACK CLICK
// ==========================================

exports.trackClick = async (
  req,
  res,
  next
) => {

  try {

    console.log(
      "Referral code:",
      req.params.code
    );

    const referral =
      await Referral.findOne({

        referralCode:
          req.params.code,
      });

    console.log(
      "Referral:",
      referral
    );

    if (!referral) {

      return res.status(404).json({

        success: false,

        message:
          "Invalid referral link",
      });
    }

    // ======================================
    // UPDATE REFERRAL
    // ======================================

    referral.clicks += 1;

    await referral.save();


    await Click.create({
  referralId: referral._id,
  ipAddress: req.ip,
  userAgent: req.headers["user-agent"],
});

    await gamificationService.updateGamification(
    referral.studentId,
    10
);

    await referral.save();

    global.io.emit("analyticsUpdated");

    // ======================================
    // TRACK CAMPAIGN CLICK
    // ======================================

    await analyticsService.trackCampaignClick(
      {
        userId:
          referral.studentId,

        campaignId:
          referral.campaignId,
      }
    );

    // ======================================
    // GET CAMPAIGN CATEGORY
    // ======================================

    const campaign =
      await Campaign.findById(
        referral.campaignId
      );

    // ======================================
    // UPDATE ENGAGEMENT
    // ======================================

    if (campaign) {

      await engagementService.updateEngagement(
        referral.studentId,
        "click",
        campaign.category
      );
    }

    const leaderboard =
  await Leaderboard.findOne({
    student: referral.studentId,
  });

if (leaderboard) {

  leaderboard.points += 5;

  if (leaderboard.points >= 100) {

    leaderboard.level = "Intermediate";
  }

  if (leaderboard.points >= 300) {

    leaderboard.level = "Advanced";
  }

  if (
    leaderboard.points >= 500 &&
    !leaderboard.badges.some(
      (b) => b.title === "Top Promoter"
    )
  ) {

    leaderboard.badges.push({

      title: "Top Promoter",

      description:
        "Earned 500+ points",
    });
  }

  await leaderboard.save();
}

    // ======================================
    // RESPONSE
    // ======================================

    res.json({
  success: true,
  campaignId: referral.campaignId,
  referralId: referral._id,
  studentId: referral.studentId,
});

  } catch (error) {

    next(error);
  }
};

// ==========================================
// MY REFERRALS
// ==========================================

exports.getMyReferrals = async (
  req,
  res,
  next
) => {

  try {

    const referrals =
      await Referral.find({

        studentId:
          req.user.id,
      })

      .populate(
        "campaignId",
        "title category"
      )

      .sort({
        createdAt: -1,
      });

    res.json({

      success: true,

      referrals,
    });

  } catch (error) {

    next(error);
  }
};