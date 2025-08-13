// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AutoTestAnswersModel from "../components/AutoTestAnswersModel";
// import api from "../utils/axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const UserDashboard = () => {
//   const [activeTab, setActiveTab] = useState("profile");
//   const [user, setUser] = useState(null);
//   const [tests, setTests] = useState([]);
//   const [manualForm, setManualForm] = useState({
//     subject: "",
//     chapter: "",
//     score: "",
//     total: "",
//   });
//   const [editId, setEditId] = useState(null);
//   const [viewAnswersTest, setViewAnswersTest] = useState(null);
//   const [autoFilter, setAutoFilter] = useState("");
//   const [manualFilter, setManualFilter] = useState("");

//   const navigate = useNavigate();
//    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // const fetchUser = async () => {
  //   try {
  //     const res = await api.get("/users/profile", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setUser(res.data);
  //   } catch (err) {
  //     console.error("❌ Error fetching profile", err);
  //   }
  // };

  // const fetchTests = async () => {
  //   try {
  //     const res = await api.get("/results/my", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setTests(res.data);
  //   } catch (err) {
  //     console.error("❌ Error fetching tests", err);
  //   }
  // };

  // const handleManualSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editId) {
  //       await api.put(
  //         `/results/${editId}`,
  //         { ...manualForm, type: "manual" },
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       alert("✅ Manual result updated");
  //     } else {
  //       await api.post(
  //         "/results/save",
  //         { ...manualForm, type: "manual" },
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
            
  //         }
  //       );
  //       alert("✅ Manual result saved");
  //     }

  //     fetchTests();
  //     setManualForm({ subject: "", chapter: "", score: "", total: "" });
  //     setEditId(null);
  //     setActiveTab("tests");
  //   } catch (err) {
  //     alert("❌ Failed to save manual result");
  //   }
  // };

  // const handleEdit = (test) => {
  //   setManualForm({
  //     subject: test.subject,
  //     chapter: test.chapter,
  //     score: test.score,
  //     total: test.total,
  //   });
  //   setEditId(test._id);
  //   setActiveTab("manual");
  // };

  // const handleDelete = async (testId) => {
  //   if (!window.confirm("Are you sure you want to delete this test?")) return;

  //   try {
  //     await api.delete(`/results/${testId}`, {
  //      headers: { Authorization: `Bearer ${token}` },
  //     });
  //     alert("🗑️ Test deleted");
  //     fetchTests();
  //   } catch (err) {
  //     console.error("❌ Failed to delete test", err);
  //   }
  // };

  // const handleLogout = () => {
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   navigate("/enroll");
  // };
//   useEffect(() => {
//   if (activeTab === "logout") handleLogout();
// }, [activeTab]);

//   useEffect(() => {
//     fetchUser();
//     fetchTests();
//   }, []);

//   const autoTests = tests.filter((t) => t.type !== "manual");
//   const manualTests = tests.filter((t) => t.type === "manual");

//   const filteredAutoTests = autoTests.filter((t) =>
//     t.subject.toLowerCase().includes(autoFilter.toLowerCase())
//   );
//   const filteredManualTests = manualTests.filter((t) =>
//     t.subject.toLowerCase().includes(manualFilter.toLowerCase())
//   );

//   return (
  
//     <div className="flex flex-col md:flex-row min-h-screen">
//       {/* Sidebar */}
//       {/* Mobile Dropdown (shown only on small screens) */}
// <div className="md:hidden bg-gray-100 p-4">
//   <select
//     className="w-full p-2 border rounded"
//     value={activeTab}
//     onChange={(e) => setActiveTab(e.target.value)}
//   >
//     <option value="profile">👤 Profile</option>
//     <option value="tests">📊 My Tests</option>
//     <option value="manual">✍️ Add Manual Test</option>
//     <option value="logout">🚪 Logout</option>
//   </select>
// </div>

// {/* Sidebar for desktop */}
// <div className="hidden md:block bg-gray-800 text-white w-full md:w-64 p-4">
//   <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
//   <ul className="space-y-3">
//     <li>
//       <button
//         onClick={() => setActiveTab("profile")}
//         className={`w-full text-left ${activeTab === "profile" ? "text-yellow-400" : ""}`}
//       >
//         👤 Profile
//       </button>
//     </li>
//     <li>
//       <button
//         onClick={() => setActiveTab("tests")}
//         className={`w-full text-left ${activeTab === "tests" ? "text-yellow-400" : ""}`}
//       >
//         📊 My Tests
//       </button>
//     </li>
//     <li>
//       <button
//         onClick={() => setActiveTab("manual")}
//         className={`w-full text-left ${activeTab === "manual" ? "text-yellow-400" : ""}`}
//       >
//         ✍️ Add Manual Test
//       </button>
//     </li>
//     <li>
//       <button
//         onClick={handleLogout}
//         className="text-red-400 w-full text-left"
//       >
//         🚪 Logout
//       </button>
//     </li>
//   </ul>
// </div>


