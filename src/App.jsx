// App.jsx — FIXED VERSION
import { Routes, Route } from 'react-router-dom'; // ⬅ remove BrowserRouter from here
import Home from './pages/Home';
import Enroll from './pages/Enroll';
import StudyMaterials from './pages/studyMaterial';
import Syllabus from './pages/Syllabus';
import Register from './pages/Register';
import Course from './pages/Course';
import Sat from './pages/Sat';
// import Geography from './pages/Geography';
// import History from './pages/History';
// import Maths from './pages/Mathematics';
// import Mat from './pages/Mat';
import Science from './pages/Science';
import TestPage from './pages/TestPage';
import VerifyOtp from './pages/VerifyOtp';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogin from './pages/admin/AdminLogin';
import PrivateAdminRoute from './components/PrivateAdminRoutes';
import PrivateUserRoute from './components/PrivateUserRoutes';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequireAuth from "./components/RequireAuth";
import PaymentPage from './pages/PaymentPage';
import MyTests from "./pages/myTests";
import AdminQuestions from './pages/admin/AdminQuestion';
import UserDashboard from "./pages/UserDashboard";
import AdminStats from './pages/admin/AdminStats';
import AdminUploadMaterial from "./pages/admin/AdminUploadMaterial";
import SocialStudies from "./pages/SocialStudies";
// import ProtectedTestButton from "./components/ProtectedTestButton";
// import Civic from "./pages/Civic";
// import Physics from "./pages/physics";
// import Chemistry from "./pages/Chemistry";
// import Biology from "./pages/Biology";
import CourseSelection from "./pages/CourseSelection";
import AdminUploadChapter from './pages/admin/AdminUploadChapter';
import DynamicSubjectPage from "./pages/Dynamic Pages/DynamicSubjectPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TermsAndConditions from "./components/TermsAndCondition";
import RefundPolicy from "./components/Refundpolicy";
import PrivacyPolicy from './components/Privacypolicy';

// Inside your Routes

// import AdminQuestions from './pages/admin/AdminQuestion';

function App() {
  return (
    <Routes>
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
       <Route path="/course-selection" element={<CourseSelection />} />
      <Route path="/course" element={<RequireAuth><Course />
      </RequireAuth>} />
      <Route path="/:subjectName" element={<DynamicSubjectPage />} />
      <Route path="/dashboard" element={<PrivateUserRoute>
        <UserDashboard />
    </PrivateUserRoute>
  }
/>
      <Route path="/sat" element={<Sat />} />
      {/* <Route path="/geography" element={<Geography />} /> */}
      <Route path="/social-studies" element={<SocialStudies />} />
      <Route path="/science" element={<Science />} />
      {/* <Route path="/history" element={<History />} />
      <Route path="/civics" element={<Civic />} />
      <Route path="/maths" element={<Maths />} />
      <Route path="/mat" element={<Mat />} />
      <Route path="/physics" element={<Physics />} />
      <Route path="/chemistry" element={<Chemistry />} />
      <Route path="/biology" element={<Biology />} /> */}
      <Route path="/test/:subject/:chapterId" element={<TestPage />} />
      <Route path="/my-tests" element={<MyTests />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/stats" element={<PrivateAdminRoute><AdminStats /></PrivateAdminRoute>} />
      <Route path="/admin/upload-material" element={<PrivateAdminRoute><AdminUploadMaterial /></PrivateAdminRoute>}/>

      <Route path="/admin/upload-chapter" 
      element={
      <PrivateAdminRoute>
      <AdminUploadChapter />
      </PrivateAdminRoute>} />
      <Route
  path="/admin/users"
  element={
    <PrivateAdminRoute>
      <AdminUsers />
    </PrivateAdminRoute>
  }
/>
    <Route
  path="/admin/dashboard"
  element={<PrivateAdminRoute><AdminDashboard /></PrivateAdminRoute>}
/>
<Route path="/payment" element={<PaymentPage />} />
<Route path="/admin/questions" element={<AdminQuestions />} />
    </Routes>
  );
}

export default App;
