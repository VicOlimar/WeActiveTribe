### Steps to test Android

- Mount metro server (and keep this running)
`npx react start` 

- On another terminal tab start start the app (this should launch your android emulator)
`npx react-native run-android`
##### If android emulator does't start, execute it manually.


### Steps to compile Android

- Update `android/app/build.gradle` version numbers (Currently lines 137 - 138).

Look for the lines:
```gradle
versionCode 15
versionName "1.2"
```
- Move into android folder (`cd android/`)
- Compile using `./gradlew bundleRelease`
- The resulting .aab file (android app bundle) will be at `/android/app/build/outputs/bundle/release/app.aab`

#### For more information visit [official react native guide](https://reactnative.dev/docs/environment-setup)

### If assets does not show in iOS 14 do the following:

Go to `react-native/Libraries/Image/RCTUIImageViewAnimated.m` and replace the condition with this one:

`
if (_currentFrame) {
    layer.contentsScale = self.animatedImageScale;
    layer.contents = (__bridge id)_currentFrame.CGImage;
  } else {
    [super displayLayer:layer];
  }
`