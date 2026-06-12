import { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MCIName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface TipCategory {
  key: string;
  label: string;
  icon: MCIName;
}

export interface Tip {
  id: string;
  category: string;
  icon: MCIName;
  title: string;
  description: string;
}

export const TIP_CATEGORIES: TipCategory[] = [
  { key: 'armazenamento', label: 'Armazenamento', icon: 'fridge-outline' },
  { key: 'planejamento', label: 'Planejamento', icon: 'clipboard-list-outline' },
  { key: 'reaproveitamento', label: 'Reaproveitamento', icon: 'recycle-variant' },
];

export const TIPS: Tip[] = [
  {
    id: 't1',
    category: 'armazenamento',
    icon: 'thermometer',
    title: 'Respeite a temperatura ideal',
    description:
      'Guarde laticínios e carnes nas partes mais frias da geladeira e frutas/verduras nas gavetas, evitando variações de temperatura.',
  },
  {
    id: 't2',
    category: 'armazenamento',
    icon: 'package-variant-closed',
    title: 'Use potes herméticos',
    description:
      'Alimentos abertos duram mais em recipientes fechados, protegidos do ar e da umidade.',
  },
  {
    id: 't3',
    category: 'armazenamento',
    icon: 'sort-clock-ascending-outline',
    title: 'Regra do FIFO',
    description:
      'Organize a despensa colocando os itens mais antigos na frente, para que sejam consumidos primeiro (First In, First Out).',
  },
  {
    id: 't4',
    category: 'planejamento',
    icon: 'cart-outline',
    title: 'Planeje as compras',
    description:
      'Faça uma lista antes de ir ao mercado com base no que já existe na despensa para evitar compras duplicadas.',
  },
  {
    id: 't5',
    category: 'planejamento',
    icon: 'calendar-check-outline',
    title: 'Cozinhe por validade',
    description:
      'Ao planejar refeições da semana, priorize ingredientes que vencem primeiro, em vez de comprar mais itens novos.',
  },
  {
    id: 't6',
    category: 'planejamento',
    icon: 'scale-balance',
    title: 'Compre porções adequadas',
    description:
      'Avalie o consumo real da casa antes de aproveitar promoções de itens perecíveis em grande quantidade.',
  },
  {
    id: 't7',
    category: 'reaproveitamento',
    icon: 'pot-steam-outline',
    title: 'Aproveite cascas e talos',
    description:
      'Cascas, talos e folhas podem virar caldos, refogados e farofas, reduzindo o volume de restos descartados.',
  },
  {
    id: 't8',
    category: 'reaproveitamento',
    icon: 'snowflake',
    title: 'Congele o que sobrar',
    description:
      'Porções extras de refeições e frutas maduras podem ser congeladas para consumo futuro, evitando o descarte.',
  },
  {
    id: 't9',
    category: 'reaproveitamento',
    icon: 'sprout-outline',
    title: 'Faça compostagem',
    description:
      'Restos que não podem mais ser consumidos podem se tornar adubo para plantas, reduzindo o lixo orgânico.',
  },
];
