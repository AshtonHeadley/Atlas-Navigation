# Team5-Atlas-NavigationApp

This is a new and innovative navigation app. Please try us out!

![image](https://github.com/CS160-04-Spring2024/Team5-Atlas-NavigationApp/assets/93296008/00dd4b3d-8932-4532-90d3-60f9a1625607)

# General Installation Guide
## Step 1: Clone the Repository 
- First, clone the Atlas repository to your local machine. Open a terminal window and run:
```
Git clone https://github.com/CS160-04-Spring2024/Team5-Atlas-NavigationApp.git
```

## Step 2: Install Development Tools 
### Depending on whether you are developing for iOS or Android, you will need to install the appropriate tools:

### iOS
1. For iOS (Mac only): Download and install Xcode.
2. If not already installed, make sure to have the latest version of CocoaPods installed
    - Install accurate to architecture (ARM-64, x86 Intel)
        - CocoaPods guides here: [CocoaPods Guide](https://guides.cocoapods.org/using/getting-started.html)
            - Troubleshooting: 
                - If installation is failing, try: [HomeBrew Guide](https://formulae.brew.sh/formula/cocoapods)
                - Native installation may be required if on ARM system
                - Use StackOverflow threads for support
                - Potentially helpful thread: [HERE](https://stackoverflow.com/questions/20755044/how-do-i-install-cocoapods)
### Android
1. For Android: Download and install Android Studio.

## Step 3: Open the Project in an IDE 
### You can open the Atlas project in any Integrated Development Environment (IDE) of your choice, such as Visual Studio Code, Xcode, or Android Studio. 

## Step 4: Install Project Dependencies 
1. Open a terminal window. 
2. Navigate to the cloned directory and then enter the subdirectory “Atlas”:
```
cd [directory path here]/Team5-Atlas-NavigationApp/Atlas
```
3. Install the necessary packages by running:
```
npm install
npm update
npm link
```
4. ### iOS ONLY: update pod packages:
```
cd ios
pod install
```
Troubleshooting support: [HERE](https://stackoverflow.com/questions/20755044/how-do-i-install-cocoapods)
5. Return to the “Atlas” directory
```
cd ..
```
# Option 1: Emulator run
- Step 1: Install Necessary Emulators
    1. In Xcode or Android Studio, install necessary simulator device to run Atlas on
        - [Xcode Simulator(Emulator) Guide](https://developer.apple.com/documentation/safari-developer-tools/adding-additional-simulators)
        - [Android Studio Emulator Guide](https://developer.android.com/studio/run/emulator)
- Step 2: Start the Development Server
    1. Back on the Atlas directory, run the following command in the terminal to start the development server:
```
npm run start
```
- Step 3: Launch the Application on a Virtual Device 
    1. Open another terminal window. 
    2. Navigate to the project directory then Atlas directory again:
`
cd [directory path here]/Team5-Atlas-NavigationApp/Atlas
`
    3. Run one of the following commands depending on the target platform:
        - For ios: `npm run ios`
        - For android: `npm run android`
### This will open the project in a virtual device, either an iPhone or an Android emulator.

# Option 2: Hardware run (iOS/iPhone ONLY) [Apple ID with developer access enabled required]
1. Follow general steps 1-4
2. Run Xcode, open `Atlas.xcodeproj`
3. On mobile device, enable developer mode in the settings
4. Using a “charging cable” connect iOS device to computer, enable this device as a “simulator” on Xcode
5. On top bar in Xcode, select connected device in the dropdown menu
6. Click the “Play” button with title “Start activated scheme” and wait for “`Build Succeeded`” or other instructions on screen.
    - Possible issues:
        - Apple ID with developer access not signed in on Xcode
        - Unverified Developer warning on mobile device (after build):
            - `Settings (App)→General→VPN & Device Management→ Trust application developer`
7. Find app on device and tap to run


Following these steps above will allow for any user to download and use the Atlas Navigation app. 



