import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '../../hooks/useAuth';
const ProfileScreen = () => {
 const router = useRouter();
 const { signOut, user, getUserName, getUserEmail, getUserAvatar } = useAuth();

 // Sample user data
 // const user = {
 //  name: 'Alex Johnson',
 //  email: 'alex.johnson@example.com',
 //  joinDate: 'Member since June 2023',
 //  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
 //  stats: {
 //   products: 124,
 //   scans: 567,
 //   contributions: 89
 //  }
 // };

 const menuItems = [
  { icon: 'settings', name: 'Settings', action: () => { } },
  { icon: 'help', name: 'Help Center', action: () => { } },
  {
   icon: 'logout', name: 'Log Out', action: async () => {
    try {
     await signOut();
     router.push(`/signIn`)
    } catch (error) {
     Alert.alert('Error', 'Failed to logout');
    }
   }
  },
 ];

 return (
  <SafeAreaView style={styles.container}>
   <ScrollView showsVerticalScrollIndicator={false}>
    {/* Header with Back Button */}
    <View style={styles.header}>
     <TouchableOpacity
      style={styles.backButton}
      onPress={() => router.back()}
     >
      <Feather name="chevron-left" size={24} color="#007AFF" />
     </TouchableOpacity>
     <Text style={styles.title}>Profile</Text>
     <TouchableOpacity>
      <Feather name="edit" size={22} color="#007AFF" />
     </TouchableOpacity>
    </View>

    {/* Rest of your existing code remains the same */}
    <View style={styles.profileCard}>
     <View style={styles.avatarContainer}>
      {/* <Image
       source={{ uri: user.avatar }}
       style={styles.avatar}
      /> */}
      <TouchableOpacity style={styles.agentAvatarPlaceholder} >
       <Text style={styles.agentInitials}>
        {user?.name?.charAt(0) || "A"}
        {user?.name?.charAt(1) || "A"}
       </Text>
      </TouchableOpacity>
      <View style={styles.verifiedBadge}>
       <MaterialIcons name="verified" size={16} color="#4BC0C0" />
      </View>
     </View>

     <Text style={styles.userName}>{user.name}</Text>
     <Text style={styles.userEmail}>{user.email}</Text>
     {/* <Text style={styles.joinDate}>{user.joinDate}</Text> */}

     {/* Stats Row */}
     <View style={styles.statsContainer}>
      <View style={styles.statItem}>
       <Text style={styles.statNumber}>{user.role}</Text>
       <Text style={styles.statLabel}>Products</Text>
      </View>
      <View style={styles.statItem}>
       <Text style={styles.statNumber}>{user.role}</Text>
       <Text style={styles.statLabel}>Scans</Text>
      </View>
      <View style={styles.statItem}>
       <Text style={styles.statNumber}>{user.role}</Text>
       <Text style={styles.statLabel}>Contributions</Text>
      </View>
     </View>
    </View>

    {/* Menu Items */}
    <View style={styles.menuContainer}>
     {menuItems.map((item, index) => (
      <TouchableOpacity
       key={index}
       style={styles.menuItem}
       onPress={item.action}
      >
       <MaterialIcons
        name={item.icon}
        size={24}
        color="#6c757d"
        style={styles.menuIcon}
       />
       <Text style={styles.menuText}>{item.name}</Text>
       <Feather
        name="chevron-right"
        size={20}
        color="#adb5bd"
       />
      </TouchableOpacity>
     ))}
    </View>

    {/* App Version */}
    <View style={styles.versionContainer}>
     <Text style={styles.versionText}>App Version 2.4.1</Text>
    </View>
   </ScrollView>
  </SafeAreaView >
 );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#eee',
 },
 header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 24,
  paddingBottom: 16,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#e9ecef',
 },
 backButton: {
  position: 'absolute',
  left: 16,
  zIndex: 1,
  padding: 8,
 },
 title: {
  fontSize: 24,
  fontWeight: '700',
  color: '#212529',
  flex: 1,
  textAlign: 'center',
  marginLeft: -24, // Adjust to center properly with back button
 },
 // Rest of your existing styles remain the same
 profileCard: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 24,
  margin: 20,
  marginBottom: 10,
  alignItems: 'center',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
 },
 avatarContainer: {
  position: 'relative',
  marginBottom: 16,
 },
 agentAvatarPlaceholder: {
  width: 100,
  height: 100,
  borderRadius: 60,
  backgroundColor: "#eee",
  justifyContent: "center",
  alignItems: "center",
 },
 agentInitials: {
  color: "#28c1a3",
  fontWeight: "800",
  fontSize: 32,
  textTransform: "uppercase",
  textAlign: "center",
 },
 avatar: {
  width: 100,
  height: 100,
  borderRadius: 50,
  borderWidth: 3,
  borderColor: '#f1f3f5',
 },
 verifiedBadge: {
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 4,
 },

 userName: {
  fontSize: 22,
  fontWeight: '700',
  color: '#212529',
  marginBottom: 4,
 },
 userEmail: {
  fontSize: 16,
  color: '#6c757d',
  marginBottom: 4,
 },
 joinDate: {
  fontSize: 14,
  color: '#adb5bd',
  marginBottom: 24,
 },
 statsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 16,
  paddingHorizontal: 20,
 },
 statItem: {
  alignItems: 'center',
 },
 statNumber: {
  fontSize: 20,
  fontWeight: '700',
  color: '#007AFF',
  marginBottom: 4,
 },
 statLabel: {
  fontSize: 14,
  color: '#6c757d',
 },
 menuContainer: {
  backgroundColor: '#fff',
  borderRadius: 12,
  margin: 20,
  marginTop: 10,
  paddingVertical: 8,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
 },
 menuItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#f1f3f5',
 },
 menuIcon: {
  marginRight: 16,
  width: 24,
 },
 menuText: {
  flex: 1,
  fontSize: 16,
  color: '#495057',
 },
 versionContainer: {
  alignItems: 'center',
  marginVertical: 20,
 },
 versionText: {
  fontSize: 14,
  color: '#adb5bd',
 },
});

export default ProfileScreen;