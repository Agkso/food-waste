import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FoodItem } from '@/types';
import { daysUntil, formatDateBR, getStatus } from '@/utils/dates';
import { categoryIcon } from '@/constants/categories';
import { colors, radius, shadow, spacing } from '@/theme';

const STATUS_STYLES = {
  fresh: { color: colors.fresh, bg: colors.freshBg, label: (d: number) => `${d}d restantes` },
  soon: { color: colors.soon, bg: colors.soonBg, label: (d: number) => `Vence em ${d}d` },
  expired: {
    color: colors.expired,
    bg: colors.expiredBg,
    label: (d: number) => `Vencido há ${Math.abs(d)}d`,
  },
};

export const FoodCard: React.FC<{ item: FoodItem; onPress?: () => void; onRemove?: () => void }> = ({
  item,
  onPress,
  onRemove,
}) => {
  const status = getStatus(item.expirationDate);
  const days = daysUntil(item.expirationDate);
  const statusStyle = STATUS_STYLES[status];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <View style={[styles.icon, { backgroundColor: statusStyle.bg }]}>
        <MaterialCommunityIcons
          name={categoryIcon(item.category) as never}
          size={24}
          color={statusStyle.color}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.meta}>
          {item.quantity} {item.unit} · validade {formatDateBR(item.expirationDate)}
        </Text>
        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.badgeTxt, { color: statusStyle.color }]}>
            {statusStyle.label(days)}
          </Text>
        </View>
      </View>

      {onRemove && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={styles.removeBtn}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.textLight} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 2, marginBottom: spacing.xs },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeTxt: { fontSize: 11, fontWeight: '700' },
  removeBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginLeft: spacing.xs,
  },
});
