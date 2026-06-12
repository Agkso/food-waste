export const colors = {
  primary: '#16a34a',
  primaryDark: '#15803d',
  primaryLight: '#dcfce7',
  secondary: '#0ea5e9',
  secondaryLight: '#e0f2fe',

  background: '#f3f6f4',
  surface: '#ffffff',

  text: '#111827',
  textMuted: '#6b7280',
  textLight: '#9ca3af',
  border: '#e7ebe8',

  fresh: '#16a34a',
  freshBg: '#dcfce7',
  soon: '#d97706',
  soonBg: '#fef3c7',
  expired: '#dc2626',
  expiredBg: '#fee2e2',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const shadow = {
  sm: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

export const typography = {
  h1: { fontSize: 26, fontWeight: '800' as const, color: colors.text },
  h2: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  subtitle: { fontSize: 14, fontWeight: '500' as const, color: colors.textMuted },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.text },
  caption: { fontSize: 12, fontWeight: '600' as const, color: colors.textMuted },
};
