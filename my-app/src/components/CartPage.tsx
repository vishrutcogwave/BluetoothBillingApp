import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FALLBACK_IMAGE } from "../utils";
import { printerService } from "../services/printerService";
import PrinterSelector from "../components/PrinterSelector";
import { useOutlet } from "../context/OutletContext";

import { getBill, submitBill } from "../api/kotService";
import { useCompany } from "../context/CompanyContext";



/* =========================
   TAX CALCULATION
   ========================= */

const CartPage = () => {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();
  console.log("cartItems", items);
    const { selectedOutlet } = useOutlet();
console.log(selectedOutlet,"selectedOutlet");

  const mainBlue = "#0576B2";
  const hoverBlue = "#0461A8";

  const [printerConnected, setPrinterConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { companyInfo } = useCompany();
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
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

    return {
      UserCode: 1,
      Table: "F",
      SubTable: "A",
      Outlet: 7,
      OutletName: "FASTFOOD",
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

//   const buildSubmitPayload = (items: any[],res:any) => {
//   const qty = items.reduce((s, i) => s + i.qty, 0);
  

//   return {
//     Cart: {
//       UserCode: 1,
//       Table: "R1",
//       SubTable: "A",
//       Outlet: selectedOutlet?.id,
//       OutletName: "PARADISE BAR AND RESTAURANT",
//       Waiter: 1,
//       WaiterName: "SYSTEM",
//       Pax: qty,

//       Branch: companyInfo?.Branch_code,
//       Type: "K",
//       Mode: "CASH",

//       NCCode: 0,
//       NCRemarks: "NA",
//       VRemarks: "NA",

//       Discount: 0,
//       DiscountType: "AMOUNT",
//       DiscountRemarks: "NA",

//       Plan: "NA",
//       GuestName: "WALKIN",
//       GuestCode: "0",
//       CheckInNo: "0",
//       KotMobileNo: "9999999999",

//       Food: items.map((item) => ({
//             Id: item.id, // backend food ID
//       id: item.id,
//       Food: item.name,
//       code: "0",
//       Price: item.price,
//       Qty: item.qty,
//       Comment: "",
//       Category: item.catcode ?? 1,
//       OrigQty: item.qty,
//       })),

//       Total: total,
//       TotQty: qty,

//       HomeDelivary: {
//         GuestCode: 0,
//         TitleGn1: 0,
//         GuestName: "WALKIN",
//         DOB: new Date().toISOString(),
//         Address: "NA",
//         City: "NA",
//         Phone: "9999999999",
//         Email: "NA",
//         Remarks: "NA",
//         LastModify: new Date().toISOString(),
//         Discount: 0,
//         Branch_code: companyInfo?.Branch_code,
//         isUpdate: 0,
//       },
//     },

//     Tax: res, // ✅ sent but backend ignores safely
//     BillingType: "DIRECT",
//     SubBillingType: "DIRECT",
//   };
// };
// const buildSubmitPayload = (items: any[], res:any) => {
//   const qty = items.reduce((s, i) => s + i.qty, 0);

//   return {
//     Cart: {
//       UserCode: 1,
//       Table: "F",
//       SubTable: "A",
//      Outlet: selectedOutlet?.id,
//       OutletName: selectedOutlet?.name,
//       Waiter: 1,
//       WaiterName: "SYSTEM",
//       Pax: qty,

//       Branch: companyInfo?.Branch_code,
//       Type: "K",
//       Mode: "CASH",

//       NCCode: 0,
//       NCRemarks: "NA",
//       VRemarks: "NA",

//       Discount: 0,
//       DiscountType: "AMOUNT",
//       DiscountRemarks: "NA",

//       Plan: "NA",
//       GuestName: "WALKIN",
//       GuestCode: "0",
//       CheckInNo: "0",
//       KotMobileNo: "9999999999",

//       Food: items.map((i) => ({
//         Id: i.id,          // 🔥 ItemCode
//         Food: i.name,
//         Price: i.price,
//         Qty: i.qty,
//         OrigQty: i.qty,
//         Comment: "NA",
//         Category: i.catcode,
//       })),

//       Total: total,
//       TotQty: qty,

//       HomeDelivary: {
//         GuestCode: 0,
//         TitleGn1: 0,
//         GuestName: "WALKIN",
//         DOB: new Date().toISOString(),
//         Address: "NA",
//         City: "NA",
//         Phone: "9999999999",
//         Email: "NA",
//         Remarks: "NA",
//         LastModify: new Date().toISOString(),
//         Discount: 0,
//         Branch_code: "DEROY",
//         isUpdate: 0,
//       },
//     },

//     Tax: res, // ✅ sent but backend ignores safely
//     BillingType: "DIRECT",
//     SubBillingType: "DIRECT",
//   };
// };

const buildSubmitPayloadFromRes = (res: any, tax: any) => {
  const foodList = Array.isArray(res?.Food)
    ? res.Food.map((f: any) => ({
        Id: Number(f.Id),
        id: Number(f.Id),                 // 🔥 must be 0
        Food: f.Food,
        code: "0",
        Price: Number(f.Price),
        Qty: Number(f.Qty),
        Comment: "",
        Category: Number(f.Category),
        OrigQty: Number(f.OrigQty ?? f.Qty),
      }))
    : [];

  const totalQty =
    res?.TotQty ??
    foodList.reduce((s: number, i: any) => s + i.Qty, 0);

  const totalAmount =
    res?.Total ??
    foodList.reduce((s: number, i: any) => s + i.Price * i.Qty, 0);

  return {
    Cart: {
      UserCode: Number(res?.UserCode ?? 1),
      Table: res?.Table ?? "F",
      SubTable: res?.SubTable ?? "A",

      Outlet: Number(res?.Outlet),
      OutletName: res?.OutletName ?? "FAST FOOD",

      Waiter: Number(res?.Waiter ?? 1),
      WaiterName: res?.WaiterName ?? "ZZ",
      Pax: Number(res?.Pax ?? totalQty),

      Food: foodList,

      Total: Number(totalAmount),
      TotQty: Number(totalQty),

      Branch: res?.Branch ?? "DEROY",
      Type: res?.Type ?? "K",

      NCCode: Number(res?.NCCode ?? 0),
      NCRemarks: res?.NCRemarks ?? "",

      Discount: Number(res?.Discount ?? 0),
      DiscountType: res?.DiscountType ?? "",
      DiscountRemarks: res?.DiscountRemarks ?? "",

      VRemarks: res?.VRemarks ?? "0",

      Mode: "ADD",             // 🔥 force consistency
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
      code: "COMPLETED",
      message: "COMPLETED",
      data: {
        transactionId: "OM2511251506490665876190",
        amount: Number(tax?.GrandTotal ?? totalAmount),
        merchantId: "ORID25112025150648",
        providerReferenceId: "OMO2511251506490665876255",
        qrString: "",
      },
    },
  };
};


  const handlePrintBill = async () => {
    try {
      setLoading(true);

      const payload = createBillPayload();
      const res = await getBill(payload);

         const payload2 = buildSubmitPayloadFromRes(items, res);

    // ✅ use centralized API
    const res2 = await submitBill(payload2);
      console.log("Backend Bill 👉", res2);

      if (!res2.success) {
        alert("Bill calculation failed");
        return;
      }

      await printerService.printBill(items, res, companyInfo);

      dispatch({ type: "CLEAR_CART" });
      navigate("/itemsPage");
    } catch (err) {
      console.error("Submit/Print error:", err);
      alert("❌ Error while submitting or printing bill");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <p className="text-gray-500">Review and complete your selection</p>
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

          {/* SUMMARY + PRINTER */}
          <div className="w-full max-w-md bg-gray-50 rounded-2xl p-6 shadow">
            <h2 className="font-semibold text-xl mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

             {!printerConnected ? (
              <PrinterSelector onConnected={() => setPrinterConnected(true)} />
            ) : (  
            <button
              disabled={loading}
              onClick={handlePrintBill}
              className="mt-6 w-full text-white font-semibold py-3 rounded-xl"
              style={{ backgroundColor: mainBlue }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverBlue)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = mainBlue)
              }
            >
              {loading ? "Processing..." : "Submit & Print 🧾"}
            </button>
              )} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
