import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getServiceById, mockServices } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Button, ScreenHeader } from '../../components';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'MissingDocument'>;

// Map document type labels to services that produce them
const docToService: Record<string, string> = {
  'income proof':    'svc-002',
  'income certificate': 'svc-002',
  'income cert':     'svc-002',
  'residence proof': 'svc-003',
  'address certificate': 'svc-003',
  'address proof':   'svc-003',
  'proof of residence (utility bill or rent agreement)': 'svc-003',
  'proof of residence': 'svc-003',
  'utility bill':    'svc-003',
  'rent agreement':  'svc-003',
};

function normalizeDocLabel(docType: string): string {
  return docType.toLowerCase().replace(/\([^)]*\)/g, '').trim();
}

function getProducingService(docType: string) {
  const key = normalizeDocLabel(docType);

  if (docToService[key]) {
    return mockServices.find((s) => s.id === docToService[key]);
  }

  for (const [pattern, svcId] of Object.entries(docToService)) {
    if (key.includes(pattern) || pattern.includes(key)) {
      return mockServices.find((s) => s.id === svcId);
    }
  }

  if (key.includes('income') || key.includes('itr') || key.includes('salary')) {
    return mockServices.find((s) => s.id === 'svc-002');
  }
  if (key.includes('residence') || key.includes('address') || key.includes('domicile') || key.includes('niwas')) {
    return mockServices.find((s) => s.id === 'svc-003');
  }

  return null;
}

// Explanations per document type
const explanations: Record<string, { what: string; why: string; how: string }> = {
  'income proof': {
    what: "A document that officially states your household's annual income.",
    why: 'Required to verify your financial eligibility for government services.',
    how: 'You can obtain it from your District Revenue Office. NPOI can guide you through the application.',
  },
  'income certificate': {
    what: "An official certificate issued by the Revenue Department stating your annual household income.",
    why: 'Required to verify your financial eligibility for government services and subsidies.',
    how: 'You can apply online through your state portal. NPOI will walk you through it.',
  },
  'proof of residence (utility bill or rent agreement)': {
    what: 'Any document that confirms you live at your claimed address — e.g. electricity bill, rent agreement.',
    why: 'Needed to verify that your residential address is accurate.',
    how: 'You may upload a scanned copy of a recent utility bill or a notarised rent agreement.',
  },
  'medical certificate': {
    what: 'A certificate from a registered medical practitioner confirming your fitness to drive.',
    why: 'Required for driving licence renewal for applicants above 40 years of age.',
    how: 'Obtain from any government hospital or registered private clinic. Upload once issued.',
  },
  'income proof / itr / salary slip': {
    what: 'Official proof of your annual household income — ITR, salary slip, or income certificate.',
    why: 'Required to verify financial eligibility for government services and subsidies.',
    how: 'Apply for an Income Certificate through NPOI, or upload your latest ITR or salary slip.',
  },
};

export const MissingDocumentScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { documentType, returnServiceId } = route.params;

  const explanation = explanations[documentType.toLowerCase()]
    ?? explanations[normalizeDocLabel(documentType)]
    ?? {
    what: 'An official document required to proceed with your application.',
    why: 'This document is required to verify your eligibility or identity.',
    how: 'Contact your local government office or apply through the relevant government portal.',
  };

  const producingService = getProducingService(documentType);
  const returnService = getServiceById(returnServiceId);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader
        title="Missing Document"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Context */}
        {returnService && (
          <View style={styles.contextCard}>
            <Text style={styles.contextText}>
              You need this to continue your{' '}
              <Text style={styles.contextBold}>{returnService.title}</Text> application.
            </Text>
          </View>
        )}

        {/* Missing doc header */}
        <View style={styles.missingHeader}>
          <View style={styles.missingIconWrap}>
            <Ionicons name="document-outline" size={32} color={Colors.warning} />
          </View>
          <Text style={styles.missingTitle}>{documentType}</Text>
          <Text style={styles.missingSubtitle}>You're missing one document</Text>
        </View>

        {/* Explanation */}
        <View style={styles.card}>
          <View style={styles.explainRow}>
            <Ionicons name="help-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.explainLabel}>What is it?</Text>
          </View>
          <Text style={styles.explainText}>{explanation.what}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.explainRow}>
            <Ionicons name="alert-circle-outline" size={18} color={Colors.warning} />
            <Text style={styles.explainLabel}>Why is it needed?</Text>
          </View>
          <Text style={styles.explainText}>{explanation.why}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.explainRow}>
            <Ionicons name="navigate-outline" size={18} color={Colors.success} />
            <Text style={styles.explainLabel}>How to obtain it</Text>
          </View>
          <Text style={styles.explainText}>{explanation.how}</Text>
        </View>

        {/* CTA */}
        {producingService ? (
          <Button
            label={`Get ${producingService.title}`}
            onPress={() =>
              navigation.navigate('Requirements', { serviceId: producingService.id })
            }
            fullWidth
            size="lg"
            style={styles.cta}
          />
        ) : (
          <View style={styles.manualCard}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.info} />
            <Text style={styles.manualText}>
              Please obtain this document from your local government office and add it to your Documents.
            </Text>
          </View>
        )}

        {returnService && (
          <Button
            label={`Return to ${returnService.title}`}
            onPress={() => navigation.navigate('Requirements', { serviceId: returnServiceId })}
            variant="ghost"
            fullWidth
            style={styles.returnBtn}
          />
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base },

  contextCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
  },
  contextText: { fontSize: Typography.sm, color: Colors.textSecondary },
  contextBold: { fontWeight: Typography.semiBold, color: Colors.primary },

  missingHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.base,
  },
  missingIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  missingTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  missingSubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  explainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  explainLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  explainText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  cta: { marginTop: Spacing.md },
  returnBtn: { marginTop: Spacing.sm },

  manualCard: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.infoLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  manualText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
