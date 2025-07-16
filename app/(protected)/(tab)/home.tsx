import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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

const DashboardScreen = () => {
 const router = useRouter();
 const screenWidth = Dimensions.get("window").width;

 // Sample data
 const stats = {
  products: 1243,
  images: 5678,
  monthlyGrowth: 12.5,
 };

 // Monthly data
 const monthlyData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
   {
    data: [120, 145, 178, 200, 220, 243, 120, 145, 178, 200, 220, 243,],
    color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
    strokeWidth: 3,
   },
   {
    data: [80, 110, 135, 360, 185, 210, 120, 15, 178, 240, 320, 243,],
    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
    strokeWidth: 3,
   },
  ],
 };





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
      <Text style={styles.title}>Hi Naveen</Text>
      <Text style={styles.subtitle}>Last updated: Today, 10:30 AM</Text>
     </View>
     <TouchableOpacity style={styles.agentAvatarPlaceholder} onPress={() => router.push("/(protected)/profile")}  >
      <Text style={styles.agentInitials}>
       NA
       {/* {user?.username?.charAt(0) || "A"} */}
       {/* {user?.username?.charAt(1) || "A"} */}
      </Text>
     </TouchableOpacity>
    </View>

    {/* Stats Cards */}
    <View style={styles.statsContainer}>
     <View style={[styles.statCard, { backgroundColor: "#4BC0C0" }]}>
      <MaterialIcons name="inventory" size={24} color="white" />
      <Text style={styles.statNumber}>{stats.products}</Text>
      <Text style={styles.statLabel}>Products</Text>
      <Text style={styles.statChange}>
       ↑ {stats.monthlyGrowth}% this month
      </Text>
     </View>

     <View style={[styles.statCard, { backgroundColor: "#36A2EB" }]}>
      <MaterialIcons name="photo-library" size={24} color="white" />
      <Text style={styles.statNumber}>{stats.images}</Text>
      <Text style={styles.statLabel}>Images</Text>
      <Text style={styles.statChange}>↑ 8.2% this month</Text>
     </View>
    </View>

    {/* Quick Actions */}
    <View style={styles.actionsContainer}>
     <TouchableOpacity
      style={styles.actionButton}
      onPress={() => router.push("/(protected)/(tab)/product")}
     >
      <MaterialIcons name="view-carousel" size={20} color="#007AFF" />
      <Text style={styles.actionText}>View Product</Text>
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
     <ScrollView horizontal>
      <LineChart
       data={monthlyData}
       width={screenWidth}
       height={220}
       chartConfig={chartConfig}
       bezier
       style={styles.chart}
       withVerticalLines={false}
       withHorizontalLines={false}
      />

     </ScrollView>

    </View>
    <View style={[styles.chartContainer, { marginBottom: 90 }]}>
     <View style={styles.chartHeader}>
      <Text style={styles.chartTitle}>Monthly Upload Trend</Text>
      <Text style={styles.chartSubtitle}>Products vs Images</Text>
     </View>
     <ScrollView horizontal>
      <LineChart
       data={monthlyData}
       width={screenWidth}
       height={220}
       chartConfig={chartConfig}
       style={styles.chart}
       withVerticalLines={false}
       withHorizontalLines={false}
      />

     </ScrollView>

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
  color: "#28c1a3",
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
