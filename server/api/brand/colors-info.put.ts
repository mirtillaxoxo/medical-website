// server/api/brand/theme.put.ts
// Salva i colori globali del sito nel KV.
import { kv } from "hub:kv";

// Devono coincidere con themeFields in composables/useThemeColors.ts
const KEYS = ["primary", "secondary", "dark"];
const HEX = /^#[0-9a-fA-F]{6}$/;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || typeof body !== "object") {
    throw createError({ statusCode: 400, statusMessage: "Body non valido" });
  }

  const data: Record<string, string> = {};
  for (const key of KEYS) {
    const value = typeof body[key] === "string" ? body[key].trim() : "";
    // Vuoto = colore predefinito del sito. Altrimenti deve essere #rrggbb.
    if (value && !HEX.test(value)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Colore non valido: ${key}`,
      });
    }
    data[key] = value.toLowerCase();
  }

  await kv.set("theme", data);
  return { ok: true };
});
