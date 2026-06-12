import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';
import { getStatus } from '@/utils/dates';
import { colors, radius, shadow, spacing, typography } from '@/theme';

type MCIName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const AVG_WEIGHT_KG = 0.4;
const WATER_PER_KG = 1000;
const CO2_PER_KG = 2.5;

function LegendItem({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

function ImpactStat({ icon, value, label }: { icon: MCIName; value: string; label: string }) {
  return (
    <View style={styles.impactStat}>
      <View style={styles.impactIcon}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.impactValue}>{value}</Text>
      <Text style={styles.impactLabel}>{label}</Text>
    </View>
  );
}

export default function Impact() {
  const { items, stats } = useFood();

  const breakdown = useMemo(() => {
    const counts = { fresh: 0, soon: 0, expired: 0 };
    items.forEach((i) => counts[getStatus(i.expirationDate)]++);
    return counts;
  }, [items]);

  const total = items.length;
  const kgPreserved = stats.consumed * AVG_WEIGHT_KG;
  const waterSaved = kgPreserved * WATER_PER_KG;
  const co2Avoided = kgPreserved * CO2_PER_KG;
  const totalResolved = stats.consumed + stats.wasted;
  const rescueRate = totalResolved > 0 ? Math.round((stats.consumed / totalResolved) * 100) : null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <MaterialCommunityIcons name="chart-donut" size={32} color="#fff" />
        </View>
        <Text style={styles.heroTitle}>Seu impacto</Text>
        <Text style={styles.heroSubtitle}>
          Acompanhe como o uso do app contribui para reduzir o desperdício de alimentos em casa.
        </Text>
      </View>

      <View style={styles.bigRow}>
        <View style={styles.bigCard}>
          <Text style={styles.bigValue}>{stats.totalAdded}</Text>
          <Text style={styles.bigLabel}>cadastrados</Text>
        </View>
        <View style={styles.bigCard}>
          <Text style={[styles.bigValue, { color: colors.fresh }]}>{stats.consumed}</Text>
          <Text style={styles.bigLabel}>preservados</Text>
        </View>
        <View style={styles.bigCard}>
          <Text style={[styles.bigValue, { color: colors.expired }]}>{stats.wasted}</Text>
          <Text style={styles.bigLabel}>perdidos</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status da despensa agora</Text>
        {total > 0 ? (
          <>
            <View style={styles.bar}>
              <View
                style={[
                  styles.barSeg,
                  { flex: breakdown.fresh, backgroundColor: colors.fresh },
                ]}
              />
              <View
                style={[styles.barSeg, { flex: breakdown.soon, backgroundColor: colors.soon }]}
              />
              <View
                style={[
                  styles.barSeg,
                  { flex: breakdown.expired, backgroundColor: colors.expired },
                ]}
              />
            </View>
            <View style={styles.legend}>
              <LegendItem color={colors.fresh} label="Frescos" value={breakdown.fresh} />
              <LegendItem color={colors.soon} label="Vencendo" value={breakdown.soon} />
              <LegendItem color={colors.expired} label="Vencidos" value={breakdown.expired} />
            </View>
          </>
        ) : (
          <Text style={styles.emptyTxt}>Adicione itens à despensa para ver estatísticas.</Text>
        )}
      </View>

      {rescueRate !== null && (
        <View style={styles.card}>
          <View style={styles.rateRow}>
            <View style={styles.rateIcon}>
              <MaterialCommunityIcons name="trophy-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Taxa de aproveitamento</Text>
              <Text style={styles.cardDesc}>
                {rescueRate}% dos itens removidos da despensa foram consumidos antes de vencer.
              </Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${rescueRate}%` }]} />
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estimativa de impacto</Text>
        <Text style={styles.cardDesc}>
          Com base nos {stats.consumed} itens preservados, o app estima a contribuição abaixo.
        </Text>
        <View style={styles.impactRow}>
          <ImpactStat
            icon="weight-kilogram"
            value={`${kgPreserved.toFixed(1)} kg`}
            label="alimentos"
          />
          <ImpactStat icon="water-outline" value={`${Math.round(waterSaved)} L`} label="de água" />
          <ImpactStat
            icon="molecule-co2"
            value={`${co2Avoided.toFixed(1)} kg`}
            label="CO₂ evitado"
          />
        </View>
        <Text style={styles.disclaimer}>
          * Valores ilustrativos com base em médias de referência, para fins educativos.
        </Text>
      </View>

      <View style={styles.odsCard}>
        <MaterialCommunityIcons name="earth" size={20} color={colors.primary} />
        <Text style={styles.odsText}>
          Estes indicadores ajudam a visualizar a contribuição do app para a Meta 12.3 da ODS 12
          — Consumo e Produção Responsáveis.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },

  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadow.md,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  bigRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  bigCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.sm,
  },
  bigValue: { fontSize: 24, fontWeight: '800', color: colors.text },
  bigLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2, textAlign: 'center' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  cardTitle: { ...typography.h2, fontSize: 15, marginBottom: 4 },
  cardDesc: { ...typography.body, color: colors.textMuted, lineHeight: 19 },
  emptyTxt: { ...typography.body, color: colors.textMuted },

  bar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.border,
    marginTop: spacing.md,
  },
  barSeg: { minWidth: 0 },

  legend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: radius.pill },
  legendLabel: { fontSize: 12, color: colors.textMuted },
  legendValue: { fontSize: 12, fontWeight: '800', color: colors.text },

  rateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  rateIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primary },

  impactRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  impactStat: { flex: 1, alignItems: 'center' },
  impactIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  impactValue: { fontSize: 15, fontWeight: '800', color: colors.text },
  impactLabel: { fontSize: 11, color: colors.textMuted, marginTop: 1, textAlign: 'center' },
  disclaimer: {
    ...typography.caption,
    textTransform: 'none',
    marginTop: spacing.md,
    lineHeight: 16,
  },

  odsCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    paddingHorizontal: spacing.sm,
  },
  odsText: { ...typography.caption, textTransform: 'none', flex: 1, lineHeight: 17 },
});
