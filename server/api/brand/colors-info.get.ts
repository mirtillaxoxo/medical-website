// server/api/brand/theme.get.ts
import { kv } from "hub:kv";

// Restituisce i colori salvati, oppure null se non c'è ancora nulla
export default defineEventHandler(async () => {
  return (await kv.get("theme")) ?? null;
});
