import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getServiceById } from '../../data/mockData';
import { mockUser } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Button, ScreenHeader, RequirementRow } from '../../components';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'GoalConfirmation'>;

export const GoalConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { query, serviceId } = route.params;
  const service = getServiceById(serviceId);

  if (!service) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScreenHeader title="Goal" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Service not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const available = service.requirements.filter((r) => r.available).length;
  const missing = service.requirements.filter((r) => !r.available).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="Confirm Goal" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Intent echo */}
        <View style={styles.intentCard}>
          <Ionicons name="sparkles" size={20} color={Colors.primary} />
          <Text style={styles.intentText}>
            I can help you get a{' '}
            <Text style={styles.intentBold}>{service.title}</Text>.
          </Text>
        </View>

        {/* Location confirmation */}
        <View style={styles.confirmRow}>
          <View style={styles.confirmItem}>
            <Text style={styles.confirmLabel}>Service</Text>
            <Text style={styles.confirmValue}>{service.title}</Text>
          </View>
          <View style={styles.confirmDivider} />
          <View style={styles.confirmItem}>
            <Text style={styles.confirmLabel}>Location</Text>
            <Text style={styles.confirmValue}>{mockUser.state}</Text>
          </View>
        </View>
        <Text style={styles.confirmQuestion}>Is that right?</Text>

        {/* Requirements summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>You'll need</Text>
          {service.requirements.map((req) => (
            <RequirementRow key={req.id} requirement={req} />
          ))}

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.summaryText}>{available} available</Text>
            </View>
            {missing > 0 && (
              <View style={styles.summaryItem}>
                <Ionicons name="ellipse-outline" size={16} color={Colors.textTertiary} />
                <Text style={[styles.summaryText, { color: Colors.textSecondary }]}>
                  {missing} missing
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Physical visit warning */}
        {service.requiresPhysicalVisit && (
          <View style={styles.visitCard}>
            <Ionicons name="location-outline" size={18} color={Colors.warning} />
            <View style={styles.visitBody}>
              <Text style={styles.visitTitle}>In-person visit required</Text>
              <Text style={styles.visitDesc}>{service.visitReason}</Text>
            </View>
          </View>
        )}

        {/* Process steps */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Process</Text>
          {service.steps.map((step, i) => (
            <View key={i} style={styles.processRow}>
              <View style={styles.processNum}>
                <Text style={styles.processNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.processStep}>{step}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Button
          label="Continue"
          onPress={() => navigation.navigate('Requirements', { serviceId })}
          fullWidth
          size="lg"
          style={styles.ctaBtn}
        />
        <Button
          label="That's not what I need"
          onPress={() => navigation.goBack()}
          variant="ghost"
          fullWidth
          style={styles.cancelBtn}
        />

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: Typography.base, color: Colors.textSecondary },

  intentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  intentText: {
    flex: 1,
    fontSize: Typography.md,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  intentBold: {
    fontWeight: Typography.bold,
    color: Colors.primary,
  },

  confirmRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  confirmItem: { flex: 1, gap: Spacing.xs },
  confirmLabel: { fontSize: Typography.xs, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  confirmValue: { fontSize: Typography.base, fontWeight: Typography.semiBold, color: Colors.textPrimary },
  confirmDivider: { width: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  confirmQuestion: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadow.sm,
  },
  cardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  summaryText: { fontSize: Typography.sm, color: Colors.success, fontWeight: Typography.medium },

  visitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warningLight,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  visitBody: { flex: 1 },
  visitTitle: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textPrimary },
  visitDesc: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 2, lineHeight: 18 },

  processRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  processNum: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processNumText: { fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.primary },
  processStep: { fontSize: Typography.base, color: Colors.textPrimary },

  ctaBtn: { marginBottom: Spacing.sm },
  cancelBtn: {},
});
