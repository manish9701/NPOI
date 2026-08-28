import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Spacing } from '../../theme';
import { getServiceById } from '../../data/mockData';
import { RootStackParamList } from '../../types';
import { Button } from '../../components';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Requirements'>;

const INDIGO = '#3D3BF3';

export const RequirementsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const service    = getServiceById(route.params.serviceId);
  const [showAll, setShowAll] = useState(false);

  if (!service) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Before you start</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}><Text>Service not found</Text></View>
      </SafeAreaView>
    );
  }

  const available = service.requirements.filter(r => r.available);
  const missing   = service.requirements.filter(r => !r.available);
  const ready     = missing.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Before you start</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Card */}
        <LinearGradient
          colors={[INDIGO, '#2B29C1']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroCircle} />
          <View style={styles.heroIconWrap}>
            <Ionicons name="document-text-outline" size={24} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>{service.title}</Text>
          <Text style={styles.heroDesc}>{service.description}</Text>
          
          <View style={styles.heroStatsBox}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Documents ready</Text>
              <Text style={styles.heroStatValue}>{available.length}/{service.requirements.length}</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Processing time</Text>
              <Text style={styles.heroStatValue}>{service.processingDays}</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Application fee</Text>
              <Text style={styles.heroStatValue}>{service.fees}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Status Banner */}
        {ready ? (
          <View style={styles.readyBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text style={styles.readyBannerText}>
              You have all required documents. You're ready to apply!
            </Text>
          </View>
        ) : (
          <View style={[styles.readyBanner, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="alert-circle" size={20} color="#D97706" />
            <Text style={[styles.readyBannerText, { color: '#92400E' }]}>
              {missing.length} document{missing.length > 1 ? 's' : ''} still needed before you can apply.
            </Text>
          </View>
        )}

        {/* Requirements Checklist */}
        <Text style={styles.sectionLabel}>REQUIRED DOCUMENTS</Text>
        <View style={styles.reqCard}>
          {service.requirements.map((req, i, arr) => (
            <View key={req.id} style={[styles.reqRow, i < arr.length - 1 && styles.reqRowBorder]}>
              <View style={[styles.reqIconBox, { backgroundColor: req.available ? '#DCFCE7' : '#FEF9C3' }]}>
                <Ionicons name={req.available ? 'checkmark' : 'close'} size={18} color={req.available ? '#16A34A' : '#D97706'} />
              </View>
              <Text style={styles.reqLabel}>{req.label}</Text>
              {req.available ? (
                <View style={styles.reqAvailPill}><Text style={styles.reqAvailText}>Available</Text></View>
              ) : (
                <TouchableOpacity
                  style={styles.reqMissingPill}
                  onPress={() => navigation.navigate('MissingDocument', { documentType: req.label, returnServiceId: service.id })}
                >
                  <Text style={styles.reqMissingText}>Get now</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Physical visit notice */}
        {service.requiresPhysicalVisit && (
          <View style={styles.visitCard}>
            <View style={styles.visitIconBox}>
              <Ionicons name="location-outline" size={22} color={INDIGO} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.visitTitle}>In-person visit required</Text>
              <Text style={styles.visitDesc}>
                {service.visitReason ?? 'A visit to a government office will be required to complete this application.'}
              </Text>
            </View>
          </View>
        )}

        {/* CTA */}
        <Button
          label={ready ? 'Start application' : `Get ${missing[0]?.label} first`}
          onPress={() => ready
            ? navigation.navigate('ApplicationFlow', { serviceId: service.id })
            : navigation.navigate('MissingDocument', { documentType: missing[0].label, returnServiceId: service.id })
          }
          fullWidth size="lg"
          style={styles.cta}
        />
        {!ready && (
          <Text style={styles.ctaHint}>
            Complete the missing document journey first. We'll bring you back when it's ready.
          </Text>
        )}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F6F6F8' },
  scroll:  { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  centered:{ flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, backgroundColor: '#F6F6F8' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },

  heroCard: { borderRadius: 24, padding: 24, overflow: 'hidden', position: 'relative', marginBottom: 16 },
  heroCircle: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)', right: -50, top: -50 },
  heroIconWrap: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 },
  heroDesc:  { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 20, marginBottom: 24 },
  
  heroStatsBox: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 16, gap: 12 },
  heroStatItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroStatLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  heroStatValue: { fontSize: 14, fontWeight: '700', color: '#fff', textAlign: 'right', flex: 1, marginLeft: 16 },

  readyBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 24 },
  readyBannerText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#16A34A', lineHeight: 20 },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 12, paddingHorizontal: 4 },
  reqCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  reqRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  reqRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  reqIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  reqLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111' },
  reqAvailPill: { backgroundColor: '#DCFCE7', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  reqAvailText: { fontSize: 12, fontWeight: '600', color: '#16A34A' },
  reqMissingPill: { backgroundColor: '#FEF3C7', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  reqMissingText: { fontSize: 12, fontWeight: '600', color: '#D97706' },

  visitCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16, marginBottom: 24 },
  visitIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  visitTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 4 },
  visitDesc: { fontSize: 13, color: '#374151', lineHeight: 18 },

  cta: { marginTop: 8 },
  ctaHint: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginTop: 12, lineHeight: 18 },
});
