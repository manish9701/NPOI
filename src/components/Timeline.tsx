import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApplicationStep } from '../types';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface Props {
  steps: ApplicationStep[];
}

export const Timeline: React.FC<Props> = ({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <View key={step.id} style={styles.stepRow}>
            {/* Connector line */}
            <View style={styles.connectorCol}>
              <View
                style={[
                  styles.dot,
                  step.completed && styles.dotCompleted,
                  step.active && styles.dotActive,
                ]}
              >
                {step.completed && (
                  <Ionicons name="checkmark" size={12} color={Colors.textInverse} />
                )}
                {step.active && !step.completed && (
                  <View style={styles.activePulse} />
                )}
              </View>
              {!isLast && (
                <View style={[styles.line, step.completed && styles.lineCompleted]} />
              )}
            </View>

            {/* Label */}
            <View style={styles.labelWrap}>
              <Text
                style={[
                  styles.label,
                  step.completed && styles.labelCompleted,
                  step.active && styles.labelActive,
                  !step.completed && !step.active && styles.labelPending,
                ]}
              >
                {step.label}
              </Text>
              {step.active && (
                <Text style={styles.currentTag}>Current</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 44,
  },
  connectorCol: {
    alignItems: 'center',
    width: 28,
    marginRight: Spacing.md,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  dotCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  dotActive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  activePulse: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 20,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  lineCompleted: {
    backgroundColor: Colors.success,
  },
  labelWrap: {
    flex: 1,
    paddingVertical: Spacing.xs,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  labelCompleted: {
    color: Colors.success,
    fontWeight: Typography.medium,
  },
  labelActive: {
    color: Colors.textPrimary,
    fontWeight: Typography.semiBold,
  },
  labelPending: {
    color: Colors.textTertiary,
  },
  currentTag: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.medium,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
});