//       {/* Content */}
//       <div className="flex-1 p-6 bg-gray-100">
//         {activeTab === "profile" && user && (
//           <div>
//             <h3 className="text-xl font-semibold mb-4">👤 Profile</h3>
//             <p><strong>Name:</strong> {user.name}</p>
//             <p><strong>Email:</strong> {user.email}</p>
//             <p><strong>Mobile:</strong> {user.whatsappNo}</p>
//             <p><strong>District:</strong> {user.district}</p>
//             <p><strong>Taluka:</strong> {user.taluka}</p>
//             <p><strong>Username:</strong> {user.username || "Not assigned"}</p>
//             <p><strong>Paid:</strong> {user.isPaid ? "Yes" : "No"}</p>
//           </div>
//         )}

//         {activeTab === "tests" && (
//           <div>
//             <h3 className="text-xl font-semibold mb-4">📊 My Tests</h3>

//             {/* ✅ Progress Summary */}
//             <div className="bg-white p-4 mb-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h4 className="font-bold mb-2">✅ Auto Test Progress</h4>
//                 {filteredAutoTests.length === 0 ? (
//                   <p>No auto tests yet.</p>
//                 ) : (
//                   <div>
//                     <p>
//                       Avg Score:{" "}
//                       <strong>
//                         {Math.round(
//                           (filteredAutoTests.reduce((sum, t) => sum + Number(t.score), 0) /
//                             filteredAutoTests.reduce((sum, t) => sum + Number(t.total), 0)) * 100
//                         ) || 0}
//                         %
//                       </strong>
//                     </p>
//                     <div className="h-4 bg-gray-200 rounded mt-2">
//                       <div
//                         className="h-full bg-blue-500 rounded"
//                         style={{
//                           width: `${
//                             (filteredAutoTests.reduce((sum, t) => sum + Number(t.score), 0) /
//                               filteredAutoTests.reduce((sum, t) => sum + Number(t.total), 0)) * 100
//                           }%`,
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <h4 className="font-bold mb-2">✍️ Manual Test Progress</h4>
//                 {filteredManualTests.length === 0 ? (
//                   <p>No manual tests yet.</p>
//                 ) : (
//                   <div>
//                     <p>
//                       Avg Score:{" "}
//                       <strong>
//                         {Math.round(
//                           (filteredManualTests.reduce((sum, t) => sum + Number(t.score), 0) /
//                             filteredManualTests.reduce((sum, t) => sum + Number(t.total), 0)) * 100
//                         ) || 0}
//                         %
//                       </strong>
//                     </p>
//                     <div className="h-4 bg-gray-200 rounded mt-2">
//                       <div
//                         className="h-full bg-green-500 rounded"
//                         style={{
//                           width: `${
//                             (filteredManualTests.reduce((sum, t) => sum + Number(t.score), 0) /
//                               filteredManualTests.reduce((sum, t) => sum + Number(t.total), 0)) * 100
//                           }%`,
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Test Lists & Charts */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Auto Tests */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h4 className="text-lg font-bold mb-2">✅ Auto Tests</h4>
//                 <input
//                   type="text"
//                   placeholder="Filter by subject"
//                   value={autoFilter}
//                   onChange={(e) => setAutoFilter(e.target.value)}
//                   className="w-full p-2 mb-3 border rounded"
//                 />
//                 {filteredAutoTests.length === 0 ? (
//                   <p>No auto test results found.</p>
//                 ) : (
//                   <>
//                     <ul className="space-y-3">
//                       {filteredAutoTests.map((t, i) => (
//                         <li key={i} className="bg-gray-50 p-3 rounded shadow">
//                           <p><strong>Subject:</strong> {t.subject}</p>
//                           <p><strong>Chapter:</strong> {t.chapter}</p>
//                           <p><strong>Score:</strong> {t.score} / {t.total}</p>
//                           <p><strong>Date:</strong> {new Date(t.createdAt).toLocaleString()}</p>
//                           <div className="flex space-x-4 mt-2">
//                            <button
//                               onClick={() => setViewAnswersTest(t)}
//                               className="text-green-600 text-sm hover:underline"
//                             >
//                               View Answers
//                             </button>
//                           <button
//                             onClick={() => handleDelete(t._id)}
//                             className="text-red-600 text-sm hover:underline"
//                           >
//                             Delete
//                           </button>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                     <div className="mt-6">
//                       <h5 className="font-semibold mb-2">📈 Score Chart</h5>
//                       <ResponsiveContainer width="100%" height={200}>
//                         <BarChart data={filteredAutoTests}>
//                           <XAxis dataKey="chapter" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Bar dataKey="score" fill="#4f46e5" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Manual Tests */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h4 className="text-lg font-bold mb-2">✍️ Manual Tests</h4>
//                 <input
//                   type="text"
//                   placeholder="Filter by subject"
//                   value={manualFilter}
//                   onChange={(e) => setManualFilter(e.target.value)}
//                   className="w-full p-2 mb-3 border rounded"
//                 />
//                 {filteredManualTests.length === 0 ? (
//                   <p>No manual test results found.</p>
//                 ) : (
//                   <>
//                     <ul className="space-y-3">
//                       {filteredManualTests.map((t, i) => (
//                         <li key={i} className="bg-gray-50 p-3 rounded shadow">
//                           <p><strong>Subject:</strong> {t.subject}</p>
//                           <p><strong>Test:</strong> {t.chapter}</p>
//                           <p><strong>Score:</strong> {t.score} / {t.total}</p>
//                           <p><strong>Date:</strong> {new Date(t.createdAt).toLocaleString()}</p>
//                           <div className="flex space-x-4 mt-2">
                           
