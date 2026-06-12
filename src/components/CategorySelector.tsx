import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CATEGORIES } from '@/constants/categories';
import { FoodCategory } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { MCIName } from './FormField';

export function CategorySelector({
  value,
  onChange,
}: {
  value: FoodCategory;
  onChange: (category: FoodCategory) => void;
}) {
  return (
    <View style={styles.wrap}>
      {CATEGORIES.map((c) => {
        const active = c.key === value;
        return (
          <TouchableOpacity
            key={c.key}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(c.key)}
          >
            <MaterialCommunityIcons
              name={c.icon as MCIName}
              size={16}
              color={active ? '#fff' : colors.primary}
            />
            <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{c.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipActive: { backgroundColor: colors.primary },
  chipTxt: { fontSize: 12, fontWeight: '600', color: colors.primary },
  chipTxtActive: { color: '#fff' },
});
