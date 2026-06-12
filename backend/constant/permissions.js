const PERMISSIONS = {
  ADMIN: {
    APPROVE_CAMPAIGN: "approve_campaign",
    APPROVE_WITHDRAWAL: "approve_withdrawal",
    VIEW_ANALYTICS: "view_analytics",
    MANAGE_USERS: "manage_users",
  },

  BRAND: {
    CREATE_CAMPAIGN: "create_campaign",
    APPROVE_APPLICATION: "approve_application",
    VIEW_OWN_ANALYTICS: "view_own_analytics",
  },

  STUDENT: {
    APPLY_CAMPAIGN: "apply_campaign",
    GENERATE_REFERRAL: "generate_referral",
    REQUEST_WITHDRAWAL: "request_withdrawal",
  },
};

const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS.ADMIN),
  brand: Object.values(PERMISSIONS.BRAND),
  student: Object.values(PERMISSIONS.STUDENT),
};

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
};