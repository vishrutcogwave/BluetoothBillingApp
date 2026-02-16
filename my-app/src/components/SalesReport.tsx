import React from "react";
import { ArrowLeft } from "lucide-react";

/* ================= TYPES ================= */

type PaymentMethod = {
  label: "Cash" | "Card" | "Online";
  value: number;
  color: string;
};

type TransactionStatus = "Completed" | "Processing" | "Failed";

type Transaction = {
  invoice: string;
  name: string;
  email: string;
  status: TransactionStatus;
  method: "Cash" | "Card" | "Online";
  amount: number;
};

type SalesReportProps = {
  onBack: () => void;
};

/* ================= DATA ================= */

const paymentData: PaymentMethod[] = [
  { label: "Cash", value: 40, color: "bg-green-500" },
  { label: "Card", value: 80, color: "bg-blue-500" },
  { label: "Online", value: 60, color: "bg-purple-500" },
];

const transactions: Transaction[] = [
  {
    invoice: "TX-1001",
    name: "Alice",
    email: "alice@example.com",
    status: "Completed",
    method: "Card",
    amount: 250,
  },
  {
    invoice: "TX-1002",
    name: "Bob",
    email: "bob@example.com",
    status: "Completed",
    method: "Card",
    amount: 120,
  },
  {
    invoice: "TX-1003",
    name: "Charlie",
    email: "charlie@example.com",
    status: "Completed",
    method: "Cash",
    amount: 300,
  },
  {
    invoice: "TX-1004",
    name: "David",
    email: "david@example.com",
    status: "Processing",
    method: "Online",
    amount: 90,
  },
  {
    invoice: "TX-1005",
    name: "Eva",
    email: "eva@example.com",
    status: "Completed",
    method: "Online",
    amount: 150,
  },
];

/* ================= COMPONENT ================= */

const SalesReport: React.FC<SalesReportProps> = ({ onBack }) => {
  const maxValue = Math.max(...paymentData.map((p) => p.value));

  /* Count completed transactions per method */
  const completedCountByMethod: Record<
    PaymentMethod["label"],
    number
  > = { Cash: 0, Card: 0, Online: 0 };

  transactions.forEach((tx) => {
    if (tx.status === "Completed") {
      completedCountByMethod[tx.method]++;
    }
  });

  return (
    <div className="p-3 md:p-6 space-y-6">
      {/* HEADER */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="text-xl md:text-2xl font-bold">
          Sales Report
        </h1>
        <p className="text-xs md:text-sm text-gray-500">
          Completed transactions count by payment method
        </p>
      </div>

      {/* PAYMENT METHODS */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-base md:text-lg mb-4">
          Payment Methods
        </h2>

        <div className="flex items-end justify-around h-48 md:h-56">
          {paymentData.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-1"
            >
              {/* COUNT */}
              <span className="text-sm md:text-lg font-bold">
                {completedCountByMethod[item.label]}
              </span>

              {/* BAR */}
              <div
                className={`w-8 md:w-14 rounded-md ${item.color}`}
                style={{
                  height: `${(item.value / maxValue) * 150}px`,
                }}
              />

              <span className="text-xs md:text-sm text-gray-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MOBILE TRANSACTIONS ================= */}
      <div className="md:hidden space-y-3">
        <h2 className="font-semibold text-base">
          Recent Transactions
        </h2>

        {transactions.map((tx) => (
          <div
            key={tx.invoice}
            className="bg-white rounded-lg shadow p-3"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {tx.invoice}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  tx.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : tx.status === "Processing"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {tx.status}
              </span>
            </div>

            <p className="text-sm font-medium mt-1">
              {tx.name}
            </p>
            <p className="text-xs text-gray-500">
              {tx.email}
            </p>

            <p className="text-xs mt-1">
              Method:{" "}
              <span className="font-medium">
                {tx.method}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg mb-4">
          Recent Transactions
        </h2>

        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-2">Invoice</th>
              <th className="text-left py-2">Customer</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Method</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.invoice}
                className="border-b last:border-none"
              >
                <td className="py-3 font-medium">
                  {tx.invoice}
                </td>
                <td>
                  <div className="font-medium">
                    {tx.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {tx.email}
                  </div>
                </td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : tx.status === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td>{tx.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
