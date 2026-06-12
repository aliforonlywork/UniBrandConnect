const CampaignApplication = require(
  "../models/CampaignApplication"
);

const Campaign = require(
  "../models/Campaign"
);

const Notification = require(
  "../models/Notification"
);

// ==========================================
// STUDENT APPLY TO CAMPAIGN
// ==========================================

exports.applyToCampaign = async (
  req,
  res,
  next
) => {
  try {

    console.log("APPLY API HIT");
console.log("BODY:", req.body);
console.log("USER:", req.user.id);

    const { campaignId } = req.body;

    // ======================================
    // VALIDATE CAMPAIGN
    // ======================================

    const campaign =
      await Campaign.findById(
        campaignId
      );

    if (
      !campaign ||
      campaign.status !== "approved"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Campaign not available",
      });
    }

    // ======================================
    // CHECK DUPLICATE APPLICATION
    // ======================================

    const existingApplication =
      await CampaignApplication.findOne({

        studentId:
          req.user.id,

        campaignId,
      });

    if (existingApplication) {

      return res.status(400).json({

        success: false,

        message:
          "Already applied to this campaign",
      });
    }

    // ======================================
    // CREATE APPLICATION
    // ======================================

    const application =
      await CampaignApplication.create({

        studentId:
          req.user.id,

        campaignId,
      });

    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({

      success: true,

      application,
    });

  } catch (error) {

    next(error);
  }
};

// ==========================================
// BRAND GET CAMPAIGN APPLICANTS
// ==========================================

exports.getCampaignApplicants =
  async (
    req,
    res,
    next
  ) => {
    try {

      const campaign =
        await Campaign.findById(
          req.params.campaignId
        );

      // ====================================
      // VALIDATE CAMPAIGN OWNER
      // ====================================

      if (
        !campaign ||
        campaign.brandId.toString() !==
          req.user.id
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",
        });
      }

      // ====================================
      // GET APPLICANTS
      // ====================================

      const applicants =
        await CampaignApplication.find({

          campaignId:
            req.params.campaignId,
        })

        .populate(
          "studentId",
          "name email"
        )

        .sort({
          createdAt: -1,
        });

      // ====================================
      // RESPONSE
      // ====================================

      res.json({

        success: true,

        applicants,
      });

    } catch (error) {

      next(error);
    }
  };

// ==========================================
// BRAND APPROVE APPLICATION
// ==========================================

exports.approveApplication =
  async (
    req,
    res,
    next
  ) => {
    try {

      const application =
        await CampaignApplication.findById(
          req.params.id
        );

      // ====================================
      // VALIDATE APPLICATION
      // ====================================

      if (!application) {

        return res.status(404).json({

          success: false,

          message:
            "Application not found",
        });
      }

      // ====================================
      // UPDATE STATUS
      // ====================================

      application.status =
        "approved";

      await application.save();

      // ====================================
      // CREATE NOTIFICATION
      // ====================================

      await Notification.create({

        userId:
          application.studentId,

        message:
          "Your campaign application has been approved.",
      });

      // ====================================
      // RESPONSE
      // ====================================

      res.json({

        success: true,

        message:
          "Application approved",

        application,
      });

    } catch (error) {

      next(error);
    }
  };