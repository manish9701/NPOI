/**
 * ProfileScreen — Centered profile layout, clean settings
 * No stat cards, no connected services, minimal indigo usage
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius } from '../../theme';
import { mockUser, mockDocuments, mockApplications, mockFamily } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useNotifications } from '../../hooks/useNotifications';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const INDIGO = '#3D3BF3';

export const ProfileScreen: React.FC = () => {
  const navigation               = useNavigation<Nav>();
  const [notifEnabled, setNotif] = useState(true);
  const [biometric,    setBio]   = useState(false);
  const { language, setLanguage } = useTranslation();
  const { unreadCount }           = useNotifications();

  const initials = mockUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Profile</Text>
        <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={22} color="#111" />
          {unreadCount > 0 && <View style={styles.notifDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#fff" />
            </View>
          </View>
          <Text style={styles.userName}>{mockUser.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color="#888" />
            <Text style={styles.userLocation}>{mockUser.location}, {mockUser.state}</Text>
          </View>
          <Text style={styles.userPhone}>{mockUser.phone}</Text>

          <View style={styles.pillsRow}>
            <View style={styles.infoPill}>
              <Text style={[styles.pillNum, { color: INDIGO }]}>{mockDocuments.length}</Text>
              <Text style={styles.pillLabel}>Documents</Text>
            </View>
            <View style={styles.pillDivider} />
            <View style={styles.infoPill}>
              <Text style={[styles.pillNum, { color: '#C97A08' }]}>
                {mockApplications.filter((a: any) => a.status !== 'completed' && a.status !== 'draft').length}
              </Text>
              <Text style={styles.pillLabel}>In Progress</Text>
            </View>
            <View style={styles.pillDivider} />
            <View style={styles.infoPill}>
              <Text style={[styles.pillNum, { color: '#BE185D' }]}>{mockFamily.length}</Text>
              <Text style={styles.pillLabel}>Family</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editProfileBtn}>
            <Ionicons name="pencil-outline" size={14} color={INDIGO} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <Section title="Family">
          <RowItem icon="people-outline" label="Family members" value={`${mockFamily.length} linked`}
            iconBg="#FFF0F7" iconColor="#BE185D" onPress={() => navigation.navigate('FamilyScreen')} />
        </Section>

        <Section title="Personal Information">
          <RowItem icon="person-outline"   label="Full name" value={mockUser.name}  iconBg="#F6F6F8" iconColor="#555" />
          <RowItem icon="call-outline"     label="Phone"     value={mockUser.phone} iconBg="#F6F6F8" iconColor="#555" />
          <RowItem icon="location-outline" label="State"     value={mockUser.state} iconBg="#F6F6F8" iconColor="#555" last />
        </Section>

        <Section title="Preferences">
          <ToggleRow icon="notifications-outline" label="Push notifications" iconBg="#F0F0FF" iconColor={INDIGO} value={notifEnabled} onToggle={() => setNotif(v => !v)} />
          <ToggleRow icon="finger-print-outline" label="Biometric lock" iconBg="#F0F0FF" iconColor={INDIGO} value={biometric} onToggle={() => setBio(v => !v)} />
          <RowItem icon="language-outline" label="App language" value={language === 'en' ? 'English' : 'हिंदी'} iconBg="#F0F0FF" iconColor={INDIGO}
            onPress={() => Alert.alert('Language', 'Choose language', [
              { text: 'English', onPress: () => setLanguage('en') },
              { text: 'हिंदी',   onPress: () => setLanguage('hi') },
              { text: 'Cancel',  style: 'cancel' },
            ])} last />
        </Section>

        <Section title="About">
          <RowItem icon="information-circle-outline" label="About NPOI"    iconBg="#F6F6F8" iconColor="#555" onPress={() => Alert.alert('NPOI v5', 'Your gateway for government documents.')} />
          <RowItem icon="shield-outline"             label="Privacy policy" iconBg="#F6F6F8" iconColor="#555" onPress={() => Alert.alert('Privacy', 'Coming soon.')} />
          <RowItem icon="help-circle-outline"        label="Help & support" iconBg="#F6F6F8" iconColor="#555" onPress={() => Alert.alert('Help', 'Coming soon.')} last />
        </Section>

        <TouchableOpacity style={styles.signOut} onPress={() => Alert.alert('Sign out', 'This is a prototype.')} activeOpacity={0.75}>
          <Ionicons name="log-out-outline" size={16} color={Colors.danger} />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>NPOI v5.0 · Prototype</Text>
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={sec.wrap}>
    <Text style={sec.title}>{title.toUpperCase()}</Text>
    <View style={sec.card}>{children}</View>
  </View>
);
const sec = StyleSheet.create({
  wrap:  { marginBottom: Spacing.xl, paddingHorizontal: Spacing.base },
  title: { fontSize: 10, fontWeight: '700', color: '#AAA', letterSpacing: 0.8, marginBottom: Spacing.sm },
  card:  { backgroundColor: '#fff', borderRadius: Radius.xl, borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden' },
});

interface RowProps { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; iconBg: string; iconColor: string; onPress?: () => void; last?: boolean; }
const RowItem: React.FC<RowProps> = ({ icon, label, value, iconBg, iconColor, onPress, last }) => (
  <TouchableOpacity style={[rowS.row, !last && rowS.rowBorder]} onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
    <View style={[rowS.icon, { backgroundColor: iconBg }]}><Ionicons name={icon} size={16} color={iconColor} /></View>
    <Text style={[rowS.label, { flex: 1 }]}>{label}</Text>
    {value && <Text style={rowS.value} numberOfLines={1}>{value}</Text>}
    {onPress && <Ionicons name="chevron-forward" size={15} color="#CCC" />}
  </TouchableOpacity>
);

interface ToggleProps { icon: keyof typeof Ionicons.glyphMap; label: string; iconBg: string; iconColor: string; value: boolean; onToggle: () => void; }
const ToggleRow: React.FC<ToggleProps> = ({ icon, label, iconBg, iconColor, value, onToggle }) => (
  <View style={[rowS.row, rowS.rowBorder]}>
    <View style={[rowS.icon, { backgroundColor: iconBg }]}><Ionicons name={icon} size={16} color={iconColor} /></View>
    <Text style={[rowS.label, { flex: 1 }]}>{label}</Text>
    <Switch value={value} onValueChange={onToggle} trackColor={{ false: '#E2E6F0', true: INDIGO }} thumbColor="#fff" />
  </View>
);

const rowS = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  icon:      { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  label:     { fontSize: 14, color: '#111' },
  value:     { fontSize: 13, color: '#888', maxWidth: 120, textAlign: 'right' },
});

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F6F6F8' },
  scroll: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, backgroundColor: '#F6F6F8' },
  topBarTitle: { fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.5 },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 1, borderColor: '#EBEBEB' },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.danger, borderWidth: 1.5, borderColor: '#fff' },
  heroCard: { backgroundColor: '#fff', borderRadius: Radius.xxl, marginHorizontal: Spacing.base, marginBottom: Spacing.xl, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: '#EBEBEB' },
  avatarCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#FFD6C4', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, position: 'relative' },
  avatarInitials: { fontSize: 34, fontWeight: '900', color: '#C2440A' },
  verifiedBadge: { position: 'absolute', bottom: 2, right: 2, width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.indiaGreen, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  userName:    { fontSize: 22, fontWeight: '800', color: '#111', letterSpacing: -0.3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  userLocation:{ fontSize: 13, color: '#666' },
  userPhone:   { fontSize: 13, color: '#AAA', marginTop: 2 },
  pillsRow:    { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.lg, paddingHorizontal: Spacing.base, backgroundColor: '#F6F6F8', borderRadius: Radius.xl, paddingVertical: Spacing.md, width: '100%', justifyContent: 'center' },
  infoPill:    { alignItems: 'center', flex: 1 },
  pillNum:     { fontSize: 22, fontWeight: '900' },
  pillLabel:   { fontSize: 10, color: '#AAA', marginTop: 2, fontWeight: '500' },
  pillDivider: { width: 1, height: 36, backgroundColor: '#E0E0E0' },
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.md, paddingHorizontal: Spacing.base, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: INDIGO + '40', backgroundColor: '#EDEDFD' },
  editProfileText: { fontSize: 13, fontWeight: '600', color: INDIGO },
  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginHorizontal: Spacing.base, marginBottom: Spacing.sm, backgroundColor: '#FEF2F2', borderRadius: Radius.xl, paddingVertical: Spacing.md, borderWidth: 1, borderColor: '#FCA5A5' + '50' },
  signOutText: { fontSize: 14, color: Colors.danger, fontWeight: '600' },
  version:     { textAlign: 'center', fontSize: 11, color: '#CCC', marginBottom: Spacing.base },
});
