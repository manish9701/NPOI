import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string | number;
  label: string;
  onPress?: () => void;
  urgent?: boolean;
}

export const StatCard: React.FC<Props> = ({
  icon,
  iconColor,
  value,
  label,
  onPress,
  urgent = false,
}) => {
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap
      style={[styles.card, urgent && styles.urgent]}
      onPress={onPress as any}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconColor + '18' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.value, urgent && { color: iconColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Wrap>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  urgent: {
    borderColor: Colors.warningMid,
    backgroundColor: Colors.warningLight,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  value: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  label: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
