import { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

type MCIName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface OnboardingSlide {
  icon: MCIName;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    icon: 'leaf',
    iconColor: colors.primary,
    iconBg: colors.primaryLight,
    title: 'Reduza o desperdício de alimentos',
    description:
      'Organize sua despensa, acompanhe validades e ajude a reduzir o desperdício em casa, alinhado à Meta 12.3 da ONU (ODS 12).',
  },
  {
    icon: 'camera-outline',
    iconColor: colors.secondary,
    iconBg: colors.secondaryLight,
    title: 'Escaneie e cadastre em segundos',
    description:
      'Use a câmera para identificar alimentos automaticamente e ler datas de validade nos rótulos com IA e OCR.',
  },
  {
    icon: 'bell-ring-outline',
    iconColor: colors.soon,
    iconBg: colors.soonBg,
    title: 'Alertas antes do vencimento',
    description:
      'Receba notificações para usar os alimentos a tempo e evitar que se percam na geladeira ou na despensa.',
  },
  {
    icon: 'chef-hat',
    iconColor: colors.fresh,
    iconBg: colors.freshBg,
    title: 'Receitas com o que você já tem',
    description:
      'Receba sugestões de receitas com base nos ingredientes disponíveis, evitando compras desnecessárias.',
  },
];
