// server/api/brand/radius-info.put.ts
// Salva le raggiature globali del sito nel KV.
import { kv } from "hub:kv";

// Devono coincidere con radiusFields in composables/useRadiusSettings.ts
const KEYS = ["sm", "md", "lg", "xl", "2xl", "3xl"];
const MAX = 64;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || typeof body !== "object") {
    throw createError({ statusCode: 400, statusMessage: "Body non valido" });
  }

  const data: Record<string, number | null> = {};
  for (const key of KEYS) {
    const raw = body[key];
    // null / vuoto = raggiatura predefinita del sito
    if (raw === null || raw === undefined || raw === "") {
      data[key] = null;
      continue;
    }
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0 || n > MAX) {
      throw createError({
        statusCode: 400,
        statusMessage: `Raggiatura non valida: ${key}`,
      });
    }
    data[key] = Math.round(n);
  }

  await kv.set("radius-info", data);
  return { ok: true };
});
