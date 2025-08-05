// import { useEffect, useState } from "react";
// import api from "../../utils/axios";
// import AdminHeader from "../../components/Admin/AdminHeader";
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUserResults, setSelectedUserResults] = useState([]);
//   const [selectedUserName, setSelectedUserName] = useState("");
//   const [showResultsModal, setShowResultsModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [resultSearch, setResultSearch] = useState("");
//   const [resultSortOrder, setResultSortOrder] = useState("desc");
//   const [editUser, setEditUser] = useState(null);
//   const [form, setForm] = useState({
//     name: "",
//     whatsappNo: "",
//     taluka: "",
//     username: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchUsers = async () => {
//     setIsLoading(true);
//     try {
//       const res = await api.get("/admin/users", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//       });
//       setUsers(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching users:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTogglePaid = async (userId) => {
//     try {
//       const res = await api.patch(`/users/toggle-paid/${userId}`, null, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//       });
//       setUsers(prev => prev.map(u => 
//         u._id === userId ? { ...u, isPaid: res.data.isPaid, username: res.data.username } : u
//       ));
//     } catch (err) {
//       console.error("Failed to toggle paid status:", err);
//     }
//   };

//   const handleViewResults = async (userId, userName) => {
//     try {
//       const res = await api.get(`/admin/user-tests/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//       });
//       setSelectedUserResults(res.data);
//       setSelectedUserName(userName);
//       setShowResultsModal(true);
//     } catch (err) {
//       console.error("Error fetching user test results:", err);
//     }
//   };

//   const handleEdit = (user) => {
//     setEditUser(user._id);
//     setForm({
//       name: user.name,
//       whatsappNo: user.whatsappNo,
//       taluka: user.taluka,
//       username: user.username,
//     });
//   };

//   const handleUpdate = async () => {
//     try {
//       await api.put(`/admin/users/${editUser}`, form, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//       });
//       setEditUser(null);
//       fetchUsers();
//     } catch (err) {
//       console.error("Failed to update user:", err);
//     }
//   };

//   const confirmDelete = (user) => {
//     setUserToDelete(user);
//     setShowDeleteModal(true);
//   };

//   const handleDelete = async () => {
//     if (!userToDelete) return;
//     try {
//       await api.delete(`/admin/users/${userToDelete._id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//       });
//       setShowDeleteModal(false);
//       fetchUsers();
//     } catch (err) {
//       console.error("Failed to delete user:", err);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter((u) => {
//     const searchText = search.toLowerCase();
//     return (
//       (u.name.toLowerCase().includes(searchText) ||
//         u.whatsappNo.includes(searchText) ||
//         u.username?.toLowerCase().includes(searchText) ||
//         u.taluka.toLowerCase().includes(searchText)) &&
//       (statusFilter === "" ? true : statusFilter === "paid" ? u.isPaid : !u.isPaid)
//     );
//   });

//   const filteredResults = selectedUserResults
//     .filter(t => t.subject.toLowerCase().includes(resultSearch.toLowerCase()))
//     .sort((a, b) => resultSortOrder === "asc" 
//       ? new Date(a.createdAt) - new Date(b.createdAt) 
//       : new Date(b.createdAt) - new Date(a.createdAt)
//     );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AdminHeader />
      
//       <div className="max-w-7xl mx-auto p-4">
//         <h2 className="text-2xl font-bold text-center mb-6">Registered Users</h2>

//         {/* Search and Filter */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <input
//             type="text"
//             placeholder="Search name, username, mobile, taluka"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="p-2 border rounded w-full md:w-1/2"
//           />
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="p-2 border rounded w-full md:w-auto"
//           >
//             <option value="">All Users</option>
//             <option value="paid">Paid Users</option>
//             <option value="unpaid">Unpaid Users</option>
//           </select>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <>
//             {/* Card-based layout for all screen sizes */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredUsers.map((u) => (
//                 <div key={u._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-start">
//                       <h3 className="font-medium text-lg">
//                         {editUser === u._id ? (
//                           <input
//                             value={form.name}
//                             onChange={(e) => setForm({...form, name: e.target.value})}
//                             className="border p-1 w-full rounded"
//                           />
//                         ) : (
//                           u.name
//                         )}
//                       </h3>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         u.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                       }`}>
//                         {u.isPaid ? "Paid" : "Unpaid"}
//                       </span>
//                     </div>

