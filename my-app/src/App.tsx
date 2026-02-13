import { useEffect, useState } from "react";
import LandingPage from "./screen/LandingPage";
import { CompanyProvider } from "./context/CompanyContext";
import { OutletProvider } from "./context/OutletContext";
import { AuthProvider } from "./context/AuthContext";

declare const cordova: any;

export default function App() {
  const [_ready, setReady] = useState(false);

  useEffect(() => {
const requestBluetoothPermissions = async (): Promise<boolean> => {
  if (cordova.platformId !== "android" || !cordova.plugins?.permissions) {
    return true;
  }

  const perms = cordova.plugins.permissions;

  // STEP 1: Location
  const locationGranted = await new Promise<boolean>((resolve) => {
    perms.requestPermission(
      perms.ACCESS_FINE_LOCATION,
      (res: any) => resolve(res.hasPermission),
      () => resolve(false)
    );
  });

  if (!locationGranted) {
    alert("❌ Location permission denied");
    return false;
  }

  // STEP 2: Bluetooth CONNECT (ONLY THIS MATTERS)
  const btGranted = await new Promise<boolean>((resolve) => {
    perms.requestPermission(
      perms.BLUETOOTH_CONNECT,
      (res: any) => resolve(res.hasPermission),
      () => resolve(false)
    );
  });

  if (!btGranted) {
    alert("❌ Bluetooth Connect permission denied");
    return false;
  }

  // OPTIONAL: SCAN (do NOT block)
  perms.requestPermission(perms.BLUETOOTH_SCAN, () => {}, () => {});

  return true;
};



    const onDeviceReady = async () => {
      console.log("✅ deviceready fired");
      const granted = await requestBluetoothPermissions();
      if (granted) setReady(true);
    };

    document.addEventListener("deviceready", onDeviceReady);

    return () => document.removeEventListener("deviceready", onDeviceReady);
  }, []);

  // if (!ready) return <div>Loading device and requesting Bluetooth permissions...</div>;

  return (
    <AuthProvider>
    <CompanyProvider>
      <OutletProvider>
        <LandingPage/>
      </OutletProvider>
    </CompanyProvider>
    </AuthProvider>
  )
}
