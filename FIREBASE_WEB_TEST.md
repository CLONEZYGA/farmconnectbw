# Firebase Web Setup Test Guide

## Overview
The app has been updated to use the web-compatible Firebase SDK instead of React Native Firebase, which resolves the Metro bundling issues with Expo web.

## Changes Made

### 1. Dependencies Updated
- Removed: `@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-firebase/firestore`, `@react-native-firebase/storage`
- Added: `firebase` (web-compatible SDK)

### 2. Firebase Configuration
- Updated `config/firebase.ts` to use web Firebase SDK
- Uses `initializeApp`, `getAuth`, `getFirestore`, `getStorage`
- Maintains the same configuration and predefined users

### 3. AuthContext Updated
- Updated `context/AuthContext.tsx` to use web Firebase auth methods
- Uses `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `onAuthStateChanged`
- Maintains all existing functionality

## Testing Steps

### 1. Start the Development Server
```bash
npx expo start --clear
```

### 2. Test Web Platform
- Open the web version at `http://localhost:8081`
- The app should load without Metro bundling errors

### 3. Test Authentication
- Navigate to the login screen
- Try logging in with predefined users:
  - **Farmer**: `farmer@farmconnectbw.com` / `farmer123`
  - **Buyer**: `buyer@farmconnectbw.com` / `buyer123`
  - **Expert**: `expert@farmconnectbw.com` / `expert123`
  - **Admin**: `admin@farmconnectbw.com` / `admin123`

### 4. Test Quick Login Buttons
- Use the quick login buttons on the login screen
- Each should authenticate and redirect to the appropriate role-based screen

## Expected Behavior

### ✅ Working Features
- App loads without Metro bundling errors
- Firebase authentication works on web
- Predefined users can log in
- Role-based navigation works
- User data is stored in Firebase
- PostgreSQL database integration (if configured)

### ⚠️ Known Limitations
- Some React Native specific features may not work on web
- Native device features (camera, location) require platform-specific handling
- Push notifications require additional setup for web

## Troubleshooting

### If Authentication Fails
1. Check Firebase Console to ensure users exist
2. Verify Firebase configuration in `config/firebase.ts`
3. Check browser console for error messages

### If App Doesn't Load
1. Clear browser cache
2. Restart development server with `--clear` flag
3. Check for TypeScript errors

### If Database Operations Fail
1. Ensure PostgreSQL service is running
2. Check database connection in `services/database.ts`
3. Verify database schema matches expected structure

## Next Steps

### For Production
1. Set up proper Firebase security rules
2. Configure environment variables for sensitive data
3. Set up proper error handling and logging
4. Implement proper user management in Firebase Console

### For Mobile Development
1. The web Firebase SDK works on mobile through Expo
2. For native features, consider using Expo's Firebase plugin
3. Test on both iOS and Android simulators

## Firebase Console Setup

### Create Users in Firebase Console
1. Go to Firebase Console > Authentication > Users
2. Add the 4 predefined users manually:
   - `farmer@farmconnectbw.com`
   - `buyer@farmconnectbw.com`
   - `expert@farmconnectbw.com`
   - `admin@farmconnectbw.com`
3. Set passwords as specified in the config

### Enable Authentication Methods
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable Email/Password authentication
3. Configure any additional sign-in methods as needed

## Success Criteria
- ✅ Metro bundling completes without errors
- ✅ App loads on web platform
- ✅ Login screen displays correctly
- ✅ Authentication works with predefined users
- ✅ Role-based navigation functions properly
- ✅ No console errors related to Firebase modules 