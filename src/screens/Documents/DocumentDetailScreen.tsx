import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Typography, Spacing, Radius, Shadow, docCategoryColor } from '../../theme';
import { getDocumentById, daysUntilExpiry } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Button, InfoCard } from '../../components';
import { docIcon } from '../../components/DocumentCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'DocumentDetail'>;

const INDIGO = '#3D3BF3';

// ─── Document-specific actions ────────────────────────────────────────────────
const DOC_ACTIONS: Record<string, {
  id: string;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  destructive?: boolean;
}[]> = {
  aadhaar: [
    { id: 'lock_bio',     label: 'Lock Biometrics',          desc: 'Prevent misuse via UIDAI portal',   icon: 'lock-closed-outline',   color: '#DC2626', destructive: true },
    { id: 'unlock_bio',   label: 'Unlock Biometrics',        desc: 'Re-enable biometric authentication', icon: 'lock-open-outline',     color: '#1A7A45' },
    { id: 'masked',       label: 'Download Masked Aadhaar',  desc: 'Hides first 8 digits for safety',    icon: 'download-outline',      color: INDIGO    },
    { id: 'auth_history', label: 'Authentication History',   desc: 'View recent Aadhaar auth attempts',  icon: 'time-outline',          color: '#0369A1' },
    { id: 'update',       label: 'Update Details',           desc: 'Correct name, DOB or address',       icon: 'create-outline',        color: '#C97A08' },
  ],
  pan: [
    { id: 'link_aadhaar', label: 'Link Aadhaar',             desc: 'Mandatory — link before deadline',   icon: 'link-outline',          color: '#DC2626', destructive: true },
    { id: 'reprint',      label: 'Reprint PAN Card',         desc: 'Order a physical reprint via NSDL',  icon: 'card-outline',          color: INDIGO    },
    { id: 'e_pan',        label: 'Download e-PAN',           desc: 'Get digital PAN PDF instantly',      icon: 'download-outline',      color: '#1A7A45' },
    { id: 'change_name',  label: 'Correction / Change',      desc: 'Update name or DOB on PAN',          icon: 'create-outline',        color: '#C97A08' },
  ],
  driving_licence: [
    { id: 'renew_dl',     label: 'Renew Driving Licence',    desc: 'Valid renewal before expiry date',   icon: 'refresh-outline',       color: INDIGO    },
    { id: 'update_addr',  label: 'Update Address',           desc: 'Change address on licence',          icon: 'home-outline',          color: '#0369A1' },
    { id: 'add_class',    label: 'Add Vehicle Class',        desc: 'Add LMV, MCWG, HMV etc.',            icon: 'car-sport-outline',     color: '#7C3AED' },
    { id: 'duplicate',    label: 'Apply for Duplicate DL',   desc: 'Lost or damaged licence',            icon: 'copy-outline',          color: '#C97A08' },
    { id: 'digilocker',   label: 'Share via DigiLocker',     desc: 'Digital sharing for traffic checks', icon: 'cloud-upload-outline',  color: '#1A7A45' },
  ],
  passport: [
    { id: 'reissue',      label: 'Apply for Re-issue',       desc: 'Expired or damaged passport',        icon: 'refresh-outline',       color: INDIGO    },
    { id: 'pcc',          label: 'Police Clearance Cert.',   desc: 'Required for visa applications',     icon: 'shield-outline',        color: '#0369A1' },
    { id: 'tatkaal',      label: 'Tatkaal Application',      desc: 'Urgent processing within 3 days',    icon: 'flash-outline',         color: '#C97A08' },
    { id: 'track_app',    label: 'Track Application',        desc: 'Check Passport Seva status',         icon: 'search-outline',        color: '#1A7A45' },
  ],
  voter_id: [
    { id: 'check_status', label: 'Check Voter Status',       desc: 'Verify on NVSP portal',              icon: 'checkbox-outline',      color: '#1A7A45' },
    { id: 'update_info',  label: 'Update Voter Info',        desc: 'Correct name, address or photo',     icon: 'create-outline',        color: INDIGO    },
    { id: 'e_epic',       label: 'Download e-EPIC',          desc: 'Digital Voter ID (PDF)',             icon: 'download-outline',      color: '#0369A1' },
  ],
  default: [
    { id: 'share',        label: 'Share Document',           desc: 'Share with a service or authority',  icon: 'share-social-outline',  color: '#1A7A45' },
    { id: 'download',     label: 'Download',                 desc: 'Save a copy to your device',         icon: 'download-outline',      color: INDIGO    },
  ],
};

