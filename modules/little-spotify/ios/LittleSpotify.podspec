Pod::Spec.new do |s|
  s.name           = 'LittleSpotify'
  s.version        = '1.0.0'
  s.summary        = 'A native module tailored for the little sptofiy app.'
  s.description    = 'This module provides a native interface to the Spotify SDK and other native ios features.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '13.4', :tvos => '13.4' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'PromiseKit', "~> 6.8"

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"

  s.exclude_files = "SpotifySDK/SpotifyiOS.xcframework/**/*.h"
  s.vendored_frameworks = "SpotifySDK/SpotifyiOS.xcframework"
end
