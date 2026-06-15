package com.reactnativelastactivestate

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.margelo.nitro.com.reactnativelastactivestate.RNLastActiveStateOnLoad

class LastActiveStatePackage : TurboReactPackage() {
  companion object {
    init {
      RNLastActiveStateOnLoad.initializeNative()
    }
  }

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? = null

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider { emptyMap() }
}
