import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
      <p className="loader-text">Loading, please wait...</p>

      <style jsx>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4); /* Dim background */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease-in-out;
        }
        .loader-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e5e7eb; /* Light gray */
          border-top: 4px solid #2563eb; /* StudyMaterial primary color */
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .loader-text {
          color: white;
          font-size: 1rem;
          margin-top: 12px;
          font-weight: 500;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FullScreenLoader;
