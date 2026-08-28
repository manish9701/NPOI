import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow, serviceCategoryColor } from '../../theme';

const INDIGO   = '#3D3BF3';
const INDIGO_L = '#EDEDFD';
import {
  mockServices,
  getDraftApplications,
  getActiveApplications,
  getCompletedApplications,
} from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { ApplicationCard, EmptyState } from '../../components';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Tab = 'active' | 'drafts' | 'completed';

const PROCESS_STEPS = [
  { icon: 'search-outline' as const,          label: 'Find service',    color: Colors.primary        },
  { icon: 'document-text-outline' as const,   label: 'Fill form',       color: Colors.accentTravel ?? Colors.info },
  { icon: 'checkmark-circle-outline' as const, label: 'Verify docs',    color: Colors.indiaGreen     },
  { icon: 'paper-plane-outline' as const,     label: 'Submit & track',  color: Colors.saffron        },
];

export const ApplicationsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<Tab>('active');

  const activeCount    = getActiveApplications().length;
  const draftCount     = getDraftApplications().length;
  const completedCount = getCompletedApplications().length;

  const shown =
    tab === 'active'    ? getActiveApplications()    :
    tab === 'drafts'    ? getDraftApplications()     :
                          getCompletedApplications();

  const handleCardPress = (appId: string, status: string, serviceId: string) => {
    if (status === 'draft') {
      navigation.navigate('ApplicationFlow', { serviceId, applicationId: appId });
    } else {
      navigation.navigate('ApplicationStatus', { applicationId: appId });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applications</Text>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.navigate('AskScreen')}
          accessibilityRole="button"
        >
          <Ionicons name="add" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Segmented tab bar ───────────────────────────────────────────── */}
      <View style={styles.tabBarWrap}>
        <View style={styles.tabBar}>
          {([
            { key: 'active',    label: 'Active',    count: activeCount,    icon: 'layers-outline' as const },
            { key: 'drafts',    label: 'Drafts',    count: draftCount,     icon: 'create-outline' as const },
            { key: 'completed', label: 'Completed', count: completedCount, icon: 'checkmark-circle-outline' as const },
          ] as { key: Tab; label: string; count: number; icon: keyof typeof Ionicons.glyphMap }[]).map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabItem, tab === t.key && styles.tabItemActive]}
              onPress={() => setTab(t.key)}
              activeOpacity={0.8}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t.key }}
            >
              <Ionicons
                name={t.icon}
                size={13}
                color={tab === t.key ? Colors.textInverse : Colors.textTertiary}
              />
              <Text style={[styles.tabItemText, tab === t.key && styles.tabItemTextActive]}>
                {t.label}
              </Text>
              {t.count > 0 && (
                <View style={[styles.tabBadge, tab === t.key && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, tab === t.key && styles.tabBadgeTextActive]}>
                    {t.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {shown.length === 0 ? (
          <>
            <EmptyState
              icon={
                tab === 'drafts'    ? 'create-outline' :
                tab === 'completed' ? 'checkmark-circle-outline' :
                                      'layers-outline'
              }
              title={
                tab === 'active'    ? 'No active applications' :
                tab === 'drafts'    ? 'No saved drafts' :
                                      'No completed applications'
              }
              message={
                tab === 'active' ? 'Start an application and it will appear here once submitted.' :
                tab === 'drafts' ? 'Save an application draft and you can resume it any time.' :
                                   'Completed applications and issued documents will show up here.'
              }
            />

            {/* How it works — only on active/drafts empty state */}
            {tab !== 'completed' && (
              <View style={styles.howItWorksCard}>
                <Text style={styles.howTitle}>How it works</Text>
                <Text style={styles.howSubtitle}>Apply for any government document in 4 steps</Text>
                <View style={styles.howSteps}>
                  {PROCESS_STEPS.map((step, i) => (
                    <View key={step.label} style={styles.howStep}>
                      <View style={[styles.howStepIcon, { backgroundColor: step.color + '14' }]}>
                        <Ionicons name={step.icon} size={18} color={step.color} />
                      </View>
                      <Text style={styles.howStepNum}>{i + 1}</Text>
                      <Text style={styles.howStepLabel}>{step.label}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.startFirstBtn}
                  onPress={() => navigation.navigate('AskScreen')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="sparkles" size={16} color={Colors.textInverse} />
                  <Text style={styles.startFirstBtnText}>Start your first application</Text>
                  <Ionicons name="arrow-forward" size={16} color={Colors.textInverse} />
                </TouchableOpacity>
              </View>
            )}

            {/* Popular services */}
            {tab !== 'completed' && (
              <View style={styles.popularSection}>
                <Text style={styles.popularTitle}>POPULAR SERVICES</Text>
                <View style={styles.popularList}>
                  {mockServices.map(svc => {
                    const color = serviceCategoryColor[svc.category] ?? Colors.primary;
                    return (
                      <TouchableOpacity
                        key={svc.id}
                        style={styles.popularCard}
                        onPress={() => navigation.navigate('Requirements', { serviceId: svc.id })}
                        activeOpacity={0.78}
                      >
                        <View style={[styles.popularIcon, { backgroundColor: color + '12' }]}>
                          <Ionicons name="document-text-outline" size={18} color={color} />
                        </View>
                        <View style={styles.popularCardBody}>
                          <Text style={styles.popularCardTitle}>{svc.title}</Text>
                          <View style={styles.popularCardMeta}>
                            <View style={[styles.catBadge, { backgroundColor: color + '14' }]}>
                              <Text style={[styles.catBadgeText, { color }]}>{svc.category}</Text>
                            </View>
                            <Text style={styles.popularCardFee}>{svc.fees.split('(')[0].trim()}</Text>
                          </View>
                        </View>
                        <Ionicons name="chevron-forward" size={15} color={Colors.textTertiary} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </>
        ) : (
          <>
            {shown.map(app => (
              <ApplicationCard
                key={app.id}
                application={app}
                onPress={() => handleCardPress(app.id, app.status, app.serviceId)}
              />
            ))}

            <TouchableOpacity
              style={styles.newAppCta}
              onPress={() => navigation.navigate('AskScreen')}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
              <Text style={styles.newAppCtaText}>Start a new application</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: Spacing.xxxl + 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

// Pull in Colors directly
const { accentTravel: _accentTravel } = Colors;

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#fff' },
  scroll:  { flex: 1 },
  content: { padding: Spacing.base },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.black,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  startBtn: {
    width: 38, height: 38,
    borderRadius: Radius.full,
    backgroundColor: INDIGO,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },

  // Tab bar
  tabBarWrap: {
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: 3,
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: Radius.sm,
  },
  tabItemActive:     { backgroundColor: INDIGO },
  tabItemText:       { fontSize: 11, color: Colors.textTertiary, fontWeight: Typography.semiBold },
  tabItemTextActive: { color: '#fff' },
  tabBadge: {
    minWidth: 16, height: 16, borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeActive:     { backgroundColor: 'rgba(255,255,255,0.30)' },
  tabBadgeText:       { fontSize: 9, color: Colors.textSecondary, fontWeight: Typography.bold },
  tabBadgeTextActive: { color: '#fff' },

  // Empty state / how it works
  howItWorksCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    ...Shadow.card,
  },
  howTitle:    { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary, letterSpacing: -0.3 },
  howSubtitle: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.xl },
  howSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  howStep: { alignItems: 'center', gap: 6, flex: 1 },
  howStepIcon: {
    width: 48, height: 48,
    borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  howStepNum: {
    width: 18, height: 18,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: Typography.black,
    color: '#fff',
    lineHeight: 18,
    overflow: 'hidden',
  },
  howStepLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', fontWeight: Typography.medium },
  startFirstBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    ...Shadow.sm,
  },
  startFirstBtnText: { fontSize: Typography.base, fontWeight: Typography.semiBold, color: '#fff' },

  // Popular
  popularSection: { marginTop: Spacing.xl },
  popularTitle: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  popularList: { gap: Spacing.xs },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    ...Shadow.xs,
  },
  popularIcon:     { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  popularCardBody: { flex: 1, gap: 4 },
  popularCardTitle: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textPrimary, letterSpacing: -0.1 },
  popularCardMeta:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  popularCardFee:   { fontSize: 11, color: Colors.textTertiary },
  catBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  catBadgeText: { fontSize: 10, fontWeight: Typography.semiBold },

  // New app CTA
  newAppCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.ashokaBlueMid + '25',
  },
  newAppCtaText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.semiBold },
});
