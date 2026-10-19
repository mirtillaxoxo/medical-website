// server/api/brand-info.get.ts
import { kv } from "hub:kv";
// Restituisce i dati salvati, oppure null se non è ancora stato salvato nulla
// (in quel caso il client usa i valori iniziali).
export default defineEventHandler(async () => {
  return (await kv.get("brand-info")) ?? null;
});
