import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Application } from '../types';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { StatusBadge } from './StatusBadge';

interface Props {
  application: Application;
  onPress: () => void;
}

const INDIGO = '#3D3BF3';

const statusMeta: Record<string, {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}> = {
  draft:       { icon: 'create-outline',       color: '#C97A08', bg: '#FFF7ED' },
  submitted:   { icon: 'paper-plane-outline',  color: '#0369A1', bg: '#E0F2FE' },
  in_progress: { icon: 'sync-outline',         color: INDIGO,    bg: '#EDEDFD' },
  completed:   { icon: 'checkmark-circle',     color: '#1A7A45', bg: '#DCFCE7' },
  rejected:    { icon: 'close-circle-outline', color: '#DC2626', bg: '#FEE2E2' },
};

export const ApplicationCard: React.FC<Props> = ({ application, onPress }) => {
  const meta = statusMeta[application.status] ?? statusMeta.in_progress;
  const isCompleted = application.status === 'completed';
  const isDraft = application.status === 'draft';
  const isRejected = application.status === 'rejected';
  const pct = isCompleted
    ? 100
    : Math.round(((application.progress - 1) / Math.max(application.totalSteps - 1, 1)) * 100);

  const ctaLabel = isDraft ? 'Continue draft' : isCompleted ? 'View document' : isRejected ? 'View details' : 'Track status';
  const ctaIcon: keyof typeof Ionicons.glyphMap = isDraft ? 'arrow-forward' : isCompleted ? 'document-text-outline' : isRejected ? 'information-circle-outline' : 'chevron-forward';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.78}
      accessibilityRole="button"
    >
      {/* Top accent bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: meta.color }]} />
      </View>

      <View style={styles.body}>
        {/* Header: Icon + Title + Meta */}
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.icon} size={18} color={meta.color} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>{application.service}</Text>
            <View style={styles.idRow}>
              <Text style={styles.appId}>ID: {application.id.toUpperCase()}</Text>
              {application.estimatedDays && !isCompleted && !isRejected && (
                <Text style={styles.eta}> • {application.estimatedDays}</Text>
              )}
            </View>
          </View>
          <StatusBadge status={application.status} size="sm" />
        </View>

        {/* Progress steps row */}
        {!isCompleted && !isDraft && !isRejected && application.steps?.length > 0 && (
          <View style={styles.stepsWrap}>
            <View style={styles.stepsRow}>
              {application.steps.map((step, i) => (
                <React.Fragment key={step.id}>
                  <View style={[
                    styles.stepDot,
                    step.completed && { backgroundColor: '#1A7A45', borderColor: '#1A7A45' },
                    step.active && { borderColor: INDIGO, borderWidth: 2 },
                  ]}>
                    {step.completed && <Ionicons name="checkmark" size={8} color="#fff" />}
                  </View>
                  {i < application.steps.length - 1 && (
                    <View style={[styles.stepLine, step.completed && { backgroundColor: '#1A7A45' }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.nextAction} numberOfLines={1}>
            {isCompleted ? 'Document is ready in your vault' : isRejected ? 'Application was not approved' : application.nextAction}
          </Text>
          <View style={styles.ctaRow}>
            <Text style={[styles.ctaText, { color: meta.color }]}>{ctaLabel}</Text>
            <Ionicons name={ctaIcon} size={13} color={meta.color} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
  },
  progressBarBg: { height: 3, backgroundColor: '#F0F0F0' },
  progressBarFill: { height: '100%' },
  body: { padding: Spacing.base, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconWrap: {
    width: 42, height: 42, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  headerText: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: '600', color: '#111', letterSpacing: -0.2 },
  idRow: { flexDirection: 'row', alignItems: 'center' },
  appId: { fontSize: 11, color: '#888', fontWeight: '500' },
  eta: { fontSize: 11, color: '#888' },
  
  stepsWrap: { backgroundColor: '#F6F6F8', borderRadius: Radius.lg, padding: Spacing.sm },
  stepsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  stepDot: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#DDD',
    alignItems: 'center', justifyContent: 'center',
  },
  stepLine: { flex: 1, height: 2, backgroundColor: '#DDD', marginHorizontal: 2 },

  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: '#F5F5F5',
  },
  nextAction: { flex: 1, fontSize: 12, color: '#666', marginRight: Spacing.md },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 },
  ctaText: { fontSize: 12, fontWeight: '600' },
});
