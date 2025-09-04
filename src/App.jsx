// App.jsx — CLEANED + ORDERED
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// --- Pages ---
import Home from "./pages/Home";
import Enroll from "./pages/Enroll";
import StudyMaterials from "./pages/studyMaterial"; // ✅ fixed casing
import Syllabus from "./pages/NMMS/Syllabus";
import Register from "./pages/Register";
import NMMS from "./pages/NMMS/NMMS";
import Course from "./pages/Courses"
import Sat from "./pages/NMMS/Sat";
import Science from "./pages/NMMS/Science";
import TestPage from "./pages/TestPage";
import VerifyOtp from "./pages/VerifyOtp";
import PaymentPage from "./pages/NMMS/PaymentPage";
import MyTests from "./pages/MyTests";
import UserDashboard from "./pages/UserDashboard";
import SocialStudies from "./pages/NMMS/SocialStudies";
import CourseSelection from "./pages/NMMS/CourseSelection";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// --- Admin Pages ---
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStats from "./pages/admin/AdminStats";
import AdminUploadMaterial from "./pages/admin/AdminUploadMaterial";
import AdminUploadChapter from "./pages/admin/AdminUploadChapter";
import AdminQuestions from "./pages/admin/AdminQuestion";
import AdminCourseSubjectChapter from "./pages/admin/AdminCourseSubjectChapter";

// --- Components ---
import PrivateAdminRoute from "./components/PrivateAdminRoutes";
import PrivateUserRoute from "./components/PrivateUserRoutes";
import RequireAuth from "./components/RequireAuth";
import TermsAndConditions from "./components/TermsAndCondition";
import RefundPolicy from "./components/Refundpolicy";
import PrivacyPolicy from "./components/Privacypolicy";
import InstallPrompt from "./components/InstallPrompt";
import ScrollRestoration from "./components/ScrollRestoration";
import DynamicSubjectPage from "./pages/Dynamic/DynamicSubjectPage";

function App() {
  // Clear service worker + cache once per session
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (!sessionStorage.getItem("sw_reloaded")) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          if (regs.length) {
            regs.forEach((r) => r.unregister());
          }
          if ("caches" in window) {
            caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
          }
          sessionStorage.setItem("sw_reloaded", "true");
          window.location.reload();
        });
      }
    }
  }, []);

  return (
    <>
      <InstallPrompt />
      <ScrollRestoration />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/privacy-terms" element={<PrivacyPolicy />} />
        <Route path="/refund-terms" element={<RefundPolicy />} />
        <Route path="/payment-terms" element={<TermsAndConditions />} />
        <Route path="/study-materials" element={<StudyMaterials />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/register" element={<Register />} />
        <Route path="/NMMS/course-selection" element={<CourseSelection />} />
        <Route
          path="/courses"
          element={
            <RequireAuth>
              <Course />
            </RequireAuth>
          }
        />
        <Route
          path="/NMMS/NMMS"
          element={
            <RequireAuth>
              <NMMS />
            </RequireAuth>
          }
        />
        <Route path="/NMMS/sat" element={<Sat />} />
        <Route path="/NMMS/social-studies" element={<SocialStudies />} />
        <Route path="/NMMS/science" element={<Science />} />
        <Route path="/test/:subject/:chapterId" element={<TestPage />} />
        <Route path="/my-tests" element={<MyTests />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/NMMS/payment" element={<PaymentPage />} />

        {/* User routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateUserRoute>
              <UserDashboard />
            </PrivateUserRoute>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/stats"
          element={
            <PrivateAdminRoute>
              <AdminStats />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/upload-material"
          element={
            <PrivateAdminRoute>
              <AdminUploadMaterial />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/upload-chapter"
          element={
            <PrivateAdminRoute>
              <AdminUploadChapter />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateAdminRoute>
              <AdminUsers />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/create"
          element={
            <PrivateAdminRoute>
              <AdminCourseSubjectChapter />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateAdminRoute>
              <AdminDashboard />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <PrivateAdminRoute>
              <AdminQuestions />
            </PrivateAdminRoute>
          }
        />

        {/* Dynamic route must be LAST */}
        <Route path="/dynamic/:subjectName" element={<DynamicSubjectPage />} />
      </Routes>
    </>
  );
}

export default App;
