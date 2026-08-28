import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { mockFamily, mockDocuments, mockUser, getExpiringDocuments } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { FamilyMemberCard } from '../../components';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const FamilyScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const userExpiring = getExpiringDocuments().length;
  const totalFamilyDocs = mockFamily.reduce((sum, m) => sum + m.documents.length, 0);
  const totalExpiring = mockFamily.reduce((sum, m) =>
    sum + m.documents.filter(d => d.status === 'expiring' || d.status === 'expired').length, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Family</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Summary */}
        {totalExpiring > 0 && (
          <View style={styles.alertBanner}>
            <Ionicons name="warning-outline" size={18} color={Colors.warning} />
            <Text style={styles.alertText}>
              {totalExpiring} family document{totalExpiring > 1 ? 's' : ''} expiring soon across your family
            </Text>
          </View>
        )}

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>PRIMARY ACCOUNT</Text>
          <View style={styles.cardGroup}>
            <TouchableOpacity
              style={styles.selfCard}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Documents' } as any)}
              activeOpacity={0.85}
            >
              <View style={styles.selfAvatar}>
                <Text style={styles.selfInitials}>
                  {mockUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.selfInfo}>
                <Text style={styles.selfName}>{mockUser.name}</Text>
                <Text style={styles.selfRole}>Primary account holder</Text>
                <View style={styles.selfStats}>
                  <View style={styles.selfStatItem}>
                    <Ionicons name="documents-outline" size={13} color={Colors.primary} />
                    <Text style={styles.selfStatText}>{mockDocuments.length} documents</Text>
                  </View>
                  {userExpiring > 0 && (
                    <View style={[styles.selfStatItem, styles.selfStatWarn]}>
                      <Ionicons name="warning-outline" size={13} color={Colors.warning} />
                      <Text style={[styles.selfStatText, { color: Colors.warning }]}>{userExpiring} expiring</Text>
                    </View>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>FAMILY MEMBERS</Text>
          <View style={styles.cardGroup}>
            {mockFamily.map(member => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onPress={() => navigation.navigate('FamilyMember', { memberId: member.id })}
              />
            ))}
            
            <TouchableOpacity
              style={styles.addCard}
              onPress={() => Alert.alert('Add family member', 'This feature is available in the full version.')}
              activeOpacity={0.75}
            >
              <View style={styles.addIcon}>
                <Ionicons name="add" size={22} color={Colors.primary} />
              </View>
              <View style={styles.addBody}>
                <Text style={styles.addTitle}>Add a family member</Text>
                <Text style={styles.addDesc}>Mother, father, spouse or child — each gets their own space</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, backgroundColor: '#F6F6F8' },
  topBarTitle: { fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.5 },

  scroll:  { flex: 1 },
  content: { paddingBottom: Spacing.xl },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.warningMid,
  },
  alertText: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary },

  sectionWrap: { marginBottom: Spacing.xl, paddingHorizontal: Spacing.base },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#AAA',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  cardGroup: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
  },

  selfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  selfAvatar: {
    width: 52, height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  selfInitials: { fontSize: Typography.lg, fontWeight: Typography.bold, color: '#fff' },
  selfInfo:     { flex: 1 },
  selfName:     { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  selfRole:     { fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.medium, marginBottom: 4 },
  selfStats:    { flexDirection: 'row', gap: Spacing.sm },
  selfStatItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  selfStatWarn: {},
  selfStatText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.medium },

  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  addIcon: {
    width: 48, height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  addBody:  { flex: 1 },
  addTitle: { fontSize: Typography.base, color: Colors.primary, fontWeight: Typography.semiBold },
  addDesc:  { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2, lineHeight: 16 },
});
