import { ExpoRoute } from 'expo-router/build/types';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      '/(auth)/register': undefined;
      '/(auth)/forgot-password': undefined;
      '/screens/farmerDashboard': undefined;
      '/screens/expertDashboard': undefined;
      '/screens/buyerDashboard': undefined;
      '/screens/adminDashboard': undefined;
      '/': undefined;
    }
  }
}

// This type can be used when you need to reference route names
export type AppRoutes = keyof ReactNavigation.RootParamList; 