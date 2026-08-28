/**
 * ApplicationStatusScreen — Detailed vertical timeline redesign
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Spacing, Radius } from '../../theme';
import { getApplicationById } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Button } from '../../components';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ApplicationStatus'>;

const INDIGO = '#3D3BF3';

export const ApplicationStatusScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const app        = getApplicationById(route.params.applicationId);

  if (!app) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#111" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Application Status</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <Ionicons name="layers-outline" size={48} color="#DDD" />
          <Text style={styles.emptyTitle}>Application not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = app.status === 'completed';
  const isRejected  = app.status === 'rejected';
  const isDraft     = app.status === 'draft';

  const statusColor = isCompleted ? Colors.indiaGreen : isRejected ? Colors.danger : isDraft ? Colors.warning : INDIGO;
  const statusLabel = isCompleted ? 'Completed' : isRejected ? 'Rejected' : isDraft ? 'Draft' : 'In Progress';

  const submittedDate = app.submittedDate
    ? new Date(app.submittedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;
  const updatedDate = new Date(app.updatedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Application Status</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={[styles.heroIconBox, { backgroundColor: statusColor + '14' }]}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : isRejected ? 'close-circle' : isDraft ? 'create-outline' : 'sync-outline'}
              size={32} color={statusColor}
            />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroTitle} numberOfLines={2}>{app.service}</Text>
            <View style={[styles.statusPill, { backgroundColor: statusColor + '18' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
            {app.estimatedDays && !isCompleted && !isRejected && (
              <Text style={styles.eta}>⏱ Estimated: {app.estimatedDays}</Text>
            )}
          </View>
        </View>

        {/* Vertical Timeline */}
        {!isDraft && app.steps.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>APPLICATION TIMELINE</Text>
            <View style={styles.timeline}>
              {app.steps.map((step: any, index: number) => {
                const isLast   = index === app.steps.length - 1;
                const isDone   = step.completed;
                const isActive = step.active;
                const dotColor = isDone ? Colors.indiaGreen : isActive ? INDIGO : '#DDD';
                const lineColor= isDone ? Colors.indiaGreen : '#EEE';
                return (
                  <View key={step.id} style={styles.timelineRow}>
                    <View style={styles.timelineGraphic}>
                      <View style={[styles.timelineDot, { backgroundColor: dotColor, borderWidth: isActive ? 3 : 0, borderColor: INDIGO + '40' }]}>
                        {isDone && <Ionicons name="checkmark" size={10} color="#fff" />}
                      </View>
                      {!isLast && <View style={[styles.timelineLine, { backgroundColor: lineColor }]} />}
                    </View>
                    <View style={[styles.timelineContent, { opacity: (isDone || isActive) ? 1 : 0.4 }]}>
                      <Text style={[styles.stepTitle, isActive && styles.stepTitleActive]}>{step.label}</Text>
                      {isActive && (
                        <View style={styles.activeHint}>
                          <Ionicons name="information-circle" size={14} color={INDIGO} />
                          <Text style={styles.activeHintText}>Processing — may take up to 2 working days.</Text>
                        </View>
                      )}
                      {isDone && index === 0 && submittedDate && <Text style={styles.stepDate}>{submittedDate}</Text>}
                      {isDone && index > 0 && <Text style={styles.stepDate}>{updatedDate}</Text>}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Rejection reason */}
        {isRejected && app.rejectionReason && (
          <View style={[styles.alertBox, { backgroundColor: Colors.dangerLight, borderColor: Colors.dangerMid + '40' }]}>
            <Ionicons name="close-circle-outline" size={18} color={Colors.danger} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: Colors.danger }]}>Application rejected</Text>
              <Text style={styles.alertBody}>{app.rejectionReason}</Text>
            </View>
          </View>
        )}

        {/* Details card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DETAILS</Text>
          {[
            { label: 'Application ID', value: app.id.toUpperCase() },
            ...(submittedDate ? [{ label: 'Submitted', value: submittedDate }] : []),
            { label: 'Last updated', value: updatedDate },
            { label: 'Next step', value: isCompleted ? 'Document issued' : app.nextAction },
          ].map((item, i, arr) => (
            <View key={item.label} style={[styles.detailRow, i < arr.length - 1 && styles.detailRowBorder]}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue} numberOfLines={2}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Action hint */}
        {!isCompleted && !isRejected && (
          <View style={[styles.alertBox, {
            backgroundColor: isDraft ? Colors.warningLight : Colors.infoLight,
            borderColor: isDraft ? Colors.warningMid + '40' : Colors.infoMid + '40',
          }]}>
            <Ionicons name={isDraft ? 'alert-circle-outline' : 'information-circle-outline'} size={18}
              color={isDraft ? Colors.warning : Colors.info} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: isDraft ? Colors.warning : Colors.info }]}>
                {isDraft ? 'Action required' : 'Processing'}
              </Text>
              <Text style={styles.alertBody}>
                {isDraft
                  ? 'Your draft is saved. Complete and submit to begin processing.'
                  : 'Your application is being processed. You will be notified on updates.'}
              </Text>
            </View>
          </View>
        )}

        {/* CTAs */}
        <View style={styles.ctaWrap}>
          {isDraft && (
            <Button label="Continue application"
              onPress={() => navigation.navigate('ApplicationFlow', { serviceId: app.serviceId, applicationId: app.id })}
              fullWidth size="lg" />
          )}
          {isCompleted && (
            <Button label="View in Documents"
              onPress={() => navigation.navigate('MainTabs', { screen: 'Documents' } as any)}
              fullWidth size="lg" />
          )}
          {isRejected && (
            <Button label="Start new application"
              onPress={() => navigation.navigate('Requirements', { serviceId: app.serviceId })}
              fullWidth size="lg" />
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const INDIGO_REF = '#3D3BF3';

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F6F6F8' },
  scroll:  { flex: 1 },
  content: { padding: Spacing.base },
  centered:{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { fontSize: 15, color: '#AAA' },
  navBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: Spacing.sm,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F6F6F8', alignItems: 'center', justifyContent: 'center' },
  navTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111', textAlign: 'center' },
  heroCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: '#fff', borderRadius: Radius.xl, padding: Spacing.base,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: '#EBEBEB',
  },
  heroIconBox: { width: 60, height: 60, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  heroInfo:   { flex: 1, gap: 8 },
  heroTitle:  { fontSize: 17, fontWeight: '700', color: '#111', letterSpacing: -0.3 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  statusDot:  { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '600' },
  eta:        { fontSize: 11, color: '#AAA' },
  card: { backgroundColor: '#fff', borderRadius: Radius.xl, padding: Spacing.base, marginBottom: Spacing.md, borderWidth: 1, borderColor: '#EBEBEB' },
  cardLabel: { fontSize: 10, fontWeight: '700', color: '#AAA', letterSpacing: 0.8, marginBottom: Spacing.md },
  // Timeline
  timeline: { paddingTop: Spacing.xs },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start' },
  timelineGraphic: { width: 32, alignItems: 'center' },
  timelineDot: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  timelineLine: { width: 2, flex: 1, minHeight: 32, marginVertical: 3 },
  timelineContent: { flex: 1, paddingBottom: 24, paddingLeft: Spacing.xs },
  stepTitle:       { fontSize: 15, fontWeight: '500', color: '#333', marginBottom: 2 },
  stepTitleActive: { color: INDIGO_REF, fontWeight: '700' },
  stepDesc:        { fontSize: 13, color: '#666', marginBottom: 4 },
  stepDate:        { fontSize: 11, color: '#AAA', marginTop: 2 },
  activeHint: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0F0FF', borderRadius: 8, padding: 8, marginTop: 6 },
  activeHintText: { fontSize: 12, color: INDIGO_REF, fontWeight: '500', flex: 1 },
  // Details
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10 },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  detailLabel: { fontSize: 13, color: '#888' },
  detailValue: { fontSize: 13, fontWeight: '500', color: '#111', maxWidth: '55%', textAlign: 'right' },
  alertBox: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1 },
  alertTitle: { fontSize: 13, fontWeight: '600', marginBottom: 3 },
  alertBody:  { fontSize: 12, color: '#666', lineHeight: 18 },
  ctaWrap:    { marginTop: Spacing.xs },
});
