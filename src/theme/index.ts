import { DefaultTheme } from "@react-navigation/native";

export const colors = {
  primaryGreen: "#A8D5BA",
  cream: "#F8F1E5",
  warmOrange: "#F4A261",
  text: "#2F3A30",
  card: "#FFFFFF",
  muted: "#7A857A",
};

export const appTheme = {
  colors,
  navigationTheme: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.cream,
      card: colors.card,
      primary: colors.primaryGreen,
      text: colors.text,
      border: "#DCE6D6",
    },
  },
};
