import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, typography } from '@/theme';

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const FEATURES: { icon: MCIName; title: string; desc: string }[] = [
  {
    icon: 'camera-outline',
    title: 'Reconhecimento por IA',
    desc: 'Identifica alimentos a partir de fotos usando uma API de visão computacional.',
  },
  {
    icon: 'barcode-scan',
    title: 'Extração de validade',
    desc: 'Combina OCR e expressões regulares para localizar datas de validade em rótulos.',
  },
  {
    icon: 'bell-outline',
    title: 'Alertas de vencimento',
    desc: 'Notificações locais avisam dois dias antes de um item vencer.',
  },
  {
    icon: 'silverware-fork-knife',
    title: 'Sugestão de receitas',
    desc: 'Recomenda receitas com base nos ingredientes disponíveis na despensa.',
  },
];

const TECH = [
  'Expo',
  'React Native',
  'TypeScript',
  'expo-router',
  'AsyncStorage',
  'expo-notifications',
  'Vision API',
];

export default function About() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <MaterialCommunityIcons name="leaf" size={36} color="#fff" />
        </View>
        <Text style={styles.heroTitle}>Food Waste App</Text>
        <Text style={styles.heroSubtitle}>
          Gestão inteligente da despensa para reduzir o desperdício de alimentos em casa.
        </Text>
      </View>

      <View style={styles.odsCard}>
        <View style={styles.odsIcon}>
          <MaterialCommunityIcons name="recycle" size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.odsTitle}>ODS 12 · Consumo e Produção Responsáveis</Text>
          <Text style={styles.odsText}>
            Alinhado à Meta 12.3 da ONU, que busca reduzir pela metade o desperdício de
            alimentos per capita no varejo e no consumidor até 2030.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Funcionalidades</Text>
      {FEATURES.map((f) => (
        <View key={f.title} style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name={f.icon} size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Tecnologias</Text>
      <View style={styles.chipsWrap}>
        {TECH.map((t) => (
          <View key={t} style={styles.chip}>
            <Text style={styles.chipTxt}>{t}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <MaterialCommunityIcons name="school-outline" size={18} color={colors.textMuted} />
        <Text style={styles.footerTxt}>
          Projeto interdisciplinar — Inteligência Artificial, Programação para Dispositivos
          Móveis e Teoria da Computação.
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

  odsCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  odsIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  odsTitle: { ...typography.h2, fontSize: 15, marginBottom: 4 },
  odsText: { ...typography.body, color: colors.textMuted, lineHeight: 19 },

  sectionTitle: { ...typography.h2, marginBottom: spacing.sm, marginTop: spacing.sm },

  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  featureDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2, lineHeight: 17 },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipTxt: { fontSize: 12, fontWeight: '600', color: colors.textMuted },

  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
  },
  footerTxt: { ...typography.caption, flex: 1, lineHeight: 17, textTransform: 'none' },
});
