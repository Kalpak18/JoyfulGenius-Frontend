import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { GraduationCap } from "lucide-react";
import api from "../utils/axios";
import useAuth from "../hooks/useAuth";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loading: authLoading, isUser } = useAuth();

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = async (course) => {
    if (!isUser || !user) {
      // Redirect to login/enroll if no student logged in
      navigate("/enroll");
      return;
    }

    try {
      // Track visit for the logged-in student
      await api.post(`/users/track-course/${user._id}/${course._id}`);
      
      // Refresh user info to get updated paid status
      const res = await api.get("/users/current");
      const updatedUser = res.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      const paid = updatedUser.paidCourses?.some(
        (pc) => pc.courseId === course._id
      );

      // Navigate based on course type and paid status
      if (course.name === "NMMS") {
        navigate(paid ? "/NMMS/NMMS" : "/NMMS/course-selection");
      } else {
        navigate(
          paid
            ? `/course/${course.name}/subjects`
            : `/course/${course.name}/payment`
        );
      }
    } catch (err) {
      console.error("Failed to track visit or refresh user:", err);
    }
  };

  if (authLoading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center justify-center gap-3 mb-6">
          <GraduationCap size={36} className="text-amber-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 tracking-wide">
            All Available Courses
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-amber-700 font-semibold">
            Loading courses...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course)}
                className="cursor-pointer bg-white p-4 shadow-md text-center rounded-xl hover:shadow-lg transition"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
                  {course.name}
                </h3>
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md text-gray-400 font-semibold">
                  {course.name}
                </div>
                {course.description && (
                  <p className="text-gray-600 mt-2 text-sm">
                    {course.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="hidden md:block bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025 Exam Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Courses;



// import { useEffect, useState } from "react";
// import Header from "../components/Header";
// import { useNavigate } from "react-router-dom";
// import { GraduationCap } from "lucide-react";
// import api from "../utils/axios";

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/courses"); // fetch all courses
//         setCourses(res.data.data); // backend returns { data: [...] }
//       } catch (err) {
//         console.error("Failed to fetch courses:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleCourseClick = (course) => {
//   const user = JSON.parse(localStorage.getItem("user")); // logged-in user
//   const paid = user?.paidCourses?.some(pc => pc.courseId === course._id);

//   if (course.name === "NMMS") {
//     if (paid) {
//       navigate("/NMMS/subjects"); // fixed route
//     } else {
//       navigate("/NMMS/course-selection");  // fixed route
//     }
//   } else {
//     // fallback for other courses
//     if (paid) {
//       navigate(`/course/${course.name}/subjects`);
//     } else {
//       navigate(`/course/${course.name}/payment`);
//     }
//   }
// };



//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
//       <Header />

//       <main className="flex-grow container mx-auto px-4 pt-6 pb-24">
//         <div className="flex items-center justify-center gap-3 mb-6">
//           <GraduationCap size={36} className="text-amber-600" />
//           <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 tracking-wide">
//             All Available Courses
//           </h2>
//         </div>

//         {loading ? (
//           <p className="text-center text-amber-700 font-semibold">Loading courses...</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {courses.map((course) => (
//               <div
//                 key={course._id}
//                 onClick={() => handleCourseClick(course)}
//                 className="cursor-pointer bg-white p-4 shadow-md text-center rounded-xl hover:shadow-lg transition"
//               >
//                 <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
//                   {course.name}
//                 </h3>
//                 <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md text-gray-400 font-semibold">
//                   {course.name}
//                 </div>
//                 {course.description && (
//                   <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       <footer className="hidden md:block bg-gray-800 text-white text-center py-4">
//         <p>&copy; 2025 Exam Prep. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Courses;
