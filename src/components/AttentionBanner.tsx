import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface Props {
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
  variant?: 'warning' | 'info' | 'danger';
}

const variantMap = {
  warning: {
    bg: Colors.warningLight,
    border: Colors.warning,
    icon: 'warning-outline' as const,
    iconColor: Colors.warning,
    actionColor: Colors.warning,
  },
  info: {
    bg: Colors.primaryLight,
    border: Colors.primary,
    icon: 'information-circle-outline' as const,
    iconColor: Colors.primary,
    actionColor: Colors.primary,
  },
  danger: {
    bg: Colors.dangerLight,
    border: Colors.danger,
    icon: 'alert-circle-outline' as const,
    iconColor: Colors.danger,
    actionColor: Colors.danger,
  },
};

export const AttentionBanner: React.FC<Props> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  variant = 'warning',
}) => {
  const v = variantMap[variant];
  return (
    <View style={[styles.container, { backgroundColor: v.bg, borderLeftColor: v.border }]}>
      <Ionicons name={v.icon} size={20} color={v.iconColor} style={styles.icon} />
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity onPress={onAction} style={styles.action}>
        <Text style={[styles.actionText, { color: v.actionColor }]}>{actionLabel}</Text>
        <Ionicons name="arrow-forward" size={14} color={v.actionColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: Spacing.sm,
  },
  actionText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
  },
});
