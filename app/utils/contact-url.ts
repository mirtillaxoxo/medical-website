import type { ContactType } from "~/composables/UseBarndInfo";

export function createContactUrl({
  type,
  value,
}: {
  type: ContactType;
  value: string;
}) {
  const v = value.trim();

  switch (type) {
    case "email":
      return `mailto:${v}`;
    case "whatsapp":
      // wa.me vuole solo cifre, con prefisso internazionale e senza "+"
      return `https://wa.me/${v.replace(/\D/g, "")}`;
    default:
      return `tel:${v.replace(/\s/g, "")}`;
  }
}
