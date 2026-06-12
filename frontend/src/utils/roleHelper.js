export const getDashboardRoute = (role) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "student":
      return "/student/dashboard";
    case "brand":
      return "/brand/dashboard";
    case "university":
      return "/university/dashboard";
    default:
      return "/";
  }
};