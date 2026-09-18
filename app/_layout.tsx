import "../global.css"
import { Stack } from "expo-router";
import AuthProvider from "../components/Firebase/AuthProvider";
import { ThemeProvider } from "../components/shared/theme";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
}