import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  card: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  accentText: string;
  success: string;
  border: string;
  chipBg: string;
  iconBg: string;
  shadow: string;
}

export const lightColors: ThemeColors = {
  background: '#EFEFEF',
  card: '#FFFFFF',
  primaryText: '#010101',
  secondaryText: '#6B6B6B',
  accent: '#FF6B35',
  accentText: '#FFFFFF',
  success: '#4CAF82',
  border: '#E5E5E5',
  chipBg: '#EFEFEF',
  iconBg: '#EFEFEF',
  shadow: '#000000',
};

export const darkColors: ThemeColors = {
  background: '#0E0E12',
  card: '#1C1C23',
  primaryText: '#F2F2F7',
  secondaryText: '#A1A1AA',
  accent: '#FF7B45',
  accentText: '#FFFFFF',
  success: '#4CAF82',
  border: '#2A2A32',
  chipBg: '#26262E',
  iconBg: '#26262E',
  shadow: '#000000',
};

interface ThemeContextValue {
  isDark: boolean;
  theme: ThemeMode;
  colors: ThemeColors;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = '@dailytracker/theme';

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  theme: 'system',
  colors: lightColors,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setThemeState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch(() => {});
  };

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
  };

  const isDark = theme === 'system' ? system === 'dark' : theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, theme, colors, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);