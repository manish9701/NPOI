import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FamilyMember, Relationship } from '../types';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';

interface Props {
  member: FamilyMember;
  onPress: () => void;
  isActive?: boolean;
}

const relationshipLabel: Record<Relationship, string> = {
  self:   'You',
  mother: 'Mother',
  father: 'Father',
  spouse: 'Spouse',
  child:  'Child',
};

const relationshipIcon: Record<Relationship, keyof typeof Ionicons.glyphMap> = {
  self:   'person',
  mother: 'woman',
  father: 'man',
  spouse: 'heart',
  child:  'happy',
};

const relationshipColor: Record<Relationship, string> = {
  self:   Colors.primary,
  mother: '#8B5CF6',
  father: '#0891B2',
  spouse: '#EC4899',
  child:  '#F97316',
};

export const FamilyMemberCard: React.FC<Props> = ({ member, onPress, isActive }) => {
  const color = relationshipColor[member.relationship];
  const icon = relationshipIcon[member.relationship];
  const expiring = member.documents.filter(
    (d) => d.status === 'expiring' || d.status === 'expired'
  ).length;

  return (
    <TouchableOpacity
      style={[styles.card, isActive && { borderColor: color, borderWidth: 2 }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.avatar, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.rel}>{relationshipLabel[member.relationship]}</Text>
        <View style={styles.meta}>
          <Ionicons name="documents-outline" size={12} color={Colors.textTertiary} />
          <Text style={styles.metaText}>{member.documents.length} documents</Text>
          {expiring > 0 && (
            <View style={styles.alertBadge}>
              <Text style={styles.alertText}>{expiring} expiring</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  rel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  metaText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  alertBadge: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 1,
    borderRadius: Radius.sm,
  },
  alertText: {
    fontSize: Typography.xs,
    color: Colors.warning,
    fontWeight: Typography.medium,
  },
});
