// utils/resolveIcon.ts
// Sceglie l'icona di un account/social dall'URL (priorità) o dal titolo.
// Le regole sono controllate in ordine: la prima che corrisponde vince.

const DEFAULT_ICON = "ph:app-window";

const iconRules: Array<{ match: string[]; icon: string }> = [
  { match: ["whatsapp", "wa.me"], icon: "ph:whatsapp-logo" },
  { match: ["instagram"], icon: "ph:instagram-logo" },
  { match: ["facebook"], icon: "ph:facebook-logo" },
  { match: ["linkedin"], icon: "ph:linkedin-logo" },
  { match: ["youtube"], icon: "ph:youtube-logo" },
  { match: ["tiktok"], icon: "ph:tiktok-logo" },
  { match: ["twitter"], icon: "ph:twitter-logo" },
  { match: ["x.com"], icon: "ph:x-logo" },
  { match: ["threads"], icon: "ph:threads-logo" },
  { match: ["github"], icon: "ph:github-logo" },
  { match: ["reddit"], icon: "ph:reddit-logo" },
  { match: ["behance"], icon: "ph:behance-logo" },
  { match: ["google"], icon: "ph:google-logo" },
  {
    match: ["humanitas", "idoctors", "doctolib", "miodottore", "mio dottore"],
    icon: "ph:hospital",
  },
  { match: ["tel:"], icon: "ph:phone" },
  { match: ["mailto:"], icon: "ph:mailbox" },
];

function findRule(text: string) {
  const t = text.trim().toLowerCase();
  if (!t) return undefined;
  return iconRules.find((rule) => rule.match.some((key) => t.includes(key)));
}

export function resolveAccountIcon(title: string, url = ""): string {
  return (findRule(url) ?? findRule(title))?.icon ?? DEFAULT_ICON;
}
