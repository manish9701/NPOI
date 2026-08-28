import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label?: string;
  };
  tinted?: boolean; // white text on dark bg — used inside gradient screens
}

export const ScreenHeader: React.FC<Props> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  tinted = false,
}) => {
  const textColor   = tinted ? Colors.textInverse : Colors.textPrimary;
  const subColor    = tinted ? 'rgba(255,255,255,0.65)' : Colors.textSecondary;
  const iconBg      = tinted ? 'rgba(255,255,255,0.15)' : Colors.surfaceAlt;
  const iconColor   = tinted ? Colors.textInverse : Colors.textPrimary;
  const borderColor = tinted ? 'transparent' : Colors.borderLight;

  return (
    <View style={[styles.container, { borderBottomColor: borderColor, backgroundColor: tinted ? 'transparent' : Colors.surface }]}>
      {/* Back / placeholder */}
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={[styles.iconBtn, { backgroundColor: iconBg }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Center title */}
      <View style={styles.center}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: subColor }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right action / placeholder */}
      {rightAction ? (
        <TouchableOpacity
          onPress={rightAction.onPress}
          style={[styles.iconBtn, { backgroundColor: iconBg }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={rightAction.label ?? 'Action'}
        >
          <Ionicons name={rightAction.icon} size={20} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 38,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: Typography.xs,
    marginTop: 1,
    fontWeight: Typography.medium,
  },
});
