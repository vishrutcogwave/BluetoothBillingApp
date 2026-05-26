// 

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getChanceSheetReport, getOutletsForUser } from "../api/kotService";
import { printerService } from "../services/printerService";
import PrinterSelector from "./PrinterSelector";

type ApiBill = {
  BillNo: string;
  Grand: number;
  Tax: number;
  Cash: number;
  Card: number;
  OltName: string;
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
const [summary, setSummary] = useState<any[]>([]);
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

        const data = await getChanceSheetReport(
          formatDate(startDate),
          formatDate(endDate),
        selectedOutletIds,
        );

      setBills(data?.ChanceSheet || []);
      setSummary(data?.Summary || []);
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
        const outlet = bill.OltName || "Unknown Outlet";

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

  const totalNetAmount = useMemo(
    () => bills.reduce((sum, b) => sum + (b.Grand || 0), 0),
    [bills],
  );

  const gstAmount = useMemo(
    () => bills.reduce((sum, b) => sum + (b.Tax || 0), 0),
    [bills],
  );

  const totalsByMethod = useMemo(() => {
    return {
      Cash: bills.reduce((sum, b) => sum + (b.Cash || 0), 0),

      Card: bills.reduce((sum, b) => sum + (b.Card || 0), 0),

      Online: bills
        .filter(
          (b) => (b.Cash || 0) === 0 && (b.Card || 0) === 0,
        )
        .reduce((sum, b) => sum + (b.Grand || 0), 0),
    };
  }, [bills]);

  const paymentCounts = useMemo(() => {
    return {
      Cash: bills.filter((b) => b.Cash > 0).length,

      Card: bills.filter((b) => b.Card > 0).length,

      Online: bills.filter(
        (b) => (b.Cash || 0) === 0 && (b.Card || 0) === 0,
      ).length,
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
        (o) => String(o.id) === selectedOutletIds
      )?.name ?? "",
        fromDate: startDate,
        toDate: endDate,
        bills: bills.map((b) => ({
          BillNo: b.BillNo,
          Grand: b.Grand,
        })),
        totals: {
          gst: gstAmount,
          cash: totalsByMethod.Cash,
          card: totalsByMethod.Card,
          online: totalsByMethod.Online,
          total: totalNetAmount,
        },
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
    <div className="flex flex-wrap items-center gap-3 text-lg text-gray-700">
  {/* FROM */}
  <div>
    <label className="mr-1">From:</label>

    <input
      type="date"
      value={startDate}
      max={endDate}
      onChange={(e) =>
        setStartDate(e.target.value)
      }
      className="border rounded px-2 py-1 text-lg"
    />
  </div>

  {/* TO */}
  <div>
    <label className="mr-1">To:</label>

    <input
      type="date"
      value={endDate}
      min={startDate}
      onChange={(e) =>
        setEndDate(e.target.value)
      }
      className="border rounded px-2 py-1 text-lg"
    />
  </div>

  {/* OUTLET */}
  <div>
    <label className="mr-1">Outlet:</label>

    <select
      value={selectedOutletIds}
      onChange={(e) =>
        setSelectedOutletIds(e.target.value)
      }
      className="border rounded px-2 py-1 text-lg"
    >
      {/* ALL */}
      <option
        value={outlets
          .map((o) => o.id)
          .join(",")}
      >
        All
      </option>

      {/* SINGLE OUTLETS */}
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
                      key={`${outlet}-${b.BillNo}`}
                    >
                      <td className="border px-2 py-1">
                        {b.BillNo}
                      </td>

                      <td className="border px-2 py-1 text-right">
                        ₹ {b.Grand.toFixed(2)}
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
                            sum + (b.Grand || 0),
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

  {summary.map((item, index) => (
    <div
      key={index}
      className="flex justify-between"
    >
      <span>
        {item.Particulars} :
      </span>

      <span>
        ₹ {Number(item.Amount).toFixed(2)}
      </span>
    </div>
  ))}

  <div className="flex justify-between font-bold border-t mt-2 pt-1 text-2xl">
    <span>TOTAL :</span>

    <span>
      ₹{" "}
      {summary
        .reduce(
          (sum, item) =>
            sum + Number(item.Amount || 0),
          0,
        )
        .toFixed(2)}
    </span>
  </div>
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