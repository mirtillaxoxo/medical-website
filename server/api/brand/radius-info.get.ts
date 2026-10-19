// server/api/brand/radius-info.get.ts
import { kv } from "hub:kv";

// Restituisce le raggiature salvate, oppure null se non c'è ancora nulla
export default defineEventHandler(async () => {
  return (await kv.get("radius-info")) ?? null;
});
