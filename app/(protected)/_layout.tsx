import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
 return (
  <Stack>
   <Stack.Screen name="(tab)" options={{ headerShown: false }} />
   <Stack.Screen name="profile" options={{ headerShown: false }} />
   <Stack.Screen name="photoUpload" options={{ headerShown: false }} />
   <Stack.Screen name="photoReview" options={{ headerShown: false }} />
  </Stack>
 );
};

export default Layout;