/**
 * AskScreen — State-aware Service Discovery
 * Centered state selector · Central vs State services · Rich service rows
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Keyboard, TextInput, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Spacing, Radius } from '../../theme';
import { matchServiceFromQuery, mockServices, mockUser } from '../../data/mockData';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const INDIGO = '#3D3BF3';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh',
];

const CAT_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Transport:  'car-outline',
  Revenue:    'document-text-outline',
  Municipal:  'home-outline',
  Central:    'business-outline',
  Education:  'school-outline',
  State:      'flag-outline',
  Health:     'medkit-outline',
  All:        'apps-outline',
};

const CAT_COLOR: Record<string, string> = {
  Transport:  '#0369A1',
  Revenue:    '#1A7A45',
  Municipal:  '#C97A08',
  Central:    INDIGO,
  Education:  '#7C3AED',
  State:      '#BE185D',
  Health:     '#0891B2',
  All:        INDIGO,
};

const CATS = ['All', 'Central', 'State', 'Transport', 'Municipal', 'Education', 'Revenue'];

const SUGGESTIONS = [
  { text: 'Renew my driving licence',  icon: 'car-outline' as const,           cat: 'Transport' },
  { text: 'Get an income certificate', icon: 'document-text-outline' as const, cat: 'Revenue'   },
  { text: 'Residence certificate',     icon: 'home-outline' as const,          cat: 'Municipal' },
  { text: 'Get a new passport',        icon: 'earth-outline' as const,         cat: 'Central'   },
];

export const AskScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [query,      setQuery]      = useState('');
  const [noMatch,    setNoMatch]    = useState(false);
  const [isParsing,  setParsing]    = useState(false);
  const [activeCat,  setActiveCat]  = useState('All');
  const [state,      setState]      = useState(mockUser.state ?? 'Rajasthan');
  const [showStates, setShowStates] = useState(false);
  const [stateQ,     setStateQ]     = useState('');

  const handleSubmit = (text: string) => {
    const q = text.trim();
    if (!q) return;
    Keyboard.dismiss();
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      const service = matchServiceFromQuery(q);
      if (service) { setNoMatch(false); navigation.navigate('GoalConfirmation', { query: q, serviceId: service.id }); }
      else setNoMatch(true);
    }, 900);
  };

  const filteredServices = useMemo(() => {
    let base = mockServices;
    if (activeCat !== 'All') base = base.filter((s: any) => s.category === activeCat);
    return base;
  }, [activeCat]);

  const filteredStates = stateQ.trim()
    ? STATES.filter(s => s.toLowerCase().includes(stateQ.toLowerCase()))
    : STATES;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find a Service</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* State selector banner */}
      <TouchableOpacity style={styles.statePill} onPress={() => setShowStates(true)} activeOpacity={0.8}>
        <Ionicons name="location-outline" size={16} color={INDIGO} />
        <Text style={styles.stateLabel}>Showing services for:</Text>
        <Text style={styles.stateName}>{state}</Text>
        <Ionicons name="chevron-down" size={14} color={INDIGO} />
      </TouchableOpacity>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBox, noMatch && { borderColor: Colors.warning }]}>
          <View style={styles.searchIconBox}>
            <Ionicons name="sparkles" size={16} color={Colors.saffron} />
          </View>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={t => { setQuery(t); setNoMatch(false); }}
            placeholder="What do you need help with?"
            placeholderTextColor="#AAA"
            onSubmitEditing={() => handleSubmit(query)}
            returnKeyType="search"
            autoFocus
            editable={!isParsing}
          />
          {query.length > 0 && !isParsing && (
            <TouchableOpacity onPress={() => { setQuery(''); setNoMatch(false); }}>
              <Ionicons name="close-circle" size={18} color="#CCC" />
            </TouchableOpacity>
          )}
        </View>
        {query.length > 0 && (
          <TouchableOpacity style={[styles.findBtn, isParsing && { backgroundColor: '#6E6EF7' }]}
            onPress={() => handleSubmit(query)} disabled={isParsing} activeOpacity={0.85}>
            <Ionicons name={isParsing ? 'sync-outline' : 'search-outline'} size={16} color="#fff" />
            <Text style={styles.findBtnText}>{isParsing ? 'Understanding…' : 'Find service'}</Text>
          </TouchableOpacity>
        )}
        {noMatch && (
          <View style={styles.noMatchBox}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.info} />
            <Text style={styles.noMatchText}>No exact match. Try the suggestions below or browse by category.</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Quick suggestions */}
        {!query && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>QUICK SUGGESTIONS</Text>
            <View style={styles.suggestGrid}>
              {SUGGESTIONS.map(s => {
                const color = CAT_COLOR[s.cat] ?? INDIGO;
                return (
                  <TouchableOpacity key={s.text} style={styles.suggChip}
                    onPress={() => { setQuery(s.text); handleSubmit(s.text); }} activeOpacity={0.78}>
                    <View style={[styles.suggIcon, { backgroundColor: color + '14' }]}>
                      <Ionicons name={s.icon} size={14} color={color} />
                    </View>
                    <Text style={styles.suggText} numberOfLines={2}>{s.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Category chips + service groups */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>BROWSE SERVICES</Text>
            <Text style={styles.sectionCount}>{filteredServices.length} available</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catsRow} style={styles.catsScroll}>
            {CATS.map(cat => {
              const color  = CAT_COLOR[cat] ?? INDIGO;
              const active = activeCat === cat;
              return (
                <TouchableOpacity key={cat}
                  style={[styles.catChip, active && { backgroundColor: color, borderColor: color }]}
                  onPress={() => setActiveCat(cat)} activeOpacity={0.8}>
                  <Ionicons name={CAT_ICON[cat] ?? 'apps-outline'} size={12} color={active ? '#fff' : color} />
                  <Text style={[styles.catText, active && { color: '#fff', fontWeight: '600' }]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Central services */}
          {(activeCat === 'All' || activeCat === 'Central') && (
            <ServiceGroup title="Central Government" subtitle="Available across all states"
              services={filteredServices.filter((s: any) => s.category === 'Central')}
              onPress={(id: string) => navigation.navigate('Requirements', { serviceId: id })} />
          )}
          {/* State services */}
          {(activeCat === 'All' || activeCat !== 'Central') && (
            <ServiceGroup title={`${state} State Services`} subtitle={`Services from Govt. of ${state}`}
              services={filteredServices.filter((s: any) => s.category !== 'Central')}
              onPress={(id: string) => navigation.navigate('Requirements', { serviceId: id })} />
          )}
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* State picker modal */}
      <Modal visible={showStates} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select State</Text>
            <TouchableOpacity onPress={() => { setShowStates(false); setStateQ(''); }}>
              <Ionicons name="close" size={24} color="#111" />
            </TouchableOpacity>
          </View>
          <View style={styles.stateSearch}>
            <Ionicons name="search-outline" size={16} color="#AAA" />
            <TextInput style={styles.stateSearchInput} value={stateQ} onChangeText={setStateQ}
              placeholder="Search state…" placeholderTextColor="#AAA" autoFocus />
          </View>
          <FlatList
            data={filteredStates}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.stateRow, item === state && { backgroundColor: '#EDEDFD' }]}
                onPress={() => { setState(item); setShowStates(false); setStateQ(''); }}
                activeOpacity={0.75}>
                <Ionicons name="location-outline" size={16} color={item === state ? INDIGO : '#AAA'} />
                <Text style={[styles.stateRowText, item === state && { color: INDIGO, fontWeight: '600' }]}>{item}</Text>
                {item === state && <Ionicons name="checkmark" size={16} color={INDIGO} />}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const ServiceGroup: React.FC<{ title: string; subtitle: string; services: any[]; onPress: (id: string) => void }> =
  ({ title, subtitle, services, onPress }) => {
  if (services.length === 0) return null;
  return (
    <View style={grp.wrap}>
      <View style={grp.header}>
        <View>
          <Text style={grp.title}>{title}</Text>
          <Text style={grp.sub}>{subtitle}</Text>
        </View>
        <Text style={grp.count}>{services.length}</Text>
      </View>
      {services.map((svc: any) => {
        const color = CAT_COLOR[svc.category] ?? INDIGO;
        return (
          <TouchableOpacity key={svc.id} style={grp.row} onPress={() => onPress(svc.id)} activeOpacity={0.78}>
            <View style={[grp.icon, { backgroundColor: color + '12' }]}>
              <Ionicons name={CAT_ICON[svc.category] ?? 'document-text-outline'} size={20} color={color} />
            </View>
            <View style={grp.body}>
              <View style={grp.topRow}>
                <Text style={grp.svcTitle} numberOfLines={1}>{svc.title}</Text>
                <View style={[grp.badge, { backgroundColor: color + '12' }]}>
                  <Text style={[grp.badgeText, { color }]}>{svc.category}</Text>
                </View>
              </View>
              <Text style={grp.desc} numberOfLines={1}>{svc.description}</Text>
              <View style={grp.meta}>
                <View style={grp.metaItem}><Ionicons name="time-outline" size={11} color="#AAA" /><Text style={grp.metaText}>{svc.processingDays}</Text></View>
                <View style={grp.metaItem}><Ionicons name="cash-outline" size={11} color="#AAA" /><Text style={grp.metaText}>{(svc.fees as string).split('(')[0].trim()}</Text></View>
                {svc.requiresPhysicalVisit && (
                  <View style={grp.metaItem}><Ionicons name="business-outline" size={11} color={Colors.warning} /><Text style={[grp.metaText, { color: Colors.warning }]}>Visit required</Text></View>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const grp = StyleSheet.create({
  wrap:   { marginBottom: Spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: Spacing.sm },
  title:  { fontSize: 15, fontWeight: '700', color: '#111' },
  sub:    { fontSize: 11, color: '#AAA', marginTop: 1 },
  count:  { fontSize: 12, color: '#AAA', fontWeight: '500' },
  row:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md, borderWidth: 1, borderColor: '#EBEBEB' },
  icon:   { width: 48, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  body:   { flex: 1, gap: 3 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, justifyContent: 'space-between' },
  svcTitle:  { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  badge:     { borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2, flexShrink: 0 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  desc:      { fontSize: 11, color: '#AAA', lineHeight: 16 },
  meta:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flexWrap: 'wrap' },
  metaItem:  { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText:  { fontSize: 11, color: '#AAA' },
});

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#fff' },
  scroll:  { flex: 1 },
  content: { padding: Spacing.base },
  header:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: Spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F6F6F8', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111', textAlign: 'center' },
  statePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.base, paddingVertical: 10, backgroundColor: '#EDEDFD', borderBottomWidth: 1, borderBottomColor: '#DDD' },
  stateLabel: { fontSize: 12, color: '#666' },
  stateName:  { fontSize: 13, fontWeight: '700', color: INDIGO, flex: 1 },
  searchSection: { padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: Spacing.sm },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: '#F6F6F8', borderRadius: Radius.lg, borderWidth: 1.5, borderColor: '#EBEBEB', paddingHorizontal: Spacing.md, height: 50 },
  searchIconBox: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  searchInput: { flex: 1, fontSize: 15, color: '#111' },
  findBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: INDIGO, borderRadius: Radius.lg, paddingVertical: 12 },
  findBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  noMatchBox: { flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.infoLight, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.infoMid + '50', alignItems: 'flex-start' },
  noMatchText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  section:      { marginBottom: Spacing.xl },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: '#AAA', letterSpacing: 1, marginBottom: Spacing.md },
  sectionCount: { fontSize: 12, color: '#AAA' },
  suggestGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  suggChip:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: Radius.xl, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: '#EBEBEB' },
  suggIcon:     { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  suggText:     { fontSize: 13, color: '#111', fontWeight: '500', maxWidth: 160 },
  catsScroll:   { flexGrow: 0, marginBottom: Spacing.md },
  catsRow:      { gap: Spacing.xs },
  catChip:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E6F0' },
  catText:      { fontSize: 13, color: '#666', fontWeight: '500' },
  modalSafe:    { flex: 1, backgroundColor: '#fff' },
  modalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalTitle:   { fontSize: 18, fontWeight: '700', color: '#111' },
  stateSearch:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, margin: Spacing.base, backgroundColor: '#F6F6F8', borderRadius: Radius.lg, paddingHorizontal: Spacing.md, height: 44, borderWidth: 1, borderColor: '#EBEBEB' },
  stateSearchInput: { flex: 1, fontSize: 14, color: '#111' },
  stateRow:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  stateRowText: { flex: 1, fontSize: 15, color: '#333' },
});
