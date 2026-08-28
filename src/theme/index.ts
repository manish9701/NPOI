// ─── NPOI Design System v5 — Minimal Strong · Indian Identity ─────────────────
// Indian flag: Saffron #FF9933, White, Ashoka Navy #1A3A8F, India Green #138808
// Usage rule: saffron for primary CTAs/actions; indiaGreen for success/verified;
//             ashokaBlue for brand/headers; white/light surfaces dominate.

export const Colors = {
  // ── Indian flag palette (use with restraint) ────────────────────────────────
  saffron:      '#FF6B2B', // India Saffron — CTAs, FAB, primary actions
  saffronLight: '#FFF3EC',
  saffronMid:   '#FFB38A',
  indiaGreen:   '#1A7A45', // India Green — verified, success, complete
  indiaGreenLight: '#E8F5EE',
  indiaGreenMid:   '#4CAF80',
  ashokaBlue:   '#1A3A8F', // Ashoka Navy — brand, headers, tabs
  ashokaBlueLight: '#EBF0FB',
  ashokaBlueMid:   '#5B7DC5',

  // ── Brand (Ashoka Navy replaces generic blue) ───────────────────────────────
  primary:       '#1A3A8F',
  primaryLight:  '#EBF0FB',
  primaryMid:    '#5B7DC5',
  primaryDark:   '#12296A',
  primaryDeep:   '#0D1D4E',

  // ── Semantic status ─────────────────────────────────────────────────────────
  success:       '#1A7A45', // India Green
  successLight:  '#E8F5EE',
  successMid:    '#4CAF80',

  warning:       '#C97A08', // Amber (darkened for better contrast)
  warningLight:  '#FEF3C7',
  warningMid:    '#F59E0B',

  danger:        '#DC2626', // Red
  dangerLight:   '#FEF2F2',
  dangerMid:     '#F87171',

  info:          '#0369A1', // Blue
  infoLight:     '#E0F2FE',
  infoMid:       '#38BDF8',

  // ── Urgency tiers ────────────────────────────────────────────────────────────
  urgentCritical: '#B91C1C',
  urgentHigh:     '#C2410C',
  urgentMedium:   '#B45309',
  urgentLow:      '#A16207',

  // ── Neutral surface ─────────────────────────────────────────────────────────
  background:    '#F4F5F9', // Crisp cool grey
  backgroundAlt: '#ECEEF5',
  surface:       '#FFFFFF',
  surfaceAlt:    '#F8F9FC',
  surfaceCard:   '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  overlay:       'rgba(10, 20, 60, 0.55)',

  // ── Tricolor gradient stops ──────────────────────────────────────────────────
  tricolorSaffron: '#FF9933',
  tricolorWhite:   '#FFFFFF',
  tricolorGreen:   '#138808',

  // ── Border ──────────────────────────────────────────────────────────────────
  border:        '#E2E6F0',
  borderLight:   '#ECEEF8',
  borderFocus:   '#1A3A8F',
  borderCard:    '#E8EBF5',

  // ── Text ────────────────────────────────────────────────────────────────────
  textPrimary:   '#0D1340', // Deep navy-black
  textSecondary: '#4A5280', // Muted navy
  textTertiary:  '#8F98BF', // Light slate-blue
  textDisabled:  '#C8CDE8',
  textInverse:   '#FFFFFF',
  textLink:      '#1A3A8F',
  textSuccess:   '#1A7A45',
  textWarning:   '#C97A08',
  textDanger:    '#DC2626',

  // ── Document category accents ───────────────────────────────────────────────
  accentIdentity:  '#4338CA', // Indigo
  accentTransport: '#0369A1', // Sky-blue
  accentFinance:   '#1A7A45', // India Green
  accentResidence: '#C97A08', // Amber
  accentTravel:    '#0D9488', // Teal
  accentFamily:    '#BE185D', // Pink
  accentEducation: '#7C3AED', // Violet

  // ── Shimmer ──────────────────────────────────────────────────────────────────
  shimmerBase:      '#E2E6F0',
  shimmerHighlight: '#F8F9FC',
};

export const Typography = {
  xs:      11,
  sm:      13,
  base:    15,
  md:      17,
  lg:      20,
  xl:      24,
  xxl:     28,
  display: 36,

  regular:   '400' as const,
  medium:    '500' as const,
  semiBold:  '600' as const,
  bold:      '700' as const,
  extraBold: '800' as const,
  black:     '900' as const,

  tight:   1.2,
  normal:  1.5,
  relaxed: 1.7,
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   24,
  xxl:  32,
  xxxl: 48,
  huge: 64,
};

export const Radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   22,
  xxl:  28,
  full: 999,
};

export const Shadow = {
  xs: {
    shadowColor: '#1A3A8F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#1A3A8F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0D1D4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0D1D4E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
  saffron: {
    shadowColor: '#FF6B2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    shadowColor: '#1A3A8F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};

// ─── Urgency helper ──────────────────────────────────────────────────────────
export function urgencyColor(daysLeft: number): string {
  if (daysLeft <= 0)  return Colors.urgentCritical;
  if (daysLeft <= 7)  return Colors.urgentHigh;
  if (daysLeft <= 30) return Colors.urgentMedium;
  if (daysLeft <= 60) return Colors.urgentLow;
  return Colors.success;
}

export function urgencyLabel(daysLeft: number): string {
  if (daysLeft <= 0)  return 'Expired';
  if (daysLeft === 1) return 'Expires tomorrow';
  if (daysLeft <= 7)  return `Expires in ${daysLeft} days — act now`;
  if (daysLeft <= 30) return `Expires in ${daysLeft} days`;
  if (daysLeft <= 60) return `Expires in ${daysLeft} days`;
  return `Expires in ${daysLeft} days`;
}

export const docCategoryColor: Record<string, string> = {
  driving_licence:       Colors.accentTransport,
  aadhaar:               Colors.accentIdentity,
  pan:                   Colors.accentFinance,
  voter_id:              Colors.accentIdentity,
  passport:              Colors.accentTravel,
  income_certificate:    Colors.accentFinance,
  address_proof:         Colors.accentResidence,
  residence_certificate: Colors.accentResidence,
  birth_certificate:     Colors.accentFamily,
  pension:               Colors.accentFinance,
  school_id:             Colors.accentEducation,
  medical:               Colors.accentFamily,
  vaccination:           Colors.accentFamily,
};

// ─── Doc type display labels ─────────────────────────────────────────────────
export const docTypeLabel: Record<string, string> = {
  driving_licence:       'Transport',
  aadhaar:               'Identity',
  pan:                   'Finance',
  voter_id:              'Identity',
  passport:              'Travel',
  income_certificate:    'Finance',
  address_proof:         'Residence',
  residence_certificate: 'Residence',
  birth_certificate:     'Family',
  pension:               'Finance',
  school_id:             'Education',
  medical:               'Health',
  vaccination:           'Health',
};

// ─── Service category colors ──────────────────────────────────────────────────
export const serviceCategoryColor: Record<string, string> = {
  Transport:  Colors.accentTransport,
  Revenue:    Colors.accentFinance,
  Municipal:  Colors.accentResidence,
  Central:    Colors.ashokaBlue,
  Education:  Colors.accentEducation,
  State:      Colors.indiaGreen,
  Health:     Colors.accentFamily,
};
