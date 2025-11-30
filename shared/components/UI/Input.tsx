import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemedView';
import { ThemeColors } from '../../config/constants';
import { ThemedText } from './ThemedText';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle | ViewStyle[];
  inputStyle?: TextStyle | TextStyle[];
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  helperText?: string;
}

export function Input({
  label,
  error,
  icon,
  iconPosition = 'left',
  variant = 'outlined',
  size = 'medium',
  containerStyle,
  inputStyle,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  onToggleSecure,
  helperText,
  ...textInputProps
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const getVariantStyle = React.useMemo(() => {
    switch (variant) {
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
          backgroundColor: colors.surface,
        };
      case 'filled':
        return {
          borderWidth: 0,
          backgroundColor: error ? '#FFEBEE' : colors.card,
        };
      case 'underlined':
        return {
          borderWidth: 0,
          borderBottomWidth: 2,
          borderBottomColor: error ? colors.error : isFocused ? colors.primary : colors.border,
          backgroundColor: 'transparent',
        };
    }
  }, [colors, error, isFocused, variant]);

  const getSizeStyle = React.useMemo(() => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 6,
          fontSize: 14,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          fontSize: 16,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderRadius: 12,
          fontSize: 18,
        };
    }
  }, [size]);

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  const containerStyles = React.useMemo(() => [
    styles.container,
    getVariantStyle,
    getSizeStyle,
    containerStyle,
  ], [getVariantStyle, getSizeStyle, containerStyle]);

  const inputStyles = React.useMemo(() => [
    styles.input,
    {
      color: colors.text,
      paddingLeft: icon && iconPosition === 'left' ? iconSize + 12 : 16,
      paddingRight: (icon && iconPosition === 'right' ? iconSize + 12 : 16) + (rightIcon ? iconSize + 8 : 0),
    },
    inputStyle,
  ], [colors, icon, iconPosition, rightIcon, iconSize, inputStyle]);

  const renderLeftIcon = () => {
    if (!icon) return null;

    return (
      <Ionicons
        name={icon}
        size={iconSize}
        color={colors.textSecondary}
        style={styles.leftIcon}
      />
    );
  };

  const renderRightContent = () => {
    if (secureTextEntry && onToggleSecure) {
      return (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={onToggleSecure}
          activeOpacity={0.7}
        >
          <Ionicons
            name={textInputProps.secureTextEntry ? 'eye-off' : 'eye'}
            size={iconSize}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={onRightIconPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={rightIcon}
            size={iconSize}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={styles.inputContainer}>
      {label && (
        <ThemedText
          style={styles.label}
          variant="caption"
          lightColor="textSecondary"
        >
          {label}
        </ThemedText>
      )}
      <View style={containerStyles}>
        {renderLeftIcon()}
        <TextInput
          style={inputStyles}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {renderRightContent()}
      </View>
      {error && (
        <ThemedText
          style={styles.errorText}
          variant="caption"
          lightColor="error"
        >
          {error}
        </ThemedText>
      )}
      {helperText && !error && (
        <ThemedText
          style={styles.helperText}
          variant="caption"
          lightColor="textSecondary"
        >
          {helperText}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  leftIcon: {
    marginLeft: 4,
  },
  rightIcon: {
    marginRight: 4,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;