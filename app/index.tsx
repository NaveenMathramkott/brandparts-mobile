// import useAuthStore from "@/store/authStore"
import { Redirect } from "expo-router"
import * as React from "react"
import { ActivityIndicator, View } from "react-native"
import "react-native-reanimated"
import { useAuth } from "../hooks/useAuth"

const Page = () => {
 const { isAuthenticated, isLoading } = useAuth();

 if (isLoading) {
  return (
   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color={"green"} />
   </View>
  )
 }

 return isAuthenticated ? (
  <Redirect href="/(protected)/(tab)/home" />
 ) : (
  <Redirect href="/signIn" />
 )
}

export default Page
