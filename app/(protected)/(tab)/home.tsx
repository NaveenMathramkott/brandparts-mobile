import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
 Dimensions,
 ScrollView,
 StyleSheet,
 Text,
 TouchableOpacity,
 View
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../hooks/useAuth";

const DashboardScreen = () => {
 const router = useRouter();
 const { user } = useAuth();
 const [dashboardData, setDashboardData] = useState({})
 const screenWidth = Dimensions.get("window").width;


 const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
   return "Good Morning";
  } else if (currentHour < 17) {
   return "Good Afternoon";
  } else if (currentHour < 20) {
   return "Good Evening";
  } else {
   return "Good Night";
  }
 }

 const getDashboardMonthlyData = async () => {
  try {
   // Replace with your actual API endpoint
   const response = await axios.get(
    `http://192.168.1.147:5000/api/product/dashboard?userId=${user?.id}`,

    {
     headers: {
      "Content-Type": "application/json",
     },
    }
   );

   return response.data;
  } catch (error) {
   console.error("Auth service error:", error);
   throw error;
  }
 }

 useEffect(() => {
  const fetchData = async () => {
   try {
    const data = await getDashboardMonthlyData();
    setDashboardData(data);
   } catch (error) {
    console.error("Error fetching dashboard data:", error);
   }
  };

  fetchData();
 }, []);


 const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  useShadowColorFromDataset: true,
  propsForDots: {
   r: "4",
   strokeWidth: "2",
   stroke: "#fff",
  },
  fillShadowGradient: "#007AFF",
  fillShadowGradientOpacity: 0.2,
 };


 return (
  <SafeAreaView style={styles.container}>
   <ScrollView >
    {/* Header */}
    <View style={styles.header}>
     <View>
      <Text style={styles.title} numberOfLines={1}>Hi {user?.name}</Text>
      <Text style={styles.subtitle}>{getGreeting()}</Text>
     </View>
     <View style={styles.agentAvatarPlaceholder}>
      <Text style={styles.agentInitials}>
       {user?.name?.charAt(0) || "N"}
       {user?.name?.charAt(1) || "A"}
      </Text>
     </View>
    </View>

    {/* Stats Cards */}
    <View style={styles.statsContainer}>
     <View style={[styles.statCard, { backgroundColor: "#4BC0C0" }]}>
      <MaterialIcons name="inventory" size={24} color="white" />
      <Text style={styles.statNumber}>{dashboardData?.stats?.products}</Text>
      <Text style={styles.statLabel}>Products</Text>
      <Text style={styles.statChange}>
       ↑ {dashboardData?.stats?.monthlyGrowth}% this month
      </Text>
     </View>

     <View style={[styles.statCard, { backgroundColor: "#36A2EB" }]}>
      <MaterialIcons name="photo-library" size={24} color="white" />
      <Text style={styles.statNumber}>{dashboardData?.stats?.images}</Text>
      <Text style={styles.statLabel}>Images</Text>
      <Text style={styles.statChange}>↑ {dashboardData?.stats?.monthlyGrowth}% This month </Text>
     </View>
    </View>

    {/* Quick Actions */}
    <View style={styles.actionsContainer}>
     <TouchableOpacity
      style={styles.actionButton}
      onPress={() => router.push("/(protected)/(tab)/profile")}
     >
      <MaterialIcons name="view-carousel" size={20} color="#007AFF" />
      <Text style={styles.actionText}>View Profile</Text>
     </TouchableOpacity>

     <TouchableOpacity
      style={styles.actionButton}
      onPress={() => router.push("/(protected)/(tab)/barcode")}
     >
      <MaterialIcons name="camera-alt" size={20} color="#007AFF" />
      <Text style={styles.actionText}>Scan Barcode</Text>
     </TouchableOpacity>
    </View>

    {/* Monthly Trend Chart */}
    <View style={styles.chartContainer}>
     <View style={styles.chartHeader}>
      <Text style={styles.chartTitle}>Monthly Upload Trend</Text>
      <Text style={styles.chartSubtitle}>Products vs Images</Text>
     </View>
     {dashboardData?.monthlyData ? <ScrollView horizontal>
      <LineChart
       data={dashboardData?.monthlyData}
       width={screenWidth}
       height={220}
       chartConfig={chartConfig}
       bezier
       style={styles.chart}
       withVerticalLines={false}
       withHorizontalLines={false}
      />

     </ScrollView> : <Text>No Data</Text>}

    </View>

   </ScrollView>
  </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#eee",
 },
 header: {
  paddingHorizontal: 24,
  paddingVertical: 16,
  backgroundColor: "#fff",
  borderBottomWidth: 1,
  borderBottomColor: "#e9ecef",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: 'center'
 },
 title: {
  fontSize: 24,
  fontWeight: "700",
  color: "#212529",
  textTransform: "capitalize",
 },
 agentAvatarPlaceholder: {
  width: 40,
  height: 40,
  borderRadius: 60,
  backgroundColor: "#eee",
  justifyContent: "center",
  alignItems: "center",
 },
 agentInitials: {
  color: '#fb626c',
  fontWeight: "800",
  fontSize: 19,
  textTransform: "uppercase",
  textAlign: "center",
 },
 subtitle: {
  fontSize: 14,
  color: "#6c757d",
  marginTop: 4,
 },
 statsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  padding: 20,
  paddingBottom: 10,
 },
 statCard: {
  width: "48%",
  borderRadius: 12,
  padding: 20,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
 },
 statNumber: {
  fontSize: 28,
  fontWeight: "700",
  color: "#fff",
  marginVertical: 8,
 },
 statLabel: {
  fontSize: 16,
  color: "rgba(255,255,255,0.9)",
  fontWeight: "500",
 },
 statChange: {
  fontSize: 12,
  color: "rgba(255,255,255,0.8)",
  marginTop: 8,
 },
 actionsContainer: {
  flexDirection: "row",
  justifyContent: "center",
  paddingHorizontal: 20,
  paddingTop: 12,
 },
 actionButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 20,
  paddingVertical: 10,
  paddingHorizontal: 16,
  marginHorizontal: 8,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
 },
 actionText: {
  marginLeft: 8,
  color: "#007AFF",
  fontWeight: "600",
 },
 chartContainer: {
  margin: 20,
  marginBottom: 0,
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 16,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
 },
 chartHeader: {
  marginBottom: 16,
 },
 chartTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#212529",
 },
 chartSubtitle: {
  fontSize: 14,
  color: "#6c757d",
 },
 chart: {
  borderRadius: 8,
  marginTop: 8,
  marginLeft: -10
 },
});

export default DashboardScreen;
