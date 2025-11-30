# FarmConnectBW - Smart Farming Solutions

A comprehensive React Native/Expo application designed to connect farmers, buyers, experts, and administrators in the agricultural ecosystem of Botswana.

## Features

- **Multi-role Authentication**: Support for farmers, buyers, experts, and administrators
- **Marketplace**: Direct buying and selling of agricultural products
- **Expert Consultations**: Connect with agricultural experts for advice
- **Inventory Management**: Track crops, livestock, and equipment
- **Analytics & Reports**: Data-driven insights for farm management
- **Real-time Messaging**: Communication between all user types
- **Payment Integration**: Secure payment processing for transactions

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **Storage**: AsyncStorage & Expo SecureStore
- **UI Components**: React Native Paper, Expo Vector Icons
- **Charts**: React Native Chart Kit
- **Maps**: Expo Location
- **TypeScript**: Full type safety

## Project Structure

```
├── app/                    # Main application screens
│   ├── (auth)/            # Authentication screens
│   ├── (farmer)/          # Farmer-specific screens
│   ├── (buyer)/           # Buyer-specific screens
│   ├── (expert)/          # Expert-specific screens
│   ├── (admin)/           # Admin-specific screens
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
├── context/              # React Context providers
├── services/             # API and storage services
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── assets/               # Images, fonts, and static files
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on your preferred platform**
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web

## User Roles

### Farmer
- Manage crops and livestock
- Access market for selling products
- Get expert advice
- Track farm analytics

### Buyer
- Browse and purchase products
- Manage orders and payments
- Connect with farmers directly

### Expert
- Provide consultations
- Share knowledge and advice
- Manage consultation requests

### Administrator
- Oversee platform operations
- Manage users and content
- View system analytics

## Development

This project uses:
- **Expo Router** for navigation
- **TypeScript** for type safety
- **React Context** for state management
- **AsyncStorage** for local data persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
