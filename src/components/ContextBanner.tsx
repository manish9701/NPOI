import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface Props {
  label: string;
  onDismiss: () => void;
}

export const ContextBanner: React.FC<Props> = ({ label, onDismiss }) => (
  <View style={styles.container}>
    <Ionicons name="eye-outline" size={14} color={Colors.primary} />
    <Text style={styles.text}>{label}</Text>
    <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Ionicons name="close" size={16} color={Colors.primary} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  text: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
});