//                             <button
//                               onClick={() => handleEdit(t)}
//                               className="text-blue-600 text-sm hover:underline"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(t._id)}
//                               className="text-red-600 text-sm hover:underline"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                     <div className="mt-6">
//                       <h5 className="font-semibold mb-2">📊 Score Chart</h5>
//                       <ResponsiveContainer width="100%" height={200}>
//                         <BarChart data={filteredManualTests}>
//                           <XAxis dataKey="chapter" />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Bar dataKey="score" fill="#10b981" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "manual" && (
//           <div>
//             <h3 className="text-xl font-semibold mb-4">
//               {editId ? "✏️ Edit Manual Test" : "➕ Add Manual Test"}
//             </h3>
//             <form onSubmit={handleManualSubmit} className="space-y-4 max-w-md">
//               <input
//                 type="text"
//                 placeholder="Subject"
//                 value={manualForm.subject}
//                 onChange={(e) => setManualForm({ ...manualForm, subject: e.target.value })}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Test Name / Chapter"
//                 value={manualForm.chapter}
//                 onChange={(e) => setManualForm({ ...manualForm, chapter: e.target.value })}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Score"
//                 value={manualForm.score}
//                 onChange={(e) => setManualForm({ ...manualForm, score: e.target.value })}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Total Marks"
//                 value={manualForm.total}
//                 onChange={(e) => setManualForm({ ...manualForm, total: e.target.value })}
//                 required
//                 className="w-full p-2 border rounded"
//               />
//               <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                 {editId ? "Update Test" : "Save Test"}
//               </button>
//             </form>
//           </div>
//         )}
//         {viewAnswersTest && (
//           <AutoTestAnswersModel
//             test={viewAnswersTest}
//             onClose={() => setViewAnswersTest(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };
// export default UserDashboard;




// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import AutoTestAnswersModel from "../components/AutoTestAnswersModel";
// import api from "../utils/axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { Home, BookOpen, User, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
// import Header from "../components/Header"; // Make sure path is correct

// const UserDashboard = () => {
//   // All your existing state and functions remain exactly the same
//   const [activeTab, setActiveTab] = useState("profile");
//   const [user, setUser] = useState(null);
//   const [tests, setTests] = useState([]);
//   const [manualForm, setManualForm] = useState({
//     subject: "",
//     chapter: "",
//     score: "",
//     total: "",
//   });
//   const [editId, setEditId] = useState(null);
//   const [viewAnswersTest, setViewAnswersTest] = useState(null);
//   const [autoFilter, setAutoFilter] = useState("");
//   const [manualFilter, setManualFilter] = useState("");
//   const [isMobile, setIsMobile] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token") || sessionStorage.getItem("token");

//   // Add mobile detection
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Navigation functions
//   const goBack = () => navigate(-1);
//   const goForward = () => navigate(1);

//   // All your existing functions remain unchanged:
//   // const fetchUser = async () => { /* ... */ };
//   // const fetchTests = async () => { /* ... */ };
//   // const handleManualSubmit = async (e) => { /* ... */ };
//   // const handleEdit = (test) => { /* ... */ };
//   // const handleDelete = async (testId) => { /* ... */ };
//   // const handleLogout = () => { /* ... */ };
  
//     const fetchUser = async () => {
//     try {
//       const res = await api.get("/users/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching profile", err);
//     }
//   };

//   const fetchTests = async () => {
//     try {
//       const res = await api.get("/results/my", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTests(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching tests", err);
//     }
//   };

//   const handleManualSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editId) {
//         await api.put(
//           `/results/${editId}`,
//           { ...manualForm, type: "manual" },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         alert("✅ Manual result updated");
//       } else {
//         await api.post(
//           "/results/save",
//           { ...manualForm, type: "manual" },
//           {
//             headers: { Authorization: `Bearer ${token}` },
            
//           }
//         );
//         alert("✅ Manual result saved");
//       }

//       fetchTests();
//       setManualForm({ subject: "", chapter: "", score: "", total: "" });
//       setEditId(null);
//       setActiveTab("tests");
//     } catch (err) {
//       alert("❌ Failed to save manual result");
//     }
//   };

//   const handleEdit = (test) => {
//     setManualForm({
//       subject: test.subject,
//       chapter: test.chapter,
//       score: test.score,
//       total: test.total,
//     });
//     setEditId(test._id);
//     setActiveTab("manual");
//   };

//   const handleDelete = async (testId) => {
//     if (!window.confirm("Are you sure you want to delete this test?")) return;

//     try {
//       await api.delete(`/results/${testId}`, {
//        headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("🗑️ Test deleted");
//       fetchTests();
//     } catch (err) {
//       console.error("❌ Failed to delete test", err);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/enroll");
//   };
//   useEffect(() => {
//     if (activeTab === "logout") handleLogout();
//   }, [activeTab]);

//   useEffect(() => {
//     fetchUser();
//     fetchTests();
//   }, []);

