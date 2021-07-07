package com.reactnativelastactivestate;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = LastActiveStateModule.NAME)
public class LastActiveStateModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    public static final String NAME = "LastActiveState";

    ReactApplicationContext context;

    public LastActiveStateModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("initialLastActiveTime", getLastActive());
        return constants;
    }

    @Override
    public void onHostResume() {
        WritableMap params = Arguments.createMap();
        params.putDouble("lastActiveTime", getLastActive());
        sendEvent(params);
    }

    @Override
    public void onHostPause() {
        SharedPreferences sharedPref = context.getCurrentActivity().getPreferences(Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        Long time = System.currentTimeMillis() / 1000;
        editor.putLong("lastActiveTime", time);
        editor.commit();
    }

    @Override
    public void onHostDestroy() {
    }

     @ReactMethod
     public void getLastActiveTime(Callback callBack) {
       callBack.invoke(getLastActive().doubleValue());
     }

    private void sendEvent(@Nullable WritableMap params) {
      context
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("changeLastActiveTime", params);
    }

    private Long getLastActive() {
      SharedPreferences sharedPref = context.getCurrentActivity().getPreferences(Context.MODE_PRIVATE);
      return sharedPref.getLong("lastActiveTime", 0);
    }
}
