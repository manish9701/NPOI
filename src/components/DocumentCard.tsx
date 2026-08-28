import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserDocument } from '../types';
import {
  Colors, Typography, Spacing, Radius, Shadow,
  docCategoryColor, docTypeLabel,
} from '../theme';
import { daysUntilExpiry } from '../data/mockData';

interface Props {
  document: UserDocument;
  onPress: () => void;
  onAction?: () => void;
  actionLabel?: string;
  compact?: boolean;
}

export const docIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  driving_licence:       'car-outline',
  aadhaar:               'person-outline',
  pan:                   'card-outline',
  voter_id:              'id-card-outline',
  passport:              'earth-outline',
  income_certificate:    'document-text-outline',
  address_proof:         'home-outline',
  residence_certificate: 'home-outline',
  birth_certificate:     'people-outline',
  pension:               'wallet-outline',
  school_id:             'school-outline',
  medical:               'medkit-outline',
  vaccination:           'bandage-outline',
};

function maskNumber(num: string): string {
  const clean = num.replace(/\s/g, '');
  if (clean.length <= 4) return clean;
  const visible = clean.slice(-4);
  const masked  = '•'.repeat(Math.min(clean.length - 4, 8));
  return `${masked} ${visible}`;
}

export const DocumentCard: React.FC<Props> = ({
  document,
  onPress,
  onAction,
  actionLabel,
  compact = false,
}) => {
  const icon        = docIcon[document.type] ?? 'document-outline';
  const accentColor = docCategoryColor[document.type] ?? Colors.primary;
  const catLabel    = docTypeLabel[document.type] ?? 'Other';

  const daysLeft  = document.expiryDate ? daysUntilExpiry(document.expiryDate) : null;
  const isExpired = daysLeft !== null && daysLeft <= 0;
  const isExpiring = document.status === 'expiring';
  const needsFix  = document.status === 'needs_correction';

  // Determine status bar color on left edge
  const statusColor = isExpired || isExpiring
    ? (isExpired ? Colors.urgentCritical : daysLeft !== null && daysLeft <= 7 ? Colors.urgentHigh : Colors.urgentMedium)
    : needsFix ? Colors.warning
    : accentColor;

  // Expiry label
  let expiryLabel = '';
  if (document.expiryDate) {
    if (isExpired) expiryLabel = 'Expired';
    else if (daysLeft !== null && daysLeft <= 60) expiryLabel = `${daysLeft}d left`;
    else expiryLabel = new Date(document.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  } else {
    expiryLabel = 'Lifetime';
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${document.title}, ${expiryLabel}`}
    >

      <View style={styles.inner}>
        {/* Icon */}
        <View style={[styles.iconWrap, { backgroundColor: accentColor + '12' }]}>
          <Ionicons name={icon} size={22} color={accentColor} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Top row: title + status */}
          <View style={styles.topRow}>
            <Text style={styles.title} numberOfLines={1}>{document.title}</Text>
            {document.verified && !isExpiring && !isExpired && !needsFix ? (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={10} color={Colors.indiaGreen} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            ) : isExpired ? (
              <View style={[styles.statusPill, { backgroundColor: Colors.dangerLight }]}>
                <Text style={[styles.statusPillText, { color: Colors.danger }]}>Expired</Text>
              </View>
            ) : isExpiring && daysLeft !== null ? (
              <View style={[styles.statusPill, { backgroundColor: daysLeft <= 7 ? Colors.dangerLight : Colors.warningLight }]}>
                <Text style={[styles.statusPillText, { color: daysLeft <= 7 ? Colors.danger : Colors.urgentMedium }]}>
                  {daysLeft}d left
                </Text>
              </View>
            ) : needsFix ? (
              <View style={[styles.statusPill, { backgroundColor: Colors.warningLight }]}>
                <Text style={[styles.statusPillText, { color: Colors.warning }]}>Fix needed</Text>
              </View>
            ) : null}
          </View>

          {/* Doc number */}
          <Text style={styles.docNum}>{maskNumber(document.documentNumber)}</Text>

          {/* Bottom row: category + issuer */}
          <View style={styles.bottomRow}>
            <View style={[styles.catPill, { backgroundColor: accentColor + '12' }]}>
              <Text style={[styles.catText, { color: accentColor }]}>{catLabel}</Text>
            </View>
            <Text style={styles.issuer} numberOfLines={1}>{document.issuer}</Text>
          </View>
        </View>

        {/* Right: action or chevron */}
        <View style={styles.right}>
          {onAction && actionLabel ? (
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: statusColor + '40' }]}
              onPress={onAction}
              activeOpacity={0.75}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.actionText, { color: statusColor }]}>{actionLabel}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.chevron}>
              <Ionicons name="chevron-forward" size={15} color={Colors.textTertiary} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    flex: 1,
    letterSpacing: -0.2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.indiaGreenLight,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexShrink: 0,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: Typography.semiBold,
    color: Colors.indiaGreen,
  },
  statusPill: {
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    flexShrink: 0,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: Typography.bold,
  },
  docNum: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: Typography.medium,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 1,
  },
  catPill: {
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexShrink: 0,
  },
  catText: {
    fontSize: 10,
    fontWeight: Typography.semiBold,
  },
  issuer: {
    fontSize: 11,
    color: Colors.textTertiary,
    flex: 1,
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  actionText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
