const UserPreference = require(
  "../models/userPreferenceModel"
);

// ==========================================
// UPDATE USER ENGAGEMENT
// ==========================================

exports.updateEngagement = async (
  userId,
  action,
  category = null
) => {

  try {

    // ======================================
    // FIND USER PREFERENCE
    // ======================================

    let pref =
      await UserPreference.findOne({
        user: userId,
      });

    // ======================================
    // CREATE IF NOT EXISTS
    // ======================================

    if (!pref) {

      pref =
        await UserPreference.create({

          user: userId,

          interests: [],

          engagementScore: 0,

          clickCount: 0,

          conversionCount: 0,

          viewedCategories: [],
        });
    }

    // ======================================
    // ENGAGEMENT SCORE
    // ======================================

    let increment = 0;

    // ======================================
    // VIEW
    // ======================================

    if (action === "view") {

      increment = 1;

      pref.viewCount =
        (pref.viewCount || 0) + 1;
    }

    // ======================================
    // CLICK
    // ======================================

    if (action === "click") {

      increment = 2;

      pref.clickCount =
        (pref.clickCount || 0) + 1;
    }

    // ======================================
    // JOIN / CONVERSION
    // ======================================

    if (
      action === "join" ||
      action === "conversion"
    ) {

      increment = 5;

      pref.conversionCount =
        (pref.conversionCount || 0) + 1;
    }

    // ======================================
    // UPDATE SCORE
    // ======================================

    pref.engagementScore += increment;

    // ======================================
    // TRACK CATEGORY INTEREST
    // ======================================

    if (
      category &&
      !pref.interests.includes(category)
    ) {

      pref.interests.push(category);
    }

    // ======================================
    // TRACK VIEWED CATEGORIES
    // ======================================

    if (
      category &&
      !pref.viewedCategories.includes(
        category
      )
    ) {

      pref.viewedCategories.push(
        category
      );
    }

    // ======================================
    // SAVE
    // ======================================

    await pref.save();

    return pref;

  } catch (error) {

    console.error(
      "Engagement Service Error:",
      error
    );

    return null;
  }
};