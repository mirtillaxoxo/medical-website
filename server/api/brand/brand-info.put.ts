// server/api/brand/brand-info.put.ts
// Salva i dati del brand nel KV.
import { kv } from "hub:kv";

const str = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const CONTACT_TYPES = ["phone", "email", "whatsapp"];

export default defineEventHandler(async (event) => {
  // Validazione e pulizia: si tengono solo i campi previsti
  const body = await readBody(event);
  if (!body || typeof body !== "object") {
    throw createError({ statusCode: 400, statusMessage: "Body non valido" });
  }

  const contacts = (Array.isArray(body.contacts) ? body.contacts : [])
    .slice(0, 20)
    .map((c: any) => ({
      title: str(c?.title),
      type: CONTACT_TYPES.includes(c?.type) ? c.type : "email",
      value: str(c?.value),
      ...(str(c?.icon) ? { icon: str(c.icon) } : {}),
    }))
    .filter((c: { value: string }) => c.value);

  const accounts = (Array.isArray(body.accounts) ? body.accounts : [])
    .slice(0, 20)
    .map((a: any) => ({
      title: str(a?.title),
      value: str(a?.value),
      icon: str(a?.icon),
    }))
    .filter((a: { value: string }) => a.value);

  const reg =
    body.registration && typeof body.registration === "object"
      ? body.registration
      : {};

  const data = {
    title: str(body.title),
    titleShort: str(body.titleShort),
    subtitle: str(body.subtitle),
    role: str(body.role, 100),
    description: str(body.description),
    name: str(body.name),
    surname: str(body.surname),
    websiteUrl: str(body.websiteUrl),

    registration: {
      province: str(reg.province, 100),
      date: str(reg.date, 100),
      number: str(reg.number, 50),
      url: str(reg.url, 1000),
    },
    contacts,
    accounts,
  };

  // Tutti i campi di "Dati generali" sono obbligatori
  const requiredFields = [
    data.title,
    data.titleShort,
    data.subtitle,
    data.role,
    data.description,
    data.name,
    data.surname,
    data.websiteUrl,
  ];

  if (requiredFields.some((v) => !v)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Compila tutti i campi dei dati generali",
    });
  }

  await kv.set("brand-info", data);
  return { ok: true };
});