//                     <div className="space-y-1 text-sm">
//                       <p>
//                         <span className="font-medium">Mobile:</span>{" "}
//                         {editUser === u._id ? (
//                           <input
//                             value={form.whatsappNo}
//                             onChange={(e) => setForm({...form, whatsappNo: e.target.value})}
//                             className="border p-1 w-full rounded"
//                           />
//                         ) : (
//                           u.whatsappNo
//                         )}
//                       </p>
//                       <p>
//                         <span className="font-medium">Taluka:</span>{" "}
//                         {editUser === u._id ? (
//                           <input
//                             value={form.taluka}
//                             onChange={(e) => setForm({...form, taluka: e.target.value})}
//                             className="border p-1 w-full rounded"
//                           />
//                         ) : (
//                           u.taluka
//                         )}
//                       </p>
//                       {u.username && (
//                         <p>
//                           <span className="font-medium">Username:</span> {u.username}
//                         </p>
//                       )}
//                     </div>

//                      {/* Action Buttons - 2 per row for ALL screen sizes */}
//                     <div className="space-y-2 mt-3">
//                       {/* First Row */}
//                       <div className="flex gap-2">
//                       <button
//                         onClick={() => handleViewResults(u._id, u.name)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex-1 min-w-[100px]"
//                       >
//                         Results
//                       </button>
//                       <button
//                         onClick={() => handleTogglePaid(u._id)}
//                         className={`text-white px-3 py-1 rounded text-sm flex-1 min-w-[100px] ${
//                           u.isPaid ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
//                         }`}
//                       >
//                         {u.isPaid ? "Unpaid" : "Paid"}
//                       </button>
//                       </div>
//                       <div className="flex gap-2">
//                       {editUser === u._id ? (
//                         <button
//                           onClick={handleUpdate}
//                           className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex-1 min-w-[100px]"
//                         >
//                           Save
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(u)}
//                           className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 flex-1 min-w-[100px]"
//                         >
//                           Edit
//                         </button>
//                       )}
//                       <button
//                         onClick={() => confirmDelete(u)}
//                         className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800 flex-1 min-w-[100px]"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 </div>
//               ))}
//             </div>

//             {filteredUsers.length === 0 && (
//               <div className="text-center py-8 bg-white rounded shadow">
//                 <p className="text-gray-500">No users found matching your criteria</p>
//               </div>
//             )}
//           </>
//         )}

//         {/* Results Modal */}
//         <Transition appear show={showResultsModal} as={Fragment}>
//           <Dialog as="div" className="relative z-50" onClose={() => setShowResultsModal(false)}>
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <div className="fixed inset-0 bg-black bg-opacity-50" />
//             </Transition.Child>

//             <div className="fixed inset-0 overflow-y-auto">
//               <div className="flex min-h-full items-center justify-center p-4 text-center">
//                 <Transition.Child
//                   as={Fragment}
//                   enter="ease-out duration-300"
//                   enterFrom="opacity-0 scale-95"
//                   enterTo="opacity-100 scale-100"
//                   leave="ease-in duration-200"
//                   leaveFrom="opacity-100 scale-100"
//                   leaveTo="opacity-0 scale-95"
//                 >
//                   <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                     <Dialog.Title
//                       as="h3"
//                       className="text-lg font-medium leading-6 text-gray-900"
//                     >
//                       {selectedUserName}'s Test Results
//                     </Dialog.Title>

//                     <div className="flex flex-col md:flex-row gap-4 my-6">
//                       <input
//                         type="text"
//                         placeholder="Filter by subject"
//                         value={resultSearch}
//                         onChange={(e) => setResultSearch(e.target.value)}
//                         className="p-2 border rounded flex-grow"
//                       />
//                       <select
//                         value={resultSortOrder}
//                         onChange={(e) => setResultSortOrder(e.target.value)}
//                         className="p-2 border rounded"
//                       >
//                         <option value="desc">Newest First</option>
//                         <option value="asc">Oldest First</option>
//                       </select>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <h4 className="text-lg font-semibold mb-4 bg-blue-50 p-2 rounded">
//                           ✅ Auto Tests
//                         </h4>
//                         {filteredResults
//                           .filter(t => t.type !== "manual")
//                           .map((t, i) => (
//                             <div key={i} className="bg-gray-50 p-3 mb-3 rounded border">
//                               <p><strong>Subject:</strong> {t.subject}</p>
//                               <p><strong>Chapter:</strong> {t.chapter}</p>
//                               <p><strong>Score:</strong> {t.score}/{t.total}</p>
//                               <p className="text-sm text-gray-500">
//                                 {new Date(t.createdAt).toLocaleString()}
//                               </p>
//                             </div>
//                           ))}
//                       </div>

