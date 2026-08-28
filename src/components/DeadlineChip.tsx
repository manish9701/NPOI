import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, urgencyColor, urgencyLabel } from '../theme';

interface Props {
  daysLeft: number;
  compact?: boolean;
}

export const DeadlineChip: React.FC<Props> = ({ daysLeft, compact = false }) => {
  const color = urgencyColor(daysLeft);
  const label = urgencyLabel(daysLeft);
  const icon: keyof typeof Ionicons.glyphMap =
    daysLeft <= 0 ? 'alert-circle' : daysLeft <= 7 ? 'warning' : 'time-outline';

  return (
    <View style={[styles.chip, { backgroundColor: color + '18', borderColor: color + '40' }, compact && styles.compact]}>
      <Ionicons name={icon} size={compact ? 11 : 13} color={color} />
      <Text style={[styles.label, { color }, compact && styles.compactLabel]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
  },
  label: {
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
  },
  compactLabel: {
    fontSize: 10,
  },
});
