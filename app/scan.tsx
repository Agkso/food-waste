import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { analyzeImage } from '@/services/vision';
import { extractDateFromText } from '@/utils/dates';
import { colors, radius, shadow, spacing, typography } from '@/theme';

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const camRef = useRef<CameraView>(null);
  const [loading, setLoading] = useState(false);

  if (!permission) return <View style={styles.c} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <View style={styles.permissionIcon}>
          <MaterialCommunityIcons name="camera-outline" size={40} color={colors.primary} />
        </View>
        <Text style={styles.permissionTitle}>Acesso à câmera</Text>
        <Text style={styles.permissionText}>
          Precisamos da câmera para identificar alimentos e ler datas de validade
          automaticamente nos rótulos.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <MaterialCommunityIcons name="camera" size={18} color="#fff" />
          <Text style={styles.permissionBtnTxt}>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const capture = async () => {
    if (!camRef.current) return;
    try {
      setLoading(true);
      const photo = await camRef.current.takePictureAsync({ base64: true, quality: 0.6 });
      if (!photo?.base64) throw new Error('Falha ao capturar imagem');
      const result = await analyzeImage(photo.base64);
      const name = result.labels[0] ?? '';
      const dateText = result.texts.join(' ');
      const date = extractDateFromText(dateText);
      router.replace({
        pathname: '/add',
        params: {
          name,
          date: date ? date.toISOString().substring(0, 10) : '',
          image: photo.uri,
        },
      });
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha na análise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.c}>
      <CameraView ref={camRef} style={StyleSheet.absoluteFill} facing="back" />

      <View style={styles.frame} pointerEvents="none">
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      <View style={styles.hintWrap} pointerEvents="none">
        <View style={styles.hintCard}>
          <MaterialCommunityIcons name="information-outline" size={16} color="#fff" />
          <Text style={styles.hint}>Aponte para o alimento ou rótulo de validade</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
          disabled={loading}
        >
          <MaterialCommunityIcons name="close" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutter} onPress={capture} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View style={styles.shutterInner} />
          )}
        </TouchableOpacity>

        <View style={styles.backBtn} />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#fff" size="large" />
          <Text style={styles.loadingTxt}>Analisando imagem...</Text>
        </View>
      )}
    </View>
  );
}

const FRAME_SIZE = 260;
const CORNER = 28;

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#000' },

  permissionScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  permissionIcon: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  permissionTitle: { ...typography.h2, fontSize: 18, marginBottom: spacing.sm },
  permissionText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  permissionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.lg,
    ...shadow.md,
  },
  permissionBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },

  frame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    marginLeft: -FRAME_SIZE / 2,
    marginTop: -FRAME_SIZE / 2 - 40,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: '#fff',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: radius.md },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: radius.md },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: radius.md },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: radius.md },

  hintWrap: {
    position: 'absolute',
    top: spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    maxWidth: '85%',
  },
  hint: { color: '#fff', fontSize: 13, flexShrink: 1 },

  controls: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: '#fff',
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
