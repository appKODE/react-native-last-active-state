require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-last-active-state"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://git.appkode.ru/diary/diary_last_active_state.git", :tag => "#{s.version}" }
  s.module_name  = "RNLastActiveState"

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.dependency "React-Core"

  load 'nitrogen/generated/ios/RNLastActiveState+autolinking.rb'
  add_nitrogen_files(s)
end
