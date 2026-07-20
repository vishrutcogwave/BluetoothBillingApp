package com.cogwave.skposlcd;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.IBinder;
import android.util.Base64;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;

import net.nyx.printerservice.print.IPrinterService;

public class SkposLCD extends CordovaPlugin {

    private IPrinterService printerService;

    private final ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            printerService = IPrinterService.Stub.asInterface(service);
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
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {

        if ("show".equals(action)) {

            if (printerService == null) {
                callbackContext.error("Printer service not connected");
                return true;
            }

            try {

                String base64 = args.getString(0);

                byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                Bitmap bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);

                int result = printerService.showLcdBitmap(bitmap);

                if (result == 0) {
                    callbackContext.success();
                } else {
                    callbackContext.error("showLcdBitmap failed : " + result);
                }

            } catch (Exception e) {
                callbackContext.error(e.getMessage());
            }

            return true;
        }

        if ("wakeUp".equals(action)) {
            return configLcd(1, callbackContext);
        }

        if ("sleep".equals(action)) {
            return configLcd(2, callbackContext);
        }

        if ("reset".equals(action)) {
            return configLcd(4, callbackContext);
        }

        return false;
    }

    private boolean configLcd(int mode, CallbackContext callbackContext) {

        if (printerService == null) {
            callbackContext.error("Printer service not connected");
            return true;
        }

        try {

            int result = printerService.configLcd(mode);

            if (result == 0) {
                callbackContext.success();
            } else {
                callbackContext.error("configLcd failed : " + result);
            }

        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }

        return true;
    }

    @Override
    public void onDestroy() {

        try {
            cordova.getActivity().unbindService(serviceConnection);
        } catch (Exception ignored) {
        }

        super.onDestroy();
    }
}