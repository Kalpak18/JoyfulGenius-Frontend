import React from "react";

const RefundPolicy = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white py-4 border-b flex justify-between items-center z-10">
        <h1 className="text-3xl font-bold">Refund & Cancellation Policy</h1>
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
          This cancellation policy outlines how you can cancel or seek a refund
          for a product or service that you have purchased through{" "}
          <strong>https://joyfulgenius.org/</strong> ("Platform") owned by{" "}
          <strong>Joyful Genius</strong>, having its registered address at{" "}
          <strong>Old Agra Road, Vasind, Maharashtra</strong>.
        </p>

        <h2 className="mt-6 font-bold text-lg">1. Order Cancellations</h2>
        <p className="mt-2">
          Cancellations will only be considered if the request is made within{" "}
          <strong>2 days</strong> of placing the order. However, a cancellation
          request may not be entertained if the order has already been
          communicated to the seller/merchant listed on the Platform and they
          have initiated the process of shipping or the product is out for
          delivery. In such an event, you may choose to reject the product at the
          doorstep.
        </p>

        <h2 className="mt-6 font-bold text-lg">2. Non-Cancellable Items</h2>
        <p className="mt-2">
          Joyful Genius does not accept cancellation requests for perishable
          items like flowers, eatables, etc. However, a refund or replacement can
          be made if the user establishes that the quality of the product
          delivered is not satisfactory.
        </p>

        <h2 className="mt-6 font-bold text-lg">3. Damaged or Defective Items</h2>
        <p className="mt-2">
          In case of receipt of damaged or defective items, please report to our
          customer service team within <strong>2 days</strong> of receiving the
          product. The request will be entertained once the seller/merchant
          listed on the Platform has checked and determined the same at its own
          end.
        </p>

        <h2 className="mt-6 font-bold text-lg">4. Product Mismatch or Expectations</h2>
        <p className="mt-2">
          If you feel that the product received is not as shown on the site or as
          per your expectations, you must notify our customer service within{" "}
          <strong>2 days</strong> of receiving the product. After reviewing your
          complaint, the customer service team will take an appropriate decision.
        </p>

        <h2 className="mt-6 font-bold text-lg">5. Manufacturer Warranty Products</h2>
        <p className="mt-2">
          For complaints regarding products that come with a manufacturer’s
          warranty, please refer the issue directly to the manufacturer.
        </p>

        <h2 className="mt-6 font-bold text-lg">6. Refund Processing Time</h2>
        <p className="mt-2">
          In case of any refunds approved by Joyful Genius, it will take{" "}
          <strong>5-7 business days</strong> for the refund to be processed to
          you.
        </p>

        <h2 className="mt-6 font-bold text-lg">7. Contact Information</h2>
        <p className="mt-2">
          For any queries regarding this Refund & Cancellation Policy, please use
          the contact details provided on our website{" "}
          <strong>https://joyfulgenius.org/</strong>.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
