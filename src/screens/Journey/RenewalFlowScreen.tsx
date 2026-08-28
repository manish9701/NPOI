import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getDocumentById, daysUntilExpiry } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Button, ScreenHeader, RequirementRow } from '../../components';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'RenewalFlow'>;

type RenewalStep = 'start' | 'review' | 'consent' | 'submitted';

// Mock renewal requirements per doc type
const renewalRequirements: Record<string, Array<{ id: string; label: string; available: boolean }>> = {
  driving_licence: [
    { id: 'r1', label: 'Existing driving licence', available: true },
    { id: 'r2', label: 'Identity proof', available: true },
    { id: 'r3', label: 'Medical certificate', available: false },
  ],
  address_proof: [
    { id: 'r4', label: 'Identity proof', available: true },
    { id: 'r5', label: 'Proof of residence', available: false },
  ],
};

export const RenewalFlowScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { documentId } = route.params;
  const doc = getDocumentById(documentId);
  const [step, setStep] = useState<RenewalStep>('start');
  const [submitting, setSubmitting] = useState(false);

  if (!doc) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScreenHeader title="Renew" onBack={() => navigation.goBack()} />
        <View style={styles.centered}><Text>Document not found</Text></View>
      </SafeAreaView>
    );
  }

  const days = doc.expiryDate ? daysUntilExpiry(doc.expiryDate) : null;
  const reqs = renewalRequirements[doc.type] ?? [
    { id: 'r-gen', label: 'Existing document', available: true },
    { id: 'r-gen2', label: 'Identity proof', available: true },
  ];
  const available = reqs.filter((r) => r.available);
  const missing = reqs.filter((r) => !r.available);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep('submitted');
    }, 1500);
  };

  if (step === 'submitted') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScreenHeader title="Renewal submitted" />
        <ScrollView contentContainerStyle={styles.successContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>{doc.title} renewal submitted</Text>
          <Text style={styles.successDesc}>
            Your renewal application has been submitted. The new document will appear in your Documents once issued.
          </Text>
          <View style={styles.successNote}>
            <Ionicons name="folder-outline" size={18} color={Colors.success} />
            <Text style={styles.successNoteText}>Added to Documents once issued.</Text>
          </View>
          <Button
            label="Track application"
            onPress={() => navigation.navigate('ApplicationStatus', { applicationId: 'app-001' })}
            fullWidth
            size="lg"
            style={styles.btn}
          />
          <Button
            label="Back to Home"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' } as any)}
            variant="ghost"
            fullWidth
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader
        title={`Renew ${doc.title}`}
        onBack={() => {
          if (step === 'start') navigation.goBack();
          else if (step === 'review') setStep('start');
          else setStep('review');
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Start ── */}
        {step === 'start' && (
          <View>
            {/* Expiry status */}
            <View style={[styles.expiryCard, days !== null && days <= 0 ? styles.expiryCardDanger : styles.expiryCardWarn]}>
              <Ionicons
                name="warning-outline"
                size={24}
                color={days !== null && days <= 0 ? Colors.danger : Colors.warning}
              />
              <View style={styles.expiryBody}>
                <Text style={styles.expiryTitle}>{doc.title}</Text>
                <Text style={styles.expiryDays}>
                  {days !== null
                    ? days <= 0
                      ? 'Expired'
                      : `Expires in ${days} day${days === 1 ? '' : 's'}`
                    : 'Check expiry'}
                </Text>
              </View>
            </View>

            {/* Documents check */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>NPOI checked your documents</Text>
              <Text style={styles.cardSub}>Already have</Text>
              {available.map((req) => (
                <RequirementRow key={req.id} requirement={req} />
              ))}
              {missing.length > 0 && (
                <>
                  <Text style={[styles.cardSub, { color: Colors.warning, marginTop: Spacing.sm }]}>
                    Still need
                  </Text>
                  {missing.map((req) => (
                    <RequirementRow key={req.id} requirement={req} />
                  ))}
                </>
              )}
            </View>

            {missing.length > 0 && (
              <View style={styles.missingBanner}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.warning} />
                <Text style={styles.missingBannerText}>
                  You're missing {missing.length} document{missing.length !== 1 ? 's' : ''}. You can continue and provide them later.
                </Text>
              </View>
            )}

            <Button label="Continue to review" onPress={() => setStep('review')} fullWidth size="lg" />
          </View>
        )}

        {/* ── Review ── */}
        {step === 'review' && (
          <View>
            <Text style={styles.stepTitle}>Review</Text>
            <Text style={styles.stepDesc}>Confirm the details before submitting your renewal.</Text>

            <View style={styles.card}>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Document</Text>
                <Text style={styles.reviewValue}>{doc.title}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Document number</Text>
                <Text style={styles.reviewValue}>{doc.documentNumber}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Current expiry</Text>
                <Text style={[styles.reviewValue, { color: Colors.warning }]}>{doc.expiryDate}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Documents attached</Text>
                <Text style={styles.reviewValue}>{available.length}</Text>
              </View>
            </View>

            <Button label="Continue to consent" onPress={() => setStep('consent')} fullWidth size="lg" />
            <Button label="Back" onPress={() => setStep('start')} variant="ghost" fullWidth style={styles.backBtn} />
          </View>
        )}

        {/* ── Consent ── */}
        {step === 'consent' && (
          <View>
            <Text style={styles.stepTitle}>Consent</Text>
            <Text style={styles.stepDesc}>Review what is being submitted.</Text>

            {[
              { label: 'What', value: `Renewal of your ${doc.title}.` },
              { label: 'Who', value: 'Transport Authority / Relevant Government Department, Rajasthan.' },
              { label: 'Why', value: 'To renew and extend the validity of your document.' },
            ].map((item) => (
              <View key={item.label} style={styles.consentItem}>
                <Text style={styles.consentLabel}>{item.label}</Text>
                <Text style={styles.consentValue}>{item.value}</Text>
              </View>
            ))}

            <View style={styles.protoNote}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.protoNoteText}>
                This is a prototype. No real data is submitted.
              </Text>
            </View>

            <Button
              label="Submit renewal"
              onPress={handleSubmit}
              fullWidth
              size="lg"
              loading={submitting}
              style={styles.btn}
            />
            <Button label="Back" onPress={() => setStep('review')} variant="ghost" fullWidth style={styles.backBtn} />
          </View>
        )}

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

  expiryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderLeftWidth: 3,
  },
  expiryCardWarn: {
    backgroundColor: Colors.warningLight,
    borderLeftColor: Colors.warning,
  },
  expiryCardDanger: {
    backgroundColor: Colors.dangerLight,
    borderLeftColor: Colors.danger,
  },
  expiryBody: { flex: 1 },
  expiryTitle: { fontSize: Typography.base, fontWeight: Typography.semiBold, color: Colors.textPrimary },
  expiryDays: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 2 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadow.sm,
  },
  cardTitle: { fontSize: Typography.base, fontWeight: Typography.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  cardSub: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium, marginBottom: Spacing.xs },

  missingBanner: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
  },
  missingBannerText: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 18 },

  stepTitle: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: Spacing.xs },
  stepDesc: { fontSize: Typography.base, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.base },

  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  reviewLabel: { fontSize: Typography.sm, color: Colors.textSecondary },
  reviewValue: { fontSize: Typography.sm, fontWeight: Typography.medium, color: Colors.textPrimary },

  consentItem: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  consentLabel: { fontSize: Typography.xs, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.xs },
  consentValue: { fontSize: Typography.base, color: Colors.textPrimary, lineHeight: 22 },

  protoNote: {
    flexDirection: 'row',
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.base,
  },
  protoNoteText: { flex: 1, fontSize: Typography.xs, color: Colors.textSecondary },

  btn: { marginBottom: Spacing.sm },
  backBtn: {},

  successContent: { padding: Spacing.base, alignItems: 'center', paddingTop: Spacing.xxl },
  successIcon: { marginBottom: Spacing.lg },
  successTitle: { fontSize: Typography.xxl, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  successDesc: { fontSize: Typography.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  successNote: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.successLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
    width: '100%',
  },
  successNoteText: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary },
});
