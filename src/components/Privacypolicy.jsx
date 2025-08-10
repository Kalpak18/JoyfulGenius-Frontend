import React from "react";

const PrivacyPolicy = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white py-4 border-b flex justify-between items-center z-10">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print / Download
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="mt-6 border rounded-lg p-6 h-[70vh] overflow-y-auto leading-relaxed text-justify">
        <p>
          This Privacy Policy applies to the website{" "}
          <strong>https://joyfulgenius.org/</strong> ("Platform") owned and
          operated by <strong>Joyful Genius</strong>, having its registered
          address at <strong>Old Agra Road, Vasind, Maharashtra</strong>.
        </p>

        <h2 className="mt-6 font-bold text-lg">1. Information We Collect</h2>
        <p className="mt-2">
          We may collect the following types of personal and non-personal
          information when you use our Platform or Services:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Name, contact number, email address, and billing details</li>
          <li>Login credentials and account preferences</li>
          <li>Device and browser information</li>
          <li>Usage data such as pages visited and time spent</li>
        </ul>

        <h2 className="mt-6 font-bold text-lg">2. How We Use Your Information</h2>
        <p className="mt-2">
          The information collected is used for:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Providing and managing the Services</li>
          <li>Processing payments and transactions</li>
          <li>Sending important updates and notifications</li>
          <li>Improving website performance and user experience</li>
          <li>Compliance with legal requirements</li>
        </ul>

        <h2 className="mt-6 font-bold text-lg">3. Sharing Your Information</h2>
        <p className="mt-2">
          We do not sell or rent your personal information to third parties.
          However, we may share your information with:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Service providers assisting us in operations</li>
          <li>Payment gateway providers for transaction processing</li>
          <li>Legal authorities when required by law</li>
        </ul>

        <h2 className="mt-6 font-bold text-lg">4. Cookies & Tracking</h2>
        <p className="mt-2">
          Our Platform uses cookies to enhance user experience, analyze trends,
          and improve performance. You may choose to disable cookies in your
          browser settings, but certain features may not function properly.
        </p>

        <h2 className="mt-6 font-bold text-lg">5. Data Security</h2>
        <p className="mt-2">
          We implement reasonable technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction.
        </p>

        <h2 className="mt-6 font-bold text-lg">6. Your Rights</h2>
        <p className="mt-2">
          You have the right to access, update, and delete your personal
          information. You can also opt-out of marketing communications at any
          time by contacting us.
        </p>

        <h2 className="mt-6 font-bold text-lg">7. Changes to This Policy</h2>
        <p className="mt-2">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page, and continued use of our Services will imply
          acceptance of those changes.
        </p>

        <h2 className="mt-6 font-bold text-lg">8. Contact Us</h2>
        <p className="mt-2">
          For any questions regarding this Privacy Policy, please contact us via
          the details provided on <strong>https://joyfulgenius.org/</strong>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
