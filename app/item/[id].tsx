import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';
import { CATEGORY_MAP, categoryIcon } from '@/constants/categories';
import { FoodCategory } from '@/types';
import { daysUntil, extractDateFromText, formatDateBR, getStatus } from '@/utils/dates';
import { Field, fieldStyles, MCIName } from '@/components/FormField';
import { CategorySelector } from '@/components/CategorySelector';
import { colors, radius, shadow, spacing, typography } from '@/theme';

const STATUS_STYLES = {
  fresh: {
    color: colors.fresh,
    bg: colors.freshBg,
    label: (d: number) => `${d} dia${d === 1 ? '' : 's'} restante${d === 1 ? '' : 's'}`,
  },
  soon: {
    color: colors.soon,
    bg: colors.soonBg,
    label: (d: number) => `Vence em ${d} dia${d === 1 ? '' : 's'}`,
  },
  expired: {
    color: colors.expired,
    bg: colors.expiredBg,
    label: (d: number) => `Vencido há ${Math.abs(d)} dia${Math.abs(d) === 1 ? '' : 's'}`,
  },
};

function InfoRow({ icon, label, value }: { icon: MCIName; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={18} color={colors.textLight} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, updateItem, removeItem } = useFood();
  const item = items.find((i) => i.id === id);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item?.name ?? '');
  const [qty, setQty] = useState(String(item?.quantity ?? 1));
  const [unit, setUnit] = useState(item?.unit ?? 'un');
  const [dateStr, setDateStr] = useState(item ? formatDateBR(item.expirationDate) : '');
  const [category, setCategory] = useState<FoodCategory>(item?.category ?? 'outro');

  if (!item) {
    return (
      <View style={styles.notFound}>
        <MaterialCommunityIcons name="alert-circle-outline" size={40} color={colors.textLight} />
        <Text style={styles.notFoundTxt}>Item não encontrado</Text>
      </View>
    );
  }

  const status = getStatus(item.expirationDate);
  const days = daysUntil(item.expirationDate);
  const statusStyle = STATUS_STYLES[status];

  const startEditing = () => {
    setName(item.name);
    setQty(String(item.quantity));
    setUnit(item.unit);
    setDateStr(formatDateBR(item.expirationDate));
    setCategory(item.category ?? 'outro');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Informe o nome do alimento');
    const parsed = extractDateFromText(dateStr) ?? new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      return Alert.alert('Data inválida', 'Use o formato dd/mm/aaaa');
    }
    await updateItem(item.id, {
      name: name.trim(),
      quantity: Number(qty) || 1,
      unit,
      category,
      expirationDate: parsed.toISOString(),
    });
    setEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('Remover item', `Remover "${item.name}" da despensa?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          await removeItem(item.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: statusStyle.bg }]}>
          <MaterialCommunityIcons
            name={categoryIcon(item.category) as MCIName}
            size={40}
            color={statusStyle.color}
          />
        </View>

        {editing ? (
          <TextInput
            style={styles.titleInput}
            value={name}
            onChangeText={setName}
            placeholder="Nome do alimento"
            placeholderTextColor={colors.textLight}
          />
        ) : (
          <Text style={styles.heroTitle}>{item.name}</Text>
        )}

        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusTxt, { color: statusStyle.color }]}>
            {statusStyle.label(days)}
          </Text>
        </View>
      </View>

      {editing ? (
        <View style={styles.card}>
          <View style={styles.row}>
            <Field label="Quantidade" icon="numeric" style={{ flex: 1 }}>
              <TextInput
                style={fieldStyles.input}
                value={qty}
                onChangeText={setQty}
                keyboardType="numeric"
              />
            </Field>
            <Field label="Unidade" icon="scale-bathroom" style={{ flex: 1 }}>
              <TextInput
                style={fieldStyles.input}
                value={unit}
                onChangeText={setUnit}
                placeholder="un, kg, L"
                placeholderTextColor={colors.textLight}
              />
            </Field>
          </View>

          <Field label="Validade" icon="calendar-outline">
            <TextInput
              style={fieldStyles.input}
              value={dateStr}
              onChangeText={setDateStr}
              placeholder="31/12/2026"
              placeholderTextColor={colors.textLight}
            />
          </Field>

          <Text style={fieldStyles.label}>Categoria</Text>
          <CategorySelector value={category} onChange={setCategory} />
        </View>
      ) : (
        <View style={styles.card}>
          <InfoRow
            icon="package-variant-closed"
            label="Quantidade"
            value={`${item.quantity} ${item.unit}`}
          />
          <InfoRow
            icon={categoryIcon(item.category) as MCIName}
            label="Categoria"
            value={CATEGORY_MAP[item.category ?? 'outro'].label}
          />
          <InfoRow icon="calendar-outline" label="Validade" value={formatDateBR(item.expirationDate)} />
          <InfoRow
            icon="calendar-plus"
            label="Adicionado em"
            value={formatDateBR(item.addedAt)}
          />
        </View>
      )}

      <View style={styles.actions}>
        {editing ? (
          <>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => setEditing(false)}>
              <Text style={styles.btnSecondaryTxt}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
              <MaterialCommunityIcons name="content-save-outline" size={18} color="#fff" />
              <Text style={styles.btnPrimaryTxt}>Salvar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.btnDanger} onPress={handleDelete}>
              <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.expired} />
              <Text style={styles.btnDangerTxt}>Remover</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={startEditing}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color="#fff" />
              <Text style={styles.btnPrimaryTxt}>Editar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },

  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  notFoundTxt: { ...typography.body, color: colors.textMuted },

  hero: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: { ...typography.h1, textAlign: 'center', marginBottom: spacing.sm },
  titleInput: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    width: '100%',
    paddingBottom: 4,
  },
  statusBadge: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 6 },
  statusTxt: { fontSize: 13, fontWeight: '700' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  row: { flexDirection: 'row', gap: spacing.md },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: { ...typography.body, color: colors.textMuted, flex: 1 },
  infoValue: { fontSize: 14, fontWeight: '700', color: colors.text },

  actions: { flexDirection: 'row', gap: spacing.md },
  btnPrimary: {
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
  btnPrimaryTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnSecondary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: radius.lg,
  },
  btnSecondaryTxt: { color: colors.textMuted, fontWeight: '700', fontSize: 15 },
  btnDanger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.expiredBg,
    paddingVertical: 14,
    borderRadius: radius.lg,
  },
  btnDangerTxt: { color: colors.expired, fontWeight: '700', fontSize: 15 },
});
