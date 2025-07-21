import {
 DarkTheme,
 DefaultTheme,
 ThemeProvider,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import React, { useEffect } from "react"
import "react-native-reanimated"

import { LogBox, useColorScheme } from "react-native"

import { Slot } from "expo-router"
import { AuthProvider } from "../components/AuthProvider"
import { useAuth } from "../hooks/useAuth"

SplashScreen.preventAutoHideAsync()

LogBox.ignoreLogs(["Clerk:"])
LogBox.ignoreLogs(['useInsertionEffect must not schedule updates'])

export default function RootLayout() {

 const [loaded] = useFonts({
  SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
 })
 const colorScheme = useColorScheme()
 const { isLoading } = useAuth();

 useEffect(() => {
  if (loaded && !isLoading) {
   SplashScreen.hideAsync()
  }
 }, [loaded, isLoading])

 return (
  <AuthProvider>
   <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
    <Slot />
   </ThemeProvider>
  </AuthProvider>
 );

}
