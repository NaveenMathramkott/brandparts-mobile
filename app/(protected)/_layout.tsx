import { Redirect, Stack } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { useAuth } from "../../hooks/useAuth";

const Layout = () => {
 const { isAuthenticated, isLoading } = useAuth();

 if (isLoading) {
  return <Text>Loading...</Text>;
 }

 if (!isAuthenticated) {
  return <Redirect href="/auth/signIn" />;
 }
 return (
  <Stack>
   <Stack.Screen name="(tab)" options={{ headerShown: false }} />
   <Stack.Screen name="photoUpload" options={{ headerShown: false }} />
   <Stack.Screen name="photoReview" options={{ headerShown: false }} />
  </Stack>
 );
};

export default Layout;


{/* <SafeAreaProvider>
   <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="signIn" options={{ headerShown: false }} />
    <Stack.Screen name="onboard" options={{ headerShown: false }} />
    <Stack.Screen name="+not-found" />
   </Stack>
   <StatusBar style="auto" />
  </SafeAreaProvider> */}