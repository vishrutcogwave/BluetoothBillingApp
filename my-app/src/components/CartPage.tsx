import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FALLBACK_IMAGE } from "../utils";
import { printerService } from "../services/printerService";
import PrinterSelector from "../components/PrinterSelector";
import { useOutlet } from "../context/OutletContext";

import {
  checkPaymentStatus,
  getBill,
  getbillnouseorderid,
  getCardTypes,
  getonlineTypes,
  sendPaymentRequest,
  submitBill,
} from "../api/kotService";
import { useCompany } from "../context/CompanyContext";
import SalesReport from "./SalesReport";
import { QRCodeCanvas } from "qrcode.react";

/* =========================
   TAX CALCULATION
   ========================= */

const CartPage = () => {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();
  console.log("cartItems", items);
  const { selectedOutlet } = useOutlet();
  console.log(selectedOutlet, "selectedOutlet");

  const mainBlue = "#0576B2";
  const hoverBlue = "#0461A8";

  const [printerConnected, setPrinterConnected] = useState(false);
  const [activePage, setActivePage] = useState<string>("home");
  const [loading, setLoading] = useState(false);
  const { companyInfo } = useCompany();
  const [paymentMode, setPaymentMode] = useState<"CASH" | "CARD" | "ONLINE">(
    "CASH",
  );

  const [onlineTypes, setOnlineTypes] = useState<any[]>([]);
  const [selectedOnline, setSelectedOnline] = useState<any>(null);
  const [billData, setBillData] = useState<any>(null);
const [paymentData, setPaymentData] = useState<any>(null);

const [paymentChecking, setPaymentChecking] =
  useState(false);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        if (items.length === 0) return;

        const payload = createBillPayload();
        const res = await getBill(payload);

        console.log("Bill 👉", res);
        setBillData(res); // ✅ store response
      } catch (error) {
        console.error("Error fetching bill:", error);
      }
    };

    fetchBill();
  }, [items]);

  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const cardRes = await getCardTypes();
        const onlineRes = await getonlineTypes();

        console.log("Cards 👉", cardRes);
        console.log("Online 👉", onlineRes);

        setOnlineTypes(
          Array.isArray(onlineRes) ? onlineRes : onlineRes?.data || [],
        );
      } catch (error) {
        console.error("Error fetching payment types:", error);
      }
    };

    fetchPaymentTypes();
  }, []);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
  };
  const generateTransactionId = () => {
    const timestamp = Date.now(); // current time
    const random = Math.floor(Math.random() * 100000); // 5 digit random
    return `TXN-${timestamp}-${random}`;
  };
 const fetchPaymentQR = async () => {
  try {
    const transactionId = generateTransactionId();

    const amount = Math.round(
      (billData?.GrandTotal ?? total) * 100
    );

    const res = await sendPaymentRequest(
      amount,
      transactionId
    );

    console.log("Payment QR 👉", res);

    if (res?.success) {
      setPaymentData({
        ...res.data,
        localTransactionId: transactionId,
      });

      startPaymentStatusPolling(transactionId);
    }
  } catch (err) {
    console.error("QR Payment Error:", err);
  }
};
const startPaymentStatusPolling = (
  transactionId: string
) => {
  if (paymentChecking) return;

  setPaymentChecking(true);

  const interval = setInterval(async () => {
    try {
      const res =
        await checkPaymentStatus(transactionId);

      console.log("Payment Status 👉", res);

      if (
        res?.success === true &&
        (
      
          res?.code === "SUCCESS"
        )
      ) {
        clearInterval(interval);

        setPaymentChecking(false);

        alert("✅ Payment Successful");

        await handlePrintBill();
      }
    } catch (err) {
      console.error(
        "Payment status check failed",
        err
      );
    }
  }, 3000);
};
  const mapCartToFoodPayload = (items: any[]) => {
    return items.map((item) => ({
      Id: item.id, // backend food ID
      id: item.id,
      Food: item.name,
      code: "0",
      Price: item.price,
      Qty: item.qty,
      Comment: "",
      Category: item.catcode ?? 1,
      OrigQty: item.qty,
    }));
  };
  const createBillPayload = () => {
    const foodItems = mapCartToFoodPayload(items);
    console.log(companyInfo, "code");
console.log("selectedOutlet",selectedOutlet);

    return {
      UserCode: 1,
      Table: "F",
      SubTable: "A",
  Outlet: Number(selectedOutlet?.id || 0),
OutletName: selectedOutlet?.name || "",
      Waiter: 1,
      WaiterName: "ZZ",
      Pax: 1,

      Food: foodItems,

      Total: total,
      TotQty: foodItems.reduce((sum, f) => sum + f.Qty, 0),

      Branch: companyInfo?.Branch_code || "",
      Type: "K",
      NCCode: 0,
      NCRemarks: "",
      Discount: 0,
      DiscountType: "",
      DiscountRemarks: "",
      VRemarks: "0",
      Mode: "ADD",
      SubBillType: "C",
      Plan: "",
      GuestName: "Sunil",
      GuestCode: "",
      CheckInNo: "0",
      KotMobileNo: "0",
    };
  };

  const buildSubmitPayloadFromRes = (
    res: any,
    tax: any,
    transactionId: any,
  ) => {
    const foodItems = mapCartToFoodPayload(items);

    const totalQty =
      res?.TotQty ?? foodItems.reduce((s: number, i: any) => s + i.Qty, 0);

    const totalAmount =
      res?.Total ??
      foodItems.reduce((s: number, i: any) => s + i.Price * i.Qty, 0);

    return {
      Cart: {
        UserCode: Number(res?.UserCode ?? 1),
        Table: res?.Table ?? "F",
        SubTable: res?.SubTable ?? "A",
  Outlet: Number(selectedOutlet?.id || 0),
OutletName: selectedOutlet?.name || "",

        Waiter: Number(res?.Waiter ?? 1),
        WaiterName: res?.WaiterName ?? "ZZ",
        Pax: Number(res?.Pax ?? totalQty),

        Food: foodItems,

        Total: Number(totalAmount),
        TotQty: Number(totalQty),

        Branch: companyInfo?.Branch_code || "",
        Type: res?.Type ?? "K",

        NCCode: Number(res?.NCCode ?? 0),
        NCRemarks: res?.NCRemarks ?? "",

        Discount: Number(res?.Discount ?? 0),
        DiscountType: res?.DiscountType ?? "",
        DiscountRemarks: res?.DiscountRemarks ?? "",

        VRemarks: res?.VRemarks ?? "0",

        Mode: "ADD", // 🔥 force consistency
        SubBillType: "C",

        Plan: res?.Plan ?? "",
        GuestName: res?.GuestName ?? "Sunil",
        GuestCode: res?.GuestCode ?? "",
        CheckInNo: res?.CheckInNo ?? "0",
        KotMobileNo: "9845516950",
      },

      Tax: {
        TotalAmount: Number(tax?.TotalAmount ?? totalAmount),
        TotalQty: Number(tax?.TotalQty ?? totalQty),
        CGSTPer: Number(tax?.CGSTPer ?? 2.5),
        CGSTAmt: Number(tax?.CGSTAmt ?? 0),
        SGSTPer: Number(tax?.SGSTPer ?? 2.5),
        SGSTAmt: Number(tax?.SGSTAmt ?? 0),
        ServiceChargePer: Number(tax?.ServiceChargePer ?? 0),
        ServiceCharge: Number(tax?.ServiceCharge ?? 0),
        GrandTotal: Number(tax?.GrandTotal ?? totalAmount),
        DiscountPer: Number(tax?.DiscountPer ?? 0),
        Discount: Number(tax?.Discount ?? 0),
        DiscountRemarks: null,
        RoundOff: Number(tax?.RoundOff ?? 0),
      },

      BillingType: "ADD",
      SubBillingType: "C",

      paymentresponse: {
        success: true,
        code: paymentMode,
        message: "COMPLETED",
        data: {
          transactionId:
            paymentMode === "ONLINE" ? selectedOnline.CardType : "CASH",

          amount: Number(tax?.GrandTotal ?? totalAmount),
          merchantId: transactionId,
          providerReferenceId: "POS",
          qrString: "",
        },
      },
    };
  };

  // const handlePrintBill = async () => {
  //   debugger
  //   try {
  //     setLoading(true);
  //     const transactionId = generateTransactionId(); // 🔥 generate here
  //     const payload = createBillPayload();
  //     const res = await getBill(payload);

  //     const payload2 = buildSubmitPayloadFromRes(items, res, transactionId);

  //     // ✅ use centralized API
  //     const res2 = await submitBill(payload2);
  //     const res3 = await getbillnouseorderid(transactionId);
  //     console.log("res3", res3);

  //     console.log("Backend Bill 👉", res2);

  //     if (!res2.success) {
  //       alert("Bill calculation failed");
  //       return;
  //     }

  //     await printerService.printBill(items, res, companyInfo, res3.billdetails);

  //     dispatch({ type: "CLEAR_CART" });
  //     navigate("/itemsPage");
  //   } catch (err) {
  //     console.error("Submit/Print error:", err);
  //     alert("❌ Error while submitting or printing bill");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePrintBill = async () => {
  try {
    setLoading(true);

  const transactionId =
  paymentMode === "ONLINE"
    ? paymentData?.localTransactionId
    : generateTransactionId();

    const payload = createBillPayload();
    const res = await getBill(payload);

    const payload2 = buildSubmitPayloadFromRes(
      items,
      res,
      transactionId
    );

    const res2 = await submitBill(payload2);

    console.log("Backend Bill 👉", res2);

    // ✅ stop printing if submit fails
    if (!res2 || res2.success !== true) {
      alert("Bill submission failed");
      return;
    }

    const res3 = await getbillnouseorderid(transactionId);

    console.log("res3", res3);

    await printerService.printBill(
      items,
      res,
      companyInfo,
      res3.billdetails
    );

    dispatch({ type: "CLEAR_CART" });

    navigate("/itemsPage");

  } catch (err) {
    console.error("Submit/Print error:", err);
    alert("❌ Error while submitting or printing bill");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    if (paymentMode === "ONLINE" && onlineTypes.length > 0) {
      setSelectedOnline(onlineTypes[0]);
    }
  }, [paymentMode, onlineTypes]);

  useEffect(() => {
  if (
    paymentMode === "ONLINE" &&
    (billData?.GrandTotal ?? total) > 0
  ) {
    fetchPaymentQR();
  }
}, [paymentMode, billData]);
  return (
    <>
      {activePage === "sales" ? (
        <SalesReport onBack={() => setActivePage("home")} />
      ) : (
        <div
          className="min-h-screen flex justify-center items-start p-4 sm:p-8"
          style={{ backgroundColor: mainBlue + "20" }}
        >
          <div className="w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-8">
            {/* HEADER */}
            <header>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft size={22} /> Back
              </button>

              <h1 className="text-2xl font-semibold">Your Order</h1>
              <p className="text-gray-500">
                Review and complete your selection
              </p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* ITEMS */}
              <div className="flex-1 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between gap-4 border rounded-xl p-4"
                    style={{ borderColor: mainBlue + "50" }}
                  >
                    <div className="flex gap-4">
                      <img
                        onError={handleImgError}
                        src={`https://source.unsplash.com/80x80/?${encodeURIComponent(
                          item.name,
                        )}`}
                        className="w-20 h-20 rounded object-cover"
                        alt={item.name}
                      />

                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-500 text-sm">
                          ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          dispatch({ type: "DECREASE_QTY", payload: item.id })
                        }
                        className="w-8 h-8 border rounded"
                      >
                        -
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() =>
                          dispatch({ type: "INCREASE_QTY", payload: item.id })
                        }
                        className="w-8 h-8 border rounded"
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          dispatch({ type: "REMOVE_ITEM", payload: item.id })
                        }
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAYMENT MODE */}
              <div className="mt-4">
                <h3 className="font-medium mb-2">Payment Mode</h3>

                {/* Main Modes */}
                <div className="grid grid-cols-2 gap-2">
                  {["CASH", "ONLINE"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMode(mode as any)}
                      className={`py-2 rounded-lg border text-sm font-medium transition 
          ${
            paymentMode === mode
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700"
          }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* ONLINE OPTIONS (From API) */}
                {/* {paymentMode === "ONLINE" && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {onlineTypes.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Loading online types...
                      </p>
                    ) : (
                      onlineTypes.map((online) => (
                        <button
                          key={online.CardId}
                          onClick={() => setSelectedOnline(online)}
                          className={`py-2 rounded-lg border text-sm transition 
              ${
                selectedOnline?.CardId === online.CardId
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white"
              }`}
                        >
                          {online.CardType}
                        </button>
                      ))
                    )}
                  </div>
                )} */}

                {paymentMode === "ONLINE" && selectedOnline && (
                  <div className="mt-6 flex flex-col items-center justify-center w-full">
                    <p className="text-sm sm:text-base text-gray-600 mb-3 text-center">
                      Scan & Pay
                    </p>

                    {/* QR BOX */}
                    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-md flex justify-center w-full">
                      <QRCodeCanvas
                      value={paymentData?.qrString || ""}
                        size={
                          window.innerWidth < 640
                            ? 160 // 📱 mobile
                            : window.innerWidth < 1024
                              ? 220 // 💻 tablet
                              : 280 // 🖥️ kiosk
                        }
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                        includeMargin
                      />
                    </div>

                    {/* Amount */}
                    <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mt-3 text-center">
                ₹{((paymentData?.amount || 0) / 100).toFixed(2)}
                    </p>

                    <p className="text-xs text-gray-400 text-center">
                      Scan using any UPI app
                    </p>
                  </div>
                )}  
              </div>

              {/* SUMMARY + PRINTER */}
              <div className="w-full max-w-md bg-gray-50 rounded-2xl p-6 shadow">
                <h2 className="font-semibold text-xl mb-4">Order Summary</h2>

                {/* Subtotal */}
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{(billData?.TotalAmount ?? total).toFixed(2)}</span>
                </div>

                {/* Taxes */}
                {billData?.TaxList?.map((tax: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>{tax.TaxName}</span>
                    <span>₹{tax.TaxAmount.toFixed(2)}</span>
                  </div>
                ))}

                {/* Service Charge */}
                {(billData?.ServiceCharge ?? 0) > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Service Charge</span>
                    <span>₹{billData.ServiceCharge.toFixed(2)}</span>
                  </div>
                )}

                {/* Discount */}
                {(billData?.Discount ?? 0) > 0 && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Discount</span>
                    <span>-₹{billData.Discount.toFixed(2)}</span>
                  </div>
                )}

                <hr className="my-3" />

                {/* Grand Total */}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Grand Total</span>
                  <span>₹{((paymentData?.amount || 0) / 100).toFixed(2)}</span>
                </div>

                {/* ✅ KEEP YOUR ORIGINAL PRINTER + SUBMIT LOGIC */}
                <div className="space-y-4 mt-6">
                  {printerConnected ? (
                    <PrinterSelector
                      onConnected={() => setPrinterConnected(true)}
                    />
                  ) : (
                    <button
                      disabled={loading || paymentMode === "ONLINE"}
                      onClick={handlePrintBill}
                      className={`w-full text-white font-semibold py-3 rounded-xl transition ${
                        paymentMode === "ONLINE"
                          ? "bg-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          paymentMode === "ONLINE" ? "#9CA3AF" : mainBlue,
                      }}
                      onMouseOver={(e) => {
                        if (paymentMode !== "ONLINE") {
                          e.currentTarget.style.backgroundColor = hoverBlue;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (paymentMode !== "ONLINE") {
                          e.currentTarget.style.backgroundColor = mainBlue;
                        }
                      }}
                    >
                      {loading ? "Processing..." : "Submit & Print 🧾"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
