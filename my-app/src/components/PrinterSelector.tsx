// // import { useEffect, useState } from "react";
// // import { printerService } from "../services/printerService";

// // type Props = {
// //   onConnected: () => void;
// // };

// // export default function PrinterSelector({ onConnected }: Props) {
// //   const [printers, setPrinters] = useState<any[]>([]);
// //   const [connecting, setConnecting] = useState<string | null>(null);

// //   // useEffect(() => {
// //   //   const loadPrinters = async () => {
// //   //     try {
// //   //       const paired = await printerService.getPairedDevices();
// //   //       setPrinters(paired);
// //   //     } catch (e: any) {
// //   //       alert("❌ Failed to load printers: " + (e.message || e));
// //   //     }
// //   //   };

// //   //   loadPrinters();
// //   // }, []);
// // useEffect(() => {
// //   const onDeviceReady = async () => {
// //     try {
// //       const paired = await printerService.getPairedDevices();
// //       setPrinters(paired);

// //       if (paired.length > 0) {
// //         const firstPrinter = paired[0];

// //         setConnecting(firstPrinter.address);
// //         await printerService.connect(firstPrinter.address);

// //         alert(`✅ Connected to ${firstPrinter.name || "Printer"}`);
// //         onConnected();
// //       } else {
// //         alert("❌ No paired printers found");
// //       }
// //     } catch (e: any) {
// //       alert("❌ Printer connection failed: " + (e.message || e));
// //     } finally {
// //       setConnecting(null);
// //     }
// //   };

// //   document.addEventListener("deviceready", onDeviceReady);
// //   return () =>
// //     document.removeEventListener("deviceready", onDeviceReady);
// // }, []);

// //   const connect = async (mac: string) => {
// //     try {
// //       setConnecting(mac);
// //       await printerService.connect(mac);
// //       alert("✅ Printer connected");
// //       onConnected();
// //     } catch (e: any) {
// //       alert("❌ Connection failed: " + (e.message || e));
// //     } finally {
// //       setConnecting(null);
// //     }
// //   };

// //   return (
// //     <div className="p-4 border rounded-xl bg-white shadow">
// //       <h3 className="font-semibold mb-3">Select Printer</h3>

// //       {printers.length === 0 && (
// //         <p className="text-sm text-gray-500">No paired printers found</p>
// //       )}

// //       <ul className="space-y-2">
// //         {printers.map((p, i) => (
// //           <li
// //             key={i}
// //             className="flex justify-between items-center border rounded-lg p-2"
// //           >
// //             <div>
// //               <p className="font-medium">{p.name || "Unnamed Printer"}</p>
// //               <p className="text-xs text-gray-500">{p.address}</p>
// //             </div>

// //             <button
// //               disabled={connecting === p.address}
// //               onClick={() => connect(p.address)}
// //               className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
// //             >
// //               {connecting === p.address ? "Connecting..." : "Connect"}
// //             </button>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }
// import { useEffect } from "react";
// import { printerService } from "../services/printerService";

// type Props = {
//   onConnected: () => void;
// };

// export default function PrinterSelector({ onConnected }: Props) {
//   const ensureConnected = async () => {
//     try {
//       // 1️⃣ If already connected, do nothing
//       const ok = await printerService.isConnected();
//       if (ok) {
//         onConnected();
//         return;
//       }

//       // 2️⃣ Try reconnect last printer
//       const reconnected = await printerService.autoReconnect();
//       if (reconnected) {
//         onConnected();
//         return;
//       }

//       // 3️⃣ Fallback: connect first paired printer
//       const paired = await printerService.getPairedDevices();
//       if (paired.length > 0) {
//         await printerService.connect(paired[0].address);
//         onConnected();
//       }
//     } catch (e) {
//       console.warn("Printer reconnect skipped");
//     }
//   };

//   useEffect(() => {
//     ensureConnected();

//     // 🔥 THIS IS THE KEY FIX
//     document.addEventListener("resume", ensureConnected);

//     return () => {
//       document.removeEventListener("resume", ensureConnected);
//     };
//   }, []);

//   return (
//     <div className="mt-6 text-center text-gray-500">
//       Connecting to printer...
//     </div>
//   );
// }



import { useEffect } from "react";
import { printerService } from "../services/printerService";

type Props = {
  onConnected: () => void;
};

export default function PrinterSelector({ onConnected }: Props) {
  useEffect(() => {
  const ensureConnected = async () => {
  try {
    alert("1. initialize()");
    await printerService.initialize();

    alert("2. Checking connection");

    if (await printerService.isConnected()) {
      alert("Already connected");
      onConnected();
      return;
    }

    alert("3. Auto reconnect");

    const reconnected = await printerService.autoReconnect();

    alert("Auto reconnect result: " + reconnected);

    if (reconnected) {
      onConnected();
      return;
    }

    alert("4. Getting paired devices");

    const paired = await printerService.getPairedDevices();

    alert("Paired printers: " + paired.length);

    if (!paired.length) {
      alert("❌ No paired printers found");
      return;
    }

    const printer = paired[0];

    alert(
      "Connecting to:\n" +
      (printer.name || "Unknown") +
      "\n" +
      printer.address
    );

    await printerService.connect(printer.address);

    alert("✅ Connected Successfully");

    onConnected();
  } catch (err: any) {
    alert(
      "❌ ERROR:\n" +
      (err?.message || JSON.stringify(err) || String(err))
    );

    console.error(err);
  }
};

    const onDeviceReady = () => {
      ensureConnected();
    };

    document.addEventListener("deviceready", onDeviceReady);
    document.addEventListener("resume", ensureConnected);

    // If already ready, call immediately
    if ((window as any).cordova) {
      ensureConnected();
    }

    return () => {
      document.removeEventListener("deviceready", onDeviceReady);
      document.removeEventListener("resume", ensureConnected);
    };
  }, [onConnected]);

  return (
    <div className="mt-6 text-center text-gray-500">
      Connecting to printer...
    </div>
  );
}