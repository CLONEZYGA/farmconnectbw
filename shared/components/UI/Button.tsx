import React from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemedView';
import { ThemeColors } from '../../config/constants';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  full?: boolean;
  activeOpacity?: number;
  testID?: string;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  full = false,
  activeOpacity = 0.7,
  testID,
}: ButtonProps) {
  const { colors, isDark } = useTheme();

  const getVariantStyle = React.useMemo(() => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
          color: '#FFFFFF',
        };
      case 'success':
        return {
          backgroundColor: colors.success,
          borderColor: colors.success,
          color: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
          borderColor: colors.warning,
          color: '#000000',
        };
      case 'error':
        return {
          backgroundColor: colors.error,
          borderColor: colors.error,
          color: '#FFFFFF',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.border,
          color: colors.primary,
        };
    }
  }, [colors, variant]);

  const getSizeStyle = React.useMemo(() => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 12,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 16,
        };
    }
  }, [size]);

  const getTextSizeStyle = React.useMemo(() => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
          fontWeight: '500',
        };
      case 'medium':
        return {
          fontSize: 16,
          fontWeight: '600',
        };
      case 'large':
        return {
          fontSize: 18,
          fontWeight: '600',
        };
    }
  }, [size]);

  const buttonStyle = React.useMemo(() => [
    styles.button,
    getVariantStyle,
    getSizeStyle,
    full && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ], [getVariantStyle, getSizeStyle, full, disabled, style]);

  const textStyle = React.useMemo(() => [
    styles.text,
    getTextSizeStyle,
    disabled && styles.disabledText,
    textStyle,
  ], [getTextSizeStyle, disabled, textStyle]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={getVariantStyle.color}
          />
        </View>
      );
    }

    const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
    const textColor = disabled ? '#999999' : getVariantStyle.color;

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && (
          <Ionicons
            name={icon}
            size={iconSize}
            color={textColor}
            style={styles.icon}
          />
        )}
        <Text style={[textStyle, { color: textColor }]}>
          {children}
        </Text>
        {icon && iconPosition === 'right' && (
          <Ionicons
            name={icon}
            size={iconSize}
            color={textColor}
            style={styles.iconRight}
          />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  disabledText: {
    color: '#999999',
  },
  icon: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loadingContainer: {
    paddingVertical: 2,
  },
});

export default Button;