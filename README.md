# Food Waste App 🍎♻️

Aplicativo móvel multiplataforma (Expo / React Native + TypeScript) para auxiliar na **redução do desperdício de alimentos em residências**, alinhado ao **ODS 12 — Consumo e Produção Responsáveis** da ONU.

## ✨ Funcionalidades

- 📷 **Reconhecimento de alimentos** via câmera usando API de visão computacional (Google Vision por padrão; mock incluído para dev sem chave).
- 🗓️ **Extração de validade** de rótulos por OCR + expressão regular.
- 📦 **Gestão da despensa** com persistência local (AsyncStorage).
- 🚦 **Indicadores visuais** de status (fresco / vencendo / vencido).
- 🍳 **Sugestão de receitas** baseada nos itens disponíveis.

## 🚀 Como rodar

```bash
npm install
cp .env.example .env   # opcional: configurar EXPO_PUBLIC_VISION_API_KEY
npx expo start
```

Abra no app **Expo Go** (Android/iOS) ou em um emulador.

## 🧱 Estrutura

```
app/                  # rotas (expo-router)
  (tabs)/             # despensa, receitas, sobre
  scan.tsx            # captura via câmera
  add.tsx             # cadastro manual / pós-scan
src/
  components/         # FoodCard
  context/            # FoodContext (estado global)
  data/               # base de receitas + matcher
  services/           # vision API + AsyncStorage
  utils/              # dates (regex de validade)
  types/              # tipos TypeScript
```

## 🧠 Stack

- Expo SDK 51 + React Native 0.74
- TypeScript estrito
- expo-router (rotas baseadas em arquivos)
- expo-camera (captura)
- AsyncStorage (persistência local)
- Google Vision API (visão computacional) — substituível

## 🎓 Contexto acadêmico

Projeto interdisciplinar (IA + Programação Mobile + Teoria da Computação) demonstrando aplicação prática para o **ODS 12.3**. Referências: Silva et al. (2020), Antelo (2022), Gomes (2025).

## 📄 Licença

MIT
# food-waste
