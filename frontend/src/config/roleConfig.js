import { ROLES } from "../constants/roles";

export const roleRoutes = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.STUDENT]: "/student/dashboard",
  [ROLES.BRAND]: "/brand/dashboard",
  [ROLES.UNIVERSITY]: "/university/dashboard",
};