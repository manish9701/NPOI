import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  body: string;
  variant?: 'info' | 'warning' | 'success' | 'tip';
  collapsible?: boolean;
}

const variantMap = {
  info:    { bg: Colors.infoLight,    border: Colors.info,    icon: 'information-circle-outline' as const, color: Colors.info    },
  warning: { bg: Colors.warningLight, border: Colors.warning, icon: 'warning-outline' as const,            color: Colors.warning },
  success: { bg: Colors.successLight, border: Colors.success, icon: 'checkmark-circle-outline' as const,   color: Colors.success },
  tip:     { bg: Colors.primaryLight, border: Colors.primary, icon: 'bulb-outline' as const,               color: Colors.primary },
};

export const InfoCard: React.FC<Props> = ({
  icon,
  iconColor,
  title,
  body,
  variant = 'info',
  collapsible = false,
}) => {
  const [open, setOpen] = useState(true);
  const v = variantMap[variant];
  const finalIcon = icon ?? v.icon;
  const finalColor = iconColor ?? v.color;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };

  return (
    <View style={[styles.card, { backgroundColor: v.bg, borderLeftColor: v.border }]}>
      <View style={styles.header}>
        <Ionicons name={finalIcon} size={18} color={finalColor} />
        <Text style={[styles.title, { color: finalColor }]}>{title}</Text>
        {collapsible && (
          <TouchableOpacity onPress={toggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={open ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={finalColor}
            />
          </TouchableOpacity>
        )}
      </View>
      {open && <Text style={styles.body}>{body}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderLeftWidth: 4,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
  },
  body: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginLeft: 26,
  },
});
