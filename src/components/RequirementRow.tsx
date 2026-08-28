import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceRequirement } from '../types';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface Props {
  requirement: ServiceRequirement;
}

export const RequirementRow: React.FC<Props> = ({ requirement }) => {
  return (
    <View style={styles.row}>
      <View style={[styles.icon, requirement.available ? styles.iconAvail : styles.iconMissing]}>
        <Ionicons
          name={requirement.available ? 'checkmark' : 'ellipse-outline'}
          size={14}
          color={requirement.available ? Colors.success : Colors.textTertiary}
        />
      </View>
      <Text style={[styles.label, !requirement.available && styles.labelMissing]}>
        {requirement.label}
      </Text>
      {requirement.available && (
        <Text style={styles.availText}>Available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAvail: {
    backgroundColor: Colors.successLight,
  },
  iconMissing: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  labelMissing: {
    color: Colors.textSecondary,
  },
  availText: {
    fontSize: Typography.xs,
    color: Colors.success,
    fontWeight: Typography.medium,
  },
});
