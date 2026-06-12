import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';
import { extractDateFromText } from '@/utils/dates';
import { FoodCategory } from '@/types';
import { Field, fieldStyles } from '@/components/FormField';
import { CategorySelector } from '@/components/CategorySelector';
import { colors, radius, shadow, spacing } from '@/theme';

export default function AddItem() {
  const params = useLocalSearchParams<{ name?: string; date?: string; image?: string }>();
  const { addItem } = useFood();
  const [name, setName] = useState(params.name ?? '');
  const [qty, setQty] = useState('1');
  const [unit, setUnit] = useState('un');
  const [dateStr, setDateStr] = useState(params.date ?? '');
  const [category, setCategory] = useState<FoodCategory>('outro');

  const submit = async () => {
    if (!name.trim()) return Alert.alert('Informe o nome do alimento');
    const parsed = extractDateFromText(dateStr) ?? new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      return Alert.alert('Data inválida', 'Use formato dd/mm/aaaa');
    }
    await addItem({
      id: Date.now().toString(),
      name: name.trim(),
      quantity: Number(qty) || 1,
      unit,
      category,
      expirationDate: parsed.toISOString(),
      addedAt: new Date().toISOString(),
      imageUri: params.image,
    });
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {params.image ? <Image source={{ uri: params.image }} style={styles.preview} /> : null}

      <View style={styles.card}>
        <Field label="Nome do alimento" icon="tag-outline">
          <TextInput
            style={fieldStyles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Maçã"
            placeholderTextColor={colors.textLight}
          />
        </Field>

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

      <TouchableOpacity style={styles.btn} onPress={submit}>
        <MaterialCommunityIcons name="content-save-outline" size={20} color="#fff" />
        <Text style={styles.btnTxt}>Salvar na despensa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, backgroundColor: colors.background, flexGrow: 1 },

  preview: {
    width: '100%',
    height: 180,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.border,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.sm,
  },
  row: { flexDirection: 'row', gap: spacing.md },

  btn: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    ...shadow.md,
  },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
