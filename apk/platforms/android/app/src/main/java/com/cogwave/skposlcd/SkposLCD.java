package com.cogwave.skposlcd;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Base64;
import android.os.IBinder;
import android.os.RemoteException;

import net.nyx.printerservice.print.IPrinterService;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class SkposLCD extends CordovaPlugin {

    private IPrinterService printerService;

    private final ServiceConnection serviceConnection =
            new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {

            printerService =
                    IPrinterService.Stub.asInterface(service);

        }

        @Override
        public void onServiceDisconnected(ComponentName name) {

            printerService = null;

        }
    };

    @Override
    protected void pluginInitialize() {

        Intent intent = new Intent();

        intent.setPackage("net.nyx.printerservice");

        intent.setAction("net.nyx.printerservice.IPrinterService");

        cordova.getActivity().bindService(
                intent,
                serviceConnection,
                Context.BIND_AUTO_CREATE
        );

    }
        @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext)
            throws JSONException {

        if (printerService == null) {
            callbackContext.error("Printer Service not connected");
            return true;
        }

        switch (action) {

            case "showQRCode":
                showQRCode(args.getString(0), callbackContext);
                return true;

         case "wakeUp":
    wakeUp(callbackContext);
    return true;

case "sleep":
    sleep(callbackContext);
    return true;

case "reset":
    reset(callbackContext);
    return true;

            default:
                return false;
        }
    }

    private void showQRCode(String base64, CallbackContext callbackContext) {

        try {

            byte[] decoded = Base64.decode(base64, Base64.DEFAULT);

            Bitmap bitmap = BitmapFactory.decodeByteArray(
                    decoded,
                    0,
                    decoded.length
            );

            if (bitmap == null) {
                callbackContext.error("Invalid bitmap");
                return;
            }

            int result = printerService.showLcdBitmap(bitmap);

            if (result == 0) {
                callbackContext.success();
            } else {
                callbackContext.error("LCD Error Code : " + result);
            }

        } catch (RemoteException e) {

            callbackContext.error(e.getMessage());

        } catch (Exception e) {

            callbackContext.error(e.getMessage());

        }

    }


        private void wakeUp(CallbackContext callbackContext) {

        try {

            // Your SDK doesn't expose wakeUp() for LCD.
            // Keeping this for future SDK versions.

            callbackContext.success();

        } catch (Exception e) {

            callbackContext.error(e.getMessage());

        }

    }

    private void sleep(CallbackContext callbackContext) {

        try {

            // Your SDK doesn't expose sleep() for LCD.

            callbackContext.success();

        } catch (Exception e) {

            callbackContext.error(e.getMessage());

        }

    }

    private void reset(CallbackContext callbackContext) {

        try {

            // Your SDK doesn't expose reset() for LCD.

            callbackContext.success();

        } catch (Exception e) {

            callbackContext.error(e.getMessage());

        }

    }

    @Override
    public void onDestroy() {

        super.onDestroy();

        if (serviceConnection != null) {

            try {

                cordova.getActivity().unbindService(serviceConnection);

            } catch (Exception e) {

                // Ignore

            }

        }

    }

}