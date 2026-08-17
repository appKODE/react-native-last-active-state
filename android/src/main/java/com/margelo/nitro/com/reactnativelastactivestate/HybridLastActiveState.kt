package com.margelo.nitro.com.reactnativelastactivestate

import android.content.Context
import android.content.SharedPreferences
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.LifecycleEventListener
import com.margelo.nitro.core.Promise
import com.margelo.nitro.NitroModules
import androidx.core.content.edit

class HybridLastActiveState : HybridLastActiveStateSpec(), LifecycleEventListener {
  private val STORAGE_KEY = "lastActiveTime"

  override var onLastActiveTimeChanged: ((lastActiveTime: Double) -> Unit)? = null

  private val prefs: SharedPreferences
    get() = NitroModules.applicationContext!!
      .getSharedPreferences(STORAGE_KEY, Context.MODE_PRIVATE)

  override val initialLastActiveTime: Double
    get() = prefs.getLong(STORAGE_KEY, 0L).toDouble()


  init {
    Handler(Looper.getMainLooper()).post {
      NitroModules.applicationContext?.addLifecycleEventListener(this@HybridLastActiveState)
    }
  }

  override fun getLastActiveTime(): Promise<Double> {
    return Promise.async {
      prefs.getLong(STORAGE_KEY, 0L).toDouble()
    }
  }

  override fun getLastActiveTimeSync(): Double {
    return prefs.getLong(STORAGE_KEY, 0L).toDouble()
  }

  override fun onHostResume() {
    val lastActiveTime = prefs.getLong(STORAGE_KEY, 0L).toDouble()
    onLastActiveTimeChanged?.invoke(lastActiveTime)
  }

  override fun onHostPause() {
    val currentTime = System.currentTimeMillis() / 1000
    prefs.edit(commit = true) { putLong(STORAGE_KEY, currentTime) }
  }

  override fun onHostDestroy() {
    NitroModules.applicationContext?.removeLifecycleEventListener(this@HybridLastActiveState)
  }
}
