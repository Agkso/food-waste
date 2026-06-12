// Integração com API de visão computacional (Google Vision como exemplo).
// Substitua/expanda conforme o provedor escolhido.

const API_URL = process.env.EXPO_PUBLIC_VISION_API_URL ?? '';
const API_KEY = process.env.EXPO_PUBLIC_VISION_API_KEY ?? '';

export interface VisionResult {
  labels: string[];
  texts: string[];
}

export async function analyzeImage(base64: string): Promise<VisionResult> {
  if (!API_KEY || !API_URL) {
    // Mock para desenvolvimento sem chave configurada
    return {
      labels: ['food', 'fruit', 'apple'],
      texts: ['VAL 30/12/2026'],
    };
  }

  const body = {
    requests: [
      {
        image: { content: base64 },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'TEXT_DETECTION' },
        ],
      },
    ],
  };

  const res = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Vision API: ${res.status}`);

  const data = await res.json();
  const r = data.responses?.[0] ?? {};
  const labels: string[] =
    r.labelAnnotations?.map((l: { description: string }) => l.description) ?? [];
  const texts: string[] = r.textAnnotations
    ? [r.textAnnotations[0]?.description ?? '']
    : [];
  return { labels, texts };
}
