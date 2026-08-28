import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DocumentStatus, ApplicationStatus } from '../types';
import { Colors, Typography, Spacing, Radius } from '../theme';

type BadgeVariant = DocumentStatus | ApplicationStatus | 'verified' | 'unverified';

interface Props {
  status: BadgeVariant;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const config: Record<
  BadgeVariant,
  { label: string; bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  active:           { label: 'Active',           bg: Colors.indiaGreenLight, text: Colors.indiaGreen,  icon: 'checkmark-circle' },
  expiring:         { label: 'Expiring',         bg: '#FEF3C7',              text: '#B45309',          icon: 'time-outline' },
  expired:          { label: 'Expired',          bg: Colors.dangerLight,     text: Colors.danger,      icon: 'close-circle-outline' },
  pending:          { label: 'Pending',          bg: Colors.surfaceAlt,      text: Colors.textSecondary,icon: 'ellipse-outline' },
  needs_correction: { label: 'Needs Fix',        bg: '#FEF3C7',              text: '#B45309',          icon: 'alert-circle-outline' },
  draft:            { label: 'Draft',            bg: Colors.surfaceAlt,      text: Colors.textSecondary,icon: 'create-outline' },
  submitted:        { label: 'Submitted',        bg: Colors.infoLight,       text: Colors.info,        icon: 'paper-plane-outline' },
  in_progress:      { label: 'In Progress',      bg: Colors.primaryLight,    text: Colors.primary,     icon: 'sync-outline' },
  completed:        { label: 'Completed',        bg: Colors.indiaGreenLight, text: Colors.indiaGreen,  icon: 'checkmark-circle' },
  rejected:         { label: 'Rejected',         bg: Colors.dangerLight,     text: Colors.danger,      icon: 'close-circle-outline' },
  verified:         { label: 'Verified',         bg: Colors.indiaGreenLight, text: Colors.indiaGreen,  icon: 'shield-checkmark' },
  unverified:       { label: 'Unverified',       bg: Colors.surfaceAlt,      text: Colors.textSecondary,icon: 'shield-outline' },
};

export const StatusBadge: React.FC<Props> = ({ status, size = 'md', showIcon = false }) => {
  const c = config[status] ?? config['pending'];

  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, size === 'sm' && styles.sm]}>
      {showIcon && (
        <Ionicons
          name={c.icon}
          size={size === 'sm' ? 10 : 12}
          color={c.text}
        />
      )}
      <Text style={[styles.text, { color: c.text }, size === 'sm' && styles.smText]}>
        {c.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
  },
  smText: {
    fontSize: 11,
  },
});
