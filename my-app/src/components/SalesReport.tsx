
import React from "react";
import { ArrowLeft } from "lucide-react";

/* ================= TYPES ================= */

type PaymentMethod = "Cash" | "Card" | "Online";
type TransactionStatus = "Completed" | "Processing" | "Failed";

type Transaction = {
  invoice: string;
  status: TransactionStatus;
  method: PaymentMethod;
  amount: number;
};

type SalesReportProps = {
  onBack: () => void;
};

/* ================= DATA ================= */

const paymentData = [
  { label: "Cash", value: 40, color: "bg-green-500" },
  { label: "Card", value: 80, color: "bg-blue-500" },
  { label: "Online", value: 60, color: "bg-purple-500" },
];

const transactions: Transaction[] = [
  { invoice: "2526/16421", status: "Completed", method: "Cash", amount: 100 },
  { invoice: "2526/16422", status: "Completed", method: "Card", amount: 1135 },
  { invoice: "2526/16423", status: "Completed", method: "Online", amount: 236 },
  { invoice: "2526/16424", status: "Completed", method: "Online", amount: 803 },
  { invoice: "2526/16425", status: "Completed", method: "Card", amount: 278 },
];

/* ================= COMPONENT ================= */

const SalesReport: React.FC<SalesReportProps> = ({ onBack }) => {
  const completedTx = transactions.filter(
    (t) => t.status === "Completed"
  );

  const gstAmount = completedTx.reduce(
    (sum, t) => sum + t.amount * 0.05,
    0
  );

  const totalNetAmount = completedTx.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const totalsByMethod = {
    Cash: completedTx.filter(t => t.method === "Cash")
      .reduce((s, t) => s + t.amount, 0),
    Card: completedTx.filter(t => t.method === "Card")
      .reduce((s, t) => s + t.amount, 0),
    Online: completedTx.filter(t => t.method === "Online")
      .reduce((s, t) => s + t.amount, 0),
  };

  const maxValue = Math.max(...paymentData.map(p => p.value));

  return (
    <div className="p-3 md:p-4 space-y-4 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">
          Sales Report
        </h1>
      </div>

      {/* ================= GRAPH ================= */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-sm font-semibold mb-3">
          Payment Methods
        </h2>

        <div className="flex items-end justify-evenly h-44">
          {paymentData.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center"
            >
              <span className="text-xs font-bold mb-1">
                {
                  completedTx.filter(
                    (t) => t.method === item.label
                  ).length
                }
              </span>

              <div
                className={`w-10 rounded ${item.color}`}
                style={{
                  height: `${(item.value / maxValue) * 120}px`,
                }}
              />

              <span className="text-xs mt-1 text-gray-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SALES TABLE ================= */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-sm font-semibold mb-2">
          Sales Summary
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">
                  BILL NO
                </th>
                <th className="border px-2 py-1 text-right">
                  NET AMT
                </th>
              </tr>
            </thead>
            <tbody>
              {completedTx.map((tx) => (
                <tr key={tx.invoice}>
                  <td className="border px-2 py-1">
                    {tx.invoice}
                  </td>
                  <td className="border px-2 py-1 text-right">
                    ₹ {tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
      {/* TOTALS CARD */}
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
