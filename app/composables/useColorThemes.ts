import {
  colorsPrimary,
  colorsSecondary,
  colorsDark,
} from "~~/shared/utils/colors";

export const useThemeColors = () => {
  const defaultColors: ThemeColors = {
    primary: "#029e9d",
    secondary: "#83c1c5",
    dark: "#014561",
  };

  const primary = useState("theme-primary", () => defaultColors.primary);

  const secondary = useState("theme-secondary", () => defaultColors.secondary);

  const dark = useState("theme-dark", () => defaultColors.dark);

  const applyColors = () => {
    if (!import.meta.client) return;

    document.documentElement.style.setProperty(
      "--color-primary",
      primary.value,
    );

    document.documentElement.style.setProperty(
      "--color-secondary",
      secondary.value,
    );

    document.documentElement.style.setProperty("--color-dark", dark.value);

    localStorage.setItem("color-primary", primary.value);
    localStorage.setItem("color-secondary", secondary.value);
    localStorage.setItem("color-dark", dark.value);
  };

  const loadColors = () => {
    if (!import.meta.client) return;

    primary.value =
      localStorage.getItem("color-primary") ?? defaultColors.primary;

    secondary.value =
      localStorage.getItem("color-secondary") ?? defaultColors.secondary;

    dark.value = localStorage.getItem("color-dark") ?? defaultColors.dark;

    applyColors();
  };

  const setColor = (type: "primary" | "secondary" | "dark", value: string) => {
    switch (type) {
      case "primary":
        primary.value = value;
        break;

      case "secondary":
        secondary.value = value;
        break;

      case "dark":
        dark.value = value;
        break;
    }

    applyColors();
  };

  return {
    primary,
    secondary,
    dark,
    setColor,
    loadColors,
  };
};
