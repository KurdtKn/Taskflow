import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const THEME_STORAGE_KEY = "@taskflow_theme";

const lightTheme = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  primary: "#092870",
  inputBackground: "#FFFFFF",
};

const darkTheme = {
  background: "#000814",
  card: "#020617",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  border: "#0F172A",
  primary: "#3B82F6",
  inputBackground: "#0B1120",
};

type Theme = typeof lightTheme;

type ThemeContextType = {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  theme: lightTheme,
  toggleTheme: () => {},
});

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (savedTheme === "dark") {
          setIsDark(true);
        }

        if (savedTheme === "light") {
          setIsDark(false);
        }
      } catch (error) {
        console.log("Erro ao carregar tema:", error);
      }
    }

    loadTheme();
  }, []);

  async function toggleTheme() {
    try {
      const nextTheme = !isDark;

      setIsDark(nextTheme);

      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        nextTheme ? "dark" : "light"
      );
    } catch (error) {
      console.log("Erro ao salvar tema:", error);
    }
  }

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}