//   const autoTests = tests.filter((t) => t.type !== "manual");
//   const manualTests = tests.filter((t) => t.type === "manual");

//   const filteredAutoTests = autoTests.filter((t) =>
//     t.subject.toLowerCase().includes(autoFilter.toLowerCase())
//   );
//   const filteredManualTests = manualTests.filter((t) =>
//     t.subject.toLowerCase().includes(manualFilter.toLowerCase())
//   );

//   return (
//     <div className="relative min-h-screen">
//       {/* Add Header */}
//       <Header />

//       {/* Mobile Navigation Handles */}
//       {isMobile && (
//         <>
//           <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
//             <button
//               onClick={goBack}
//               className="w-8 h-20 flex items-center justify-center bg-transparent"
//               aria-label="Go back"
//             >
//               <ChevronLeft size={24} className="text-blue-950" />
//             </button>
//           </div>
//           <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
//             <button
//               onClick={goForward}
//               className="w-8 h-20 flex items-center justify-center bg-transparent"
//               aria-label="Go forward"
//             >
//               <ChevronRight size={24} className="text-blue-950" />
//             </button>
//           </div>
//         </>
//       )}

//       {/* Main Content - Keep your existing dashboard structure */}
//        <main className="pb-20 md:pb-0">
//         <div className="flex flex-col md:flex-row min-h-screen">
//           {/* Custom Mobile Dropdown */}
//           <div className="md:hidden bg-gray-100 p-4 sticky top-0 z-10 border-b">
//             <div className="relative">
//               <button 
//                 className="w-full p-3 border rounded-lg text-left flex justify-between items-center bg-white shadow-sm"
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               >
//                 <span className="font-medium">
//                   {activeTab === "profile" && "👤 Profile"}
//                   {activeTab === "tests" && "📊 My Tests"}
//                   {activeTab === "manual" && "✍️ Add Manual Test"}
//                   {activeTab === "logout" && "🚪 Logout"}
//                 </span>
//                 <ChevronDown 
//                   size={18} 
//                   className={`transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
//                 />
//               </button>
              
//               {/* Dropdown Menu */}
//               {isMobileMenuOpen && (
//                 <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-20 max-h-[60vh] overflow-y-auto">
//                   <button 
//                     className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${activeTab === "profile" ? 'text-amber-500 bg-amber-50' : ''}`}
//                     onClick={() => {
//                       setActiveTab("profile");
//                       setIsMobileMenuOpen(false);
//                     }}
//                   >
//                     👤 Profile
//                   </button>
//                   <button 
//                     className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${activeTab === "tests" ? 'text-amber-500 bg-amber-50' : ''}`}
//                     onClick={() => {
//                       setActiveTab("tests");
//                       setIsMobileMenuOpen(false);
//                     }}
//                   >
//                     📊 My Tests
//                   </button>
//                   <button 
//                     className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${activeTab === "manual" ? 'text-amber-500 bg-amber-50' : ''}`}
//                     onClick={() => {
//                       setActiveTab("manual");
//                       setIsMobileMenuOpen(false);
//                     }}
//                   >
//                     ✍️ Add Manual Test
//                   </button>
//                   <button 
//                     className="w-full text-left p-3 hover:bg-gray-50 flex items-center text-red-500"
//                     onClick={() => {
//                       setActiveTab("logout");
//                       setIsMobileMenuOpen(false);
//                     }}
//                   >
//                     🚪 Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Desktop Sidebar - Keep exactly as is */}
//           <div className="hidden md:block bg-gray-800 text-white w-full md:w-64 p-4">
//             <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
//             <ul className="space-y-3">
//               <li>
//                 <button
//                   onClick={() => setActiveTab("profile")}
//                   className={`w-full text-left ${activeTab === "profile" ? "text-yellow-400" : ""}`}
//                 >
//                   👤 Profile
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => setActiveTab("tests")}
//                   className={`w-full text-left ${activeTab === "tests" ? "text-yellow-400" : ""}`}
//                 >
//                   📊 My Tests
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => setActiveTab("manual")}
//                   className={`w-full text-left ${activeTab === "manual" ? "text-yellow-400" : ""}`}
//                 >
//                   ✍️ Add Manual Test
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={handleLogout}
//                   className="text-red-400 w-full text-left"
//                 >
//                   🚪 Logout
//                 </button>
//               </li>
//             </ul>
//           </div>

//           {/* Content Area - Keep all your existing content */}
//           <div className="flex-1 p-6 bg-gray-100">
//             {activeTab === "profile" && user && (
//               <div>
//                 <h3 className="text-xl font-semibold mb-4">👤 Profile</h3>
//                 <p><strong>Name:</strong> {`${user.f_name} ${user.last_name}`}</p>
//                 <p><strong>Email:</strong> {user.email}</p>
//                 <p><strong>Mobile:</strong> {user.whatsappNo}</p>
//                 <p><strong>District:</strong> {user.district}</p>
//                 {/* <p><strong>Taluka:</strong> {user.taluka}</p> */}
//                 <p><strong>Username:</strong> {user.username || "Not assigned"}</p>
//                 <p><strong>Paid:</strong> {user.isPaid ? "Yes" : "No"}</p>
//               </div>
//             )}

