// src/pages/UserDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AutoTestAnswersModel from "../components/AutoTestAnswersModel";
import api from "../utils/axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Home,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Header from "../components/Header";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);

  // Catalog vs user-specific courses
  const [allCourses, setAllCourses] = useState([]); // global catalog
  const [courses, setCourses] = useState([]); // unified per-user list from /users/me

  const [tests, setTests] = useState([]);

  // master lists (subjects/chapters)
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  // manual results bucket (kept for parity)
  const [manualResults, setManualResults] = useState([]);

  // manual form
  const [manualForm, setManualForm] = useState({
    courseId: "",
    subjectId: "",
    chapterId: "",
    score: "",
    total: "",
  });
  const [editId, setEditId] = useState(null);

  // modal
  const [viewAnswersTest, setViewAnswersTest] = useState(null);

  // filters / search
  const [autoFilter, setAutoFilter] = useState("");
  const [manualFilter, setManualFilter] = useState("");

  // layout state
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // email
  const [newEmail, setNewEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);

  // loading
  const [isLoading, setIsLoading] = useState(true);

  // Auto Test cascading filter state
  const [filterCourse, setFilterCourse] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterChapter, setFilterChapter] = useState("");

  // Available options for the current path (auto)
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);

  // Single cascading filter level: 'course' -> 'subject' -> 'chapter'
  const [filterLevel, setFilterLevel] = useState("course");

  // Manual cascading filter states (separate from auto)
  const [mFilterCourse, setMFilterCourse] = useState("");
  const [mFilterSubject, setMFilterSubject] = useState("");
  const [mFilterChapter, setMFilterChapter] = useState("");
  const [mAvailableSubjects, setMAvailableSubjects] = useState([]);
  const [mAvailableChapters, setMAvailableChapters] = useState([]);
  const [mFilterLevel, setMFilterLevel] = useState("course");

  const navigate = useNavigate();
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const goBack = () => navigate(-1);
  const goForward = () => navigate(1);

  // Helper: find course display name by id (fallback to catalog)
  const findCourseNameById = (id) => {
    if (!id) return "";
    const byUser = courses.find(
      (ci) => String(ci.courseId || ci._id) === String(id)
    );
    if (byUser) return byUser.courseName || byUser.name || "";
    const byAll = allCourses.find((a) => String(a._id) === String(id));
    if (byAll) return byAll.name || byAll.title || "";
    return "";
  };

  // fetch user profile (uses backend unified courses list)
  const fetchUser = async () => {
    try {
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/enroll";
        return;
      }

      // backend returns object { userId, name, email, whatsappNo, district, courses }
      const payload = res.data || {};
      setUser(payload);

      // payload.courses expected to be unified per-user list (enrolled + paid)
      setCourses(Array.isArray(payload.courses) ? payload.courses : []);
    } catch (err) {
      console.error("❌ Error fetching profile", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/enroll";
      }
    }
  };

  // fetch tests
  const fetchTests = async () => {
    try {
      const res = await api.get("/results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allResults = Array.isArray(res.data) ? res.data : [];
      const manualOnly = allResults.filter((r) => r.testType === "manual");

      setTests(allResults);
      setManualResults(manualOnly);
    } catch (err) {
      console.error("❌ Error fetching tests", err);
      setTests([]);
      setManualResults([]);
    }
  };

  // fetch global course catalog (used as fallback / for selects)
  const fetchAvailableCourses = async () => {
    try {
      const res = await api.get("/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // API returns { data: [...] }
      setAllCourses(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching catalog courses:", err);
      setAllCourses([]);
    }
  };

  const fetchSubjects = async (courseId) => {
    if (!courseId) {
      setSubjects([]);
      return [];
    }
    try {
      const res = await api.get(`/subjects?courseId=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(res.data) ? res.data : [];
      setSubjects(list);
      return list;
    } catch (err) {
      console.error("❌ Error fetching subjects:", err);
      setSubjects([]);
      return [];
    }
  };

  const fetchChapters = async (courseId, subjectId) => {
    if (!courseId || !subjectId) {
      setChapters([]);
      return [];
    }
    try {
      const res = await api.get(
        `/chapters?courseId=${courseId}&subjectId=${subjectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const list = Array.isArray(res.data) ? res.data : [];
      setChapters(list);
      return list;
    } catch (err) {
      console.error("❌ Error fetching chapters:", err);
      setChapters([]);
      return [];
    }
  };

  // manual test save / update
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing manual test
        await api.put(
          "/results/manual",
          {
            courseId: manualForm.courseId,
            subjectId: manualForm.subjectId,
            chapterId: manualForm.chapterId,
            score: Number(manualForm.score),
            total: Number(manualForm.total),
            testType: "manual",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Manual result updated");
      } else {
        // Create new manual test
        await api.post(
          "/results/manual",
          {
            courseId: manualForm.courseId,
            subjectId: manualForm.subjectId,
            chapterId: manualForm.chapterId,
            score: Number(manualForm.score),
            total: Number(manualForm.total),
            testType: "manual",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Manual result saved");
      }

      fetchTests();
      setEditId(null);
      setManualForm({
        courseId: "",
        subjectId: "",
        chapterId: "",
        score: "",
        total: "",
      });
      setSubjects([]);
      setChapters([]);
    } catch (err) {
      console.error("Manual save error:", err);
      alert("❌ Failed to save manual result");
    }
  };

  const handleEdit = async (test) => {
    setEditId(test._id);
    setActiveTab("manual");
    setManualForm({
      courseId: test.courseId || "",
      subjectId: test.subjectId || "",
      chapterId: test.chapterId || "",
      score: test.score || "",
      total: test.total || "",
    });

    if (test.courseId) {
      const subs = await fetchSubjects(test.courseId);
      setSubjects(subs || []);
    }

    if (test.courseId && test.subjectId) {
      const chaps = await fetchChapters(test.courseId, test.subjectId);
      setChapters(chaps || []);
    }
  };

  const handleDelete = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await api.delete(`/results/${testId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Test deleted");
      fetchTests();
    } catch (err) {
      console.error("❌ Failed to delete test", err);
      alert("❌ Failed to delete test");
    }
  };

  const deleteAccount = async () => {
    if (
      !window.confirm(
        "Final confirmation: delete your account? This cannot be undone."
      )
    )
      return;
    try {
      await api.delete("/users/account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      sessionStorage.clear();
      navigate("/enroll");
    } catch (err) {
      console.error("❌ Delete account error:", err);
      alert("❌ Failed to delete account");
    }
  };

  const updateEmail = async () => {
    if (!newEmail.trim()) return setEmailStatus("❌ Please enter an email");
    try {
      const res = await api.patch(
        "/users/email",
        { email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.message || res.status === 200) {
        setEmailStatus("✅ Email added successfully");
        setNewEmail("");
        fetchUser();
        setActiveTab("profile");
      } else {
        setEmailStatus("❌ Failed to add email");
      }
    } catch (err) {
      console.error("Email update error:", err);
      const msg = err.response?.data?.message || "❌ Failed to add email";
      setEmailStatus(msg);
    }
  };

  const handleLogout = async () => {
    try {
      const role =
        localStorage.getItem("role") || sessionStorage.getItem("role");

      const endpoint = role === "admin" ? "/admin/logout" : "/users/logout";

      await api.post(endpoint, {}); // server clears refresh cookie
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error("❌ Logout API failed", err);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/enroll", { replace: true });
    }
  };

  // initial data
  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchUser(), fetchTests()]);
      } catch (err) {
        console.error("❌ Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // derive tests
  const autoTests = tests.filter((t) => t.testType !== "manual");
  const manualTests =
    manualResults.length > 0
      ? manualResults
      : tests.filter((t) => t.testType === "manual");

  // helpers
  const totalScore = (arr) =>
    arr.reduce((sum, t) => sum + Number(t.score || 0), 0);
  const totalMarks = (arr) =>
    arr.reduce((sum, t) => sum + Number(t.total || 0), 0);
  const safePercent = (num, denom) => {
    if (!denom || denom === 0) return 0;
    return Math.round((num / denom) * 100);
  };

  // keep available subjects/chapters aligned with selected course/subject (auto)
  useEffect(() => {
    if (filterCourse) {
      fetchSubjects(filterCourse).then((data) => {
        setAvailableSubjects(data || []);
        setFilterSubject("");
        setAvailableChapters([]);
        setFilterChapter("");
        if (filterLevel === "course") setFilterLevel("subject");
      });
    } else {
      setAvailableSubjects([]);
      setFilterSubject("");
      setAvailableChapters([]);
      setFilterChapter("");
      setFilterLevel("course");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCourse]);

  // manual cascade subjects
  useEffect(() => {
    if (mFilterCourse) {
      fetchSubjects(mFilterCourse).then((data) => {
        setMAvailableSubjects(data || []);
        setMFilterSubject("");
        setMAvailableChapters([]);
        setMFilterChapter("");
        if (mFilterLevel === "course") setMFilterLevel("subject");
      });
    } else {
      setMAvailableSubjects([]);
      setMFilterSubject("");
      setMAvailableChapters([]);
      setMFilterChapter("");
      setMFilterLevel("course");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mFilterCourse]);

  // chapters for auto cascade
  useEffect(() => {
    if (filterCourse && filterSubject) {
      fetchChapters(filterCourse, filterSubject).then((data) => {
        setAvailableChapters(data || []);
        setFilterChapter("");
        if (filterLevel === "subject") setFilterLevel("chapter");
      });
    } else {
      setAvailableChapters([]);
      setFilterChapter("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSubject]);

  // chapters for manual cascade
  useEffect(() => {
    if (mFilterCourse && mFilterSubject) {
      fetchChapters(mFilterCourse, mFilterSubject).then((data) => {
        setMAvailableChapters(data || []);
        setMFilterChapter("");
        if (mFilterLevel === "subject") setMFilterLevel("chapter");
      });
    } else {
      setMAvailableChapters([]);
      setMFilterChapter("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mFilterSubject]);

  // cascading filter handlers (auto)
  const onCascadeChange = (e) => {
    const value = e.target.value;
    if (filterLevel === "course") {
      setFilterCourse(value);
    } else if (filterLevel === "subject") {
      setFilterSubject(value);
    } else {
      setFilterChapter(value);
    }
  };

  const onBackFilterLevel = () => {
    if (filterLevel === "chapter") {
      setFilterChapter("");
      setFilterLevel("subject");
    } else if (filterLevel === "subject") {
      setFilterSubject("");
      setAvailableChapters([]);
      setFilterLevel("course");
      setFilterCourse("");
    } else {
      setFilterCourse("");
    }
  };

  const onResetFilter = () => {
    setFilterCourse("");
    setFilterSubject("");
    setFilterChapter("");
    setAvailableSubjects([]);
    setAvailableChapters([]);
    setFilterLevel("course");
    setAutoFilter("");
  };

  // Manual cascaded filter handlers
  const onMCascadeChange = (e) => {
    const value = e.target.value;
    if (mFilterLevel === "course") {
      setMFilterCourse(value);
    } else if (mFilterLevel === "subject") {
      setMFilterSubject(value);
    } else {
      setMFilterChapter(value);
    }
  };

  const onMBackFilterLevel = () => {
    if (mFilterLevel === "chapter") {
      setMFilterChapter("");
      setMFilterLevel("subject");
    } else if (mFilterLevel === "subject") {
      setMFilterSubject("");
      setMAvailableChapters([]);
      setMFilterLevel("course");
      setMFilterCourse("");
    } else {
      setMFilterCourse("");
    }
  };

  const onMResetFilter = () => {
    setMFilterCourse("");
    setMFilterSubject("");
    setMFilterChapter("");
    setMAvailableSubjects([]);
    setMAvailableChapters([]);
    setMFilterLevel("course");
    setManualFilter("");
  };

  // selected names for breadcrumb (AUTO)
  const selectedCourseName =
    findCourseNameById(filterCourse) ||
    courses?.find((c) => String(c._id) === String(filterCourse))?.name ||
    "";
  const selectedSubjectName =
    availableSubjects?.find((s) => s._id === filterSubject)?.name || "";
  const selectedChapterName =
    availableChapters?.find((ch) => ch._id === filterChapter)?.title || "";

  // selected names for breadcrumb (MANUAL)
  const mSelectedCourseName =
    findCourseNameById(mFilterCourse) ||
    courses?.find((c) => String(c._id) === String(mFilterCourse))?.name ||
    "";
  const mSelectedSubjectName =
    mAvailableSubjects?.find((s) => s._id === mFilterSubject)?.name || "";
  const mSelectedChapterName =
    mAvailableChapters?.find((ch) => ch._id === mFilterChapter)?.title || "";

  // actual filtering of auto tests
  const filteredAutoTests = autoTests.filter((t) => {
    let pass = true;
    if (filterCourse) pass = pass && t.courseId === filterCourse;
    if (filterSubject) pass = pass && t.subjectId === filterSubject;
    if (filterChapter) pass = pass && t.chapterId === filterChapter;
    if (autoFilter)
      pass =
        pass &&
        ((t.subjectName || "")
          .toLowerCase()
          .includes(autoFilter.toLowerCase()) ||
          (t.chapterName || t.chapter || "")
            .toLowerCase()
            .includes(autoFilter.toLowerCase()));
    return pass;
  });

  // add xLabel for charts to avoid blanks
  const filteredAutoTestsWithLabels = filteredAutoTests.map((t) => ({
    ...t,
    xLabel: t.chapterName || t.chapter || t.subjectName || "—",
  }));

  const filteredManualTests = manualTests.filter((t) => {
    let pass = true;
    if (mFilterCourse) pass = pass && t.courseId === mFilterCourse;
    if (mFilterSubject) pass = pass && t.subjectId === mFilterSubject;
    if (mFilterChapter) pass = pass && t.chapterId === mFilterChapter;
    if (manualFilter)
      pass =
        pass &&
        ((t.subjectName || "")
          .toLowerCase()
          .includes(manualFilter.toLowerCase()) ||
          (t.chapterName || t.chapter || "")
            .toLowerCase()
            .includes(manualFilter.toLowerCase()));
    return pass;
  });

  // Loading component
  const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block relative w-20 h-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin animation-delay-200"></div>
          </div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <Header />

      {/* Loading overlay */}
      {isLoading && <LoadingSpinner />}

      {/* Mobile forward/back */}
      {isMobile && !isLoading && (
        <>
          <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
            <button
              onClick={goBack}
              className="w-8 h-20 flex items-center justify-center bg-transparent"
            >
              <ChevronLeft size={24} className="text-blue-950" />
            </button>
          </div>
          <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
            <button
              onClick={goForward}
              className="w-8 h-20 flex items-center justify-center bg-transparent"
            >
              <ChevronRight size={24} className="text-blue-950" />
            </button>
          </div>
        </>
      )}

      {!isLoading && (
        <main className="pb-20 md:pb-0">
          <div className="flex flex-col md:flex-row min-h-screen">
            {/* Mobile dropdown */}
            <div className="md:hidden bg-gray-100 p-4 sticky top-0 z-10 border-b">
              <div className="relative">
                <button
                  className="w-full p-3 border rounded-lg text-left flex justify-between items-center bg-white shadow-sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="font-medium">
                    {activeTab === "profile" && "👤 Profile"}
                    {activeTab === "tests" && "📊 My Tests"}
                    {activeTab === "manual" && "✍️ Add Manual Test"}
                    {activeTab === "add-email" && "📧 Add Email"}
                    {activeTab === "delete-account" && "🗑️ Delete Account"}
                    {activeTab === "logout" && "🚪 Logout"}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      isMobileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileMenuOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-20 max-h-[60vh] overflow-y-auto">
                    <button
                      className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${
                        activeTab === "profile" ? "text-amber-500 bg-amber-50" : ""
                      }`}
                      onClick={() => {
                        setActiveTab("profile");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      👤 Profile
                    </button>

                    <button
                      className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${
                        activeTab === "tests" ? "text-amber-500 bg-amber-50" : ""
                      }`}
                      onClick={() => {
                        setActiveTab("tests");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      📊 My Tests
                    </button>

                    <button
                      className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${
                        activeTab === "manual" ? "text-amber-500 bg-amber-50" : ""
                      }`}
                      onClick={() => {
                        setActiveTab("manual");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      ✍️ Add Manual Test
                    </button>

                    {!user?.email && (
                      <button
                        className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${
                          activeTab === "add-email" ? "text-amber-500 bg-amber-50" : ""
                        }`}
                        onClick={() => {
                          setActiveTab("add-email");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        📧 Add Email
                      </button>
                    )}

                    <button
                      className="w-full text-left p-3 hover:bg-gray-50 flex items-center text-red-500"
                      onClick={() => {
                        setActiveTab("delete-account");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      🗑️ Delete Account
                    </button>

                    <button
                      className="w-full text-left p-3 hover:bg-gray-50 flex items-center text-red-500"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:block bg-gray-800 text-white w-full md:w-64 p-4">
              <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left ${
                      activeTab === "profile" ? "text-yellow-400" : ""
                    }`}
                  >
                    👤 Profile
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("tests")}
                    className={`w-full text-left ${
                      activeTab === "tests" ? "text-yellow-400" : ""
                    }`}
                  >
                    📊 My Tests
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("manual")}
                    className={`w-full text-left ${
                      activeTab === "manual" ? "text-yellow-400" : ""
                    }`}
                  >
                    ✍️ Add Manual Test
                  </button>
                </li>

                {!user?.email && (
                  <li>
                    <button
                      onClick={() => setActiveTab("add-email")}
                      className={`w-full text-left ${
                        activeTab === "add-email" ? "text-yellow-400" : ""
                      }`}
                    >
                      📧 Add Email
                    </button>
                  </li>
                )}

                <li>
                  <button
                    onClick={() => setActiveTab("delete-account")}
                    className={`w-full text-left ${
                      activeTab === "delete-account" ? "text-yellow-400" : ""
                    }`}
                  >
                    🗑️ Delete Account
                  </button>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-400"
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>

            {/* Content area */}
            <div className="flex-1 p-6 bg-gray-100">
              {/* Profile */}
              {activeTab === "profile" && user && (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold mb-4">👤 Profile</h3>

                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>

                  <p>
                    <strong>Email:</strong> {user?.email || "Not provided"}
                  </p>

                  <p>
                    <strong>Mobile:</strong> {user.whatsappNo}
                  </p>
                  <p>
                    <strong>District:</strong> {user.district}
                  </p>

                  {Array.isArray(courses) && courses.length > 0 ? (
                    courses.map((c, idx) => {
                      // c could be in multiple shapes: { courseId, courseName, isPaid... } or course doc
                      const courseId = c.courseId || c._id || c.id || null;
                      const displayName =
                        c.courseName || c.name || findCourseNameById(courseId) || "—";
                      const isPaid = Boolean(c.isPaid);
                      return (
                        <div
                          key={String(courseId) || idx}
                          className="bg-white shadow-md rounded-xl p-4 border border-gray-200 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto mb-4"
                        >
                          {/* Course Name */}
                          <h4 className="text-lg font-bold text-indigo-600 mb-2">
                            {displayName}
                          </h4>

                          {/* Payment Info */}
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Status:</span>{" "}
                            {isPaid ? (
                              <span className="text-green-600 font-semibold">Paid</span>
                            ) : (
                              <span className="text-red-600 font-semibold">Unpaid</span>
                            )}
                          </p>

                          {/* Show extra info only if Paid */}
                          {isPaid && (
                            <>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Paid On:</span>{" "}
                                {c?.paidAt ? new Date(c.paidAt).toLocaleDateString() : "—"}
                              </p>

                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Username:</span>{" "}
                                {c?.username || "Not Assigned"}
                              </p>

                              {typeof c?.serial !== "undefined" && (
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Serial:</span>{" "}
                                  {c.serial}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-center">No enrolled courses found.</p>
                  )}
                </div>
              )}

              {/* Add Email (tab) */}
              {activeTab === "add-email" && !user?.email && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">📧 Add Email</h3>
                  <div className="flex flex-col sm:flex-row gap-2 items-start">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="p-2 border rounded flex-1"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={updateEmail}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Add Email
                      </button>
                      <button
                        onClick={() => setActiveTab("profile")}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  {emailStatus && <p className="mt-2 text-sm">{emailStatus}</p>}
                </div>
              )}

              {/* Delete account tab */}
              {activeTab === "delete-account" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">🗑️ Delete Account</h3>
                  <p className="mb-4 text-red-600">
                    ⚠️ Warning: This action is permanent and cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={deleteAccount}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Tests Tab */}
              {activeTab === "tests" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">📊 My Tests</h3>

                  {/* Progress summary */}
                  <div className="bg-white p-4 mb-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Auto progress */}
                    <div>
                      <h4 className="font-bold mb-2">✅ Auto Test Progress</h4>
                      {filteredAutoTests.length === 0 ? (
                        <p>No auto tests yet.</p>
                      ) : (
                        <div>
                          <p>
                            Avg Score:{" "}
                            <strong>
                              {safePercent(
                                totalScore(filteredAutoTests),
                                totalMarks(filteredAutoTests)
                              )}
                              %
                            </strong>
                          </p>
                          <div className="h-4 bg-gray-200 rounded mt-2">
                            <div
                              className="h-full bg-blue-500 rounded"
                              style={{
                                width: `${safePercent(
                                  totalScore(filteredAutoTests),
                                  totalMarks(filteredAutoTests)
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Manual progress */}
                    <div>
                      <h4 className="font-bold mb-2">✍️ Manual Test Progress</h4>
                      {filteredManualTests.length === 0 ? (
                        <p>No manual tests yet.</p>
                      ) : (
                        <div>
                          <p>
                            Avg Score:{" "}
                            <strong>
                              {safePercent(
                                totalScore(filteredManualTests),
                                totalMarks(filteredManualTests)
                              )}
                              %
                            </strong>
                          </p>
                          <div className="h-4 bg-gray-200 rounded mt-2">
                            <div
                              className="h-full bg-green-500 rounded"
                              style={{
                                width: `${safePercent(
                                  totalScore(filteredManualTests),
                                  totalMarks(filteredManualTests)
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lists and charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Auto Tests */}
                    <div className="bg-white p-4 rounded shadow">
                      <h4 className="text-lg font-bold mb-3">✅ Auto Tests</h4>

                      {/* SINGLE Cascading Filter + Search */}
                      <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4 overflow-hidden">
                        <div className="flex items-center gap-2">
                          {/* Back Button */}
                          <button
                            type="button"
                            onClick={onBackFilterLevel}
                            disabled={filterLevel === "course" && !filterCourse}
                            className={`px-2 py-1 text-sm rounded border ${
                              filterLevel === "course" && !filterCourse
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-gray-50"
                            }`}
                            title="Back one level"
                          >
                            ← Back
                          </button>

                          {/* Single select that changes its options per level */}
                          <select
                            value={
                              filterLevel === "course"
                                ? filterCourse
                                : filterLevel === "subject"
                                ? filterSubject
                                : filterChapter
                            }
                            onChange={onCascadeChange}
                            className="p-2 border rounded md:max-w-xs min-w-[180px]"
                          >
                            {/* Placeholder per level */}
                            {filterLevel === "course" && (
                              <>
                                <option value="">Select Course</option>
                                {(courses || []).map((c) => {
                                  const id = c.courseId || c._id || c.id;
                                  return (
                                    <option key={String(id)} value={String(id)}>
                                      {c.courseName || c.name || findCourseNameById(id)}
                                    </option>
                                  );
                                })}
                              </>
                            )}

                            {filterLevel === "subject" && (
                              <>
                                <option value="">Select Subject</option>
                                {(availableSubjects || []).map((s) => (
                                  <option key={s._id} value={s._id}>
                                    {s.name}
                                  </option>
                                ))}
                              </>
                            )}

                            {filterLevel === "chapter" && (
                              <>
                                <option value="">Select Chapter</option>
                                {(availableChapters || []).map((ch) => (
                                  <option key={ch._id} value={ch._id}>
                                    {ch.title}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>

                          {/* Reset filter */}
                          <button
                            type="button"
                            onClick={onResetFilter}
                            className="px-2 py-1 text-sm rounded border hover:bg-gray-50"
                            title="Reset filter"
                          >
                            Reset
                          </button>
                        </div>

                        {/* Tiny breadcrumb for context */}
                        <div className="text-sm text-gray-600 truncate max-w-full">
                          {selectedCourseName && <span>{selectedCourseName}</span>}
                          {selectedSubjectName && <span> / {selectedSubjectName}</span>}
                          {selectedChapterName && <span> / {selectedChapterName}</span>}
                        </div>

                        {/* Search input */}
                        <input
                          type="text"
                          placeholder="Search subject/chapter"
                          value={autoFilter}
                          onChange={(e) => setAutoFilter(e.target.value)}
                          className="p-2 border rounded flex-1 min-w-[180px] md:min-w-[220px] md:max-w-xs"
                        />
                      </div>

                      {filteredAutoTests.length === 0 ? (
                        <p>No auto test results found.</p>
                      ) : (
                        <>
                          <ul className="space-y-3">
                            {filteredAutoTests.map((t, i) => (
                              <li
                                key={t._id || i}
                                className="bg-gray-50 p-3 rounded shadow"
                              >
                                <p>
                                  <strong>Subject:</strong> {t.subjectName}
                                </p>
                                <p>
                                  <strong>Chapter:</strong>{" "}
                                  {t.chapterName || t.chapter || "—"}
                                </p>
                                <p>
                                  <strong>Score:</strong> {t.score} / {t.total}
                                </p>
                                <p>
                                  <strong>Date:</strong>{" "}
                                  {new Date(t.createdAt).toLocaleString()}
                                </p>
                                <div className="flex space-x-4 mt-2">
                                  <button
                                    onClick={() => setViewAnswersTest(t)}
                                    className="text-green-600 text-sm hover:underline"
                                  >
                                    View Answers
                                  </button>
                                  <button
                                    onClick={() => handleDelete(t._id)}
                                    className="text-red-600 text-sm hover:underline"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6">
                            <h5 className="font-semibold mb-2">📈 Score Chart</h5>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={filteredAutoTestsWithLabels}>
                                <XAxis dataKey="xLabel" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="score" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Manual Tests */}
                    <div className="bg-white p-4 rounded shadow">
                      <h4 className="text-lg font-bold mb-2">✍️ Manual Tests</h4>

                      {/* SINGLE Cascading Filter + Search (manual) */}
                      <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4 overflow-hidden">
                        <div className="flex items-center gap-2">
                          {/* Back Button */}
                          <button
                            type="button"
                            onClick={onMBackFilterLevel}
                            disabled={mFilterLevel === "course" && !mFilterCourse}
                            className={`px-2 py-1 text-sm rounded border ${
                              mFilterLevel === "course" && !mFilterCourse
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-gray-50"
                            }`}
                            title="Back one level"
                          >
                            ← Back
                          </button>

                          {/* Single select that changes its options per level */}
                          <select
                            value={
                              mFilterLevel === "course"
                                ? mFilterCourse
                                : mFilterLevel === "subject"
                                ? mFilterSubject
                                : mFilterChapter
                            }
                            onChange={onMCascadeChange}
                            className="p-2 border rounded md:max-w-xs min-w-[180px]"
                          >
                            {/* Placeholder per level */}
                            {mFilterLevel === "course" && (
                              <>
                                <option value="">Select Course</option>
                                {(courses || []).map((c) => {
                                  const id = c.courseId || c._id || c.id;
                                  return (
                                    <option key={String(id)} value={String(id)}>
                                      {c.courseName || c.name || findCourseNameById(id)}
                                    </option>
                                  );
                                })}
                              </>
                            )}

                            {mFilterLevel === "subject" && (
                              <>
                                <option value="">Select Subject</option>
                                {(mAvailableSubjects || []).map((s) => (
                                  <option key={s._id} value={s._id}>
                                    {s.name}
                                  </option>
                                ))}
                              </>
                            )}

                            {mFilterLevel === "chapter" && (
                              <>
                                <option value="">Select Chapter</option>
                                {(mAvailableChapters || []).map((ch) => (
                                  <option key={ch._id} value={ch._id}>
                                    {ch.title}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>

                          {/* Reset filter */}
                          <button
                            type="button"
                            onClick={onMResetFilter}
                            className="px-2 py-1 text-sm rounded border hover:bg-gray-50"
                            title="Reset filter"
                          >
                            Reset
                          </button>
                        </div>

                        {/* Tiny breadcrumb for context */}
                        <div className="text-sm text-gray-600 truncate max-w-full">
                          {mSelectedCourseName && <span>{mSelectedCourseName}</span>}
                          {mSelectedSubjectName && <span> / {mSelectedSubjectName}</span>}
                          {mSelectedChapterName && <span> / {mSelectedChapterName}</span>}
                        </div>

                        {/* Search input */}
                        <input
                          type="text"
                          placeholder="Search subject/chapter"
                          value={manualFilter}
                          onChange={(e) => setManualFilter(e.target.value)}
                          className="p-2 border rounded flex-1 min-w-[180px] md:min-w-[220px] md:max-w-xs"
                        />
                      </div>

                      {filteredManualTests.length === 0 ? (
                        <p>No manual test results found.</p>
                      ) : (
                        <>
                          <ul className="space-y-3">
                            {filteredManualTests.map((t, i) => (
                              <li
                                key={t._id || i}
                                className="bg-gray-50 p-3 rounded shadow"
                              >
                                <p>
                                  <strong>Subject:</strong> {t.subjectName}
                                </p>
                                <p>
                                  <strong>Test:</strong>{" "}
                                  {t.chapterName || t.chapter || "—"}
                                </p>
                                <p>
                                  <strong>Score:</strong> {t.score} / {t.total}
                                </p>
                                <p>
                                  <strong>Date:</strong>{" "}
                                  {new Date(t.createdAt).toLocaleString()}
                                </p>
                                <div className="flex space-x-4 mt-2">
                                  <button
                                    onClick={() => handleEdit(t)}
                                    className="text-blue-600 text-sm hover:underline"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(t._id)}
                                    className="text-red-600 text-sm hover:underline"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6">
                            <h5 className="font-semibold mb-2">📊 Score Chart</h5>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart
                                data={filteredManualTests.map((t) => ({
                                  ...t,
                                  xLabel:
                                    t.chapterName ||
                                    t.chapter ||
                                    t.subjectName ||
                                    "—",
                                }))}
                              >
                                <XAxis dataKey="xLabel" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="score" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Manual tab */}
              {activeTab === "manual" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    {editId ? "✏️ Edit Manual Test" : "➕ Add Manual Test"}
                  </h3>
                  <form onSubmit={handleManualSubmit} className="space-y-4 max-w-md">
                    <select
                      value={manualForm.courseId || ""}
                      onChange={(e) => {
                        const nextCourse = e.target.value;
                        setManualForm({
                          ...manualForm,
                          courseId: nextCourse,
                          subjectId: "",
                          chapterId: "",
                        });
                        fetchSubjects(nextCourse);
                      }}
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Course</option>
                      {(courses || []).map((c) => {
                        const id = c.courseId || c._id || c.id;
                        return (
                          <option key={String(id)} value={String(id)}>
                            {c.courseName || c.name || findCourseNameById(id)}
                          </option>
                        );
                      })}
                    </select>

                    <select
                      value={manualForm.subjectId || ""}
                      onChange={(e) => {
                        const nextSubject = e.target.value;
                        setManualForm({
                          ...manualForm,
                          subjectId: nextSubject,
                          chapterId: "",
                        });
                        fetchChapters(manualForm.courseId, nextSubject);
                      }}
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Subject</option>
                      {(subjects || []).map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={manualForm.chapterId || ""}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, chapterId: e.target.value })
                      }
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Chapter</option>
                      {(chapters || []).map((ch) => (
                        <option key={ch._id} value={ch._id}>
                          {ch.title}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Score"
                      value={manualForm.score}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          score: Number(e.target.value),
                        })
                      }
                      required
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Total Marks"
                      value={manualForm.total}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, total: e.target.value })
                      }
                      required
                      className="w-full p-2 border rounded"
                    />

                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      {editId ? "Update Test" : "Save Test"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Mobile bottom nav */}
      {isMobile && !isLoading && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 z-50">
          <div className="flex justify-around py-2">
            <Link to="/" className="flex flex-col items-center p-2 text-white">
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              to="/study-materials"
              className="flex flex-col items-center p-2 text-white"
            >
              <BookOpen size={20} />
              <span className="text-xs mt-1">Materials</span>
            </Link>
            <Link to="/syllabus" className="flex flex-col items-center p-2 text-white">
              <BookOpen size={20} />
              <span className="text-xs mt-1">Syllabus</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex flex-col items-center p-2 text-amber-400"
            >
              <User size={20} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      )}

      {/* Answers modal */}
      {viewAnswersTest && (
        <AutoTestAnswersModel
          test={viewAnswersTest}
          onClose={() => setViewAnswersTest(null)}
        />
      )}
    </div>
  );
};

export default UserDashboard;