const RELATED: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }[]> = {
  aadhaar: [{ label: 'Open bank account', icon: 'wallet-outline' }, { label: 'Apply for PAN', icon: 'card-outline' }],
  passport: [{ label: 'Get visa', icon: 'airplane-outline' }, { label: 'Open NRI account', icon: 'globe-outline' }],
  pan: [{ label: 'File income tax', icon: 'receipt-outline' }, { label: 'Open demat account', icon: 'trending-up-outline' }],
  driving_licence: [{ label: 'Vehicle registration', icon: 'car-outline' }, { label: 'Renew insurance', icon: 'shield-outline' }],
  voter_id: [{ label: 'Check voter status', icon: 'checkbox-outline' }, { label: 'Update voter info', icon: 'create-outline' }],
};

function maskNumber(num: string): string {
  const clean = num.replace(/\s/g, '');
  if (clean.length <= 4) return clean;
  const last4 = clean.slice(-4);
  const masked = '•'.repeat(Math.min(clean.length - 4, 8));
  return `${masked}  ${last4}`;
}

export const DocumentDetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const doc = getDocumentById(route.params.documentId);

  if (!doc) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <View style={styles.emptyIcon}>
            <Ionicons name="document-outline" size={32} color={Colors.textTertiary} />
          </View>
          <Text style={styles.emptyTitle}>Document not found</Text>
          <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
            <Text style={styles.backLinkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const accentColor = docCategoryColor[doc.type] ?? Colors.primary;
  const icon = docIcon[doc.type] ?? 'document-outline';
  const days = doc.expiryDate ? daysUntilExpiry(doc.expiryDate) : null;
  const isExpired = days !== null && days <= 0;
  const isExpiring = doc.status === 'expiring' || isExpired;
  const isCorrection = doc.status === 'needs_correction';

  const issueDate = new Date(doc.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const expiryDate = doc.expiryDate
    ? new Date(doc.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  const relatedServices = RELATED[doc.type] ?? [];

  const handleAction = (id: string) => {
    if (id === 'share') { navigation.navigate('ShareDocument', { documentId: doc.id }); return; }
    if (id === 'renew') { navigation.navigate('RenewalFlow', { documentId: doc.id }); return; }
    if (id === 'fix') { navigation.navigate('CorrectionFlow', { documentId: doc.id }); return; }
    if (id === 'use') { navigation.navigate('AskScreen'); return; }
    Alert.alert('Prototype', 'This action is simulated in the prototype.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* ── Nav bar ──────────────────────────────────────────────────────── */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>{doc.title}</Text>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => handleAction('share')}
          accessibilityRole="button"
          accessibilityLabel="Share document"
        >
          <Ionicons name="share-outline" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Physical ID card ─────────────────────────────────────────── */}
        <LinearGradient
          colors={[accentColor, accentColor + 'CC', accentColor + '88']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.idCard}
        >
          {/* Watermark circles */}
          <View style={[styles.wmCircle, styles.wm1]} />
          <View style={[styles.wmCircle, styles.wm2]} />

          {/* Card header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="person-outline" size={24} color="#fff" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardIssuer}>{doc.issuer.toUpperCase()}</Text>
              <Text style={styles.cardTitle}>{doc.title}</Text>
            </View>
            <View style={[styles.cardBadge, { backgroundColor: doc.verified ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)' }]}>
              <Ionicons name={doc.verified ? 'shield-checkmark' : 'shield-outline'} size={11} color="#fff" />
              <Text style={styles.cardBadgeText}>{doc.verified ? 'Verified' : 'Unverified'}</Text>
            </View>
          </View>

          {/* Document number */}
          <Text style={styles.cardNumber}>{maskNumber(doc.documentNumber)}</Text>

          {/* Footer row */}
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardFieldLabel}>ISSUED</Text>
              <Text style={styles.cardFieldValue}>{issueDate}</Text>
            </View>
            <View>
              <Text style={[styles.cardFieldLabel, { textAlign: 'center' }]}>VALID THRU</Text>
              <Text style={[styles.cardFieldValue, (isExpiring || isExpired) && { color: '#FFD700' }]}>
                {expiryDate ?? 'LIFETIME'}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardFieldLabel}>STATUS</Text>
              <Text style={[
                styles.cardFieldValue,
                isExpired && { color: '#FF8080' },
                isExpiring && !isExpired && { color: '#FFD700' },
                isCorrection && { color: '#FFB38A' },
              ]}>
                {isExpired ? 'EXPIRED' : isExpiring ? `${days}d LEFT` : isCorrection ? 'FIX REQ.' : 'ACTIVE'}
              </Text>
            </View>
          </View>

          {/* Tricolor bottom strip */}
          <View style={styles.cardTricolor}>
            <View style={[styles.triSeg, { backgroundColor: Colors.tricolorSaffron }]} />
            <View style={[styles.triSeg, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />
            <View style={[styles.triSeg, { backgroundColor: Colors.tricolorGreen }]} />
          </View>
        </LinearGradient>

        {/* ── Expiry / Correction alerts ────────────────────────────── */}
        {isExpiring && days !== null && (
          <View style={styles.expiryAlert}>
            <View style={styles.expiryAlertLeft}>
              <View style={styles.expiryAlertIcon}>
                <Ionicons name={isExpired ? 'close-circle' : 'time'} size={22}
                  color={isExpired ? '#EF4444' : '#F59E0B'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.expiryAlertTitle, { color: isExpired ? '#EF4444' : '#B45309' }]}>
                  {isExpired ? 'Document expired' : `Expires in ${days} day${days !== 1 ? 's' : ''}`}
                </Text>
                <Text style={styles.expiryAlertBody}>
                  {isExpired
                    ? 'A late fee may apply. Renew as soon as possible.'
                    : days <= 7
                      ? 'Act now — penalties start the day after expiry.'
                      : 'Renew before the expiry date to avoid disruption.'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.expiryAlertBtn, { backgroundColor: isExpired ? '#EF4444' : '#F59E0B' }]}
              onPress={() => navigation.navigate('RenewalFlow', { documentId: doc.id })}
              activeOpacity={0.85}
            >
              <Text style={styles.expiryAlertBtnText}>Renew now</Text>
            </TouchableOpacity>
          </View>
        )}
        {isCorrection && (
          <View style={[styles.expiryAlert, { backgroundColor: '#FFFBEB' }]}>
            <View style={styles.expiryAlertLeft}>
              <View style={styles.expiryAlertIcon}>
                <Ionicons name="alert-circle" size={22} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.expiryAlertTitle, { color: '#92400E' }]}>Information mismatch</Text>
                <Text style={styles.expiryAlertBody}>Details don't match your profile. Fix before it causes issues.</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.expiryAlertBtn, { backgroundColor: '#F59E0B' }]}
              onPress={() => navigation.navigate('CorrectionFlow', { documentId: doc.id })}
              activeOpacity={0.85}
            >
              <Text style={styles.expiryAlertBtnText}>Fix now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Document details (ABOVE actions) ───────────────────────── */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>DOCUMENT DETAILS</Text>
          <View style={styles.metaCard}>
            {[
              { label: 'Document number', value: doc.documentNumber },
              { label: 'Issued by', value: doc.issuer },
              { label: 'Issued on', value: issueDate },
              expiryDate
                ? { label: 'Expires on', value: expiryDate }
                : { label: 'Validity', value: 'Lifetime — no expiry' },
              {
                label: 'Status',
                value: isExpired ? 'Expired'
                  : isExpiring ? `Expiring in ${days} days`
                    : isCorrection ? 'Needs correction'
                      : 'Active',
              },
            ].map((item, i, arr) => (
              <View
                key={item.label}
                style={[styles.metaRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}
              >
                <Text style={styles.metaLabel}>{item.label}</Text>
                <Text style={[
                  styles.metaValue,
                  isExpiring && item.label === 'Status' && { color: Colors.urgentHigh },
                  isExpired && item.label === 'Status' && { color: Colors.danger },
                  isCorrection && item.label === 'Status' && { color: Colors.warning },
                ]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Document-Specific Actions ──────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>ACTIONS</Text>
          <View style={styles.actionsCard}>
            {(DOC_ACTIONS[doc.type] ?? DOC_ACTIONS.default).map((action, i, arr) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionRow, i < arr.length - 1 && styles.actionRowBorder]}
                onPress={() => handleAction(action.id)}
                activeOpacity={0.75}
              >
                <View style={[styles.actionIconBox, { backgroundColor: action.color + '12' }]}>
                  <Ionicons name={action.icon} size={20} color={action.color} />
                </View>
                <View style={styles.actionBody}>
                  <Text style={[styles.actionLabel, action.destructive && { color: action.color }]}>
                    {action.label}
                  </Text>
                  <Text style={styles.actionDesc}>{action.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#CCC" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Document history ──────────────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>DOCUMENT HISTORY</Text>
          <View style={styles.timeline}>
            <TItem
              icon="document-text-outline"
              color={Colors.indiaGreen}
              title="Document Issued"
              date={issueDate}
              done
            />
            <TItem
              icon="shield-checkmark-outline"
              color={doc.verified ? Colors.indiaGreen : Colors.textTertiary}
              title={doc.verified ? 'Verified on DigiLocker' : 'Verification pending'}
              date={doc.verified ? issueDate : 'Pending'}
              done={doc.verified}
            />
            {expiryDate && (
              <TItem
                icon={isExpired ? 'close-circle-outline' : 'time-outline'}
                color={isExpired ? Colors.urgentCritical : isExpiring ? Colors.urgentMedium : Colors.textTertiary}
                title={isExpired ? 'Document Expired' : isExpiring ? `Expires ${expiryDate}` : `Valid until ${expiryDate}`}
                date={expiryDate}
                done={false}
                isLast
              />
            )}
          </View>
        </View>

        {/* ── Related services ──────────────────────────────────────────── */}
        {relatedServices.length > 0 && (
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>USE THIS DOCUMENT FOR</Text>
            <View style={styles.relatedList}>
              {relatedServices.map(s => (
                <TouchableOpacity
                  key={s.label}
                  style={styles.relatedItem}
                  onPress={() => navigation.navigate('AskScreen')}
                  activeOpacity={0.78}
                >
                  <View style={[styles.relatedIcon, { backgroundColor: accentColor + '12' }]}>
                    <Ionicons name={s.icon} size={17} color={accentColor} />
                  </View>
                  <Text style={styles.relatedLabel}>{s.label}</Text>
                  <Ionicons name="arrow-forward" size={14} color={Colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Primary CTA ───────────────────────────────────────────────── */}
        {isExpiring && (
          <Button
            label={isExpired ? 'Renew now' : `Renew ${doc.title}`}
            onPress={() => navigation.navigate('RenewalFlow', { documentId: doc.id })}
            fullWidth size="lg"
            style={{ marginBottom: Spacing.sm }}
          />
        )}
        {isCorrection && (
          <Button
            label="Start correction"
            variant="secondary"
            onPress={() => navigation.navigate('CorrectionFlow', { documentId: doc.id })}
            fullWidth size="lg"
            style={{ marginBottom: Spacing.sm }}
          />
        )}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Timeline item ────────────────────────────────────────────────────────────
interface TItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  date: string;
  done: boolean;
  isLast?: boolean;
}
const TItem: React.FC<TItemProps> = ({ icon, color, title, date, done, isLast }) => (
  <View style={tl.row}>
    <View style={tl.left}>
      <View style={[tl.dot, { backgroundColor: color + '18', borderColor: color }]}>
        <Ionicons name={icon} size={13} color={color} />
      </View>
      {!isLast && <View style={[tl.line, { backgroundColor: color + '25' }]} />}
    </View>
    <View style={tl.body}>
      <Text style={tl.title}>{title}</Text>
      <Text style={[tl.date, done && { color: Colors.indiaGreen }]}>{date}</Text>
    </View>
  </View>
);

const tl = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  left: { alignItems: 'center', width: 30 },
  dot: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5,
  },
  line: { flex: 1, width: 1.5, marginVertical: 3 },
  body: { flex: 1, paddingTop: 4 },
  title: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textPrimary },
  date: { fontSize: Typography.xs, color: Colors.textTertiary, marginTop: 2 },
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  emptyIcon: {
    width: 72, height: 72, borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: Typography.base, color: Colors.textSecondary, fontWeight: Typography.medium },
  backLink: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.full, backgroundColor: Colors.primaryLight },
  backLinkText: { color: Colors.primary, fontWeight: Typography.semiBold },

  // Nav bar
  navBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, gap: 16, backgroundColor: '#F6F6F8' },
  navBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EBEBEB' },
  navTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111' },

  // ID Card
  idCard: {
    borderRadius: 24, padding: 20, marginBottom: 24, minHeight: 200,
    overflow: 'hidden', position: 'relative',
  },
  wmCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  wm1: { width: 140, height: 140, right: -30, bottom: -30 },
  wm2: { width: 90, height: 90, right: -5, bottom: -5 },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  cardIconWrap: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  cardHeaderText: { flex: 1 },
  cardIssuer: { fontSize: 9, fontWeight: Typography.bold, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.8 },
  cardTitle: { fontSize: Typography.sm, fontWeight: Typography.bold, color: '#fff', marginTop: 2 },
  cardBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 4,
    flexShrink: 0,
  },
  cardBadgeText: { fontSize: 9, fontWeight: Typography.bold, color: '#fff' },

  cardNumber: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: '#fff',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
    marginBottom: Spacing.xl,
  },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  cardFieldLabel: { fontSize: 8, color: 'rgba(255,255,255,0.55)', fontWeight: Typography.bold, letterSpacing: 0.8 },
  cardFieldValue: { fontSize: Typography.sm, fontWeight: Typography.bold, color: '#fff', marginTop: 2 },

  cardTricolor: { flexDirection: 'row', height: 3, borderRadius: Radius.full, overflow: 'hidden' },
  triSeg: { flex: 1 },

  // Sections
  sectionWrap: { marginBottom: Spacing.base },
  sectionTitle: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },

  // Doc-specific action list styles
  actionsCard: {
    backgroundColor: '#fff', borderRadius: Radius.xl,
    borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: 14, gap: Spacing.md,
  },
  actionRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  actionIconBox: {
    width: 40, height: 40, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  actionBody:  { flex: 1, gap: 2 },
  actionLabel: { fontSize: 14, fontWeight: '500', color: '#111' },
  actionDesc:  { fontSize: 12, color: '#888' },

  // Meta
  metaCard: {
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden', marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  metaLabel: { fontSize: Typography.sm, color: Colors.textSecondary },
  metaValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    maxWidth: '55%',
    textAlign: 'right',
  },

  // Timeline
  timeline: {},

  // Related
  relatedList: { gap: 8, marginBottom: 24 },
  relatedItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff',
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EBEBEB',
  },
  relatedIcon: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  relatedLabel: { flex: 1, fontSize: Typography.sm, fontWeight: Typography.medium, color: Colors.textPrimary },

  // Premium expiry / correction alert
  expiryAlert: {
    backgroundColor: '#FFF8F0',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    gap: Spacing.md,
  },
  expiryAlertLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  expiryAlertIcon: {
    width: 42, height: 42, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  expiryAlertTitle: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  expiryAlertBody:  { fontSize: 12.5, color: '#78350F', lineHeight: 18 },
  expiryAlertBtn:   {
    borderRadius: Radius.lg,
    paddingVertical: 11,
    alignItems: 'center',
  },
  expiryAlertBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