//                       <div>
//                         <h4 className="text-lg font-semibold mb-4 bg-yellow-50 p-2 rounded">
//                           ✍️ Manual Tests
//                         </h4>
//                         {filteredResults
//                           .filter(t => t.type === "manual")
//                           .map((t, i) => (
//                             <div key={i} className="bg-gray-50 p-3 mb-3 rounded border">
//                               <p><strong>Subject:</strong> {t.subject}</p>
//                               <p><strong>Test:</strong> {t.chapter}</p>
//                               <p><strong>Score:</strong> {t.score}/{t.total}</p>
//                               <p className="text-sm text-gray-500">
//                                 {new Date(t.createdAt).toLocaleString()}
//                               </p>
//                             </div>
//                           ))}
//                       </div>
//                     </div>

//                     <div className="mt-6 flex justify-end">
//                       <button
//                         type="button"
//                         className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                         onClick={() => setShowResultsModal(false)}
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </Dialog.Panel>
//                 </Transition.Child>
//               </div>
//             </div>
//           </Dialog>
//         </Transition>

//         {/* Delete Confirmation Modal */}
//         <Transition appear show={showDeleteModal} as={Fragment}>
//           <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteModal(false)}>
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <div className="fixed inset-0 bg-black bg-opacity-50" />
//             </Transition.Child>

//             <div className="fixed inset-0 overflow-y-auto">
//               <div className="flex min-h-full items-center justify-center p-4 text-center">
//                 <Transition.Child
//                   as={Fragment}
//                   enter="ease-out duration-300"
//                   enterFrom="opacity-0 scale-95"
//                   enterTo="opacity-100 scale-100"
//                   leave="ease-in duration-200"
//                   leaveFrom="opacity-100 scale-100"
//                   leaveTo="opacity-0 scale-95"
//                 >
//                   <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                     <Dialog.Title
//                       as="h3"
//                       className="text-lg font-medium leading-6 text-gray-900"
//                     >
//                       Confirm Deletion
//                     </Dialog.Title>
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-500">
//                         Are you sure you want to delete user <strong>{userToDelete?.name}</strong>? This action cannot be undone.
//                       </p>
//                     </div>

//                     <div className="mt-4 flex justify-end space-x-3">
//                       <button
//                         type="button"
//                         className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                         onClick={() => setShowDeleteModal(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="button"
//                         className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
//                         onClick={handleDelete}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </Dialog.Panel>
//                 </Transition.Child>
//               </div>
//             </div>
//           </Dialog>
//         </Transition>
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;

