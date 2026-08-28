import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

interface Props {
  progress: number;   // 0–1
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export const ProgressRing: React.FC<Props> = ({
  progress,
  size = 64,
  strokeWidth = 6,
  color = Colors.primary,
  label,
  sublabel,
}) => {
  const pct = Math.min(Math.max(progress, 0), 1);
  const filled = Math.round(pct * 100);
  const radius = (size - strokeWidth) / 2;
  const segments = 24;
  const filledCount = Math.round(pct * segments);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* SVG-free ring using border segments approximation via View rotation */}
      <View style={[styles.track, {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: Colors.shimmerBase,
      }]} />
      <View style={[styles.fill, {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderTopColor: pct > 0 ? color : 'transparent',
        borderRightColor: pct > 0.25 ? color : 'transparent',
        borderBottomColor: pct > 0.5 ? color : 'transparent',
        borderLeftColor: pct > 0.75 ? color : 'transparent',
        transform: [{ rotate: '-90deg' }],
      }]} />
      <View style={styles.center}>
        {label && <Text style={[styles.label, { color }]}>{label}</Text>}
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
  },
  fill: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    lineHeight: 16,
  },
  sublabel: {
    fontSize: 9,
    color: Colors.textTertiary,
    lineHeight: 12,
  },
});
