import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getChanceSheetReport } from "../api/kotService";

type ApiBill = {
  BillNo: string;
  Grand: number;
  Tax: number;
  Cash: number;
  Card: number;
};

type SalesReportProps = {
  onBack: () => void;
};

const SalesReport: React.FC<SalesReportProps> = ({ onBack }) => {
  const [bills, setBills] = useState<ApiBill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Date States
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // ✅ Get Outlet from localStorage
  const storedOutlet = localStorage.getItem("selectedOutlet");
  const selectedOutlet = storedOutlet ? JSON.parse(storedOutlet) : null;

  // ✅ Convert yyyy-mm-dd → MM/DD/YYYY for API
  const formatDate = (date: string) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // 🔹 Fetch API whenever date or outlet changes
  useEffect(() => {
    if (!selectedOutlet?.id) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getChanceSheetReport(
          formatDate(startDate),
          formatDate(endDate),
          selectedOutlet.id
        );
        setBills(data || []);
      } catch (err) {
        setError("Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [startDate, endDate, selectedOutlet?.id]);

  /* ================= CALCULATIONS ================= */
  const totalNetAmount = useMemo(
    () => bills.reduce((sum, b) => sum + (b.Grand || 0), 0),
    [bills]
  );

  const gstAmount = useMemo(
    () => bills.reduce((sum, b) => sum + (b.Tax || 0), 0),
    [bills]
  );

  const totalsByMethod = useMemo(() => {
    return {
      Cash: bills.reduce((sum, b) => sum + (b.Cash || 0), 0),
      Card: bills.reduce((sum, b) => sum + (b.Card || 0), 0),
      Online: bills
        .filter((b) => (b.Cash || 0) === 0 && (b.Card || 0) === 0)
        .reduce((sum, b) => sum + (b.Grand || 0), 0),
    };
  }, [bills]);

  const paymentCounts = useMemo(() => {
    return {
      Cash: bills.filter((b) => b.Cash > 0).length,
      Card: bills.filter((b) => b.Card > 0).length,
      Online: bills.filter(
        (b) => (b.Cash || 0) === 0 && (b.Card || 0) === 0
      ).length,
    };
  }, [bills]);

  const paymentData = [
    { label: "Cash", value: totalsByMethod.Cash, color: "bg-green-500" },
    { label: "Card", value: totalsByMethod.Card, color: "bg-blue-500" },
    { label: "Online", value: totalsByMethod.Online, color: "bg-purple-500" },
  ];

  const maxValue = Math.max(...paymentData.map((p) => p.value), 1);

  if (loading) return <div className="p-4">Loading report...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-3 md:p-4 space-y-4 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <button onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Sales Report</h1>
      </div>

      {/* GRAPH */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-sm font-semibold mb-3">Payment Methods</h2>
        <div className="flex items-end justify-evenly h-44">
          {paymentData.map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="text-xs font-bold mb-1">
                {paymentCounts[item.label as keyof typeof paymentCounts]}
              </span>
              <div
                className={`w-10 rounded ${item.color}`}
                style={{ height: `${(item.value / maxValue) * 120}px` }}
              />
              <span className="text-xs mt-1 text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SALES SUMMARY */}
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        <h2 className="text-sm font-semibold">Sales Summary</h2>

        {/* ✅ Date Pickers */}
        <div className="flex items-center gap-3 text-xs text-gray-700">
          <div>
            <label className="mr-1">From:</label>
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 text-xs"
            />
          </div>
          <div>
            <label className="mr-1">To:</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 text-xs"
            />
          </div>
        </div>

        {/* ✅ Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">BILL NO</th>
                <th className="border px-2 py-1 text-right">NET AMT</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b) => (
                <tr key={b.BillNo}>
                  <td className="border px-2 py-1">{b.BillNo}</td>
                  <td className="border px-2 py-1 text-right">
                    ₹ {b.Grand.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className="mt-4 border rounded-md p-3 text-xs">
          <div className="flex justify-between">
            <span>GST :</span>
            <span>₹ {gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>CASH :</span>
            <span>₹ {totalsByMethod.Cash.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>CARD :</span>
            <span>₹ {totalsByMethod.Card.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>ONLINE :</span>
            <span>₹ {totalsByMethod.Online.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t mt-2 pt-1">
            <span>TOTAL :</span>
            <span>₹ {totalNetAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
