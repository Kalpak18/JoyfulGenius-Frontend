import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Delay showing by 5 seconds
      setTimeout(() => {
        setIsVisible(true);
      }, 5000);
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
    setIsVisible(false); // Only hide for this visit/session
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

// const InstallPrompt = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const handler = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setIsVisible(true);
//     };

//     window.addEventListener("beforeinstallprompt", handler);

//     return () => {
//       window.removeEventListener("beforeinstallprompt", handler);
//     };
//   }, []);

//   const handleInstall = async () => {
//     if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     await deferredPrompt.userChoice;
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
//       top: 0,
//       left: 0,
//       right: 0,
//       background: "#ffffff",
//       padding: "12px 16px",
//       borderBottom: "1px solid #eee",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       zIndex: 9999,
//       boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
//     }}>
//       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//         <img
//           src="/icons/icon-192.png"
//           alt="Joyful Genius"
//           style={{ width: "32px", height: "32px", borderRadius: "6px" }}
//         />
//         <span style={{ fontSize: "14px", color: "#111" }}>
//           Install Joyful Genius?
//         </span>
//       </div>
//       <div style={{ display: "flex", gap: "6px" }}>
//         <button
//           onClick={handleInstall}
//           style={{
//             background: "#4f46e5",
//             color: "white",
//             padding: "6px 10px",
//             borderRadius: "6px",
//             border: "none",
//             fontSize: "13px",
//             cursor: "pointer"
//           }}
//         >
//           Install
//         </button>
//         <button
//           onClick={handleDismiss}
//           style={{
//             background: "transparent",
//             border: "none",
//             fontSize: "16px",
//             cursor: "pointer",
//             color: "#666"
//           }}
//         >
//           ×
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InstallPrompt;

