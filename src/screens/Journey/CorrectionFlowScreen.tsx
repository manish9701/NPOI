import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getDocumentById } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Button, ScreenHeader } from '../../components';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'CorrectionFlow'>;

type CorrStep = 'select' | 'details' | 'submitted';

const CORRECTION_FIELDS = ['Full name', 'Date of birth', 'Address', 'Photo', 'Other'];

export const CorrectionFlowScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { documentId } = route.params;
  const doc = getDocumentById(documentId);

  const [step, setStep] = useState<CorrStep>('select');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!doc) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScreenHeader title="Correction" onBack={() => navigation.goBack()} />
        <View style={styles.centered}><Text>Document not found</Text></View>
      </SafeAreaView>
    );
  }

  const handleSubmit = () => {
    if (!selectedField) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep('submitted');
    }, 1200);
  };

  if (step === 'submitted') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScreenHeader title="Correction submitted" />
        <ScrollView contentContainerStyle={styles.successContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Correction request submitted</Text>
          <Text style={styles.successDesc}>
            Your request to correct <Text style={{ fontWeight: Typography.semiBold }}>{selectedField}</Text> on your {doc.title} has been submitted.
          </Text>
          <Button
            label="Back to document"
            onPress={() => navigation.navigate('DocumentDetail', { documentId: doc.id })}
            fullWidth
            size="lg"
            style={styles.btn}
          />
          <Button
            label="Back to Home"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' } as any)}
            variant="ghost"
            fullWidth
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader
        title={`Correct ${doc.title}`}
        onBack={() => {
          if (step === 'select') navigation.goBack();
          else setStep('select');
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Select field ── */}
        {step === 'select' && (
          <View>
            <View style={styles.infoCard}>
              <Ionicons name="create-outline" size={20} color={Colors.warning} />
              <View style={styles.infoBody}>
                <Text style={styles.infoTitle}>Information appears incorrect?</Text>
                <Text style={styles.infoDesc}>Select the field that needs to be corrected on your {doc.title}.</Text>
              </View>
            </View>

            <Text style={styles.selectLabel}>What needs to be corrected?</Text>
            {CORRECTION_FIELDS.map((field) => (
              <View key={field}>
                <SelectRow
                  label={field}
                  selected={selectedField === field}
                  onPress={() => setSelectedField(field)}
                />
              </View>
            ))}

            <Button
              label="Continue"
              onPress={() => selectedField && setStep('details')}
              disabled={!selectedField}
              fullWidth
              size="lg"
              style={styles.btn}
            />
          </View>
        )}

        {/* ── Details ── */}
        {step === 'details' && (
          <View>
            <Text style={styles.stepTitle}>Provide correct information</Text>
            <Text style={styles.stepDesc}>
              Tell us what the correct value of <Text style={{ fontWeight: Typography.semiBold }}>{selectedField}</Text> should be.
            </Text>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Correct {selectedField}</Text>
              <TextInput
                style={[styles.fieldInput, styles.fieldInputMulti]}
                value={details}
                onChangeText={setDetails}
                placeholder={`Enter the correct ${selectedField?.toLowerCase()}...`}
                placeholderTextColor={Colors.textTertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.supportNote}>
              <Ionicons name="document-attach-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.supportNoteText}>
                Supporting documents (if any) can be uploaded once the correction request is reviewed.
              </Text>
            </View>

            <Button
              label="Submit correction"
              onPress={handleSubmit}
              fullWidth
              size="lg"
              disabled={details.trim().length === 0}
              loading={submitting}
              style={styles.btn}
            />
            <Button label="Back" onPress={() => setStep('select')} variant="ghost" fullWidth />
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Inline radio row
const SelectRow: React.FC<{ label: string; selected: boolean; onPress: () => void }> = ({ label, selected, onPress }) => {
  const { TouchableOpacity } = require('react-native');
  return (
    <TouchableOpacity
      style={[rowStyles.row, selected && rowStyles.rowSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
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
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  rowSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
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

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  infoBody: { flex: 1 },
  infoTitle: { fontSize: Typography.base, fontWeight: Typography.semiBold, color: Colors.textPrimary },
  infoDesc: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 18, marginTop: 2 },

  selectLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  stepTitle: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: Spacing.xs },
  stepDesc: { fontSize: Typography.base, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.base },

  fieldWrap: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium, marginBottom: Spacing.xs },
  fieldInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  fieldInputMulti: { minHeight: 80 },

  supportNote: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.base,
  },
  supportNoteText: { flex: 1, fontSize: Typography.xs, color: Colors.textSecondary, lineHeight: 18 },

  btn: { marginBottom: Spacing.sm },

  successContent: { padding: Spacing.base, alignItems: 'center', paddingTop: Spacing.xxl },
  successIcon: { marginBottom: Spacing.lg },
  successTitle: { fontSize: Typography.xxl, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  successDesc: { fontSize: Typography.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
});
