# Firebase Authentication Test Guide

## Quick Test Steps

### 1. Start the App
```bash
npx expo start
```

### 2. Test Login Screen
1. Open the app on your device/simulator
2. You should see the login screen with 4 quick login buttons:
   - **Farmer** (Green button)
   - **Buyer** (Blue button) 
   - **Expert** (Orange button)
   - **Admin** (Purple button)

### 3. Test Each Account
Click each quick login button to test:

#### Farmer Account
- **Email**: `farmer@farmconnectbw.com`
- **Password**: `farmer123`
- **Expected**: Redirects to `/(farmer)/market`

#### Buyer Account
- **Email**: `buyer@farmconnectbw.com`
- **Password**: `buyer123`
- **Expected**: Redirects to `/(buyer)/cart`

#### Expert Account
- **Email**: `expert@farmconnectbw.com`
- **Password**: `expert123`
- **Expected**: Redirects to `/(expert)/messages`

#### Admin Account
- **Email**: `admin@farmconnectbw.com`
- **Password**: `admin123`
- **Expected**: Redirects to `/(admin)/dashboard`

## What to Check

### ✅ Success Indicators:
- [ ] App starts without Firebase errors
- [ ] Login screen displays correctly
- [ ] Quick login buttons are visible
- [ ] Clicking buttons fills in email/password
- [ ] Login process completes
- [ ] User is redirected to correct screen
- [ ] User data persists after app restart

### ❌ Common Issues:
- **Firebase not initialized**: Check Firebase configuration
- **Users not found**: Create users in Firebase Console
- **Navigation errors**: Check route files exist
- **App crashes**: Check for missing dependencies

## Firebase Console Verification

1. Go to: https://console.firebase.google.com/project/farmconnect-bw
2. Click "Authentication" → "Users"
3. Verify these 4 users exist:
   - `farmer@farmconnectbw.com`
   - `buyer@farmconnectbw.com`
   - `expert@farmconnectbw.com`
   - `admin@farmconnectbw.com`

## If Users Don't Exist

Create them manually in Firebase Console:

1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Enter email and password for each account
4. Click "Add user"
5. Repeat for all 4 accounts

## Test Results

| Account | Status | Notes |
|---------|--------|-------|
| Farmer | ⏳ | Test this first |
| Buyer | ⏳ | Test after farmer |
| Expert | ⏳ | Test after buyer |
| Admin | ⏳ | Test after expert |

## Next Steps

Once authentication is working:

1. **Complete AuthContext implementation**
2. **Set up PostgreSQL database** (optional)
3. **Add real-time features**
4. **Implement push notifications**
5. **Add file upload functionality**

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify Firebase project configuration
3. Ensure all users exist in Firebase Console
4. Test with a simple email/password login first

Your Firebase project is configured and ready for testing! 