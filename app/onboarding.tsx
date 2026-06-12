import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ONBOARDING_SLIDES } from '@/data/onboarding';
import { setOnboardingSeen } from '@/services/onboarding';
import { colors, radius, spacing, typography } from '@/theme';

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const isLast = index === ONBOARDING_SLIDES.length - 1;

  const finish = async () => {
    await setOnboardingSeen();
    router.replace('/');
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    listRef.current?.scrollToOffset({ offset: (index + 1) * width, animated: true });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.skip} onPress={finish} hitSlop={8}>
        <Text style={styles.skipTxt}>Pular</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
              <MaterialCommunityIcons name={item.icon} size={56} color={item.iconColor} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={next}>
          <Text style={styles.btnTxt}>{isLast ? 'Começar' : 'Próximo'}</Text>
          <MaterialCommunityIcons
            name={isLast ? 'check' : 'arrow-right'}
            size={18}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },

  skip: {
    position: 'absolute',
    top: spacing.xxl,
    right: spacing.lg,
    zIndex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skipTxt: { ...typography.subtitle, fontWeight: '700' },

  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl * 2,
  },
  iconCircle: {
    width: 132,
    height: 132,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.h1, textAlign: 'center', marginBottom: spacing.md },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 15,
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    gap: spacing.xl,
  },
  dots: { flexDirection: 'row', gap: spacing.sm },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  dotActive: { backgroundColor: colors.primary, width: 24 },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    width: '100%',
  },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
