const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Withdrawal = require("../models/Withdrawal");

// Dashboard Stats
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const totalWithdrawals = await Withdrawal.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCampaigns,
        totalWithdrawals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL USERS
// ==========================================

exports.getAllUsers = async (
  req,
  res,
  next
) => {

  try {

    const users =
      await User.find()

      .select("-password")

      .sort({
        createdAt: -1,
      });

    res.json({

      success: true,

      users,
    });

  } catch (error) {

    next(error);
  }
};

// ==========================================
// GET ALL STUDENTS
// ==========================================

exports.getAllStudents = async (
  req,
  res,
  next
) => {

  try {

    const students =
      await User.find({

        role: "student",
      })

      .select("-password")

      .sort({
        createdAt: -1,
      });

    res.json({

      success: true,

      students,
    });

  } catch (error) {

    next(error);
  }
};

// ==========================================
// GET BRANDS
// ==========================================

exports.getBrandsForApproval =
  async (
    req,
    res,
    next
  ) => {

    try {

      const pendingBrands =
        await User.find({

          role: "brand",

          approvalStatus:
            "pending",
        })

        .select("-password")

        .sort({
          createdAt: -1,
        });

      const approvedBrands =
        await User.find({

          role: "brand",

          approvalStatus:
            "approved",
        })

        .select("-password")

        .sort({
          createdAt: -1,
        });

      res.json({

        success: true,

        pendingBrands,

        approvedBrands,
      });

    } catch (error) {

      next(error);
    }
  };

// ==========================================
// APPROVE BRAND
// ==========================================

exports.approveBrand =
  async (
    req,
    res,
    next
  ) => {

    try {

      const brand =
        await User.findById(
          req.params.id
        );

      if (!brand) {

        return res.status(404).json({

          success: false,

          message:
            "Brand not found",
        });
      }

      brand.isApproved = true;

      brand.approvalStatus =
        "approved";

      await brand.save();

      res.json({

        success: true,

        message:
          "Brand approved",
      });

    } catch (error) {

      next(error);
    }
  };

// ==========================================
// REJECT BRAND
// ==========================================

exports.rejectBrand =
  async (
    req,
    res,
    next
  ) => {

    try {

      const brand =
        await User.findById(
          req.params.id
        );

      if (!brand) {

        return res.status(404).json({

          success: false,

          message:
            "Brand not found",
        });
      }

      brand.approvalStatus =
        "rejected";

      brand.isApproved = false;

      await brand.save();

      res.json({

        success: true,

        message:
          "Brand rejected",
      });

    } catch (error) {

      next(error);
    }
  };