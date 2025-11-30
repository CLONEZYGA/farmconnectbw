# Troubleshooting Guide

## Network Issues

### "Networking has been disabled" / "Unable to reach well-known versions endpoint"

This is a common issue that occurs when:
1. Your internet connection is unstable
2. Corporate firewall is blocking connections
3. Expo servers are temporarily unavailable
4. DNS resolution issues

#### Solutions:

1. **Check your internet connection**
   ```bash
   ping google.com
   ```

2. **Clear npm cache and reinstall**
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

3. **Use offline mode**
   ```bash
   npx expo start --offline
   ```

4. **Try different network**
   - Switch to mobile hotspot
   - Try a different WiFi network
   - Disable VPN if using one

5. **Update Expo CLI**
   ```bash
   npm install -g @expo/cli@latest
   ```

### Dependency Validation Issues

When you see "Dependency validation is unreliable in offline-mode":

1. **This is normal in offline mode** - the app will still work
2. **Check dependencies manually**:
   ```bash
   npx expo install --fix
   ```

3. **Verify package.json** - ensure all dependencies are properly listed

## Development Issues

### Metro Bundler Problems

1. **Clear Metro cache**:
   ```bash
   npx expo start --clear
   ```

2. **Reset Expo cache**:
   ```bash
   npx expo r -c
   ```

3. **Kill all Node processes**:
   ```bash
   # Windows
   taskkill /f /im node.exe
   
   # Mac/Linux
   pkill -f node
   ```

### TypeScript Errors

1. **Check TypeScript configuration**:
   ```bash
   npx tsc --noEmit
   ```

2. **Update TypeScript**:
   ```bash
   npm install typescript@latest
   ```

### Navigation Issues

1. **Clear navigation cache**:
   ```bash
   npx expo start --clear
   ```

2. **Check route files** - ensure all referenced routes exist

## Performance Issues

### Slow Loading

1. **Enable Hermes engine** (already enabled in app.json)
2. **Optimize images** - use appropriate sizes
3. **Reduce bundle size** - remove unused dependencies

### Memory Issues

1. **Check for memory leaks** in useEffect hooks
2. **Optimize list rendering** with FlatList
3. **Clear AsyncStorage** periodically

## Platform-Specific Issues

### Android

1. **Clear Android build cache**:
   ```bash
   cd android && ./gradlew clean
   ```

2. **Update Android SDK** if needed

### iOS

1. **Clear iOS build cache**:
   ```bash
   cd ios && rm -rf build
   ```

2. **Update Xcode** if needed

### Web

1. **Clear browser cache**
2. **Check browser console** for errors
3. **Try different browser**

## Getting Help

1. **Check Expo documentation**: https://docs.expo.dev
2. **Search GitHub issues**: https://github.com/expo/expo/issues
3. **Ask on Discord**: https://chat.expo.dev

## Common Commands

```bash
# Start development server
npx expo start

# Start with cleared cache
npx expo start --clear

# Start in offline mode
npx expo start --offline

# Install dependencies
npm install

# Fix dependency issues
npx expo install --fix

# Check for TypeScript errors
npx tsc --noEmit

# Run on specific platform
npx expo run:android
npx expo run:ios
npx expo run:web
``` 