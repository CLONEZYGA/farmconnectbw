import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ExpertDashboard: undefined;
  FarmerDashboard: undefined;
  BuyerDashboard: undefined;
  AdminDashboard: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface NavigationProps {
  navigation: NavigationProp;
} 