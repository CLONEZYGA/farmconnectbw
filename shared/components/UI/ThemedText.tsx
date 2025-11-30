import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from './ThemedView';
import { ThemeColors } from '../../config/constants';

interface ThemedTextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  lightColor?: keyof ThemeColors;
  darkColor?: keyof ThemeColors;
  variant?: 'header' | 'title' | 'subtitle' | 'body' | 'caption' | 'error';
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  onPress?: () => void;
  testID?: string;
}

export function ThemedText({
  children,
  style,
  lightColor,
  darkColor,
  variant = 'body',
  numberOfLines,
  ellipsizeMode,
  selectable = true,
  onPress,
  testID,
}: ThemedTextProps) {
  const { colors, isDark } = useTheme();

  const themedStyle = React.useMemo(() => {
    const baseStyle: TextStyle = {};

    // Color handling
    if (lightColor && darkColor) {
      baseStyle.color = isDark ? colors[darkColor] : colors[lightColor];
    } else if (lightColor) {
      baseStyle.color = colors[lightColor];
    } else {
      baseStyle.color = colors.text;
    }

    // Variant styles
    switch (variant) {
      case 'header':
        baseStyle.fontSize = 32;
        baseStyle.fontWeight = '700';
        baseStyle.lineHeight = 40;
        break;
      case 'title':
        baseStyle.fontSize = 24;
        baseStyle.fontWeight = '600';
        baseStyle.lineHeight = 32;
        break;
      case 'subtitle':
        baseStyle.fontSize = 18;
        baseStyle.fontWeight = '500';
        baseStyle.lineHeight = 24;
        break;
      case 'body':
        baseStyle.fontSize = 16;
        baseStyle.fontWeight = '400';
        baseStyle.lineHeight = 22;
        break;
      case 'caption':
        baseStyle.fontSize = 14;
        baseStyle.fontWeight = '400';
        baseStyle.lineHeight = 18;
        break;
      case 'error':
        baseStyle.fontSize = 14;
        baseStyle.fontWeight = '500';
        baseStyle.lineHeight = 18;
        baseStyle.color = colors.error;
        break;
    }

    return baseStyle;
  }, [colors, isDark, variant, lightColor, darkColor]);

  const TextComponent = onPress ? Text : Text;

  return (
    <Text
      style={[
        themedStyle,
        styles.default,
        Array.isArray(style) ? style : [style],
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      selectable={selectable}
      onPress={onPress}
      testID={testID}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    color: '#333333',
    fontFamily: 'System',
  },
});

export default ThemedText;