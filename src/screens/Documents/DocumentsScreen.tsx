/**
 * DocumentsScreen — Minimal, clean issued documents list
 * - Bold header with search bar
 * - Filter chips: All / Expiring / Verified / Needs Fix
 * - Clean list rows: icon box + title + doc number + issuer + status
 * - Applications sub-tab with compact ApplicationCard list
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Spacing, Radius } from '../../theme';
import {
  mockDocuments, mockApplications,
  getExpiringDocuments, daysUntilExpiry,
  getActiveApplications, getDraftApplications, getCompletedApplications,
} from '../../data/mockData';
import { UserDocument, Application, RootStackParamList } from '../../types';
import { ApplicationCard } from '../../components';

type Nav        = NativeStackNavigationProp<RootStackParamList>;
type MainTab    = 'docs' | 'apps';
type DocFilter  = 'all' | 'expiring' | 'verified' | 'needs_fix';
type AppTab     = 'active' | 'drafts' | 'completed';

const INDIGO = '#3D3BF3';

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

const DOC_COLOR: Record<string, string> = {
  driving_licence:    '#0369A1',
  aadhaar:            '#EA580C',
  pan:                '#1A7A45',
  voter_id:           INDIGO,
  passport:           '#7C3AED',
  income_certificate: '#C97A08',
  medical:            '#0891B2',
  vaccination:        '#BE185D',
};

function statusBadge(doc: UserDocument): { icon: keyof typeof Ionicons.glyphMap; color: string; label: string } {
  if (doc.status === 'expired')          return { icon: 'close-circle',    color: '#EF4444', label: 'Expired' };
  if (doc.status === 'needs_correction') return { icon: 'alert-circle',    color: '#F59E0B', label: 'Fix needed' };
  if (doc.status === 'expiring') {
    const days = doc.expiryDate ? daysUntilExpiry(doc.expiryDate) : 0;
    return { icon: 'time',             color: '#F59E0B', label: `${days}d left` };
  }
  if (doc.verified)                      return { icon: 'checkmark-circle', color: INDIGO,    label: 'Verified' };
  return                                        { icon: 'ellipse-outline',  color: '#9CA3AF', label: 'Unverified' };
}

const DOC_FILTERS: { id: DocFilter; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'expiring', label: 'Expiring' },
  { id: 'verified', label: 'Verified' },
  { id: 'needs_fix',label: 'Needs fix' },
];

const APP_TABS: { id: AppTab; label: string }[] = [
  { id: 'active',    label: 'Active' },
  { id: 'drafts',    label: 'Drafts' },
  { id: 'completed', label: 'Completed' },
];

// ─── Doc list row ─────────────────────────────────────────────────────────────
const DocRow: React.FC<{ doc: UserDocument; onPress: () => void }> = ({ doc, onPress }) => {
  const icon   = DOC_ICON[doc.type]  ?? 'document-outline';
  const color  = DOC_COLOR[doc.type] ?? INDIGO;
  const { icon: sIcon, color: sColor } = statusBadge(doc);
  return (
    <TouchableOpacity style={dr.row} onPress={onPress} activeOpacity={0.75}>
      <View style={[dr.iconBox, { backgroundColor: color + '14' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={dr.body}>
        <Text style={dr.title} numberOfLines={1}>{doc.title}</Text>
        <Text style={dr.sub} numberOfLines={1}>
          {doc.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} · {doc.documentNumber}
        </Text>
        <Text style={dr.issuer} numberOfLines={1}>{doc.issuer}</Text>
      </View>
      <Ionicons name={sIcon} size={22} color={sColor} />
    </TouchableOpacity>
  );
};
const dr = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: Radius.lg,
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 8, borderWidth: 1, borderColor: '#EBEBEB',
    gap: 12,
  },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  body:    { flex: 1, gap: 2 },
  title:   { fontSize: 14.5, fontWeight: '600', color: '#111' },
  sub:     { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  issuer:  { fontSize: 11, color: '#9CA3AF' },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export const DocumentsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [mainTab,   setMainTab]   = useState<MainTab>('docs');
  const [docFilter, setDocFilter] = useState<DocFilter>('all');
  const [appTab,    setAppTab]    = useState<AppTab>('active');
  const [search,    setSearch]    = useState('');

  const filtered = useMemo(() => {
    let base = mockDocuments;
    if (docFilter === 'expiring') base = base.filter(d => d.status === 'expiring' || d.status === 'expired');
    if (docFilter === 'verified') base = base.filter(d => d.verified);
    if (docFilter === 'needs_fix')base = base.filter(d => d.status === 'needs_correction');
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.documentNumber.toLowerCase().includes(q) ||
        d.issuer.toLowerCase().includes(q)
      );
    }
    return base;
  }, [docFilter, search]);

  const shownApps: Application[] =
    appTab === 'active'    ? getActiveApplications()    :
    appTab === 'drafts'    ? getDraftApplications()     :
                             getCompletedApplications();

  const docCount = mockDocuments.length;
  const appCount = getActiveApplications().length + getDraftApplications().length;

  return (
    <SafeAreaView style={S.safe} edges={['top']}>

      {/* Top bar */}
      <View style={S.topBar}>
        <Text style={S.screenTitle}>My Docs</Text>
        <TouchableOpacity
          style={S.addBtn}
          onPress={() => navigation.navigate('AskScreen')}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={S.searchWrap}>
        <Ionicons name="search-outline" size={16} color="#9CA3AF" />
        <TextInput
          style={S.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search documents…"
          placeholderTextColor="#9CA3AF"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Docs / Apps main tabs */}
      <View style={S.mainTabsRow}>
        <TouchableOpacity
          style={[S.mainTab, mainTab === 'docs' && S.mainTabActive]}
          onPress={() => setMainTab('docs')}
        >
          <Text style={[S.mainTabText, mainTab === 'docs' && S.mainTabTextActive]}>
            Documents ({docCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[S.mainTab, mainTab === 'apps' && S.mainTabActive]}
          onPress={() => setMainTab('apps')}
        >
          <Text style={[S.mainTabText, mainTab === 'apps' && S.mainTabTextActive]}>
            Applications {appCount > 0 ? `(${appCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {mainTab === 'docs' ? (
        <>
          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={S.filtersRow} style={S.filtersWrap}>
            {DOC_FILTERS.map(f => (
              <TouchableOpacity
                key={f.id}
                style={[S.filterChip, docFilter === f.id && S.filterChipActive]}
                onPress={() => setDocFilter(f.id)}
              >
                <Text style={[S.filterChipText, docFilter === f.id && S.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* List */}
          <ScrollView style={S.list} contentContainerStyle={S.listContent} showsVerticalScrollIndicator={false}>
            {filtered.length === 0 ? (
              <View style={S.empty}>
                <Ionicons name="documents-outline" size={48} color="#D1D5DB" />
                <Text style={S.emptyText}>No documents match</Text>
              </View>
            ) : (
              filtered.map(doc => (
                <DocRow
                  key={doc.id}
                  doc={doc}
                  onPress={() => navigation.navigate('DocumentDetail', { documentId: doc.id })}
                />
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>
        </>
      ) : (
        <>
          {/* App sub-tabs */}
          <View style={S.appTabsRow}>
            {APP_TABS.map(t => (
              <TouchableOpacity key={t.id}
                style={[S.appTab, appTab === t.id && S.appTabActive]}
                onPress={() => setAppTab(t.id)}>
                <Text style={[S.appTabText, appTab === t.id && S.appTabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* App list */}
          <ScrollView style={S.list} contentContainerStyle={S.listContent} showsVerticalScrollIndicator={false}>
            {shownApps.length === 0 ? (
              <View style={S.empty}>
                <Ionicons name="layers-outline" size={48} color="#D1D5DB" />
                <Text style={S.emptyText}>No applications here</Text>
              </View>
            ) : (
              shownApps.map(app => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onPress={() =>
                    app.status === 'draft'
                      ? navigation.navigate('ApplicationFlow', { serviceId: app.serviceId, applicationId: app.id })
                      : navigation.navigate('ApplicationStatus', { applicationId: app.id })
                  }
                />
              ))
            )}
            <View style={{ height: 80 }} />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const S = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F6F6F8' },
  list:    { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 4 },

  topBar:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, backgroundColor: '#F6F6F8' },
  screenTitle: { fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.5 },
  addBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: INDIGO, alignItems: 'center', justifyContent: 'center' },

  searchWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginBottom: 12, paddingHorizontal: 14, height: 44, gap: 8, borderWidth: 1, borderColor: '#EBEBEB' },
  searchInput: { flex: 1, fontSize: 14, color: '#111' },

  mainTabsRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12, gap: 8 },
  mainTab:     { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#EBEBEB' },
  mainTabActive:{ backgroundColor: INDIGO, borderColor: INDIGO },
  mainTabText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  mainTabTextActive: { color: '#fff' },

  filtersWrap: { flexGrow: 0, marginBottom: 10 },
  filtersRow:  { paddingHorizontal: 16, gap: 8 },
  filterChip:  { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: '#EBEBEB' },
  filterChipActive: { backgroundColor: INDIGO, borderColor: INDIGO },
  filterChipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },

  appTabsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 10 },
  appTab:     { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#EBEBEB' },
  appTabActive: { backgroundColor: INDIGO, borderColor: INDIGO },
  appTabText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  appTabTextActive: { color: '#fff' },

  empty:     { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: '#9CA3AF' },
});
