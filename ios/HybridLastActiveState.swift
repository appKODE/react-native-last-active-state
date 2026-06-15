import Foundation
import UIKit
import NitroModules

class HybridLastActiveState: HybridLastActiveStateSpec {
  var onLastActiveTimeChanged: ((_ lastActiveTime: Double) -> Void)?

  var initialLastActiveTime: Double {
    return Double(UserDefaults.standard.integer(forKey: "lastActiveTime"))
  }

  override init() {
    super.init()
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(appDidBecomeActive),
      name: UIApplication.didBecomeActiveNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(appWillResignActive),
      name: UIApplication.willResignActiveNotification,
      object: nil
    )
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }

  func getLastActiveTime() throws -> Promise<Double> {
    return Promise.async {
      return Double(UserDefaults.standard.integer(forKey: "lastActiveTime"))
    }
  }

  func getLastActiveTimeSync() throws -> Double {
    return Double(UserDefaults.standard.integer(forKey: "lastActiveTime"))
  }

  @objc private func appDidBecomeActive() {
    let lastActiveTime = Double(UserDefaults.standard.integer(forKey: "lastActiveTime"))
    onLastActiveTimeChanged?(lastActiveTime)
  }

  @objc private func appWillResignActive() {
    let currentTime = Int(Date().timeIntervalSince1970)
    UserDefaults.standard.set(currentTime, forKey: "lastActiveTime")
  }
}
