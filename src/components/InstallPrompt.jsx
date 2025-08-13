import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background: "#ffffff",
      padding: "12px 16px",
      borderBottom: "1px solid #eee",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 9999,
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src="/icons/icon-192.png"
          alt="Joyful Genius"
          style={{ width: "32px", height: "32px", borderRadius: "6px" }}
        />
        <span style={{ fontSize: "14px", color: "#111" }}>
          Install Joyful Genius?
        </span>
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        <button
          onClick={handleInstall}
          style={{
            background: "#4f46e5",
            color: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            border: "none",
            fontSize: "13px",
            cursor: "pointer"
          }}
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            color: "#666"
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;



// import { useEffect, useState } from "react";

// const InstallPrompt= () => {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const handler = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setIsVisible(true);

//       // Auto-hide after 7 seconds
//       const timer = setTimeout(() => {
//         setIsVisible(false);
//       }, 7000);

//       return () => clearTimeout(timer);
//     };

//     window.addEventListener("beforeinstallprompt", handler);

//     return () => {
//       window.removeEventListener("beforeinstallprompt", handler);
//     };
//   }, []);

//   const handleInstall = async () => {
//     if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;
//     console.log("Install choice:", outcome);
//     setDeferredPrompt(null);
//     setIsVisible(false);
//   };

//   const handleDismiss = () => {
//     setIsVisible(false);
//   };

//   if (!isVisible) return null;

//   return (
//     <div style={{
//       position: "fixed",
//       bottom: 0,
//       left: 0,
//       right: 0,
//       background: "#ffffff",
//       padding: "16px",
//       borderTopLeftRadius: "16px",
//       borderTopRightRadius: "16px",
//       boxShadow: "0 -4px 12px rgba(0,0,0,0.15)",
//       display: "flex",
//       flexDirection: "column",
//       gap: "12px",
//       animation: "slideUp 0.3s ease-out",
//       zIndex: 9999
//     }}>
//       <div style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between"
//       }}>
//         <div style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "10px"
//         }}>
//           <img
//             src="/icons/icon-192.png"
//             alt="Joyful Genius"
//             style={{ width: "40px", height: "40px", borderRadius: "8px" }}
//           />
//           <div>
//             <strong style={{ fontSize: "16px", color: "#111" }}>
//               Install Joyful Genius
//             </strong>
//             <p style={{ fontSize: "13px", margin: 0, color: "#555" }}>
//               The smartest way to prepare for NMMS & competitive exams
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={handleDismiss}
//           style={{
//             background: "transparent",
//             border: "none",
//             fontSize: "20px",
//             color: "#888",
//             cursor: "pointer"
//           }}
//         >
//           ×
//         </button>
//       </div>

//       <button
//         onClick={handleInstall}
//         style={{
//           background: "#4f46e5",
//           color: "white",
//           padding: "10px",
//           borderRadius: "8px",
//           border: "none",
//           fontSize: "15px",
//           fontWeight: "bold",
//           cursor: "pointer",
//           boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
//         }}
//       >
//         Install App
//       </button>

//       <style>
//         {`
//           @keyframes slideUp {
//             from { transform: translateY(100%); opacity: 0; }
//             to { transform: translateY(0); opacity: 1; }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default InstallPrompt;
