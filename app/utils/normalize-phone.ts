export function normalizePhone(raw: string): string {
  const input = (raw ?? "").trim();
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";

  let international: string;
  if (input.startsWith("+")) {
    international = digits;
  } else if (digits.startsWith("00")) {
    international = digits.slice(2);
  } else if (digits.startsWith("39") && digits.length >= 12) {
    // numero italiano già completo di prefisso, scritto senza "+"
    international = digits;
  } else {
    international = `39${digits}`;
  }

  return `+${international}`;
}
