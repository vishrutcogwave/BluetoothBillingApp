import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getItemSalesReport } from "../api/kotService";
import { printerService } from "../services/printerService";
import PrinterSelector from "./PrinterSelector";

type SalesReportProps = {
  onBack: () => void;
};

const ItemSalesReport: React.FC<SalesReportProps> = ({ onBack }) => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [printing, setPrinting] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const storedOutlet = localStorage.getItem("selectedOutlet");
  const selectedOutlet = storedOutlet ? JSON.parse(storedOutlet) : null;

  const formatDate = (date: string) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getItemSalesReport(
          formatDate(startDate),
          formatDate(endDate)
        );
        setSales(data || []);
      } catch (err) {
        setError("Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [startDate, endDate]);

  /* ================= PRINT ================= */
  const handlePrint = async () => {
    try {
      setPrinting(true);

      await printerService.printItemSalesReport({
        outletName: selectedOutlet?.name ?? "",
        fromDate: startDate,
        toDate: endDate,
        items: sales,
      });

    } catch (err) {
      console.error(err);
      alert("❌ Error printing report");
    } finally {
      setPrinting(false);
    }
  };

  if (loading) return <div className="p-4">Loading report...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

return (
  <div className="p-3 md:p-4 space-y-4 bg-gray-100 min-h-screen">
    
    {/* HEADER */}
    <div className="flex items-center gap-2">
      <button onClick={onBack}>
        <ArrowLeft size={20} />
      </button>

      <h1 className="text-3xl font-bold">
        Item Sales Report
      </h1>
    </div>

    {/* DATE FILTER */}
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-3 text-lg text-gray-700">
        <div>
          <label className="mr-1">From:</label>

          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1 text-lg"
          />
        </div>

        <div>
          <label className="mr-1">To:</label>

          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1 text-lg"
          />
        </div>
      </div>
    </div>

    {/* TABLE */}
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-semibold mb-3">
        Items
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-lg border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2 text-left">
                ITEM
              </th>

              <th className="border px-2 py-2 text-right">
                RATE
              </th>

              <th className="border px-2 py-2 text-right">
                QTY
              </th>

              <th className="border px-2 py-2 text-right">
                TOTAL
              </th>
            </tr>
          </thead>

          <tbody>
            {sales.length > 0 ? (
              sales.map((item, i) => (
                <tr key={i}>
                  <td className="border px-2 py-2">
                    {item.ItemName.replace("\n", " ")}
                  </td>

                  <td className="border px-2 py-2 text-right">
                    {item.Rate.toFixed(2)}
                  </td>

                  <td className="border px-2 py-2 text-right">
                    {item.Qty}
                  </td>

                  <td className="border px-2 py-2 text-right">
                    {item.Total.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-3 text-gray-500 text-lg"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* TOTAL */}
      <div className="mt-4 border rounded-md p-3 text-2xl font-bold flex justify-between">
        <span>TOTAL :</span>

        <span>
          ₹{" "}
          {sales
            .reduce((sum, i) => sum + (i.Total || 0), 0)
            .toFixed(2)}
        </span>
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

export default ItemSalesReport;