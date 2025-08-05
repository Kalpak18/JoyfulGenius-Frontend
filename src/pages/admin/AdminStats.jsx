// // src/pages/admin/AdminStats.jsx
// import { useEffect, useState } from "react";
// import api from "../../utils/axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   CartesianGrid,
// } from "recharts";

// const AdminStats = () => {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await api.get("/admin/stats", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//           },
//         });
//         setStats(res.data);
//         console.log("✅ Admin stats received:", res.data);

//       } catch (err) {
//         console.error("Failed to fetch stats:", err);
//       }
//     };

//     fetchStats();
//   }, []);

//   if (
//     !stats ||
//     !Array.isArray(stats.subjectStats) ||
//     !Array.isArray(stats.topScorers) ||
//     !Array.isArray(stats.talukaStats)
//   ) {
//     return <p className="text-center mt-10">Loading or invalid dashboard data...</p>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h2 className="text-2xl font-bold text-center mb-6">📊 Admin Dashboard</h2>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white p-4 shadow rounded text-center">
//           <h4 className="text-lg font-bold">👥 Total Users</h4>
//           <p className="text-2xl text-blue-700">{stats.totalUsers}</p>
//         </div>
//         <div className="bg-white p-4 shadow rounded text-center">
//           <h4 className="text-lg font-bold">✅ Paid Users</h4>
//           <p className="text-2xl text-green-600">{stats.paidUsers}</p>
//         </div>
//         <div className="bg-white p-4 shadow rounded text-center">
//           <h4 className="text-lg font-bold">❌ Unpaid Users</h4>
//           <p className="text-2xl text-red-500">{stats.unpaidUsers}</p>
//         </div>
//         <div className="bg-white p-4 shadow rounded text-center">
//           <h4 className="text-lg font-bold">📝 Total Tests</h4>
//           <p className="text-2xl text-purple-600">{stats.totalTests}</p>
//         </div>
//       </div>

//       {/* Subject Stats */}
//       <div className="bg-white p-6 rounded shadow mb-8">
//         <h3 className="text-lg font-semibold mb-4">📈 Test Attempts per Subject</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={stats.subjectStats}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="_id" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count" fill="#6366f1" name="Attempts" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Top 5 Scorers */}
//       <div className="bg-white p-6 rounded shadow mb-8">
//         <h3 className="text-lg font-semibold mb-4">🏆 Top 5 Scorers</h3>
//         <ul className="space-y-3">
//           {stats.topScorers.map((s, i) => (
//             <li key={i} className="border p-3 rounded shadow-sm flex justify-between items-center">
//               <div>
//                 <p className="font-bold">{s.name}</p>
//                 <p className="text-sm text-gray-500">Taluka: {s.taluka}</p>
//               </div>
//               <span className="text-blue-600 font-semibold">{s.avgScore}%</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Taluka Distribution */}
//       <div className="bg-white p-6 rounded shadow mb-8">
//         <h3 className="text-lg font-semibold mb-4">🌍 User Distribution by Taluka</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={stats.talukaStats}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="_id" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count" fill="#10b981" name="Users" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default AdminStats;



import { useEffect, useState } from "react";
import api from "../../utils/axios";
import AdminHeader from "../../components/Admin/AdminHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        setStats(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderChart = (data, dataKey, name, isPie = false) => {
    if (!data || data.length === 0) return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No data available</p>
      </div>
    );

    return (
      <div className="w-full h-[300px] min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          {isPie ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey="_id"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill="#6366f1" name={name} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="pt-20 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-center">
                <div className="h-8 w-48 bg-gray-200 rounded mb-4 mx-auto"></div>
                <p className="text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="pt-20 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-10">
              <p className="text-red-500">Failed to load dashboard data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="pt-20 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
              📊 Admin Dashboard
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { title: "Total Users", value: stats.totalUsers, icon: "👥", color: "blue" },
              { title: "Paid Users", value: stats.paidUsers, icon: "✅", color: "green" },
              { title: "Unpaid Users", value: stats.unpaidUsers, icon: "❌", color: "red" },
              { title: "Total Tests", value: stats.totalTests, icon: "📝", color: "purple" },
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <h4 className="text-sm md:text-base font-medium text-gray-700 mb-1">
                  {stat.title}
                </h4>
                <p className={`text-xl md:text-2xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Subject Stats */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
                📈 Test Attempts per Subject
              </h3>
              {renderChart(stats.subjectStats, 'count', 'Attempts')}
            </div>

            {/* Top Scorers and District Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
                  🏆 Top 5 Scorers
                </h3>
                <div className="space-y-3">
                  {stats.topScorers.map((s, i) => (
                    <div 
                      key={i} 
                      className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div className="truncate">
                          <p className="font-medium text-gray-800 truncate">{s.name}</p>
                          <p className="text-xs text-gray-500">District: {s.district}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                          {s.avgScore}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
                  🌍 User Distribution by District
                </h3>
                {renderChart(stats.districtStats, 'count', 'Users', true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;