//             {activeTab === "tests" && (
//               <div>
//                 <h3 className="text-xl font-semibold mb-4">📊 My Tests</h3>
                
//                 {/* Progress Summary */}
//                 <div className="bg-white p-4 mb-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Auto Test Progress */}
//                   <div>
//                     <h4 className="font-bold mb-2">✅ Auto Test Progress</h4>
//                     {filteredAutoTests.length === 0 ? (
//                       <p>No auto tests yet.</p>
//                     ) : (
//                       <div>
//                         <p>
//                           Avg Score:{" "}
//                           <strong>
//                             {Math.round(
//                               (filteredAutoTests.reduce((sum, t) => sum + Number(t.score), 0) /
//                                 filteredAutoTests.reduce((sum, t) => sum + Number(t.total), 0)) * 100
//                             ) || 0}%
//                           </strong>
//                         </p>
//                         <div className="h-4 bg-gray-200 rounded mt-2">
//                           <div
//                             className="h-full bg-blue-500 rounded"
//                             style={{
//                               width: `${
//                                 (filteredAutoTests.reduce((sum, t) => sum + Number(t.score), 0) /
//                                   filteredAutoTests.reduce((sum, t) => sum + Number(t.total), 0)) * 100
//                               }%`,
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Manual Test Progress */}
//                   <div>
//                     <h4 className="font-bold mb-2">✍️ Manual Test Progress</h4>
//                     {filteredManualTests.length === 0 ? (
//                       <p>No manual tests yet.</p>
//                     ) : (
//                       <div>
//                         <p>
//                           Avg Score:{" "}
//                           <strong>
//                             {Math.round(
//                               (filteredManualTests.reduce((sum, t) => sum + Number(t.score), 0) /
//                                 filteredManualTests.reduce((sum, t) => sum + Number(t.total), 0)) * 100
//                             ) || 0}%
//                           </strong>
//                         </p>
//                         <div className="h-4 bg-gray-200 rounded mt-2">
//                           <div
//                             className="h-full bg-green-500 rounded"
//                             style={{
//                               width: `${
//                                 (filteredManualTests.reduce((sum, t) => sum + Number(t.score), 0) /
//                                   filteredManualTests.reduce((sum, t) => sum + Number(t.total), 0)) * 100
//                               }%`,
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Test Lists & Charts */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Auto Tests */}
//                   <div className="bg-white p-4 rounded shadow">
//                     <h4 className="text-lg font-bold mb-2">✅ Auto Tests</h4>
//                     <input
//                       type="text"
//                       placeholder="Filter by subject"
//                       value={autoFilter}
//                       onChange={(e) => setAutoFilter(e.target.value)}
//                       className="w-full p-2 mb-3 border rounded"
//                     />
//                     {filteredAutoTests.length === 0 ? (
//                       <p>No auto test results found.</p>
//                     ) : (
//                       <>
//                         <ul className="space-y-3">
//                           {filteredAutoTests.map((t, i) => (
//                             <li key={i} className="bg-gray-50 p-3 rounded shadow">
//                               <p><strong>Subject:</strong> {t.subject}</p>
//                               <p><strong>Chapter:</strong> {t.chapter}</p>
//                               <p><strong>Score:</strong> {t.score} / {t.total}</p>
//                               <p><strong>Date:</strong> {new Date(t.createdAt).toLocaleString()}</p>
//                               <div className="flex space-x-4 mt-2">
//                                 <button
//                                   onClick={() => setViewAnswersTest(t)}
//                                   className="text-green-600 text-sm hover:underline"
//                                 >
//                                   View Answers
//                                 </button>
//                                 <button
//                                   onClick={() => handleDelete(t._id)}
//                                   className="text-red-600 text-sm hover:underline"
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             </li>
//                           ))}
//                         </ul>
//                         <div className="mt-6">
//                           <h5 className="font-semibold mb-2">📈 Score Chart</h5>
//                           <ResponsiveContainer width="100%" height={200}>
//                             <BarChart data={filteredAutoTests}>
//                               <XAxis dataKey="chapter" />
//                               <YAxis />
//                               <Tooltip />
//                               <Legend />
//                               <Bar dataKey="score" fill="#4f46e5" />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </div>
//                       </>
//                     )}
//                   </div>

