import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getDocumentById } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Button, ScreenHeader } from '../../components';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ShareDocument'>;

const SHARE_TARGETS = [
  'Transport Authority',
  'Revenue Department',
  'Municipal Corporation',
  'Passport Office',
  'Bank / Financial Institution',
];

export const ShareDocumentScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { documentId } = route.params;
  const doc = getDocumentById(documentId);
  const [selected, setSelected] = useState(0);

  if (!doc) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScreenHeader title="Share" onBack={() => navigation.goBack()} />
        <View style={styles.centered}><Text>Document not found</Text></View>
      </SafeAreaView>
    );
  }

  const infoFields = [
    { label: 'Name', value: 'Arjun Sharma' },
    { label: 'Document number', value: doc.documentNumber },
    { label: 'Validity', value: doc.expiryDate ?? 'No expiry' },
    { label: 'Issuer', value: doc.issuer },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader title={`Share ${doc.title}`} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Share with */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Share with</Text>
          {SHARE_TARGETS.map((target, i) => (
            <TouchableRow
              key={target}
              label={target}
              selected={selected === i}
              onPress={() => setSelected(i)}
            />
          ))}
        </View>

        {/* Information to share */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Information</Text>
          {infoFields.map((f) => (
            <View key={f.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{f.label}</Text>
              <Text style={styles.infoValue}>{f.value}</Text>
            </View>
          ))}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Document</Text>
            <View style={styles.docChip}>
              <Ionicons name="document-text-outline" size={14} color={Colors.primary} />
              <Text style={styles.docChipText}>{doc.title}</Text>
            </View>
          </View>
        </View>

        {/* Purpose */}
        <View style={styles.card}>
          <View style={styles.purposeRow}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.purposeLabel}>Purpose</Text>
          </View>
          <Text style={styles.purposeValue}>{SHARE_TARGETS[selected]}</Text>
        </View>

        {/* Consent note */}
        <View style={styles.consentNote}>
          <Ionicons name="lock-closed-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.consentText}>
            You are sharing selected information only. The recipient will not have ongoing access to your document vault.
          </Text>
        </View>

        <Button
          label="Allow sharing"
          onPress={() => {
            Alert.alert('Shared', `${doc.title} shared with ${SHARE_TARGETS[selected]}. (Prototype simulation)`, [
              { text: 'Done', onPress: () => navigation.goBack() },
            ]);
          }}
          fullWidth
          size="lg"
          style={styles.cta}
        />

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Inline helper component
const TouchableRow: React.FC<{ label: string; selected: boolean; onPress: () => void }> = ({ label, selected, onPress }) => {
  const { TouchableOpacity } = require('react-native');
  return (
    <TouchableOpacity style={[rowStyles.row, selected && rowStyles.rowSelected]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[rowStyles.label, selected && rowStyles.labelSelected]}>{label}</Text>
      <View style={[rowStyles.radio, selected && rowStyles.radioSelected]}>
        {selected && <View style={rowStyles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
};

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  rowSelected: { borderBottomColor: Colors.primaryLight },
  label: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  labelSelected: { color: Colors.primary, fontWeight: Typography.medium },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadow.sm,
  },
  cardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: { fontSize: Typography.sm, color: Colors.textSecondary },
  infoValue: { fontSize: Typography.sm, fontWeight: Typography.medium, color: Colors.textPrimary },
  docChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  docChipText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.medium },
  purposeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  purposeLabel: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textSecondary },
  purposeValue: { fontSize: Typography.base, fontWeight: Typography.semiBold, color: Colors.textPrimary },
  consentNote: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
  },
  consentText: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20 },
  cta: {},
});
