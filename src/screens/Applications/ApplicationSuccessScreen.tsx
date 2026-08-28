import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { getServiceById } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Button, ScreenHeader } from '../../components';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ApplicationSuccess'>;

export const ApplicationSuccessScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { serviceId, applicationId } = route.params;
  const service = getServiceById(serviceId);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="Submitted" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Success icon */}
        <View style={styles.successCircle}>
          <Ionicons name="checkmark-circle" size={72} color={Colors.success} />
        </View>

        <Text style={styles.title}>Application submitted</Text>
        <Text style={styles.subtitle}>
          Your <Text style={styles.bold}>{service?.title ?? 'application'}</Text> has been submitted successfully.
        </Text>

        {/* Reference */}
        <View style={styles.refCard}>
          <Text style={styles.refLabel}>Reference number</Text>
          <Text style={styles.refValue}>{applicationId.toUpperCase().replace('APP-NEW-', 'NPOI-')}</Text>
        </View>

        {/* What's next */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What happens next?</Text>
          {(service?.steps ?? ['Submitted', 'Verification', 'Issued']).map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepDot, i === 0 && styles.stepDotDone]}>
                {i === 0
                  ? <Ionicons name="checkmark" size={10} color="#fff" />
                  : <Text style={styles.stepNum}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepText, i === 0 && styles.stepTextDone]}>{step}</Text>
            </View>
          ))}
        </View>

        {/* ETA */}
        {service?.processingDays && (
          <View style={styles.etaCard}>
            <Ionicons name="time-outline" size={18} color={Colors.info} />
            <View>
              <Text style={styles.etaLabel}>Expected processing time</Text>
              <Text style={styles.etaValue}>{service.processingDays}</Text>
            </View>
          </View>
        )}

        {/* Doc note */}
        <View style={styles.docNote}>
          <Ionicons name="folder-outline" size={18} color={Colors.success} />
          <Text style={styles.docNoteText}>
            Once issued, your document will appear automatically in your Documents.
          </Text>
        </View>

        <Button
          label="Track application"
          onPress={() => navigation.navigate('ApplicationStatus', { applicationId })}
          fullWidth size="lg" style={styles.btn}
        />
        <Button
          label="Back to Home"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' } as any)}
          variant="ghost" fullWidth
        />

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, alignItems: 'center' },

  successCircle: { marginTop: Spacing.xxl, marginBottom: Spacing.lg },
  title: { fontSize: Typography.xxl, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { fontSize: Typography.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  bold: { fontWeight: Typography.semiBold, color: Colors.textPrimary },

  refCard: {
    backgroundColor: Colors.successLight,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    marginBottom: Spacing.base,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.successMid,
    ...Shadow.sm,
  },
  refLabel: { fontSize: Typography.xs, color: Colors.textSecondary, marginBottom: Spacing.xs },
  refValue: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.success, letterSpacing: 1 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    width: '100%',
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardTitle: { fontSize: Typography.base, fontWeight: Typography.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 5 },
  stepDot: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: Colors.success },
  stepNum: { fontSize: 9, color: Colors.textTertiary, fontWeight: Typography.bold },
  stepText: { fontSize: Typography.sm, color: Colors.textSecondary },
  stepTextDone: { color: Colors.success, fontWeight: Typography.medium },

  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.infoLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.infoMid,
  },
  etaLabel: { fontSize: Typography.xs, color: Colors.textSecondary },
  etaValue: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.info },

  docNote: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.successLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  docNoteText: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20 },
  btn: { marginBottom: Spacing.sm, width: '100%' },
});
