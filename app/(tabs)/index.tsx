import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';
import { FoodCard } from '@/components/FoodCard';
import { getStatus } from '@/utils/dates';
import { colors, radius, shadow, spacing, typography } from '@/theme';

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function StatCard({
  icon,
  color,
  bg,
  label,
  value,
}: {
  icon: MCIName;
  color: string;
  bg: string;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <MaterialCommunityIcons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function Pantry() {
  const { items, removeItem, loading } = useFood();

  const stats = useMemo(() => {
    const counts = { fresh: 0, soon: 0, expired: 0 };
    items.forEach((i) => {
      counts[getStatus(i.expirationDate)]++;
    });
    return counts;
  }, [items]);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>Sua despensa</Text>
            <Text style={styles.subtitle}>
              {items.length} {items.length === 1 ? 'item armazenado' : 'itens armazenados'}
            </Text>

            {items.length > 0 && (
              <View style={styles.statsRow}>
                <StatCard
                  icon="leaf"
                  color={colors.fresh}
                  bg={colors.freshBg}
                  label="Frescos"
                  value={stats.fresh}
                />
                <StatCard
                  icon="clock-outline"
                  color={colors.soon}
                  bg={colors.soonBg}
                  label="Vencendo"
                  value={stats.soon}
                />
                <StatCard
                  icon="alert-circle-outline"
                  color={colors.expired}
                  bg={colors.expiredBg}
                  label="Vencidos"
                  value={stats.expired}
                />
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            onPress={() => router.push(`/item/${item.id}`)}
            onRemove={() => removeItem(item.id)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons name="fridge-outline" size={40} color={colors.primary} />
              </View>
              <Text style={styles.emptyTxt}>Sua despensa está vazia</Text>
              <Text style={styles.emptySub}>
                Escaneie um alimento ou adicione manualmente para controlar a validade e reduzir
                o desperdício.
              </Text>
            </View>
          ) : null
        }
      />

      <View style={styles.fabRow}>
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.fabSecondary}>
            <Ionicons name="add" size={20} color={colors.primary} />
            <Text style={styles.fabSecondaryTxt}>Manual</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/scan" asChild>
          <TouchableOpacity style={styles.fabPrimary}>
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.fabPrimaryTxt}>Escanear</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, paddingBottom: 140 },

  header: { marginBottom: spacing.lg },
  greeting: { ...typography.h1 },
  subtitle: { ...typography.subtitle, marginTop: 2 },

  statsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

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

  fabRow: {
    position: 'absolute',
    bottom: 20,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
  },
  fabPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.lg,
    ...shadow.md,
  },
  fabPrimaryTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  fabSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.lg,
    ...shadow.sm,
  },
  fabSecondaryTxt: { color: colors.primary, fontWeight: '700', fontSize: 15 },
});
