import { useEffect, useState, useMemo } from "react";
import { Upload, Trash2, Eye, Search, Loader, ChevronDown, Check } from "lucide-react";
import AdminHeader from "../../components/Admin/AdminHeader";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import api from "../../utils/axios";

const AdminUploadMaterial = () => {
  // State management
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState({
    courses: false,
    subjects: false,
    chapters: false,
    materials: false,
    submitting: false
  });
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCourses, setTotalCourses] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Form state
  const [formData, setFormData] = useState({
    courseId: "",
    subjectId: "",
    chapterId: "",
    title: "",
    type: "pdf",
    youtubeLink: "",
    downloadable: false,
    file: null
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(prev => ({ ...prev, courses: true, materials: true }));
        setError(null);

        const [coursesRes, materialsRes] = await Promise.all([
          api.get("/courses"),
          api.get(`/materials?page=${page}&limit=${limit}`)
        ]);

        setCourses(safeExtract(coursesRes));
        setMaterials(safeExtract(materialsRes.data));
        setTotalCourses(materialsRes.data?.totalCourses || 0);
      } catch (err) {
        console.error("Initial data fetch error:", err);
        setError("Failed to load initial data");
      } finally {
        setLoading(prev => ({ ...prev, courses: false, materials: false }));
      }
    };

    fetchInitialData();
  }, [page, limit]);

  // Fetch subjects when course is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!formData.courseId) {
        setSubjects([]);
        return;
      }

      try {
        setLoading(prev => ({ ...prev, subjects: true }));
        setError(null);

        const res = await api.get(`/subjects?courseId=${formData.courseId}`);
        setSubjects(safeExtract(res));
      } catch (err) {
        console.error("Fetch subjects error:", err);
        setError("Failed to load subjects");
      } finally {
        setLoading(prev => ({ ...prev, subjects: false }));
      }
    };

    fetchSubjects();
  }, [formData.courseId]);

  // Fetch chapters when subject is selected
  useEffect(() => {
    const fetchChapters = async () => {
      if (!formData.courseId || !formData.subjectId) {
        setChapters([]);
        return;
      }

      try {
        setLoading(prev => ({ ...prev, chapters: true }));
        setError(null);

        const res = await api.get(`/chapters?courseId=${formData.courseId}&subjectId=${formData.subjectId}`);
        setChapters(safeExtract(res));
      } catch (err) {
        console.error("Fetch chapters error:", err);
        setError("Failed to load chapters");
      } finally {
        setLoading(prev => ({ ...prev, chapters: false }));
      }
    };

    fetchChapters();
  }, [formData.courseId, formData.subjectId]);

  // Helper function to safely extract arrays from API responses
  const safeExtract = (response, fallback = []) => {
    try {
      if (!response) return fallback;
      if (Array.isArray(response)) return response;
      if (response.data && Array.isArray(response.data)) return response.data;
      if (response.items && Array.isArray(response.items)) return response.items;
      return fallback;
    } catch (err) {
      console.error("Data extraction error:", err);
      return fallback;
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type based on selected material type
    if (formData.type === "pdf" && !file.type.includes("pdf")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a PDF file for PDF materials"
      });
      return;
    }

    if (formData.type === "video" && !file.type.includes("video")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a video file for video materials"
      });
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "File size must be less than 10MB"
      });
      return;
    }

    setFormData(prev => ({ ...prev, file }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.courseId || !formData.subjectId || !formData.chapterId) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please select course, subject, and chapter"
      });
      return;
    }

    if (!formData.title?.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Title",
        text: "Please enter a title for the material"
      });
      return;
    }

    if (formData.type !== "youtube" && !formData.file) {
      Swal.fire({
        icon: "error",
        title: "Missing File",
        text: "Please upload a file for non-YouTube materials"
      });
      return;
    }

    if (formData.type === "youtube" && !formData.youtubeLink?.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing YouTube Link",
        text: "Please enter a YouTube link for YouTube materials"
      });
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      setError(null);

      const formPayload = new FormData();
      formPayload.append("courseId", formData.courseId);
      formPayload.append("subjectId", formData.subjectId);
      formPayload.append("chapterId", formData.chapterId);
      formPayload.append("title", formData.title.trim());
      formPayload.append("type", formData.type);
      formPayload.append("downloadable", formData.downloadable);

      if (formData.type === "youtube") {
        formPayload.append("youtubeLink", formData.youtubeLink.trim());
      }

      if (formData.file) {
        formPayload.append("file", formData.file);
      }

      const response = await api.post("/materials", formPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Material uploaded successfully"
        });
        
        // Refresh materials list
        const materialsRes = await api.get(`/materials?page=${page}&limit=${limit}`);
        setMaterials(safeExtract(materialsRes.data));
        setTotalCourses(materialsRes.data?.totalCourses || 0);
        
        // Reset form (keep course selection)
        setFormData(prev => ({
          ...prev,
          subjectId: "",
          chapterId: "",
          title: "",
          type: "pdf",
          youtubeLink: "",
          downloadable: false,
          file: null
        }));
      } else {
        throw new Error(response.data?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Failed to upload material"
      });
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  // Handle material deletion
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(prev => ({ ...prev, materials: true }));
      await api.delete(`/materials/${id}`);
      
      // Refresh materials list
      const materialsRes = await api.get(`/materials?page=${page}&limit=${limit}`);
      setMaterials(safeExtract(materialsRes.data));
      setTotalCourses(materialsRes.data?.totalCourses || 0);
      
      Swal.fire("Deleted!", "The material has been deleted.", "success");
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire("Error!", "Failed to delete material.", "error");
    } finally {
      setLoading(prev => ({ ...prev, materials: false }));
    }
  };

  // Flatten materials for display and filtering
  const flattenedMaterials = useMemo(() => {
    if (!Array.isArray(materials)) return [];
    
    return materials.flatMap(course => 
      course.subjects?.flatMap(subject =>
        subject.chapters?.flatMap(chapter =>
          chapter.materials?.map(material => ({
            ...material,
            courseId: course.courseId,
            courseTitle: course.courseTitle,
            subjectId: subject.subjectId,
            subject: subject.subject,
            chapterId: chapter.chapterId,
            chapterTitle: chapter.chapterTitle
          })) || []
        ) || []
      ) || []
    );
  }, [materials]);

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    if (!Array.isArray(flattenedMaterials)) return [];
    
    return [...flattenedMaterials]
      .filter(m => 
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.chapterTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.youtubeLink || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [flattenedMaterials, searchQuery, sortOrder]);

  // Get course title by ID
  const getCourseTitle = (courseId) => {
    return courses.find(c => c._id === courseId)?.title || "Unknown Course";
  };

  // Get subject title by ID
  const getSubjectTitle = (subjectId) => {
    return subjects.find(s => s._id === subjectId)?.name || "Unknown Subject";
  };

  // Get chapter title by ID
  const getChapterTitle = (chapterId) => {
    return chapters.find(c => c._id === chapterId)?.title || "Unknown Chapter";
  };

  // Badge styling based on material type
  const typeBadgeColor = (type) => {
    switch (type) {
      case "pdf": return "bg-blue-100 text-blue-800";
      case "video": return "bg-green-100 text-green-800";
      case "youtube": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Upload Form Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Upload className="text-blue-600" size={24} />
            Upload New Study Material
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Course Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <div className="relative">
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                  disabled={loading.courses}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={20} />
              </div>
              {loading.courses && <p className="text-sm text-gray-500">Loading courses...</p>}
            </div>

            {/* Subject Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <div className="relative">
                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                  disabled={!formData.courseId || loading.subjects}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={20} />
              </div>
              {loading.subjects && <p className="text-sm text-gray-500">Loading subjects...</p>}
            </div>

            {/* Chapter Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Chapter</label>
              <div className="relative">
                <select
                  name="chapterId"
                  value={formData.chapterId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                  disabled={!formData.subjectId || loading.chapters}
                >
                  <option value="">Select a chapter</option>
                  {chapters.map(chapter => (
                    <option key={chapter._id} value={chapter._id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={20} />
              </div>
              {loading.chapters && <p className="text-sm text-gray-500">Loading chapters...</p>}
            </div>

            {/* Material Title */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Material Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter material title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Material Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Material Type</label>
              <div className="grid grid-cols-3 gap-3">
                {["pdf", "video", "youtube"].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                    className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      formData.type === type 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {formData.type === type && <Check size={16} />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload or YouTube Link (conditional) */}
            {formData.type !== "youtube" ? (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {formData.type === "pdf" ? "PDF File" : "Video File"}
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="mb-2 text-gray-500" size={24} />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.type === "pdf" 
                          ? "PDF (max. 10MB)" 
                          : "MP4, MOV (max. 10MB)"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept={formData.type === "pdf" ? "application/pdf" : "video/*"}
                    />
                  </label>
                </div>
                {formData.file && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-medium">Selected:</span>
                    <span>{formData.file.name}</span>
                    <span className="text-gray-500">
                      ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">YouTube Link</label>
                <input
                  type="url"
                  name="youtubeLink"
                  value={formData.youtubeLink}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Downloadable Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="downloadable"
                  id="downloadable"
                  checked={formData.downloadable}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label
                  htmlFor="downloadable"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    formData.downloadable ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                      formData.downloadable ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </label>
              </div>
              <label htmlFor="downloadable" className="text-sm font-medium text-gray-700">
                Allow Download
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading.submitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading.submitting ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Material
                </>
              )}
            </button>
          </form>
        </div>

        {/* Materials List Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Search className="text-blue-600" size={24} />
              Browse Materials
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading.materials && (
            <div className="flex justify-center items-center py-10">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
          )}

          {/* Materials Grid */}
          {!loading.materials && (
            <>
              {filteredMaterials.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMaterials.map((material) => (
                    <div key={material._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-5">
                        {/* Material Type Badge */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeBadgeColor(material.type)}`}>
                            {material.type.toUpperCase()}
                          </span>
                          {material.downloadable && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                              DOWNLOADABLE
                            </span>
                          )}
                        </div>
                        
                        {/* Material Title */}
                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                          {material.title}
                        </h3>
                        
                        {/* Course/Subject/Chapter Info */}
                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                          <p className="flex items-center gap-1">
                            <span className="font-medium">Course:</span>
                            <span>{getCourseTitle(material.courseId)}</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <span className="font-medium">Subject:</span>
                            <span>{getSubjectTitle(material.subjectId)}</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <span className="font-medium">Chapter:</span>
                            <span>{getChapterTitle(material.chapterId)}</span>
                          </p>
                        </div>
                        
                        {/* Upload Date */}
                        <p className="text-xs text-gray-500 mb-4">
                          Uploaded: {dayjs(material.createdAt).format("MMM D, YYYY [at] h:mm A")}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {material.type !== "youtube" ? (
                            <>
                              <a
                                href={`${api.defaults.baseURL}/materials/${material._id}/stream`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-1"
                              >
                                <Eye size={14} />
                                View
                              </a>
                              {material.downloadable && (
                                <a
                                  href={`${api.defaults.baseURL}/materials/${material._id}/download`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                                >
                                  Download
                                </a>
                              )}
                            </>
                          ) : (
                            <a
                              href={material.youtubeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
                            >
                              <Eye size={14} />
                              Watch on YouTube
                            </a>
                          )}
                          
                          <button
                            onClick={() => handleDelete(material._id)}
                            className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    {searchQuery ? "No matching materials found" : "No materials available"}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalCourses > 0 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalCourses)} of {totalCourses} materials
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * limit >= totalCourses}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUploadMaterial;