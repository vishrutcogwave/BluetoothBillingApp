

import { useEffect } from "react";
import { printerService } from "../services/printerService";

type Props = {
  onConnected: () => void;
};

export default function PrinterSelector({ onConnected }: Props) {
  useEffect(() => {
  const ensureConnected = async () => {
  try {
    // alert("1. initialize()");
    await printerService.initialize();

    // alert("2. Checking connection");

    if (await printerService.isConnected()) {
      // alert("Already connected");
      onConnected();
      return;
    }

    // alert("3. Auto reconnect");

    const reconnected = await printerService.autoReconnect();

    // alert("Auto reconnect result: " + reconnected);

    if (reconnected) {
      onConnected();
      return;
    }

    // alert("4. Getting paired devices");

    const paired = await printerService.getPairedDevices();

    // alert("Paired printers: " + paired.length);

    if (!paired.length) {
      // alert("❌ No paired printers found");
      console.log("❌ No paired printers found");
      
      return;
    }

    const printer = paired[0];

    // alert(
    //   "Connecting to:\n" +
    //   (printer.name || "Unknown") +
    //   "\n" +
    //   printer.address
    // );

    await printerService.connect(printer.address);

    // alert("✅ Connected Successfully");

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