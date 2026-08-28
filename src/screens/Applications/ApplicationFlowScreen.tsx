import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getServiceById, mockUser } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Button, ScreenHeader, RequirementRow, InfoCard, BottomSheet } from '../../components';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ApplicationFlow'>;

const STEPS = [
  { label: 'Your Info',  icon: 'person-outline' as const },
  { label: 'Documents',  icon: 'folder-outline' as const },
  { label: 'Review',     icon: 'eye-outline' as const    },
  { label: 'Submit',     icon: 'send-outline' as const   },
];

export const ApplicationFlowScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { serviceId, applicationId } = route.params;
  const service = getServiceById(serviceId);

  const [step, setStep]           = useState(1);
  const [consented, setConsented] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [formData, setFormData]   = useState({
    fullName: mockUser.name,
    dob:      '15 Sep 1990',
    phone:    mockUser.phone,
    address:  'Flat 42, Shyam Nagar, Jaipur, Rajasthan 302001',
  });

  if (!service) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScreenHeader title="Application" onBack={() => navigation.goBack()} />
        <View style={styles.centered}><Text style={styles.emptyText}>Service not found</Text></View>
      </SafeAreaView>
    );
  }

  const available  = service.requirements.filter(r => r.available);
  const missing    = service.requirements.filter(r => !r.available);
  const totalSteps = STEPS.length;
  const pct        = ((step - 1) / (totalSteps - 1)) * 100;

  const handleNext = () => {
    if (step === 3 && !consented) { setShowConsent(true); return; }
    if (step < totalSteps) setStep(s => s + 1);
  };
  const handleBack = () => step > 1 ? setStep(s => s - 1) : navigation.goBack();

  const confirmConsent = () => { setConsented(true); setShowConsent(false); setStep(4); };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigation.navigate('ApplicationSuccess', {
        serviceId,
        applicationId: applicationId ?? `app-new-${Date.now()}`,
      });
    }, 1400);
  };

  const FIELD_LABELS: Record<string, string> = {
    fullName: 'Full name',
    dob:      'Date of birth',
    phone:    'Phone number',
    address:  'Current address',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader
        title={service.title}
        subtitle={`Step ${step} of ${totalSteps} — ${STEPS[step - 1].label}`}
        onBack={handleBack}
      />

      {/* ── Step progress ─────────────────────────────────────────────── */}
      <View style={styles.progressWrap}>
        {/* Linear fill bar */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        {/* Step dots */}
        <View style={styles.stepDots}>
          {STEPS.map((s, i) => {
            const done    = i + 1 < step;
            const active  = i + 1 === step;
            return (
              <View key={s.label} style={styles.stepDotWrap}>
                <View style={[
                  styles.stepDot,
                  done   && styles.stepDotDone,
                  active && styles.stepDotActive,
                ]}>
                  {done
                    ? <Ionicons name="checkmark" size={9} color="#fff" />
                    : active
                    ? <Ionicons name={s.icon} size={10} color={Colors.primary} />
                    : <Text style={styles.stepDotNum}>{i + 1}</Text>
                  }
                </View>
                <Text style={[styles.stepDotLabel, (done || active) && { color: Colors.primary, fontWeight: Typography.semiBold }]}>
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ─ Step 1: Information ─ */}
        {step === 1 && (
          <View>
            <Text style={styles.stepHeading}>Your information</Text>
            <Text style={styles.stepDesc}>
              Review and confirm the pre-filled details. All fields are from your profile.
            </Text>
            {(Object.keys(formData) as Array<keyof typeof formData>).map(key => (
              <View key={key} style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{FIELD_LABELS[key]}</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={formData[key]}
                  onChangeText={v => setFormData(prev => ({ ...prev, [key]: v }))}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            ))}
            <InfoCard
              variant="tip"
              title="Why we ask"
              body="This information fills the application form only. No data is submitted to any real government system in this prototype."
              collapsible
            />
          </View>
        )}

        {/* ─ Step 2: Documents ─ */}
        {step === 2 && (
          <View>
            <Text style={styles.stepHeading}>Documents</Text>
            <Text style={styles.stepDesc}>
              NPOI checked your vault against what {service.title} requires.
            </Text>

            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: Colors.indiaGreenLight }]}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.indiaGreen} />
                </View>
                <Text style={styles.cardHeading}>
                  Available ({available.length})
                </Text>
              </View>
              {available.map(req => <RequirementRow key={req.id} requirement={req} />)}
            </View>

            {missing.length > 0 && (
              <View style={[styles.card, styles.cardWarning]}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.cardHeaderIcon, { backgroundColor: Colors.warningLight }]}>
                    <Ionicons name="alert-circle-outline" size={16} color={Colors.warning} />
                  </View>
                  <Text style={[styles.cardHeading, { color: Colors.warning }]}>
                    Missing ({missing.length})
                  </Text>
                </View>
                {missing.map(req => (
                  <View key={req.id}>
                    <RequirementRow requirement={req} />
                    <TouchableOpacity
                      style={styles.getMissingBtn}
                      onPress={() => navigation.navigate('MissingDocument', {
                        documentType: req.label,
                        returnServiceId: serviceId,
                      })}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="add-circle-outline" size={13} color={Colors.primary} />
                      <Text style={styles.getMissingText}>Apply for {req.label}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {missing.length > 0 && (
              <InfoCard
                variant="warning"
                title="Missing documents will delay processing"
                body="You can still continue — NPOI saves your progress and you can attach documents later."
              />
            )}
          </View>
        )}

        {/* ─ Step 3: Review ─ */}
        {step === 3 && (
          <View>
            <Text style={styles.stepHeading}>Review your application</Text>
            <Text style={styles.stepDesc}>
              Check everything before submitting. You can go back to make changes.
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardHeading}>Applicant details</Text>
              {Object.entries(formData).map(([k, v]) => (
                <View key={k} style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>{FIELD_LABELS[k as keyof typeof formData] ?? k}</Text>
                  <Text style={styles.reviewValue}>{v}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeading}>Service summary</Text>
              {[
                { label: 'Service',            value: service.title },
                { label: 'Category',           value: service.category },
                { label: 'Documents attached', value: `${available.length} of ${service.requirements.length}` },
                { label: 'Processing time',    value: service.processingDays },
                { label: 'Fee',                value: service.fees },
              ].map(r => (
                <View key={r.label} style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>{r.label}</Text>
                  <Text style={styles.reviewValue}>{r.value}</Text>
                </View>
              ))}
            </View>

            {service.requiresPhysicalVisit && (
              <InfoCard
                variant="warning"
                title="In-person visit required"
                body={service.visitReason ?? 'A visit to a government office will be needed at a later stage.'}
              />
            )}
          </View>
        )}

        {/* ─ Step 4: Submit ─ */}
        {step === 4 && (
          <View style={styles.submitView}>
            <LinearGradientFallback color={Colors.primary} />
            <View style={styles.submitIconWrap}>
              <Ionicons name="paper-plane" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.submitTitle}>Ready to submit</Text>
            <Text style={styles.submitDesc}>
              Your <Text style={{ fontWeight: Typography.semiBold, color: Colors.textPrimary }}>{service.title}</Text> application is complete.
            </Text>
            <View style={styles.submitChecklist}>
              {[
                { icon: 'checkmark-circle' as const,     text: 'Personal information confirmed',       ok: true  },
                { icon: 'checkmark-circle' as const,     text: `${available.length} document${available.length !== 1 ? 's' : ''} attached`, ok: true },
                { icon: 'checkmark-circle' as const,     text: 'Application reviewed',                 ok: true  },
                { icon: 'checkmark-circle' as const,     text: 'Consent given',                        ok: true  },
                ...(missing.length > 0
                  ? [{ icon: 'alert-circle-outline' as const, text: `${missing.length} missing document${missing.length > 1 ? 's' : ''} — may delay processing`, ok: false }]
                  : []
                ),
              ].map(item => (
                <View key={item.text} style={styles.checkItem}>
                  <Ionicons
                    name={item.icon}
                    size={17}
                    color={item.ok ? Colors.indiaGreen : Colors.warning}
                  />
                  <Text style={[styles.checkText, !item.ok && { color: Colors.warning }]}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Consent bottom sheet ──────────────────────────────────────── */}
        <BottomSheet visible={showConsent} onClose={() => setShowConsent(false)}>
          <Text style={styles.stepHeading}>Consent</Text>
          <Text style={styles.stepDesc}>
            Understand exactly what is being submitted, and to whom.
          </Text>
          {[
            { icon: 'document-outline' as const,    label: 'WHAT',  value: `Your ${service.title} application and attached documents.` },
            { icon: 'business-outline' as const,    label: 'TO',    value: `${service.category} Department, Rajasthan Government.`     },
            { icon: 'information-outline' as const, label: 'WHY',   value: 'To process your application and verify eligibility.'       },
            { icon: 'time-outline' as const,        label: 'WHEN',  value: `Takes ${service.processingDays} after submission.`         },
          ].map(item => (
            <View key={item.label} style={styles.consentRow}>
              <View style={styles.consentIcon}>
                <Ionicons name={item.icon} size={15} color={Colors.primary} />
              </View>
              <View style={styles.consentBody}>
                <Text style={styles.consentLabel}>{item.label}</Text>
                <Text style={styles.consentValue}>{item.value}</Text>
              </View>
            </View>
          ))}
          <InfoCard variant="info" title="Prototype notice" body="No data is submitted to any real government system." />
          <Button
            label="I give my consent"
            onPress={confirmConsent}
            fullWidth size="lg"
            style={{ marginTop: Spacing.md }}
          />
        </BottomSheet>

        {/* ── Navigation buttons ─────────────────────────────────────────── */}
        <View style={styles.navBtns}>
          {step < totalSteps ? (
            <Button
              label="Continue"
              onPress={handleNext}
              fullWidth size="lg"
              icon="arrow-forward"
              iconPosition="right"
            />
          ) : (
            <Button
              label={
                missing.length > 0
                  ? `Add ${missing.length} missing document${missing.length > 1 ? 's' : ''} first`
                  : 'Submit application'
              }
              onPress={handleSubmit}
              fullWidth size="lg"
              loading={submitting}
              disabled={missing.length > 0}
              icon={missing.length === 0 ? 'paper-plane-outline' : undefined}
              iconPosition="right"
            />
          )}
          {step > 1 && (
            <Button
              label="Back"
              onPress={handleBack}
              variant="ghost"
              fullWidth
              style={{ marginTop: Spacing.xs }}
            />
          )}
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Tiny helper to avoid importing LinearGradient just for a decorative element
const LinearGradientFallback = ({ color }: { color: string }) => null;

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.background },
  scroll:  { flex: 1 },
  content: { padding: Spacing.base },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  emptyText: { fontSize: Typography.base, color: Colors.textSecondary },

  // ── Step progress ──────────────────────────────────────────────────────────
  progressWrap: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  progressBg: {
    height: 3,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepDotWrap: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 24, height: 24,
    borderRadius: 12,
    backgroundColor: Colors.borderLight,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: Colors.surface, borderColor: Colors.primary, borderWidth: 2 },
  stepDotDone:   { backgroundColor: Colors.indiaGreen, borderColor: Colors.indiaGreen },
  stepDotNum:    { fontSize: 9, color: Colors.textTertiary, fontWeight: Typography.semiBold },
  stepDotLabel:  { fontSize: 10, color: Colors.textTertiary },

  // ── Step content ───────────────────────────────────────────────────────────
  stepHeading: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.4,
  },
  stepDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },

  // ── Fields ─────────────────────────────────────────────────────────────────
  fieldWrap:  { marginBottom: Spacing.md },
  fieldLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },

  // ── Cards ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    ...Shadow.card,
  },
  cardWarning: { borderColor: Colors.warningMid + '60', backgroundColor: '#FFFDF0' },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  cardHeaderIcon: {
    width: 30, height: 30, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  cardHeading: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    letterSpacing: -0.1,
  },

  getMissingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: Spacing.xs,
    paddingLeft: Spacing.xl + 2,
    marginTop: 2,
  },
  getMissingText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.medium },

  // ── Review rows ────────────────────────────────────────────────────────────
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  reviewLabel: { fontSize: Typography.sm, color: Colors.textSecondary, flex: 1 },
  reviewValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },

  // ── Submit view ────────────────────────────────────────────────────────────
  submitView:     { alignItems: 'center', paddingTop: Spacing.xl },
  submitIconWrap: {
    width: 76, height: 76,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  submitTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.4,
  },
  submitDesc: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  submitChecklist: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    ...Shadow.card,
    marginBottom: Spacing.xl,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  checkText: { flex: 1, fontSize: Typography.sm, color: Colors.textPrimary, lineHeight: 20 },

  // ── Consent ────────────────────────────────────────────────────────────────
  consentRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
  consentIcon: {
    width: 30, height: 30, borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  consentBody:  { flex: 1 },
  consentLabel: {
    fontSize: 9, color: Colors.textTertiary,
    textTransform: 'uppercase', letterSpacing: 0.6,
    fontWeight: Typography.bold, marginBottom: 2,
  },
  consentValue: { fontSize: Typography.sm, color: Colors.textPrimary, lineHeight: 19 },

  // ── Nav buttons ────────────────────────────────────────────────────────────
  navBtns:  { marginTop: Spacing.lg },
});
