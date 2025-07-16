import {
 DarkTheme,
 DefaultTheme,
 ThemeProvider,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import React, { useEffect } from "react"
import "react-native-reanimated"

import { ActivityIndicator, LogBox, useColorScheme, View } from "react-native"

import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider } from "../components/AuthProvider"
import { useAuth } from "../hooks/useAuth"

SplashScreen.preventAutoHideAsync()

LogBox.ignoreLogs(["Clerk:"])
LogBox.ignoreLogs(['useInsertionEffect must not schedule updates'])

const AppContent: React.FC = () => {

 const [loaded] = useFonts({
  SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
 })
 const colorScheme = useColorScheme()
 const { isAuthenticated, isLoading } = useAuth();

 useEffect(() => {
  if (loaded && !isLoading) {
   SplashScreen.hideAsync()
  }
 }, [loaded, isLoading])

 if (isLoading) {
  return (
   <View style={{ flex: 1 }}>
    <ActivityIndicator size="large" color="#007AFF" />
   </View>
  );
 }

 return isAuthenticated ? (
  <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
   <AuthProvider>

    <SafeAreaProvider>
     <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
     </Stack>
     <StatusBar style="auto" />
    </SafeAreaProvider>
   </AuthProvider>
  </ThemeProvider>
 ) : (
  <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
   <AuthProvider>

    <SafeAreaProvider>
     <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signIn" options={{ headerShown: false }} />
      <Stack.Screen name="onboard" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
     </Stack>
     <StatusBar style="auto" />
    </SafeAreaProvider>
   </AuthProvider>
  </ThemeProvider>
 );
};



export default function RootLayout() {
 return (
  <AuthProvider>
   <AppContent />
  </AuthProvider>
 );

}
