import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getFamilyMemberById } from '../../data/mockData';
import { RootStackParamList, Relationship } from '../../types';
import { DocumentCard, ScreenHeader, StatCard } from '../../components';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'FamilyMember'>;

const relLabel: Record<Relationship, string>  = { self:'You', mother:'Mother', father:'Father', spouse:'Spouse', child:'Child' };
const relColor: Record<Relationship, string>  = { self: Colors.primary, mother:'#7C3AED', father:'#0284C7', spouse:'#DB2777', child:'#EA580C' };
const relIcon:  Record<Relationship, keyof typeof Ionicons.glyphMap> = { self:'person', mother:'woman', father:'man', spouse:'heart', child:'happy' };

export const FamilyMemberScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const member     = getFamilyMemberById(route.params.memberId);
  const [filter, setFilter] = useState<'all' | 'expiring'>('all');

  if (!member) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScreenHeader title="Family member" onBack={() => navigation.goBack()} />
        <View style={styles.centered}><Text>Member not found</Text></View>
      </SafeAreaView>
    );
  }

  const color    = relColor[member.relationship];
  const expiring = member.documents.filter(d => d.status === 'expiring' || d.status === 'expired');
  const active   = member.documents.filter(d => d.status === 'active');
  const shown    = filter === 'expiring' ? expiring : member.documents;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader title={member.name} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.heroCard}>
          <View style={[styles.avatarCircle, { backgroundColor: color + '18' }]}>
            <Ionicons name={relIcon[member.relationship]} size={34} color={color} />
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#fff" />
            </View>
          </View>
          <Text style={styles.userName}>{member.name}</Text>
          <Text style={[styles.relLabel, { color }]}>{relLabel[member.relationship]}</Text>

          <View style={styles.pillsRow}>
            <View style={styles.infoPill}>
              <Text style={[styles.pillNum, { color: '#111' }]}>{member.documents.length}</Text>
              <Text style={styles.pillLabel}>Total</Text>
            </View>
            <View style={styles.pillDivider} />
            <View style={styles.infoPill}>
              <Text style={[styles.pillNum, { color: Colors.success }]}>{active.length}</Text>
              <Text style={styles.pillLabel}>Active</Text>
            </View>
            <View style={styles.pillDivider} />
            <View style={styles.infoPill}>
              <Text style={[styles.pillNum, { color: expiring.length > 0 ? Colors.warning : '#AAA' }]}>{expiring.length}</Text>
              <Text style={styles.pillLabel}>Expiring</Text>
            </View>
          </View>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {(['all', 'expiring'] as const).map(f => (
            <View
              key={f}
              style={[styles.filterTab, filter === f && { ...styles.filterTabActive, borderBottomColor: color }]}
            >
              <Text
                style={[styles.filterTabText, filter === f && { color }]}
                onPress={() => setFilter(f)}
              >
                {f === 'all' ? `All (${member.documents.length})` : `Expiring (${expiring.length})`}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: Spacing.base }}>
          {/* Documents */}
          {shown.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="checkmark-circle-outline" size={32} color={Colors.success} />
              <Text style={styles.emptyText}>No expiring documents</Text>
            </View>
          ) : (
            shown.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onPress={() => navigation.navigate('DocumentDetail', { documentId: doc.id })}
                onAction={
                  doc.status === 'expiring' || doc.status === 'expired'
                    ? () => navigation.navigate('RenewalFlow', { documentId: doc.id })
                    : undefined
                }
                actionLabel={doc.status === 'expiring' || doc.status === 'expired' ? 'Renew' : undefined}
              />
            ))
          )}
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.background },
  scroll:  { flex: 1 },
  centered:{ flex: 1, alignItems: 'center', justifyContent: 'center' },

  heroCard: { backgroundColor: '#fff', borderRadius: Radius.xxl, marginHorizontal: Spacing.base, marginBottom: Spacing.xl, marginTop: Spacing.md, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: '#EBEBEB' },
  avatarCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, position: 'relative' },
  verifiedBadge: { position: 'absolute', bottom: 2, right: 2, width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.indiaGreen, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  userName:    { fontSize: 22, fontWeight: '800', color: '#111', letterSpacing: -0.3 },
  relLabel:    { fontSize: 13, fontWeight: '700', marginTop: 4, letterSpacing: 0.5, textTransform: 'uppercase' },
  
  pillsRow:    { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.lg, paddingHorizontal: Spacing.base, backgroundColor: '#F6F6F8', borderRadius: Radius.xl, paddingVertical: Spacing.md, width: '100%', justifyContent: 'center' },
  infoPill:    { alignItems: 'center', flex: 1 },
  pillNum:     { fontSize: 22, fontWeight: '900' },
  pillLabel:   { fontSize: 10, color: '#AAA', marginTop: 2, fontWeight: '500', textTransform: 'uppercase' },
  pillDivider: { width: 1, height: 36, backgroundColor: '#E0E0E0' },

  filterRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  filterTabActive: { borderBottomWidth: 2 },
  filterTabText:   { fontSize: Typography.base, color: Colors.textSecondary, fontWeight: Typography.medium },

  emptyBox: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.sm },
  emptyText: { fontSize: Typography.base, color: Colors.textSecondary },
});
