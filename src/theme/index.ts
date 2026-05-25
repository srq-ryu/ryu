import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const lightColors = {
  // 古典实景花园色系 (白天)
  primaryGreen: "#3A5A40",    // 深林绿
  secondaryGreen: "#A3B18A",  // 鼠尾草绿
  fountainBlue: "#86B9C1",    // 喷泉池蓝
  roseRed: "#B32D2E",         // 玫瑰红
  marbleWhite: "#F5F5F0",     // 大理石白
  cream: "#FAF9F6",           // 象牙白画布
  surface: "#E9EDE0",         // 浅石色
  card: "#FFFFFF",            // 纯白卡片
  text: "#1B261E",            // 深绿文本
  textMuted: "#588157",       // 柔和绿文本
  border: "#DAD7CD",          // 边框色
  accent: "#B32D2E",          // 玫瑰强调色
};

export const darkColors = {
  // 星光实景花园色系 (黑夜)
  primaryGreen: "#A3B18A",    // 浅鼠尾草绿 (在深色背景下更亮)
  secondaryGreen: "#3A5A40",  // 深林绿
  fountainBlue: "#2A4D52",    // 深夜池水蓝
  roseRed: "#E05D5E",         // 霓虹玫瑰粉
  marbleWhite: "#262B27",     // 深苔藓石色
  cream: "#131714",           // 午夜深绿黑
  surface: "#1E241F",         // 深绿表面
  card: "#262B27",            // 深色卡片
  text: "#E9EDE0",            // 浅灰绿文本
  textMuted: "#A3B18A",       // 鼠尾草绿文本
  border: "#344E41",          // 深绿边框
  accent: "#E05D5E",          // 玫瑰粉强调
};

export const appTheme = (mode: "light" | "dark") => {
  const colors = mode === "light" ? lightColors : darkColors;
  return {
    colors,
    borderRadius: {
      small: 14,
      medium: 22,
      large: 32,
      extraLarge: 40,
    },
    shadow: {
      light: {
        shadowColor: mode === "light" ? "#3A5A40" : "#000000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: mode === "light" ? 0.1 : 0.3,
        shadowRadius: 16,
        elevation: 4,
      },
      medium: {
        shadowColor: mode === "light" ? "#3A5A40" : "#000000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: mode === "light" ? 0.15 : 0.4,
        shadowRadius: 24,
        elevation: 8,
      },
    },
    navigationTheme: {
      ...(mode === "light" ? DefaultTheme : DarkTheme),
      colors: {
        ...(mode === "light" ? DefaultTheme.colors : DarkTheme.colors),
        background: colors.cream,
        card: colors.card,
        primary: colors.primaryGreen,
        text: colors.text,
        border: colors.border,
      },
    },
  };
};

// 保持向后兼容的默认导出
export const colors = lightColors;
export const appColors = lightColors;
export const lightTheme = appTheme("light");
export const darkTheme = appTheme("dark");
