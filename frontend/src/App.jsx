import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Public Pages */
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* Customer Pages*/
import PublicProductPage from "./pages/public/PublicProductPage";
import ReferralRedirect from "./pages/public/ReferralRedirect";

/* Payment */
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

/* Student */
import StudentDashboard from "./pages/student/StudentDashboard";
import AvailableCampaigns from "./pages/student/AvailableCampaigns";
import Wallet from "./pages/student/Wallet";
import EarningsReport from "./pages/student/EarningsReport";
import MyReferrals from "./pages/student/MyReferrals";
import ReferralLinkPage from "./pages/student/ReferralLinkPage";
import ClickHistory from "./pages/student/ClickHistory";
import CampaignDetails from "./pages/student/CampaignDetails";

/* Brand */
import BrandDashboard from "./pages/brands/BrandDashboard";
import CreateCampaign from "./pages/brands/CreateCampaign";
import MyCampaigns from "./pages/brands/MyCampaigns";
import CampaignApplications from "./pages/brands/CampaignApplications";
import CampaignAnalytics from "./pages/brands/CampaignAnalytics";
import BrandAnalyticsList from "./pages/brands/BrandAnalyticsList";
import EditCampaign from "./pages/brands/EditCampaign";
import CampaignPerformance from "./pages/brands/CampaignPerformance";

/* Admin */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ApproveBrands from "./pages/admin/ApproveBrands";
import ApproveCampaigns from "./pages/admin/ApproveCampaigns";
import ApproveUniversities from "./pages/admin/ApproveUniversities";
import CommissionSettings from "./pages/admin/CommissionSettings";
import PlatformAnalytics from "./pages/admin/PlatformAnalytics";
import TransactionLogs from "./pages/admin/TransactionLogs";
import AdmStudentList from "./pages/admin/AdmStudentList";

/* University */
import UniversityDashboard from "./pages/university/UniversityDashboard";
import ManageStudents from "./pages/university/ManageStudents";
import UniStudentList from "./pages/university/UniStudentList";
import UniversityCampaigns from "./pages/university/UniversityCampaigns";
import UniversityAnalytics from "./pages/university/UniversityAnalytics";

/* Gamification */
import StudentGamification from "./pages/student/StudentGamification";

/* Notification */
import Notifications from "./pages/notifications/Notifications";

/* Referral */
/*import ReferralRedirect from "./pages/referral/ReferralRedirect";*/

/* Recommendation */
import RecommendedCampaigns from "./pages/student/RecommendedCampaigns";

/* Protected Route */
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔥 Public Customer Routes */}
        <Route path="/ref/:code" element={<ReferralRedirect />} />
        <Route path="/product/:id" element={<PublicProductPage />} />

        {/* Payment Routes */}
        <Route
  path="/payment-success"
  element={<PaymentSuccess />}
/>

<Route
  path="/payment-cancel"
  element={<PaymentCancel />}
/>

        {/* Notification */}
        <Route path="/notifications" element={<Notifications />} />


        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/student/campaigns"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <AvailableCampaigns />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/wallet"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <Wallet />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/earnings"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <EarningsReport />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/campaign/:id"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <CampaignDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/referrals"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <MyReferrals />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/referral-link"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <ReferralLinkPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/clicks"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <ClickHistory />
    </ProtectedRoute>
  }
/>

  {/* Brand */}

<Route
  path="/brand/dashboard"
  element={
    <ProtectedRoute allowedRoles={["brand"]}>
      <BrandDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/brand/campaigns"
  element={
    <ProtectedRoute allowedRoles={["brand"]}>
      <MyCampaigns />
    </ProtectedRoute>
  }
/>

<Route
  path="/brand/create"
  element={
    <ProtectedRoute allowedRoles={["brand"]}>
      <CreateCampaign />
    </ProtectedRoute>
  }
/>

<Route
  path="/brand/applicants"
  element={
    <ProtectedRoute allowedRoles={["brand"]}>
      <CampaignApplications />
    </ProtectedRoute>
  }
/>

<Route
  path="/brand/analytics"
  element={
    <ProtectedRoute allowedRoles={["brand"]}>
      <BrandAnalyticsList />
    </ProtectedRoute>
  }
/>

<Route
  path="/brand/analytics/:campaignId"
  element={
    <ProtectedRoute allowedRoles={["brand"]}>
      <CampaignAnalytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/brand/analytics/:campaignId"
  element={
    <ProtectedRoute allowedRoles={["brand"]}>
      <CampaignAnalytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/brand/campaign/:id"
  element={
    <ProtectedRoute allowedRoles={["brand"]}>
      <CampaignDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/brand/edit/:id"
  element={
    <ProtectedRoute allowedRoles={["brand"]}>
      <EditCampaign />
    </ProtectedRoute>
  }
/>

<Route
  path="/brand/performance"
  element={
    <ProtectedRoute allowedRoles={["brand"]}>
      <CampaignPerformance />
    </ProtectedRoute>
  }
/>

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        

<Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <ManageUsers />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/admstudentlist"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdmStudentList />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/approve-brands"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <ApproveBrands />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/approve-campaigns"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <ApproveCampaigns />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/approve-universities"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <ApproveUniversities />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/commission"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <CommissionSettings />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/platformanalytics"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PlatformAnalytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/transactions"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <TransactionLogs />
    </ProtectedRoute>
  }
/>

        {/* University */}
        <Route
          path="/university/dashboard"
          element={
            <ProtectedRoute allowedRoles={["university"]}>
              <UniversityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/university/students"
  element={
    <ProtectedRoute allowedRoles={["university"]}>
      <ManageStudents />
    </ProtectedRoute>
  }
/>
<Route
  path="/university/studentsList"
  element={
    <ProtectedRoute allowedRoles={["university"]}>
      <UniStudentList />
    </ProtectedRoute>
  }
/>

<Route
  path="/university/campaigns"
  element={
    <ProtectedRoute allowedRoles={["university"]}>
      <UniversityCampaigns />
    </ProtectedRoute>
  }
/>

<Route
  path="/university/analytics"
  element={
    <ProtectedRoute allowedRoles={["university"]}>
      <UniversityAnalytics />
    </ProtectedRoute>
  }
/>

        {/* Gamification */}
        <Route
  path="/student/gamification"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentGamification />
    </ProtectedRoute>
  }
/>

        {/* AI Recommendations */}
        <Route
  path="/student/recommendations"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <RecommendedCampaigns />
    </ProtectedRoute>
  }
/>

        {/* Fallback route */}
        <Route path="*" element={<h1>Page Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;