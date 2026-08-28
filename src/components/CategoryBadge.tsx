import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, docCategoryColor, docTypeLabel } from '../theme';

interface Props {
  docType: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<Props> = ({ docType, size = 'md' }) => {
  const color = docCategoryColor[docType] ?? Colors.primary;
  const label = docTypeLabel[docType] ?? 'Other';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '15',
          borderColor: color + '30',
        },
        size === 'sm' && styles.sm,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }, size === 'sm' && styles.smText]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  text: {
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
  },
  smText: {
    fontSize: 10,
  },
});
