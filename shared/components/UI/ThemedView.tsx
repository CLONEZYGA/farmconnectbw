import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../../config/constants';

// Theme colors
const LightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E1E1E1',
  card: '#FFFFFF',
  tabBar: '#F8F8F8',
  statusBar: 'light',
};

const DarkColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  card: '#1C1C1E',
  tabBar: '#1C1C1E',
  statusBar: 'light',
};

type ThemeColors = typeof LightColors;

export function useThemeColors(): ThemeColors {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? DarkColors : LightColors;
}

// Context for theme
interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  colors: LightColors,
  isDark: false,
  toggleTheme: () => {},
});

export function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme Provider
interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark';
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = React.useState(
    initialTheme === 'dark' || colorScheme === 'dark'
  );

  const colors = isDark ? DarkColors : LightColors;

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const value: ThemeContextType = {
    colors,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Themed View Component
interface ThemedViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  lightColor?: string;
  darkColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export function ThemedView({
  children,
  style,
  lightColor,
  darkColor,
  backgroundColor,
  borderColor,
}: ThemedViewProps) {
  const { colors, isDark } = useTheme();

  const themedStyle = React.useMemo(() => {
    const baseStyle: ViewStyle = {};

    if (lightColor && darkColor) {
      baseStyle.backgroundColor = isDark ? darkColor : lightColor;
    } else if (backgroundColor) {
      baseStyle.backgroundColor = colors[backgroundColor as keyof ThemeColors] || backgroundColor;
    } else {
      baseStyle.backgroundColor = colors.background;
    }

    if (borderColor) {
      baseStyle.borderColor = colors[borderColor as keyof ThemeColors] || borderColor;
    } else {
      baseStyle.borderColor = colors.border;
    }

    return baseStyle;
  }, [colors, isDark, lightColor, darkColor, backgroundColor, borderColor]);

  const combinedStyle = Array.isArray(style)
    ? [themedStyle, ...style]
    : style
    ? [themedStyle, style]
    : themedStyle;

  return <View style={combinedStyle}>{children}</View>;
}

// Preset themed views for common patterns
interface CardProps extends ThemedViewProps {
  padding?: number;
  margin?: number;
  borderRadius?: number;
  shadow?: boolean;
}

export function ThemedCard({
  children,
  style,
  padding = 16,
  margin = 0,
  borderRadius = 12,
  shadow = true,
  ...themedProps
}: CardProps) {
  const { colors } = useTheme();

  const cardStyle: ViewStyle = React.useMemo(() => ({
    backgroundColor: colors.card,
    borderRadius,
    padding,
    margin,
    ...(shadow && {
      shadowColor: colors.shadowColor || '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  }), [colors, borderRadius, padding, margin, shadow]);

  return (
    <ThemedView
      style={[cardStyle, style]}
      {...themedProps}
    >
      {children}
    </ThemedView>
  );
}

interface SurfaceProps extends ThemedViewProps {
  elevation?: number;
}

export function ThemedSurface({
  children,
  style,
  elevation = 1,
  ...themedProps
}: SurfaceProps) {
  const { colors } = useTheme();

  const surfaceStyle: ViewStyle = React.useMemo(() => ({
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    margin: 8,
    ...(Platform.OS !== 'web' && {
      elevation,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    }),
  }), [colors, elevation]);

  return (
    <ThemedView
      style={[surfaceStyle, style]}
      {...themedProps}
    >
      {children}
    </ThemedView>
  );
}

interface ContainerProps extends ThemedViewProps {
  safeArea?: boolean;
  scrollable?: boolean;
}

export function ThemedContainer({
  children,
  style,
  safeArea = true,
  scrollable = false,
  ...themedProps
}: ContainerProps) {
  const { colors } = useTheme();

  const containerStyle: ViewStyle = React.useMemo(() => ({
    flex: 1,
    backgroundColor: colors.background,
  }), [colors]);

  const ContainerComponent = scrollable ? ScrollView : View;
  const containerProps = scrollable
    ? { contentContainerStyle: [containerStyle, style] }
    : { style: [containerStyle, style] };

  const Wrapper = safeArea ? SafeAreaView : View;

  return (
    <Wrapper style={{ flex: 1 }}>
      <ContainerComponent {...containerProps} {...themedProps}>
        {children}
      </ContainerComponent>
    </Wrapper>
  );
}

// Export colors for use in styles
export { LightColors, DarkColors };
export type { ThemeColors };