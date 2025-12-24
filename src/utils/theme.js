import { useColorScheme } from "react-native";

const lightTheme = {
  colors: {
    primary: "#FF6B35",
    primaryDark: "#E55A2B",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceElevated: "#F8F9FA",
    text: "#1A1A1A",
    textSecondary: "#6B6B6B",
    border: "#E5E7EB",
    input: "#F5F5F5",
    placeholder: "#9CA3AF",
    tabBarBackground: "#FFFFFF",
    tabBarBorder: "#E5E7EB",
    tabBarActive: "#FF6B35",
    tabBarInactive: "#6B6B6B",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  elevation: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    button: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    modal: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
  },
  statusBarStyle: "dark",
};

export const useTheme = () => {
  return lightTheme;
};
