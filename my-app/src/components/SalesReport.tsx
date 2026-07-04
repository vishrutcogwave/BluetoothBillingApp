// 

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getChanceSheetReport, getOutletsForUser } from "../api/kotService";
import { printerService } from "../services/printerService";
import PrinterSelector from "./PrinterSelector";

type ApiBill = {
  billNo: string;
  date: string;
  billTime: string;
  itemSale: number;
  tax: number;
  cgst: number;
  sgst: number;
  dis: number;
  total: number;
  grand: number;
  roundOff: number;
  cash: number;
  card: number;
  cheque: number;
  upi: number;
  online: number;
  credit: number;
  roomNo: number;
  kbsRefName: string;
  oltName: string;
  branchCode: string;
};

type SalesReportProps = {
  onBack: () => void;
};

const SalesReport: React.FC<SalesReportProps> = ({ onBack }) => {
  const [bills, setBills] = useState<ApiBill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [printing, setPrinting] = useState(false);
const [summary, setSummary] = useState<any>({});
const [remarksSummary, setRemarksSummary] = useState<any[]>([]);
  // ✅ Date States
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
useEffect(() => {
  const fetchOutlets = async () => {
    try {
      const username =
        localStorage.getItem("username") || "";

      // ✅ API CALL
      const data = await getOutletsForUser(username);

      console.log("Outlets 👉", data);

      const mapped = data.map((out: any) => ({
        id: out.OltCode,
        name: out.OltName,
      }));

      setOutlets(mapped);

      // ✅ DEFAULT ALL
      const allIds = mapped
        .map((o: any) => o.id)
        .join(",");

      setSelectedOutletIds(allIds);
    } catch (err) {
      console.error("Outlet fetch failed", err);
    }
  };

  fetchOutlets();
}, []);

  const [outlets, setOutlets] = useState<any[]>([]);
const [selectedOutletIds, setSelectedOutletIds] =
  useState<string>("");
  // ✅ Get Outlet from localStorage
 

  // ✅ Convert yyyy-mm-dd → MM/DD/YYYY
  const formatDate = (date: string) => {
    const d = new Date(date);

    const month = String(d.getMonth() + 1).padStart(2, "0");

    const day = String(d.getDate()).padStart(2, "0");

    const year = d.getFullYear();

    return `${month}/${day}/${year}`;
  };

  // ✅ Fetch Report
  useEffect(() => {
  if (!selectedOutletIds) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
const branchcode = localStorage.getItem("branch_code") || ""
        const data = await getChanceSheetReport(
          formatDate(startDate),
          formatDate(endDate),
        selectedOutletIds,
        branchcode
        );

setBills(data?.data || []);
setSummary(data?.summary || {});
setRemarksSummary(data?.remarksSummary || []);
      } catch (err) {
        setError("Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
}, [startDate, endDate, selectedOutletIds]);

  // ✅ Group bills by outlet
  const groupedBills = useMemo(() => {
    return bills.reduce(
      (acc, bill) => {
       const outlet = bill.oltName || "Unknown Outlet";

        if (!acc[outlet]) {
          acc[outlet] = [];
        }

        acc[outlet].push(bill);

        return acc;
      },
      {} as Record<string, ApiBill[]>,
    );
  }, [bills]);

  /* ================= CALCULATIONS ================= */


  const totalsByMethod = useMemo(() => {
    return {
    Cash: bills.reduce((sum, b) => sum + (b.cash || 0), 0),

Card: bills.reduce((sum, b) => sum + (b.card || 0), 0),

Online: bills.reduce((sum, b) => sum + (b.online || 0), 0),
    };
  }, [bills]);

  const paymentCounts = useMemo(() => {
    return {
    Cash: bills.filter((b) => b.cash > 0).length,

Card: bills.filter((b) => b.card > 0).length,

Online: bills.filter((b) => b.online > 0).length,
    };
  }, [bills]);

  const paymentData = [
    {
      label: "Cash",
      value: totalsByMethod.Cash,
      color: "bg-green-500",
    },
    {
      label: "Card",
      value: totalsByMethod.Card,
      color: "bg-blue-500",
    },
    {
      label: "Online",
      value: totalsByMethod.Online,
      color: "bg-purple-500",
    },
  ];

  const maxValue = Math.max(
    ...paymentData.map((p) => p.value),
    1,
  );

  const handlePrint = async () => {
    try {
      setPrinting(true);

    await printerService.printSalesReport({
  outletName:
    selectedOutletIds ===
    outlets.map((o) => o.id).join(",")
      ? "All Outlets"
      : outlets.find(
          (o) =>
            String(o.id) ===
            selectedOutletIds,
        )?.name ?? "",

  fromDate: startDate,

  toDate: endDate,

bills: bills.map((b) => ({
  BillNo: b.billNo,
  Grand: b.grand,
})),
summary: remarksSummary.map((s) => ({
  Particulars: s.particulars,
  Amount: s.amount,
})),

  total: bills.reduce(
    (sum, item) =>
      sum + Number(item.grand  || 0),
    0,
  ),
});
    } catch (err) {
      console.error(err);
      alert("❌ Error printing report");
    } finally {
      setPrinting(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading report...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">{error}</div>
    );
  }

 return (
  <div className="p-3 md:p-4 space-y-4 bg-gray-100 min-h-screen">
    {/* HEADER */}
    <div className="flex items-center gap-2">
      <button onClick={onBack}>
        <ArrowLeft size={20} />
      </button>

      <h1 className="text-3xl font-bold">
        Sales Report
      </h1>
    </div>

    {/* GRAPH */}
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-semibold mb-3">
      </h2>

      <div className="flex items-end justify-evenly h-44">
        {paymentData.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center"
          >
            <span className="text-lg font-bold mb-1">
              {
                paymentCounts[
                  item.label as keyof typeof paymentCounts
                ]
              }
            </span>

            <div
              className={`w-10 rounded ${item.color}`}
              style={{
                height: `${
                  (item.value / maxValue) * 120
                }px`,
              }}
            />

            <span className="text-lg mt-1 text-gray-600">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* SALES SUMMARY */}
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="text-2xl font-semibold">
        Sales Summary
      </h2>

      {/* DATE PICKERS */}
  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 text-lg text-gray-700">
  {/* FROM */}
  <div className="flex items-center gap-2 w-full sm:w-auto">
    <label className="min-w-[55px]">
      From:
    </label>

    <input
      type="date"
      value={startDate}
      max={endDate}
      onChange={(e) =>
        setStartDate(e.target.value)
      }
      className="border rounded px-2 py-1 text-lg w-full sm:w-auto"
    />
  </div>

  {/* TO */}
  <div className="flex items-center gap-2 w-full sm:w-auto">
    <label className="min-w-[55px]">
      To:
    </label>

    <input
      type="date"
      value={endDate}
      min={startDate}
      onChange={(e) =>
        setEndDate(e.target.value)
      }
      className="border rounded px-2 py-1 text-lg w-full sm:w-auto"
    />
  </div>

  {/* OUTLET */}
  <div className="flex items-center gap-2 w-full sm:w-auto">
    <label className="min-w-[55px]">
      Outlet:
    </label>

    <select
      value={selectedOutletIds}
      onChange={(e) =>
        setSelectedOutletIds(e.target.value)
      }
      className="border rounded px-2 py-1 text-lg w-full sm:w-auto"
    >
      <option
        value={outlets
          .map((o) => o.id)
          .join(",")}
      >
        All
      </option>

      {outlets.map((outlet) => (
        <option
          key={outlet.id}
          value={outlet.id}
        >
          {outlet.name}
        </option>
      ))}
    </select>
  </div>
</div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-lg border border-gray-300">
          <tbody>
            {Object.entries(groupedBills).map(
              ([outlet, outletBills]) => (
                <React.Fragment key={outlet}>
                  {/* Outlet Header */}
                  <tr className="bg-gray-200">
                    <td
                      colSpan={2}
                      className="border px-2 py-2 font-bold text-center text-xl"
                    >
                      {outlet}
                    </td>
                  </tr>

                  {/* Table Header */}
                  <tr className="bg-gray-100 font-semibold text-lg">
                    <td className="border px-2 py-1">
                      BILL NO
                    </td>

                    <td className="border px-2 py-1 text-right">
                      NET AMT
                    </td>
                  </tr>

                  {/* Bills */}
                  {outletBills.map((b) => (
                    <tr
                   key={`${outlet}-${b.billNo}`}
                    >
                      <td className="border px-2 py-1">
                    {b.billNo}
                      </td>

                      <td className="border px-2 py-1 text-right">
                        ₹ {Number(b.grand).toFixed(2)}
                      </td>
                    </tr>
                  ))}

                  {/* Outlet Total */}
                  <tr className="bg-gray-50 font-bold">
                    <td className="border px-2 py-1 text-right">
                      TOTAL
                    </td>

                    <td className="border px-2 py-1 text-right">
                      ₹{" "}
                      {outletBills
                        .reduce(
                          (sum, b) =>
                            sum + (b.grand  || 0),
                          0,
                        )
                        .toFixed(2)}
                    </td>
                  </tr>
                </React.Fragment>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
    {/* SUMMARY */}
<div className="mt-4 border rounded-md p-3 text-lg">
  <div className="font-bold text-2xl mb-3">
    SUMMARY
  </div>

  <div className="flex justify-between">
    <span>Tax</span>
    <span>₹ {Number(summary.tax || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>CGST</span>
    <span>₹ {Number(summary.cgst || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>SGST</span>
    <span>₹ {Number(summary.sgst || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>Discount</span>
    <span>₹ {Number(summary.discount || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>Cash</span>
    <span>₹ {Number(summary.cash || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>Card</span>
    <span>₹ {Number(summary.card || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>UPI</span>
    <span>₹ {Number(summary.upi || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>Online</span>
    <span>₹ {Number(summary.online || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>Cheque</span>
    <span>₹ {Number(summary.cheque || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>Credit</span>
    <span>₹ {Number(summary.credit || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between">
    <span>Round Off</span>
    <span>₹ {Number(summary.roundOff || 0).toFixed(2)}</span>
  </div>

  <div className="flex justify-between font-bold border-t mt-2 pt-2 text-xl">
    <span>Grand Total</span>
    <span>₹ {Number(summary.grand || 0).toFixed(2)}</span>
  </div>
</div>

{/* Remarks Summary */}

<div className="mt-4 border rounded-md p-3 text-lg">
  <div className="font-bold text-2xl mb-3">
    REMARKS SUMMARY
  </div>

  {remarksSummary.map((item, index) => (
    <div
      key={index}
      className="flex justify-between"
    >
      <span>{item.particulars}</span>

      <span>
        ₹ {Number(item.amount).toFixed(2)}
      </span>
    </div>
  ))}
</div>
    </div>

    {/* PRINT */}
    <div className="mt-4 space-y-3">
      {!printerConnected ? (
        <PrinterSelector
          onConnected={() =>
            setPrinterConnected(true)
          }
        />
      ) : (
        <button
          disabled={printing}
          onClick={handlePrint}
          className="w-full bg-blue-600 text-white py-3 rounded text-xl"
        >
          {printing
            ? "Printing..."
            : "Print Report 🖨️"}
        </button>
      )}
    </div>
  </div>
);
};

export default SalesReport;