//                   {/* Manual Tests */}
//                   <div className="bg-white p-4 rounded shadow">
//                     <h4 className="text-lg font-bold mb-2">✍️ Manual Tests</h4>
//                     <input
//                       type="text"
//                       placeholder="Filter by subject"
//                       value={manualFilter}
//                       onChange={(e) => setManualFilter(e.target.value)}
//                       className="w-full p-2 mb-3 border rounded"
//                     />
//                     {filteredManualTests.length === 0 ? (
//                       <p>No manual test results found.</p>
//                     ) : (
//                       <>
//                         <ul className="space-y-3">
//                           {filteredManualTests.map((t, i) => (
//                             <li key={i} className="bg-gray-50 p-3 rounded shadow">
//                               <p><strong>Subject:</strong> {t.subject}</p>
//                               <p><strong>Test:</strong> {t.chapter}</p>
//                               <p><strong>Score:</strong> {t.score} / {t.total}</p>
//                               <p><strong>Date:</strong> {new Date(t.createdAt).toLocaleString()}</p>
//                               <div className="flex space-x-4 mt-2">
//                                 <button
//                                   onClick={() => handleEdit(t)}
//                                   className="text-blue-600 text-sm hover:underline"
//                                 >
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() => handleDelete(t._id)}
//                                   className="text-red-600 text-sm hover:underline"
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             </li>
//                           ))}
//                         </ul>
//                         <div className="mt-6">
//                           <h5 className="font-semibold mb-2">📊 Score Chart</h5>
//                           <ResponsiveContainer width="100%" height={200}>
//                             <BarChart data={filteredManualTests}>
//                               <XAxis dataKey="chapter" />
//                               <YAxis />
//                               <Tooltip />
//                               <Legend />
//                               <Bar dataKey="score" fill="#10b981" />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "manual" && (
//               <div>
//                 <h3 className="text-xl font-semibold mb-4">
//                   {editId ? "✏️ Edit Manual Test" : "➕ Add Manual Test"}
//                 </h3>
//                 <form onSubmit={handleManualSubmit} className="space-y-4 max-w-md">
//                   <input
//                     type="text"
//                     placeholder="Subject"
//                     value={manualForm.subject}
//                     onChange={(e) => setManualForm({ ...manualForm, subject: e.target.value })}
//                     required
//                     className="w-full p-2 border rounded"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Test Name / Chapter"
//                     value={manualForm.chapter}
//                     onChange={(e) => setManualForm({ ...manualForm, chapter: e.target.value })}
//                     required
//                     className="w-full p-2 border rounded"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Score"
//                     value={manualForm.score}
//                     onChange={(e) => setManualForm({ ...manualForm, score: e.target.value })}
//                     required
//                     className="w-full p-2 border rounded"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Total Marks"
//                     value={manualForm.total}
//                     onChange={(e) => setManualForm({ ...manualForm, total: e.target.value })}
//                     required
//                     className="w-full p-2 border rounded"
//                   />
//                   <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                     {editId ? "Update Test" : "Save Test"}
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Mobile Bottom Navigation */}
//       {isMobile && (
//         <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 z-50">
//           <div className="flex justify-around py-2">
//             <Link 
//               to="/" 
//               className="flex flex-col items-center p-2 text-white"
//             >
//               <Home size={20} />
//               <span className="text-xs mt-1">Home</span>
//             </Link>
//             <Link 
//               to="/study-materials" 
//               className="flex flex-col items-center p-2 text-white"
//             >
//               <BookOpen size={20} />
//               <span className="text-xs mt-1">Materials</span>
//             </Link>
//             <Link 
//               to="/syllabus" 
//               className="flex flex-col items-center p-2 text-white"
//             >
//               <BookOpen size={20} />
//               <span className="text-xs mt-1">Syllabus</span>
//             </Link>
//             <Link 
//               to="/dashboard" 
//               className="flex flex-col items-center p-2 text-amber-400"
//             >
//               <User size={20} />
//               <span className="text-xs mt-1">Profile</span>
//             </Link>
//           </div>
//         </div>
//       )}