import { useEffect, useState } from "react";
import api from "../../utils/axios";
import AdminHeader from "../../components/Admin/AdminHeader";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserResults, setSelectedUserResults] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [resultSearch, setResultSearch] = useState("");
  const [resultSortOrder, setResultSortOrder] = useState("desc");
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    f_name: "",
    last_name: "",
    whatsappNo: "",
    district: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePaid = async (userId) => {
    try {
      const res = await api.patch(`/users/toggle-paid/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isPaid: res.data.isPaid, username: res.data.username } : u
      ));
    } catch (err) {
      console.error("Failed to toggle paid status:", err);
    }
  };

  const handleViewResults = async (userId, userName) => {
    try {
      const res = await api.get(`/admin/user-tests/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setSelectedUserResults(res.data);
      setSelectedUserName(userName);
      setShowResultsModal(true);
    } catch (err) {
      console.error("Error fetching user test results:", err);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user._id);
    setForm({
      f_name: user.f_name,
      last_name: user.last_name || "",
      whatsappNo: user.whatsappNo,
      district: user.district,
      username: user.username,
    });
  };

  const handleUpdate = async () => {
  try {
    const res = await api.put(
      `/admin/users/${editUser}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );

    setUsers(prev => prev.map(u => 
      u._id === editUser ? {
        ...u,
        f_name: res.data.user.f_name,
        last_name: res.data.user.last_name,
        whatsappNo: res.data.user.whatsappNo,
        district: res.data.user.district,
        // username: res.data.user.username
      } : u
    ));
    
    setEditUser(null);
    alert("User updated successfully!");
  } catch (err) {
    console.error("Failed to update user:", err);
    alert(`Error: ${err.response?.data?.message || "Failed to update user"}`);
  }
};

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/admin/users/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const searchText = search.toLowerCase();
    const fullName = `${u.f_name} ${u.last_name || ''}`.toLowerCase();
    return (
      fullName.includes(searchText) ||
      u.whatsappNo.includes(searchText) ||
      u.username?.toLowerCase().includes(searchText) ||
      u.district.toLowerCase().includes(searchText)
    ) && (
      statusFilter === "" ? true : statusFilter === "paid" ? u.isPaid : !u.isPaid
    );
  });

  const filteredResults = selectedUserResults
    .filter(t => t.subject.toLowerCase().includes(resultSearch.toLowerCase()))
    .sort((a, b) => resultSortOrder === "asc" 
      ? new Date(a.createdAt) - new Date(b.createdAt) 
      : new Date(b.createdAt) - new Date(a.createdAt)
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-6">Registered Users</h2>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search name, username, mobile, district"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded w-full md:w-auto"
          >
            <option value="">All Users</option>
            <option value="paid">Paid Users</option>
            <option value="unpaid">Unpaid Users</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Card-based layout for all screen sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((u) => (
                <div key={u._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">
                        {editUser === u._id ? (
                          <div className="flex gap-2">
                            <input
                              value={form.f_name}
                              onChange={(e) => setForm({...form, f_name: e.target.value})}
                              className="border p-1 rounded"
                              placeholder="First name"
                            />
                            <input
                              value={form.last_name}
                              onChange={(e) => setForm({...form, last_name: e.target.value})}
                              className="border p-1 rounded"
                              placeholder="Last name"
                            />
                          </div>
                        ) : (
                          `${u.f_name} ${u.last_name || ''}`.trim()
                        )}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {u.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Mobile:</span>{" "}
                        {editUser === u._id ? (
                          <input
                            value={form.whatsappNo}
                            onChange={(e) => setForm({...form, whatsappNo: e.target.value})}
                            className="border p-1 w-full rounded"
                          />
                        ) : (
                          u.whatsappNo
                        )}
                      </p>
                      <p>
                        <span className="font-medium">District:</span>{" "}
                        {editUser === u._id ? (
                          <input
                            value={form.district}
                            onChange={(e) => setForm({...form, district: e.target.value})}
                            className="border p-1 w-full rounded"
                          />
                        ) : (
                          u.district
                        )}
                      </p>
                      {u.username && (
                        <p>
                          <span className="font-medium">Username:</span> {u.username}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 mt-3">
                      {/* First Row */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewResults(u._id, `${u.f_name} ${u.last_name || ''}`.trim())}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex-1 min-w-[100px]"
                        >
                          Results
                        </button>
                        <button
                          onClick={() => handleTogglePaid(u._id)}
                          className={`text-white px-3 py-1 rounded text-sm flex-1 min-w-[100px] ${
                            u.isPaid ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {u.isPaid ? "Unpaid" : "Paid"}
                        </button>
                      </div>
                      {/* Second Row */}
                      <div className="flex gap-2">
                        {editUser === u._id ? (
                          <button
                            onClick={handleUpdate}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex-1 min-w-[100px]"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(u)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 flex-1 min-w-[100px]"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => confirmDelete(u)}
                          className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800 flex-1 min-w-[100px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 bg-white rounded shadow">
                <p className="text-gray-500">No users found matching your criteria</p>
              </div>
            )}
          </>
        )}

        {/* Results Modal */}
        <Transition appear show={showResultsModal} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setShowResultsModal(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {selectedUserName}'s Test Results
                    </Dialog.Title>

                    <div className="flex flex-col md:flex-row gap-4 my-6">
                      <input
                        type="text"
                        placeholder="Filter by subject"
                        value={resultSearch}
                        onChange={(e) => setResultSearch(e.target.value)}
                        className="p-2 border rounded flex-grow"
                      />
                      <select
                        value={resultSortOrder}
                        onChange={(e) => setResultSortOrder(e.target.value)}
                        className="p-2 border rounded"
                      >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold mb-4 bg-blue-50 p-2 rounded">
                          ✅ Auto Tests
                        </h4>
                        {filteredResults
                          .filter(t => t.type !== "manual")
                          .map((t, i) => (
                            <div key={i} className="bg-gray-50 p-3 mb-3 rounded border">
                              <p><strong>Subject:</strong> {t.subject}</p>
                              <p><strong>Chapter:</strong> {t.chapter}</p>
                              <p><strong>Score:</strong> {t.score}/{t.total}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(t.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-4 bg-yellow-50 p-2 rounded">
                          ✍️ Manual Tests
                        </h4>
                        {filteredResults
                          .filter(t => t.type === "manual")
                          .map((t, i) => (
                            <div key={i} className="bg-gray-50 p-3 mb-3 rounded border">
                              <p><strong>Subject:</strong> {t.subject}</p>
                              <p><strong>Test:</strong> {t.chapter}</p>
                              <p><strong>Score:</strong> {t.score}/{t.total}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(t.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setShowResultsModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Delete Confirmation Modal */}
        <Transition appear show={showDeleteModal} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteModal(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Confirm Deletion
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete user <strong>{userToDelete && `${userToDelete.f_name} ${userToDelete.last_name || ''}`.trim()}</strong>? This action cannot be undone.
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setShowDeleteModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default AdminUsers;