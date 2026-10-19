export type ContactType = "phone" | "email" | "whatsapp";

export interface BrandInfo {
  title: string;
  titleShort: string;
  subtitle: string;
  description: string;
  role: string;
  name: string;
  surname: string;
  websiteUrl: string;

  // Iscrizione all'Albo (mostrata nel footer)
  registration: {
    province: string;
    date: string;
    number: string;
    url: string;
  };
  contacts: Array<{
    title: string;
    type: ContactType;
    value: string;
    icon?: string;
  }>;
  accounts: Array<{
    title: string;
    value: string;
    icon: string;
  }>;
}

// Stato vuoto: nessun dato di default, tutto si compila dal form
export const initialBrandInfo: BrandInfo = {
  title: "",
  titleShort: "",
  subtitle: "",
  description: "",
  role: "",
  name: "",
  surname: "",
  websiteUrl: "",

  registration: {
    province: "",
    date: "",
    number: "",
    url: "",
  },
  contacts: [],
  accounts: [],
};

// L'icona dei contatti non si sceglie dal form: dipende dal tipo
const contactIcons: Record<ContactType, string> = {
  phone: "i-ph:phone-fill",
  email: "i-ph:envelope-open-fill",
  whatsapp: "i-ph:whatsapp-logo-fill",
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function useBrandInfo() {
  const brandInfo = useState<BrandInfo>("brand-info", () =>
    clone(initialBrandInfo),
  );
  const loaded = useState<boolean>("brand-info-loaded", () => false);

  async function load(force = false) {
    if (loaded.value && !force) return;
    try {
      const data = await $fetch<BrandInfo | null>("/api/brand/brand-info");
      if (data) {
        // Unisce allo stato vuoto: i dati salvati prima dell'aggiunta di
        // nuovi campi (es. role, registration) non li lasciano undefined
        brandInfo.value = {
          ...clone(initialBrandInfo),
          ...data,
          registration: {
            ...initialBrandInfo.registration,
            ...data.registration,
          },
        };
      }
    } catch {
      // API non raggiungibile: restano i valori già presenti
    }
    loaded.value = true;
  }

  async function save(next: BrandInfo) {
    const payload = clone(next);

    // Le icone non si scelgono dal form: si calcolano al salvataggio
    payload.contacts = payload.contacts.map((c) => ({
      ...c,
      value: c.type === "email" ? c.value : normalizePhone(c.value),
      icon: contactIcons[c.type],
    }));

    await $fetch("/api/brand/brand-info", {
      method: "PUT",
      body: payload,
    });
    brandInfo.value = payload;
  }

  return { brandInfo, load, save };
}
