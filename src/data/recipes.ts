import { Recipe } from '@/types';

export const RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Salada de frutas',
    ingredients: ['maçã', 'banana', 'laranja'],
    steps: ['Lave as frutas', 'Corte em cubos', 'Misture e sirva gelado'],
  },
  {
    id: '2',
    title: 'Omelete simples',
    ingredients: ['ovo', 'sal', 'queijo'],
    steps: ['Bata os ovos', 'Tempere', 'Frite com queijo'],
  },
  {
    id: '3',
    title: 'Arroz com legumes',
    ingredients: ['arroz', 'cenoura', 'cebola', 'alho'],
    steps: ['Refogue alho e cebola', 'Adicione cenoura ralada', 'Cozinhe o arroz'],
  },
  {
    id: '4',
    title: 'Vitamina de banana',
    ingredients: ['banana', 'leite', 'aveia'],
    steps: ['Bata todos os ingredientes', 'Sirva gelado'],
  },
];

export function suggestRecipes(availableNames: string[]): Recipe[] {
  const norm = availableNames.map((n) => n.toLowerCase());
  return RECIPES.map((r) => {
    const matches = r.ingredients.filter((ing) =>
      norm.some((n) => n.includes(ing) || ing.includes(n)),
    ).length;
    return { ...r, matchScore: matches / r.ingredients.length };
  })
    .filter((r) => (r.matchScore ?? 0) > 0)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
}
