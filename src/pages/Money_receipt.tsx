import { useLocation, Link } from "react-router-dom";
import img from "../assets/images/uniflex_logo_con (1).png";
type InfoProps = {
  label: string;
  value: string | number;
};

// ✅ Separate Component
function Info({ label, value }: InfoProps) {
  return (
    <div className="grid grid-cols-[110px_10px_1fr] text-[11px] font-semibold">
      <span>{label}</span>
      <span>:</span>
      <span>{value}</span>
    </div>
  );
}

function MoneyReceipt() {
  const { state } = useLocation();

  // ✅ Fallback Data
  const data = state || {
    customerId: "CUS-1001",
    customerName: "Sabbir Ahmed",
    mobile: "01700000000",
    plotDescription: "P-38 K-5A R-7/A",
    startDate: "15 Sep 2025",
    receivedAmount: 100000,
    amountInWord: "One Hundred Thousand Taka Only",
    receiptNo: "781",
    receiptDate: "15 Sep 2025",
    type: "Booking Money",
    totalPaid: 100000,
    nextDate: "15 Sep 2025",
  };

  return (
    <div className="w-full min-h-screen flex justify-center py-4">
      {/* Mobile App Size */}
      <div className="w-107 min-h-screen p-3">
        {/* Receipt */}
        <div className="border border-black bg-white p-3 text-black">
          {/* Company */}
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-full border flex items-center justify-center text-[10px]">
              <img src={img} alt="" />
            </div>

            <h2 className="font-bold text-[13px] mt-1">UNIFLEX LIMITED</h2>

            <p className="text-[10px] font-semibold leading-4">
              Fareast Tower, 35 Topkhana Road, Dhaka - 1000.
            </p>

            <p className="text-[10px] font-semibold leading-4">
              Website: www.uniflexlimited.com
            </p>
          </div>

          {/* Receipt Header */}
          <div className="flex justify-between mt-3">
            <div className="border border-black px-2 py-0.5 text-[10px] font-bold">
              MONEY RECEIPT
            </div>

            <div className="border border-black px-2 py-0.5 text-[10px] font-bold">
              CUSTOMER COPY
            </div>
          </div>

          {/* Information */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            {/* Left Side */}
            <div className="space-y-0.5">
              <Info label="Employee UID" value={data.customerId} />

              <Info label="Customer Name" value={data.customerName} />

              <Info label="Mobile Number" value={data.mobile} />

              <Info label="Plot Description" value={data.plotDescription} />

              <Info label="Start Date" value={data.startDate} />

              <Info
                label="Received Amount"
                value={data.receivedAmount?.toLocaleString()}
              />

              <Info label="In Word" value={data.amountInWord} />
            </div>

            {/* Right Side */}
            <div className="space-y-0.5 pt-5">
              <Info label="Receipt No." value={data.receiptNo} />

              <Info label="Receipt Date" value={data.receiptDate} />

              <Info label="Type" value={data.type} />
            </div>
          </div>

          {/* Table */}
          <div className="grid grid-cols-4 border border-black mt-4 text-[10px] font-semibold">
            <div className="border-r border-black px-1">SL</div>

            <div className="border-r border-black px-1">Total Tk Paid</div>

            <div className="border-r border-black px-1">
              {data.totalPaid?.toLocaleString()}
            </div>

            <div className="px-1">{data.nextDate}</div>
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-10 text-[11px] font-bold">
            <p>Cashier</p>

            <p className="text-gray-300 border rounded-full px-2 py-1">Seal</p>

            <p>Authorised</p>
          </div>
        </div>

        {/* Back Button */}
        <Link to="/profilecustomer">
          <button className="w-full bg-[#07277F] text-white py-3 rounded-lg font-semibold mt-5">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}

export default MoneyReceipt;
