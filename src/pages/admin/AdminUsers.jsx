import { useEffect, useState, Fragment } from "react";
import api, { getToken } from "../../utils/axios";
import AdminHeader from "../../components/Admin/AdminHeader";
import { Dialog, Transition } from "@headlessui/react";

const AdminUsers = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    district: "",
    whatsappNo: "",
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = getToken();

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // ----------------- FETCH COURSES -----------------
  useEffect(() => {
    const fetchCourses = async () => {
      setIsCoursesLoading(true);
      try {
        const res = await api.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses");
      } finally {
        setIsCoursesLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  // ----------------- FETCH USERS -----------------
  const fetchUsers = async () => {
    if (!selectedCourse) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await api.get(`/users/course/${selectedCourse}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedCourse]);

 // ----------------- TOGGLE PAID -----------------
// const handleTogglePaid = async (userId, currentStatus) => {
//   try {
//     const res = await api.post(
//       `/users/${userId}/course/${selectedCourse}/togglePaid`,
//       { isPaid: !currentStatus }, 
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     const updatedEnrollment = res.data.enrollment;

//     setUsers(prev =>
//   prev.map(u => {
//     if (u.userId === userId) {
//       const enrollment = res.data.enrollment;
//       if (!enrollment) return u; // <--- prevents undefined errors
//       return {
//         ...u,
//         isPaid: enrollment.isPaid,
//         username: enrollment.username || u.username,
//       };
//     }
//     return u;
//   })
// );
//     // setSuccess(`User marked as ${updatedEnrollment.isPaid ? "Paid" : "Unpaid"}`);
//     setSuccess("Payment status updated successfully");
//   } catch (err) {
//     console.error("Failed to toggle paid status:", err);
//     setError("Failed to update payment status");
//   }
// };



  // ----------------- DELETE USER -----------------
  // ----------------- TOGGLE PAID -----------------
const handleTogglePaid = async (userId, currentStatus) => {
  // Optimistic update (flip paid only)
  setUsers(prev =>
    prev.map(u =>
      u.userId === userId ? { ...u, isPaid: !currentStatus } : u
    )
  );

  try {
    const res = await api.post(
      `/users/${userId}/course/${selectedCourse}/togglePaid`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedUser = res.data.user; // ✅ new key from backend

    if (updatedUser) {
      setUsers(prev =>
        prev.map(u => (u.userId === userId ? updatedUser : u))
      );
    }

    setSuccess(`User marked as ${!currentStatus ? "Paid" : "Unpaid"}`);
  } catch (err) {
    console.error("Failed to toggle paid status:", err);
    setError("Failed to update payment status");

    // Revert if error
    setUsers(prev =>
      prev.map(u =>
        u.userId === userId ? { ...u, isPaid: currentStatus } : u
      )
    );
  }
};



  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/courses/${selectedCourse}/users/${userToDelete.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      setSuccess("User removed from course successfully");
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Failed to remove user from course");
    }
  };

  // ----------------- EDIT USER -----------------
  const handleEdit = (user) => {
    setEditUser(user.userId);
    setForm({
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      district: user.district || "",
      whatsappNo: user.whatsappNo || "",
    });
  };

  const cancelEdit = () => {
    setEditUser(null);
    setForm({
      name: "",
      email: "",
      username: "",
      district: "",
      whatsappNo: "",
    });
  };


  const handleUpdate = async () => {
  try {
    // Update UI immediately
    setUsers(prev =>
      prev.map(u =>
        u.userId === editUser
          ? {
              ...u,
              name: form.name,
              email: form.email,
              username: form.username,
              district: form.district,
              whatsappNo: form.whatsappNo,
              isPaid: u.isPaid // keep paid status intact
            }
          : u
      )
    );

    // Send update to backend
    await api.patch(
      `/courses/${selectedCourse}/users/${editUser}`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditUser(null);
    setSuccess("User updated successfully!");
  } catch (err) {
    console.error("Failed to update user:", err);
    setError(err.response?.data?.message || "Failed to update user");

    // Optional: revert UI if API fails
    fetchUsers(); // refetch fresh data
  }
};



  // ----------------- FILTER USERS -----------------
  const filteredUsers = users.filter((u) => {
    const searchText = search.toLowerCase();
    return (
      (u.name?.toLowerCase().includes(searchText) ||
        u.email?.toLowerCase().includes(searchText) ||
        u.username?.toLowerCase().includes(searchText)) &&
      (statusFilter === ""
        ? true
        : statusFilter === "paid"
        ? u.isPaid
        : !u.isPaid)
    );
  });

  // ----------------- RENDER -----------------
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-6">Manage Users</h2>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/3 relative">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="p-2 border rounded w-full"
              disabled={isCoursesLoading}
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {isCoursesLoading && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Search by name, email, username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded flex-1"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded w-full md:w-1/4"
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Users */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {!selectedCourse ? (
              <div className="text-center py-8 bg-white rounded shadow">
                <p className="text-gray-500">Please select a course to view users</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((u) => (
                  <div
                    key={u.userId}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">
                        {editUser === u.userId ? (
                          <input
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          u.name || "No Name"
                        )}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </div>

                    <div className="mt-2 text-sm space-y-1">
                      <p>
                        <strong>Email:</strong>{" "}
                        {editUser === u.userId ? (
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          u.email || "N/A"
                        )}
                      </p>
                      <p>
                        <strong>Username:</strong>{" "}
                        {editUser === u.userId ? (
                          <input
                            value={form.username}
                            onChange={(e) =>
                              setForm({ ...form, username: e.target.value })
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          u.username || "N/A"
                        )}
                      </p>
                      <p>
                        <strong>District:</strong>{" "}
                        {editUser === u.userId ? (
                          <input
                            value={form.district}
                            onChange={(e) =>
                              setForm({ ...form, district: e.target.value })
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          u.district || "N/A"
                        )}
                      </p>
                      <p>
                        <strong>WhatsApp:</strong>{" "}
                        {editUser === u.userId ? (
                          <input
                            type="tel"
                            value={form.whatsappNo}
                            onChange={(e) =>
                              setForm({ ...form, whatsappNo: e.target.value })
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          u.whatsappNo || "N/A"
                        )}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {editUser === u.userId ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex-1 hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm flex-1 hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(u)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm flex-1 hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleTogglePaid(u.userId, u.isPaid)}
                        className={`text-white px-3 py-1 rounded text-sm flex-1 ${
                          u.isPaid
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {u.isPaid ? "Mark Unpaid" : "Mark Paid"}
                      </button>

                      <button
                        onClick={() => confirmDelete(u)}
                        className="bg-gray-700 text-white px-3 py-1 rounded text-sm flex-1 hover:bg-gray-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded shadow">
                <p className="text-gray-500">
                  {users.length === 0 
                    ? "No users enrolled in this course" 
                    : "No users match your search criteria"}
                </p>
              </div>
            )}
          </>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        <Transition appear show={showDeleteModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setShowDeleteModal(false)}
          >
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Confirm Deletion
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove{" "}
                        <strong>{userToDelete?.name}</strong> from this course?
                        This action cannot be undone.
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm rounded border bg-white text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowDeleteModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
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