//       {viewAnswersTest && (
//         <AutoTestAnswersModel
//           test={viewAnswersTest}
//           onClose={() => setViewAnswersTest(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default UserDashboard;

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
  Trash2,
  MailPlus,
} from "lucide-react";
import Header from "../components/Header";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [manualForm, setManualForm] = useState({
    subject: "",
    chapter: "",
    score: "",
    total: "",
  });
  const [editId, setEditId] = useState(null);
  const [viewAnswersTest, setViewAnswersTest] = useState(null);
  const [autoFilter, setAutoFilter] = useState("");
  const [manualFilter, setManualFilter] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const navigate = useNavigate();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const goBack = () => navigate(-1);
  const goForward = () => navigate(1);

  // fetch user profile
  const fetchUser = async () => {
    try {
      const res = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("❌ Error fetching profile", err);
    }
  };

  // fetch tests
  const fetchTests = async () => {
    try {
      const res = await api.get("/results/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(res.data);
    } catch (err) {
      console.error("❌ Error fetching tests", err);
    }
  };

  // Load all data
//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       await Promise.all([fetchUser(), fetchTests()]);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

  // manual test save / update
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(
          `/results/${editId}`,
          { ...manualForm, type: "manual" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("✅ Manual result updated");
      } else {
        await api.post(
          "/results/save",
          { ...manualForm, type: "manual" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("✅ Manual result saved");
      }
      fetchTests();
      setManualForm({ subject: "", chapter: "", score: "", total: "" });
      setEditId(null);
      setActiveTab("tests");
    } catch (err) {
      console.error("Manual save error:", err);
      alert("❌ Failed to save manual result");
    }
  };

  const handleEdit = (test) => {
    setManualForm({
      subject: test.subject,
      chapter: test.chapter,
      score: test.score,
      total: test.total,
    });
    setEditId(test._id);
    setActiveTab("manual");
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

  // delete account (confirm through UI + optional browser confirm)
  const deleteAccount = async () => {
    if (!window.confirm("Final confirmation: delete your account? This cannot be undone.")) return;
    try {
      await api.delete("/users/delete-account", {
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
        "/users/update-email",
        { email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // backend should give a success or error message
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

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/enroll");
  };





  useEffect(() => {
    if (activeTab === "logout") handleLogout();
  }, [activeTab]);

  useEffect(() => {
    // loadData();
    fetchUser();
    fetchTests();
  }, []);

  const autoTests = tests.filter((t) => t.type !== "manual");
  const manualTests = tests.filter((t) => t.type === "manual");

  // safe avg calculation helpers
  const totalScore = (arr) => arr.reduce((sum, t) => sum + Number(t.score || 0), 0);
  const totalMarks = (arr) => arr.reduce((sum, t) => sum + Number(t.total || 0), 0);
  const safePercent = (num, denom) => {
    if (!denom || denom === 0) return 0;
    return Math.round((num / denom) * 100);
  };

  const filteredAutoTests = autoTests.filter((t) =>
    t.subject?.toLowerCase().includes(autoFilter.toLowerCase())
  );
  const filteredManualTests = manualTests.filter((t) =>
    t.subject?.toLowerCase().includes(manualFilter.toLowerCase())
  );

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
        <p className="mt-4 text-lg font-medium text-gray-700">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <Header />

      {/* Show loading spinner while data is loading */}
      {isLoading && <LoadingSpinner />}

      {/* Mobile forward/back */}
      {isMobile && !isLoading && (
        <>
          <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
            <button onClick={goBack} className="w-8 h-20 flex items-center justify-center bg-transparent">
              <ChevronLeft size={24} className="text-blue-950" />
            </button>
          </div>
          <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
            <button onClick={goForward} className="w-8 h-20 flex items-center justify-center bg-transparent">
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
                  <ChevronDown size={18} className={`transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isMobileMenuOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-20 max-h-[60vh] overflow-y-auto">
                    <button
                      className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${activeTab === "profile" ? "text-amber-500 bg-amber-50" : ""}`}
                      onClick={() => {
                        setActiveTab("profile");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      👤 Profile
                    </button>

                    <button
                      className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${activeTab === "tests" ? "text-amber-500 bg-amber-50" : ""}`}
                      onClick={() => {
                        setActiveTab("tests");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      📊 My Tests
                    </button>

                    <button
                      className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${activeTab === "manual" ? "text-amber-500 bg-amber-50" : ""}`}
                      onClick={() => {
                        setActiveTab("manual");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      ✍️ Add Manual Test
                    </button>

                    {!user?.email && (
                      <button
                        className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${activeTab === "add-email" ? "text-amber-500 bg-amber-50" : ""}`}
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
                        setActiveTab("logout");
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
                    className={`w-full text-left ${activeTab === "profile" ? "text-yellow-400" : ""}`}
                  >
                    👤 Profile
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("tests")}
                    className={`w-full text-left ${activeTab === "tests" ? "text-yellow-400" : ""}`}
                  >
                    📊 My Tests
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("manual")}
                    className={`w-full text-left ${activeTab === "manual" ? "text-yellow-400" : ""}`}
                  >
                    ✍️ Add Manual Test
                  </button>
                </li>

                {!user?.email && (
                  <li>
                    <button
                      onClick={() => setActiveTab("add-email")}
                      className={`w-full text-left ${activeTab === "add-email" ? "text-yellow-400" : ""}`}
                    >
                      📧 Add Email
                    </button>
                  </li>
                )}

                <li>
                  <button
                    onClick={() => setActiveTab("delete-account")}
                    className={`w-full text-left ${activeTab === "delete-account" ? "text-yellow-400" : ""}`}
                  >
                    🗑️ Delete Account
                  </button>
                </li>

                <li>
                  <button onClick={() => setActiveTab("logout")} className="w-full text-left text-red-400">
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

                  <p><strong>Name:</strong> {`${user.f_name} ${user.last_name}`}</p>

                  {/* <div> */}
                    <p><strong>Email:</strong> {user.email || "Not provided"}</p>
                    {/* {!user.email && (
                      <div className="mt-1 flex flex-col sm:flex-row gap-2 items-start">
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Add your email"
                          className="p-2 border rounded w-full sm:w-auto"
                        />
                        <button
                          onClick={updateEmail}
                          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                        >
                          <MailPlus size={16} className="mr-1" /> Add Email
                        </button>
                        {emailStatus && (
                          <p className="text-sm text-gray-600">{emailStatus}</p>
                        )}
                      </div>
                    )}
                  </div> */}

                  <p><strong>Mobile:</strong> {user.whatsappNo}</p>
                  <p><strong>District:</strong> {user.district}</p>
                  <p><strong>Username:</strong> {user.username || "Not assigned"}</p>
                  <p><strong>Paid:</strong> {user.isPaid ? "Yes" : "No"}</p>
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
                      <button onClick={updateEmail} className="bg-blue-600 text-white px-4 py-2 rounded">Add Email</button>
                      <button onClick={() => setActiveTab("profile")} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancel</button>
                    </div>
                  </div>
                  {emailStatus && <p className="mt-2 text-sm">{emailStatus}</p>}
                </div>
              )}

              {/* Delete account tab (with Cancel) */}
              {activeTab === "delete-account" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">🗑️ Delete Account</h3>
                  <p className="mb-4 text-red-600">⚠️ Warning: This action is permanent and cannot be undone.</p>
                  <div className="flex space-x-3">
                    <button onClick={deleteAccount} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Confirm Delete</button>
                    <button onClick={() => setActiveTab("profile")} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
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
                              {safePercent(totalScore(filteredAutoTests), totalMarks(filteredAutoTests))}%
                            </strong>
                          </p>
                          <div className="h-4 bg-gray-200 rounded mt-2">
                            <div
                              className="h-full bg-blue-500 rounded"
                              style={{
                                width: `${safePercent(totalScore(filteredAutoTests), totalMarks(filteredAutoTests))}%`,
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
                              {safePercent(totalScore(filteredManualTests), totalMarks(filteredManualTests))}%
                            </strong>
                          </p>
                          <div className="h-4 bg-gray-200 rounded mt-2">
                            <div
                              className="h-full bg-green-500 rounded"
                              style={{
                                width: `${safePercent(totalScore(filteredManualTests), totalMarks(filteredManualTests))}%`,
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
                      <h4 className="text-lg font-bold mb-2">✅ Auto Tests</h4>
                      <input
                        type="text"
                        placeholder="Filter by subject"
                        value={autoFilter}
                        onChange={(e) => setAutoFilter(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                      />
                      {filteredAutoTests.length === 0 ? (
                        <p>No auto test results found.</p>
                      ) : (
                        <>
                          <ul className="space-y-3">
                            {filteredAutoTests.map((t, i) => (
                              <li key={t_id || i} className="bg-gray-50 p-3 rounded shadow">
                                <p><strong>Subject:</strong> {t.subject}</p>
                                <p><strong>Chapter:</strong> {t.chapter}</p>
                                <p><strong>Score:</strong> {t.score} / {t.total}</p>
                                <p><strong>Date:</strong> {new Date(t.createdAt).toLocaleString()}</p>
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
                              <BarChart data={filteredAutoTests}>
                                <XAxis dataKey="chapter" />
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
                      <input
                        type="text"
                        placeholder="Filter by subject"
                        value={manualFilter}
                        onChange={(e) => setManualFilter(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                      />
                      {filteredManualTests.length === 0 ? (
                        <p>No manual test results found.</p>
                      ) : (
                        <>
                          <ul className="space-y-3">
                            {filteredManualTests.map((t, i) => (
                              <li key={t_id || i} className="bg-gray-50 p-3 rounded shadow">
                                <p><strong>Subject:</strong> {t.subject}</p>
                                <p><strong>Test:</strong> {t.chapter}</p>
                                <p><strong>Score:</strong> {t.score} / {t.total}</p>
                                <p><strong>Date:</strong> {new Date(t.createdAt).toLocaleString()}</p>
                                <div className="flex space-x-4 mt-2">
                                  <button onClick={() => handleEdit(t)} className="text-blue-600 text-sm hover:underline">Edit</button>
                                  <button onClick={() => handleDelete(t._id)} className="text-red-600 text-sm hover:underline">Delete</button>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6">
                            <h5 className="font-semibold mb-2">📊 Score Chart</h5>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={filteredManualTests}>
                                <XAxis dataKey="chapter" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="score" fill="#10b981" />
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
                  <h3 className="text-xl font-semibold mb-4">{editId ? "✏️ Edit Manual Test" : "➕ Add Manual Test"}</h3>
                  <form onSubmit={handleManualSubmit} className="space-y-4 max-w-md">
                    <input
                      type="text"
                      placeholder="Subject"
                      value={manualForm.subject}
                      onChange={(e) => setManualForm({ ...manualForm, subject: e.target.value })}
                      required
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Test Name / Chapter"
                      value={manualForm.chapter}
                      onChange={(e) => setManualForm({ ...manualForm, chapter: e.target.value })}
                      required
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Score"
                      value={manualForm.score}
                      onChange={(e) => setManualForm({ ...manualForm, score: e.target.value })}
                      required
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Total Marks"
                      value={manualForm.total}
                      onChange={(e) => setManualForm({ ...manualForm, total: e.target.value })}
                      required
                      className="w-full p-2 border rounded"
                    />
                    {/* <div className="flex gap-2"> */}
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        {editId ? "Update Test" : "Save Test"}
                      </button>
                      {/* {editId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditId(null);
                            setManualForm({ subject: "", chapter: "", score: "", total: "" });
                          }}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      )} */}
                    {/* </div> */}
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
            <Link to="/study-materials" className="flex flex-col items-center p-2 text-white">
              <BookOpen size={20} />
              <span className="text-xs mt-1">Materials</span>
            </Link>
            <Link to="/syllabus" className="flex flex-col items-center p-2 text-white">
              <BookOpen size={20} />
              <span className="text-xs mt-1">Syllabus</span>
            </Link>
            <Link to="/dashboard" className="flex flex-col items-center p-2 text-amber-400">
              <User size={20} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      )}

      {/* Answers modal */}
      {viewAnswersTest && (
        <AutoTestAnswersModel test={viewAnswersTest} onClose={() => setViewAnswersTest(null)} />
      )}
    </div>
  );
};

export default UserDashboard;