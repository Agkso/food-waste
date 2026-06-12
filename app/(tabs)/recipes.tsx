import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';
import { suggestRecipes } from '@/data/recipes';
import { Recipe } from '@/types';
import { colors, radius, shadow, spacing, typography } from '@/theme';

function matchStyle(score: number) {
  if (score >= 0.75) return { color: colors.fresh, bg: colors.freshBg };
  if (score >= 0.4) return { color: colors.soon, bg: colors.soonBg };
  return { color: colors.secondary, bg: colors.secondaryLight };
}

function RecipeCard({ recipe, owned }: { recipe: Recipe; owned: string[] }) {
  const score = recipe.matchScore ?? 0;
  const match = matchStyle(score);

  const isOwned = (ingredient: string) => {
    const i = ingredient.toLowerCase();
    return owned.some((o) => o.includes(i) || i.includes(o));
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={18}
              color={colors.primary}
            />
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {recipe.title}
          </Text>
        </View>
        <View style={[styles.matchBadge, { backgroundColor: match.bg }]}>
          <Text style={[styles.matchTxt, { color: match.color }]}>
            {Math.round(score * 100)}%
          </Text>
        </View>
      </View>

      <Text style={styles.section}>Ingredientes</Text>
      <View style={styles.ingredientsWrap}>
        {recipe.ingredients.map((ing) => {
          const has = isOwned(ing);
          return (
            <View key={ing} style={[styles.chip, has && styles.chipOwned]}>
              <MaterialCommunityIcons
                name={has ? 'check-circle' : 'circle-outline'}
                size={14}
                color={has ? colors.fresh : colors.textLight}
              />
              <Text style={[styles.chipTxt, has && styles.chipTxtOwned]}>{ing}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.section}>Modo de preparo</Text>
      {recipe.steps.map((step, idx) => (
        <View key={idx} style={styles.stepRow}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberTxt}>{idx + 1}</Text>
          </View>
          <Text style={styles.stepTxt}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

export default function Recipes() {
  const { items } = useFood();
  const owned = useMemo(() => items.map((i) => i.name.toLowerCase()), [items]);
  const recipes = useMemo(() => suggestRecipes(items.map((i) => i.name)), [items]);

  return (
    <FlatList
      data={recipes}
      keyExtractor={(r) => r.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>Receitas sugeridas</Text>
          <Text style={styles.subtitle}>
            {recipes.length
              ? `${recipes.length} receita${recipes.length > 1 ? 's' : ''} com base no que você tem`
              : 'Adicione itens à despensa para ver sugestões'}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="chef-hat" size={40} color={colors.primary} />
          </View>
          <Text style={styles.emptyTxt}>Sem sugestões por enquanto</Text>
          <Text style={styles.emptySub}>
            À medida que você adiciona alimentos na despensa, receitas compatíveis aparecem
            aqui automaticamente.
          </Text>
        </View>
      }
      renderItem={({ item }) => <RecipeCard recipe={item} owned={owned} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },

  header: { marginBottom: spacing.lg },
  heading: { ...typography.h1 },
  subtitle: { ...typography.subtitle, marginTop: 2 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: spacing.sm },
  titleIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: { ...typography.h2, flexShrink: 1 },
  matchBadge: { borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  matchTxt: { fontSize: 12, fontWeight: '800' },

  section: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  ingredientsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  chipOwned: { backgroundColor: colors.freshBg },
  chipTxt: { fontSize: 12, color: colors.textMuted },
  chipTxtOwned: { color: colors.fresh, fontWeight: '600' },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.xs, gap: spacing.sm },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberTxt: { fontSize: 11, fontWeight: '800', color: colors.primaryDark },
  stepTxt: { ...typography.body, flex: 1, lineHeight: 20 },

  empty: { alignItems: 'center', marginTop: 48, paddingHorizontal: spacing.lg },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTxt: { ...typography.h2 },
  emptySub: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
