import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useDropzone } from 'react-dropzone';

const AdminUploadMaterial= () => {
  // Main state
  const [materialId, setMaterialId] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    courseName: '',
    subjectName: '',
    topicName: '',
    allowDownload: false,
    youtubeLinks: []
  });
  const [newYoutubeLink, setNewYoutubeLink] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);

  // Load all materials
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoadingMaterials(true);
      try {
        const res = await api.get('/materials');
        setMaterials(res.data.materials || []);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load materials' });
      } finally {
        setIsLoadingMaterials(false);
      }
    };
    fetchMaterials();
  }, []);

  // Handle file drops
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'video/*': ['.mp4']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: acceptedFiles => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  // Load material for editing
  const loadMaterialForEdit = async (id) => {
    try {
      const res = await api.get(`/materials/${id}`);
      const material = res.data.material;
      setMaterialId(id);
      setFormData({
        courseName: material.courseName,
        subjectName: material.subjectName,
        topicName: material.topicName,
        allowDownload: material.files.some(f => f.allowDownload),
        youtubeLinks: material.youtubeLinks || []
      });
      setFiles([]);
      setMessage({ type: '', text: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load material' });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      
      // Append files and form data
      files.forEach(file => formDataToSend.append('files', file));
      formDataToSend.append('courseName', formData.courseName);
      formDataToSend.append('subjectName', formData.subjectName);
      formDataToSend.append('topicName', formData.topicName);
      formDataToSend.append('allowDownload', formData.allowDownload);
      formData.youtubeLinks.forEach(link => formDataToSend.append('youtubeLinks', link));

      const endpoint = materialId 
        ? `/materials/upload?materialId=${materialId}`
        : '/materials/upload';

      const res = await api.post(endpoint, formDataToSend);

      // Update materials list
      setMaterials(prev => materialId
        ? prev.map(m => m._id === materialId ? res.data.material : m)
        : [res.data.material, ...prev]
      );

      setMessage({ type: 'success', text: materialId ? 'Material updated!' : 'Material created!' });
      
      // Reset form if new material
      if (!materialId) {
        setFormData({
          courseName: '',
          subjectName: '',
          topicName: '',
          allowDownload: false,
          youtubeLinks: []
        });
        setFiles([]);
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Operation failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a file
  const deleteFile = async (fileId) => {
    try {
      await api.delete(`/materials/${materialId}/file/${fileId}`);
      const res = await api.get(`/materials/${materialId}`);
      setFormData(prev => ({
        ...prev,
        youtubeLinks: res.data.material.youtubeLinks || []
      }));
      setMessage({ type: 'success', text: 'File deleted successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete file' });
    }
  };

  // Delete entire topic
  const deleteTopic = async (id) => {
    if (window.confirm('Are you sure you want to delete this material permanently?')) {
      try {
        await api.delete(`/materials/${id}`);
        setMaterials(prev => prev.filter(m => m._id !== id));
        if (materialId === id) {
          setMaterialId(null);
          setFormData({
            courseName: '',
            subjectName: '',
            topicName: '',
            allowDownload: false,
            youtubeLinks: []
          });
        }
        setMessage({ type: 'success', text: 'Material deleted successfully' });
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to delete material' });
      }
    }
  };

  // Add YouTube link
  const addYoutubeLink = () => {
    if (newYoutubeLink.trim() && !formData.youtubeLinks.includes(newYoutubeLink.trim())) {
      setFormData(prev => ({
        ...prev,
        youtubeLinks: [...prev.youtubeLinks, newYoutubeLink.trim()]
      }));
      setNewYoutubeLink('');
    }
  };

  // Remove YouTube link
  const removeYoutubeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {materialId ? 'Edit Study Material' : 'Upload New Material'}
      </h1>

      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Materials List Sidebar */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">All Materials</h2>
          {isLoadingMaterials ? (
            <div className="text-center py-4">Loading materials...</div>
          ) : materials.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No materials found</div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {materials.map(material => (
                <div 
                  key={material._id} 
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                    materialId === material._id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => loadMaterialForEdit(material._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{material.topicName}</h3>
                      <p className="text-sm text-gray-600">
                        {material.courseName} → {material.subjectName}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTopic(material._id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{material.files?.length || 0} files</span>
                    <span>{new Date(material.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Name*</label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject Name*</label>
                <input
                  type="text"
                  value={formData.subjectName}
                  onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Topic Name*</label>
                <input
                  type="text"
                  value={formData.topicName}
                  onChange={(e) => setFormData({...formData, topicName: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* Download Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowDownload"
                checked={formData.allowDownload}
                onChange={(e) => setFormData({...formData, allowDownload: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="allowDownload" className="text-sm">
                Allow file downloads for new uploads
              </label>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Files</label>
              <div 
                {...getRootProps()} 
                className="border-2 border-dashed rounded p-8 text-center cursor-pointer hover:bg-gray-50"
              >
                <input {...getInputProps()} />
                <p>Drag & drop files here, or click to select</p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports PDFs, images (JPEG/PNG), and videos (MP4) up to 50MB
                </p>
              </div>

              {/* Selected Files Preview */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium text-sm">Files to upload:</h3>
                  <ul className="space-y-1">
                    {files.map((file, index) => (
                      <li key={file.name + index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span className="truncate">
                          {file.name} ({Math.round(file.size / 1024)} KB)
                        </span>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFiles(files.filter((_, i) => i !== index));
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Existing Files (Edit Mode) */}
            {materialId && (
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Existing Files:</h3>
                {materials.find(m => m._id === materialId)?.files?.map(file => (
                  <div key={file._id} className="flex justify-between items-center p-2 border rounded text-sm">
                    <span className="truncate">{file.fileName}</span>
                    <button 
                      type="button"
                      onClick={() => deleteFile(file._id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* YouTube Links */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">YouTube Links</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newYoutubeLink}
                  onChange={(e) => setNewYoutubeLink(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 p-2 border rounded text-sm"
                />
                <button 
                  type="button"
                  onClick={addYoutubeLink}
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
                >
                  Add Link
                </button>
              </div>

              {/* Links List */}
              {formData.youtubeLinks.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {formData.youtubeLinks.map((link, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline truncate"
                      >
                        {link}
                      </a>
                      <button 
                        type="button"
                        onClick={() => removeYoutubeLink(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : materialId ? 'Update Material' : 'Upload Material'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUploadMaterial;