import React, { ComponentProps, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/theme';

export type MCIName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function Field({
  label,
  icon,
  style,
  children,
}: {
  label: string;
  icon: MCIName;
  style?: object;
  children: ReactNode;
}) {
  return (
    <View style={[fieldStyles.field, style]}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={fieldStyles.inputWrap}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.textLight} />
        {children}
      </View>
    </View>
  );
}

export const fieldStyles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: colors.text },
});
