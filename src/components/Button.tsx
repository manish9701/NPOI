import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'saffron';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
  iconPosition = 'left',
}) => {
  const isDisabled = disabled || loading;
  const scaleAnim  = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (isDisabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const iconSize  = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;
  const iconColor = variant === 'primary' || variant === 'saffron'
    ? Colors.textInverse
    : variant === 'danger'
    ? Colors.danger
    : Colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={1}
      style={fullWidth ? { width: '100%' } : undefined}
    >
      <Animated.View
        style={[
          styles.base,
          styles[variant],
          size === 'sm' ? styles.size_sm : size === 'lg' ? styles.size_lg : styles.size_md,
          fullWidth && { width: '100%' },
          isDisabled && styles.disabled,
          style,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' || variant === 'saffron' ? Colors.textInverse : Colors.primary}
            size="small"
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons name={icon} size={iconSize} color={iconColor} />
            )}
            <Text
              style={[
                styles.text,
                variant === 'primary' ? styles.text_primary
                  : variant === 'secondary' ? styles.text_secondary
                  : variant === 'danger' ? styles.text_danger
                  : variant === 'saffron' ? styles.text_saffron
                  : styles.text_ghost,
                size === 'sm' ? styles.textSize_sm : size === 'lg' ? styles.textSize_lg : styles.textSize_md,
                textStyle,
              ]}
            >
              {label}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons name={icon} size={iconSize} color={iconColor} />
            )}
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.md,
  },
  disabled: {
    opacity: 0.45,
  },

  // ── Variants ──────────────────────────────────────────────────────────────
  primary: {
    backgroundColor: Colors.primary,
    ...Shadow.sm,
  },
  secondary: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.ashokaBlueMid + '30',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: Colors.dangerMid + '50',
  },
  saffron: {
    backgroundColor: Colors.saffron,
    ...Shadow.saffron,
  },

  // ── Sizes ─────────────────────────────────────────────────────────────────
  size_sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    minHeight: 34,
    borderRadius: Radius.sm,
  },
  size_md: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    minHeight: 44,
  },
  size_lg: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md + 2,
    minHeight: 52,
    borderRadius: Radius.lg,
  },

  // ── Text base ─────────────────────────────────────────────────────────────
  text: {
    fontWeight: Typography.semiBold,
    letterSpacing: -0.1,
  },
  text_primary:   { color: Colors.textInverse },
  text_secondary: { color: Colors.primary },
  text_ghost:     { color: Colors.primary },
  text_danger:    { color: Colors.danger },
  text_saffron:   { color: Colors.textInverse },

  // ── Text sizes ────────────────────────────────────────────────────────────
  textSize_sm:   { fontSize: Typography.sm },
  textSize_md:   { fontSize: Typography.base },
  textSize_lg:   { fontSize: Typography.md },
});
