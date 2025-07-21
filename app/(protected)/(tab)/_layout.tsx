import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import {
 Image,
 ImageSourcePropType,
 Pressable,
 StyleSheet,
 Text
} from "react-native";
import Animated, {
 useAnimatedStyle,
 useSharedValue,
 withRepeat,
 withSequence,
 withSpring,
 withTiming
} from "react-native-reanimated";
import { home, list, profile } from "../../../assets/icons/index";

const TabIcon = ({
 source,
 focused,
 name,
}: {
 source: ImageSourcePropType;
 focused: boolean;
 name: string;
}) => {
 const scale = useSharedValue(1);
 const posY = useSharedValue(0);
 const focColor = useSharedValue("#355245");
 const rotation = useSharedValue(0);

 const animatedStyles = useAnimatedStyle(() => ({
  transform: [
   { scale: scale.value },
   { translateY: posY.value },
   { rotate: `${rotation.value}deg` },
  ],
  backgroundColor: "#ffff",
  width: 60,
  height: 60,
  borderRadius: 999,
  color: focColor.value,
  borderTopWidth: 4,
  borderRightWidth: 3,
  borderLeftWidth: 3,
 }));

 useEffect(() => {
  let intervalId: NodeJS.Timeout;

  const startAnimation = () => {
   rotation.value = withRepeat(
    withSequence(
     withTiming(-10, { duration: 150 }),
     withTiming(10, { duration: 300 }),
     withTiming(0, { duration: 150 })
    ),
    4,
    true
   );
  };

  if (focused) {
   // Start animation immediately when focused
   startAnimation();

   // Set up interval for periodic animation only when focused
   intervalId = setInterval(() => {
    startAnimation();
   }, 10000);

   scale.value = withSpring(.9);
   posY.value = withSpring(0, {
    damping: 10,
    stiffness: 100,
   });
   focColor.value = "#61CE70";
  } else {
   scale.value = withSpring(0.8, { damping: 10 });
   posY.value = withSpring(0);
   focColor.value = "#979797";
   rotation.value = 0;
  }

  return () => {
   clearInterval(intervalId);
   rotation.value = 0;
  };
 }, [focused]);

 return (
  <Animated.View
   style={[
    styles.outerContainer,
    animatedStyles,
    {
     borderWidth: focused ? 1 : 0,
     borderColor: focused ? "#DC3C22" : "#fff",
    },
   ]}
  >
   <Image
    source={source}
    tintColor={focused ? "#DC3C22" : "gray"}
    resizeMode="contain"
    style={styles.icon}
   />

   <Text
    style={[
     styles.label,
     {
      color: focused ? "#DC3C22" : "gray",
      fontWeight: focused ? "700" : "500",
     },
    ]}
   >
    {name}
   </Text>
  </Animated.View>
 );
};
export default function TabLayout() {

 return (
  <Tabs
   initialRouteName="home"
   screenOptions={{
    tabBarActiveTintColor: "white",
    tabBarInactiveTintColor: "white",
    tabBarShowLabel: false,
    tabBarButton: (props) => {
     const { ref, ...rest } = props;
     return (
      <Pressable
       {...rest}
       android_ripple={null}
       pressRetentionOffset={20}
      />
     );
    },
    tabBarStyle: {
     backgroundColor: "#fff",
     position: 'absolute',
     left: 20,
     right: 20,
     bottom: 20,
     height: 60,
     borderRadius: 30,
     paddingBottom: 0,
     display: "flex",
     justifyContent: "space-around",
     alignItems: "center",
     flexDirection: "row",
     borderTopWidth: 0,
     elevation: 100,
     shadowColor: "#000",
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.25,
     shadowRadius: 5,
     marginHorizontal: 80
    },
    tabBarItemStyle: {
     height: 38,
     margin: 5,
    },
   }}
  >
   <Tabs.Screen
    name="profile"
    options={{
     title: "Profile",
     headerShown: false,
     tabBarIcon: ({ focused }) => (
      <TabIcon source={profile} focused={focused} name="profile" />
     ),
    }}
   />
   <Tabs.Screen
    name="home"
    options={{
     title: "Home",
     headerShown: false,
     tabBarIcon: ({ focused }) => (
      <TabIcon source={home} focused={focused} name="Home" />
     ),
    }}
   />
   <Tabs.Screen
    name="barcode"
    options={{
     title: "Scan",
     headerShown: false,
     tabBarIcon: ({ focused }) => (
      <TabIcon source={list} focused={focused} name="Scan" />
     ),
    }}
   />
  </Tabs>
 );
}

const styles = StyleSheet.create({
 outerContainer: {
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 999,
  padding: 8,
 },
 innerContainer: {
  borderRadius: 999,
  height: 38,
  alignItems: "center",
  justifyContent: "center",
 },
 icon: {
  width: 24,
  height: 24,
 },
 label: {
  fontSize: 12,
  marginTop: 2,
  width: 50,
  textAlign: "center",
  marginBottom: 4,
 },
});
