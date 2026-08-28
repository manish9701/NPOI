/**
 * HomeScreen — profile design language:
 * - #F6F6F8 background, white cards, no shadows
 * - borders: borderWidth:1, borderColor:'#EBEBEB'
 * - topBar: big bold 28px title or greeting + 44px circular icon buttons
 * - sections: uppercase 10px label + white rounded card
 * - INDIGO = #3D3BF3 accent only
 * - Proper emoji avatar
 * - Full-page swipeable document viewer (not bottom sheet)
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal,
  FlatList, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { Spacing, Radius, Colors } from '../../theme';
import { mockUser, mockDocuments, daysUntilExpiry } from '../../data/mockData';
import { UserDocument, RootStackParamList } from '../../types';
import { useNotifications } from '../../hooks/useNotifications';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const INDIGO = '#3D3BF3';
const { width: SCREEN_W } = Dimensions.get('window');

const DOC_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  driving_licence:       'car-outline',
  aadhaar:               'finger-print',
  pan:                   'card-outline',
  voter_id:              'id-card-outline',
  passport:              'earth-outline',
  income_certificate:    'document-text-outline',
  address_proof:         'home-outline',
  residence_certificate: 'home-outline',
  birth_certificate:     'people-outline',
  pension:               'wallet-outline',
  school_id:             'school-outline',
  medical:               'medkit-outline',
  vaccination:           'bandage-outline',
};

const DOC_GRAD: Record<string, [string, string]> = {
  aadhaar:          ['#EA580C', '#B45309'],
  pan:              ['#1A7A45', '#0F5C33'],
  driving_licence:  ['#0369A1', '#024E80'],
  voter_id:         [INDIGO, '#2B29C1'],
  passport:         ['#7C3AED', '#5B21B6'],
  medical:          ['#0891B2', '#0670A0'],
  vaccination:      ['#BE185D', '#9D1046'],
};

const SUGGESTED = [
  '10th Board Certificate', '12th Board Certificate',
  'Vehicle registration', 'Caste Certificate', 'Birth Certificate',
];

function docStatus(doc: UserDocument): { icon: keyof typeof Ionicons.glyphMap; color: string } {
  if (doc.status === 'expired')          return { icon: 'close-circle',    color: '#EF4444' };
  if (doc.status === 'needs_correction') return { icon: 'alert-circle',    color: '#F59E0B' };
  if (doc.status === 'expiring')         return { icon: 'time',            color: '#F59E0B' };
  if (doc.verified)                      return { icon: 'checkmark-circle', color: INDIGO   };
  return                                        { icon: 'ellipse-outline',  color: '#9CA3AF' };
}

// ─── Full-page swipeable document viewer ─────────────────────────────────────
const DocViewerModal: React.FC<{
  visible: boolean;
  startIndex: number;
  docs: UserDocument[];
  onClose: () => void;
  onOpenFull: (id: string) => void;
}> = ({ visible, startIndex, docs, onClose, onOpenFull }) => {
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  React.useEffect(() => {
    if (visible && flatRef.current) {
      setTimeout(() => flatRef.current?.scrollToIndex({ index: startIndex, animated: false }), 50);
      setCurrentIndex(startIndex);
    }
  }, [visible, startIndex]);

  const renderDoc = ({ item, index }: { item: UserDocument; index: number }) => {
    const icon = DOC_ICON[item.type] ?? 'document-outline';
    const [g1, g2] = DOC_GRAD[item.type] ?? [INDIGO, '#2B29C1'];
    const { icon: sIcon, color: sColor } = docStatus(item);
    const days = item.expiryDate ? daysUntilExpiry(item.expiryDate) : null;
    const masked = item.documentNumber.replace(/^(.*)(.{4})$/, (_, a, b) =>
      a.replace(/[^\s-]/g, '•') + b
    );

    return (
      <View style={{ width: SCREEN_W, paddingHorizontal: 24 }}>
        {/* Document card */}
        <LinearGradient colors={[g1, g2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={vm.card}>
          {/* Decorative circles */}
          <View style={vm.deco1} /><View style={vm.deco2} />

          <View style={vm.cardTop}>
            <View style={vm.cardIconBox}>
              <Ionicons name={icon} size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={vm.cardTitle}>{item.title}</Text>
              <Text style={vm.cardIssuer} numberOfLines={1}>{item.issuer}</Text>
            </View>
            <View style={vm.verifiedBadge}>
              <Ionicons name={item.verified ? 'shield-checkmark' : 'shield-outline'} size={11} color="#fff" />
              <Text style={vm.verifiedText}>{item.verified ? 'Verified' : 'Unverified'}</Text>
            </View>
          </View>

          <Text style={vm.docNumber}>{masked}</Text>

          <View style={vm.cardFooter}>
            {item.issueDate && (
              <View>
                <Text style={vm.fieldLabel}>ISSUED</Text>
                <Text style={vm.fieldValue}>
                  {new Date(item.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            )}
            {days !== null ? (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={vm.fieldLabel}>VALID THRU</Text>
                <Text style={[vm.fieldValue, days <= 30 && { color: '#FFD700' }]}>
                  {days <= 0 ? 'EXPIRED' : `${days}d left`}
                </Text>
              </View>
            ) : (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={vm.fieldLabel}>VALIDITY</Text>
                <Text style={vm.fieldValue}>Lifetime</Text>
              </View>
            )}
          </View>

          {/* Tricolor strip */}
          <View style={vm.tricolor}>
            <View style={[vm.tri, { backgroundColor: '#FF9933' }]} />
            <View style={[vm.tri, { backgroundColor: 'rgba(255,255,255,0.6)' }]} />
            <View style={[vm.tri, { backgroundColor: '#138808' }]} />
          </View>
        </LinearGradient>

        {/* Status row */}
        <View style={vm.statusRow}>
          <Ionicons name={sIcon} size={18} color={sColor} />
          <Text style={[vm.statusText, { color: sColor }]}>
            {item.status === 'expired' ? 'Expired'
              : item.status === 'expiring' ? `Expires in ${days} days`
              : item.status === 'needs_correction' ? 'Needs correction'
              : item.verified ? 'Verified & Active' : 'Active'}
          </Text>
        </View>

        {/* Doc details */}
        <View style={vm.detailsCard}>
          {[
            { label: 'Document number', value: item.documentNumber },
            { label: 'Issued by', value: item.issuer },
          ].map((r, i, arr) => (
            <View key={r.label} style={[vm.detailRow, i < arr.length - 1 && vm.detailBorder]}>
              <Text style={vm.detailLabel}>{r.label}</Text>
              <Text style={vm.detailValue} numberOfLines={1}>{r.value}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={vm.openBtn}
          onPress={() => { onClose(); onOpenFull(item.id); }}
          activeOpacity={0.85}
        >
          <Text style={vm.openBtnText}>Open full details</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <SafeAreaView style={vm.safe}>
        {/* Header */}
        <View style={vm.header}>
          <TouchableOpacity onPress={onClose} style={vm.closeBtn}>
            <Ionicons name="close" size={22} color="#111" />
          </TouchableOpacity>
          <Text style={vm.headerTitle}>
            {currentIndex + 1} / {docs.length}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Swipeable doc list */}
        <FlatList
          ref={flatRef}
          data={docs}
          keyExtractor={d => d.id}
          renderItem={renderDoc}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: SCREEN_W, offset: SCREEN_W * index, index })}
          onMomentumScrollEnd={e => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
            setCurrentIndex(idx);
          }}
          contentContainerStyle={{ paddingTop: 12 }}
        />

        {/* Dot indicators */}
        <View style={[vm.dotsRow, { paddingBottom: insets.bottom + 16 }]}>
          {docs.map((_, i) => (
            <View key={i} style={[vm.dot, i === currentIndex && vm.dotActive]} />
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const vm = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F6F6F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EBEBEB', backgroundColor: '#fff' },
  closeBtn:    { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F6F6F8', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EBEBEB' },
  headerTitle: { fontSize: 15, fontWeight: '600', color: '#888' },

  card:  { borderRadius: 22, padding: 20, overflow: 'hidden', position: 'relative', minHeight: 200, marginBottom: 16 },
  deco1: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.07)', right: -30, top: -30 },
  deco2: { position: 'absolute', width: 80,  height: 80,  borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.07)', right: 20, top: 20 },
  cardTop:   { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  cardIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardTitle:  { fontSize: 16, fontWeight: '700', color: '#fff' },
  cardIssuer: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 5 },
  verifiedText:  { fontSize: 10, color: '#fff', fontWeight: '600' },
  docNumber: { fontSize: 22, fontWeight: '700', color: '#fff', letterSpacing: 5, fontVariant: ['tabular-nums'], marginBottom: 18 },
  cardFooter:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  fieldLabel:  { fontSize: 9, color: 'rgba(255,255,255,0.55)', fontWeight: '700', letterSpacing: 1 },
  fieldValue:  { fontSize: 13, fontWeight: '700', color: '#fff', marginTop: 3 },
  tricolor:    { flexDirection: 'row', height: 3, borderRadius: 3, overflow: 'hidden' },
  tri:         { flex: 1 },

  statusRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EBEBEB', marginBottom: 12 },
  statusText: { fontSize: 14, fontWeight: '600' },

  detailsCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden', marginBottom: 16 },
  detailRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  detailBorder:{ borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  detailLabel: { fontSize: 13, color: '#888' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111', maxWidth: '55%', textAlign: 'right' },

  openBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: INDIGO, borderRadius: 999, paddingVertical: 15 },
  openBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  dotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingTop: 16 },
  dot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
  dotActive: { width: 18, backgroundColor: INDIGO },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { unreadCount } = useNotifications();
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerStart,   setViewerStart]   = useState(0);

  const docs      = mockDocuments;
  // Use distinct doc types for the featured cards
  const aadhaarDoc = docs.find(d => d.type === 'aadhaar');
  const covidDoc   = docs.find(d => d.type === 'vaccination' || d.type === 'medical');
  const dlDoc      = docs.find(d => d.type === 'driving_licence');
  const voterDoc   = docs.find(d => d.type === 'voter_id');
  const panDoc     = docs.find(d => d.type === 'pan');
  const casteDoc   = docs.find(d => d.type === 'caste_certificate');

  // We want to show all documents in the viewer, not just featured docs
  const openViewer = (doc: UserDocument) => {
    const idx = docs.findIndex(d => d.id === doc.id);
    setViewerStart(idx >= 0 ? idx : 0);
    setViewerVisible(true);
  };

  const { icon: aIcon, color: aColor } = aadhaarDoc ? docStatus(aadhaarDoc) : { icon: 'ellipse-outline' as const, color: '#9CA3AF' };
  const { icon: cIcon, color: cColor } = covidDoc   ? docStatus(covidDoc)   : { icon: 'ellipse-outline' as const, color: '#9CA3AF' };
  const { icon: dlIcon, color: dlColor } = dlDoc    ? docStatus(dlDoc)      : { icon: 'ellipse-outline' as const, color: '#9CA3AF' };
  const { icon: vIcon,  color: vColor  } = voterDoc ? docStatus(voterDoc)   : { icon: 'ellipse-outline' as const, color: '#9CA3AF' };
  const { icon: pIcon,  color: pColor  } = panDoc   ? docStatus(panDoc)     : { icon: 'ellipse-outline' as const, color: '#9CA3AF' };

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <ScrollView style={S.scroll} contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>

        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <View style={S.topBar}>
          <View style={S.greetRow}>
            <View style={S.avatar}>
              <Text style={S.avatarText}>
                {mockUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={S.greetText}>Welcome, {mockUser.name.split(' ')[0]}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={S.topIconBtn}>
            <Ionicons name="notifications-outline" size={22} color="#111" />
            {unreadCount > 0 && <View style={S.notifDot} />}
          </TouchableOpacity>
        </View>

        {/* ── Alert Banners ────────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={S.bannersRow} style={S.bannersWrap}>

          <TouchableOpacity style={S.bannerCard} activeOpacity={0.8}
            onPress={() => navigation.navigate('ApplicationStatus', { applicationId: 'app-005' })}>
            <View style={[S.bannerBar, { backgroundColor: '#EF4444' }]} />
            <View style={S.bannerContent}>
              <Text style={S.bannerTitle} numberOfLines={1}>Passport Appointment Scheduled</Text>
              <View style={S.tagsRow}>
                {['15 Apr 2023', '2:45 PM', 'POPSK Churu'].map(t => (
                  <View key={t} style={S.tagPill}><Text style={S.tagText}>{t}</Text></View>
                ))}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={S.bannerCard} activeOpacity={0.8}
            onPress={() => casteDoc && openViewer(casteDoc)}>
            <View style={[S.bannerBar, { backgroundColor: INDIGO }]} />
            <View style={S.bannerContent}>
              <Text style={S.bannerTitle} numberOfLines={1}>State caste Certificate</Text>
              <View style={S.tagsRow}>
                <View style={S.tagPill}><Text style={S.tagText}>Verified</Text></View>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* ── Issued Documents ─────────────────────────────────────────── */}
        <View style={S.section}>
          <View style={S.sectionHeader}>
            <Text style={S.sectionTitle}>Issued Documents</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Documents' } as never)}>
              <Text style={S.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Row 1: Aadhaar + Covid */}
          <View style={S.featuredRow}>
            {aadhaarDoc && (
              <TouchableOpacity style={S.largeCard} onPress={() => openViewer(aadhaarDoc)} activeOpacity={0.8}>
                <View style={S.lcHeader}>
                  <View style={S.aadhaarLogo}><Ionicons name="finger-print" size={26} color="#EA580C" /></View>
                  <Ionicons name={aIcon} size={22} color={aColor} />
                </View>
                <Text style={S.lcTitle}>Aadhaar Card</Text>
                <Text style={S.lcNumber}>XXX-XXX-XXX</Text>
                <Text style={S.lcFooter} numberOfLines={2}>Aadhaar , unique Identification{'\n'}Authority of India</Text>
                <View style={S.wm}><Text style={S.wmText}>AADHAAR</Text></View>
              </TouchableOpacity>
            )}
            {covidDoc && (
              <TouchableOpacity style={S.largeCard} onPress={() => openViewer(covidDoc)} activeOpacity={0.8}>
                <View style={S.lcHeader}>
                  <View style={S.emblemLogo}><Ionicons name="shield" size={26} color="#374151" /></View>
                  <Ionicons name={cIcon} size={22} color={cColor} />
                </View>
                <Text style={S.lcTitle} numberOfLines={1}>
                  {covidDoc.title.length > 14 ? covidDoc.title.slice(0, 13) + '…' : covidDoc.title}
                </Text>
                <Text style={S.lcNumber}>{covidDoc.documentNumber.slice(0, 10)}</Text>
                <Text style={S.lcFooter} numberOfLines={2}>{covidDoc.issuer}</Text>
                <View style={S.wm}><Ionicons name="shield-checkmark" size={60} color="#37415108" /></View>
              </TouchableOpacity>
            )}
          </View>

          {/* Row 2: DL + Voter */}
          <View style={S.gridRow}>
            {dlDoc && (
              <TouchableOpacity style={S.compactCard} onPress={() => openViewer(dlDoc)} activeOpacity={0.8}>
                <View style={S.compactRow}>
                  <Text style={S.compactTitle} numberOfLines={1}>Driving License</Text>
                  <Ionicons name={dlIcon} size={20} color={dlColor} />
                </View>
                <Text style={S.compactSub} numberOfLines={1}>Dl no.- {dlDoc.documentNumber}</Text>
              </TouchableOpacity>
            )}
            {voterDoc && (
              <TouchableOpacity style={S.compactCard} onPress={() => openViewer(voterDoc)} activeOpacity={0.8}>
                <View style={S.compactRow}>
                  <Text style={S.compactTitle} numberOfLines={1}>Voter Card</Text>
                  <Ionicons name={vIcon} size={20} color={vColor} />
                </View>
                <Text style={S.compactSub} numberOfLines={1}>EPIC no.- {voterDoc.documentNumber}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Row 3: PAN + Add */}
          <View style={S.gridRow}>
            {panDoc && (
              <TouchableOpacity style={S.compactCard} onPress={() => openViewer(panDoc)} activeOpacity={0.8}>
                <View style={S.compactRow}>
                  <Text style={S.compactTitle} numberOfLines={1}>PAN Card</Text>
                  <Ionicons name={pIcon} size={20} color={pColor} />
                </View>
                <Text style={S.compactSub} numberOfLines={1}>PAN no.- {panDoc.documentNumber}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[S.compactCard, S.addCard]}
              onPress={() => navigation.navigate('AskScreen')} activeOpacity={0.8}>
              <View style={S.plusCircle}><Ionicons name="add" size={26} color="#374151" /></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Documents you might need ─────────────────────────────────── */}
        <View style={S.section}>
          <Text style={S.sectionLabel}>DOCUMENTS YOU MIGHT NEED</Text>
          <View style={S.suggestWrap}>
            {SUGGESTED.map(label => (
              <TouchableOpacity key={label} style={S.chip}
                onPress={() => navigation.navigate('AskScreen')} activeOpacity={0.75}>
                <Text style={S.chipText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={S.exploreBtn}
            onPress={() => navigation.navigate('AskScreen')} activeOpacity={0.85}>
            <Text style={S.exploreBtnText}>Explore More</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <DocViewerModal
        visible={viewerVisible}
        startIndex={viewerStart}
        docs={docs}
        onClose={() => setViewerVisible(false)}
        onOpenFull={id => navigation.navigate('DocumentDetail', { documentId: id })}
      />
    </SafeAreaView>
  );
};

// ─── Styles — profile design language ────────────────────────────────────────
const S = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F6F6F8' },
  scroll:  { flex: 1 },
  content: { paddingBottom: 16 },

  // Top bar — matches ProfileScreen exactly
  topBar:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, backgroundColor: '#F6F6F8' },
  greetRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar:     { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFD6C4', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 17, fontWeight: '900', color: '#C2440A' },
  greetText:  { fontSize: 22, fontWeight: '800', color: '#111', letterSpacing: -0.4 },
  topIconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EBEBEB' },
  notifDot:   { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#fff' },

  // Banners
  bannersWrap: { marginBottom: 20 },
  bannersRow:  { paddingHorizontal: 16, gap: 10 },
  bannerCard:  { flexDirection: 'row', width: 268, minHeight: 64, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden' },
  bannerBar:   { width: 6 },
  bannerContent: { flex: 1, paddingHorizontal: 12, justifyContent: 'center', gap: 5 },
  bannerTitle: { fontSize: 13.5, fontWeight: '700', color: '#111' },
  tagsRow:     { flexDirection: 'row', gap: 5, overflow: 'hidden' },
  tagPill:     { backgroundColor: '#F3F4F6', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4 },
  tagText:     { fontSize: 11, fontWeight: '600', color: '#374151' },

  // Section — profile design language
  section:       { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:  { fontSize: 22, fontWeight: '800', color: '#111', letterSpacing: -0.4 },
  sectionLabel:  { fontSize: 10, fontWeight: '700', color: '#AAA', letterSpacing: 0.8, marginBottom: 12 },
  seeAll:        { fontSize: 13, color: '#AAA', fontWeight: '500' },

  // Large featured cards — no shadow, profile borders
  featuredRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  largeCard:   { flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#EBEBEB', minHeight: 188, overflow: 'hidden', position: 'relative', gap: 3 },
  lcHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  aadhaarLogo: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#FFF3EB', alignItems: 'center', justifyContent: 'center' },
  emblemLogo:  { width: 44, height: 44, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  lcTitle:     { fontSize: 15, fontWeight: '700', color: '#111' },
  lcNumber:    { fontSize: 12, color: '#6B7280', fontWeight: '500', marginBottom: 4 },
  lcFooter:    { fontSize: 10.5, color: '#6B7280', lineHeight: 15 },
  wm:          { position: 'absolute', bottom: 4, right: 4 },
  wmText:      { fontSize: 18, fontWeight: '900', color: '#EA580C', opacity: 0.09, letterSpacing: 2 },

  // Compact grid — no shadow
  gridRow:     { flexDirection: 'row', gap: 10, marginBottom: 10 },
  compactCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1, borderColor: '#EBEBEB', minHeight: 70, gap: 4 },
  compactRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  compactTitle:{ fontSize: 13.5, fontWeight: '700', color: '#111', flex: 1 },
  compactSub:  { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  addCard:     { alignItems: 'center', justifyContent: 'center' },
  plusCircle:  { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },

  // Suggestions
  suggestWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip:        { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#EBEBEB' },
  chipText:    { fontSize: 13.5, color: '#111', fontWeight: '500' },

  // Explore button
  exploreBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: INDIGO, borderRadius: 999, paddingVertical: 15 },
  exploreBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
