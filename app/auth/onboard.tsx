import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';

const OnboardingScreen = () => {
 const router = useRouter();

 const slides = [
  {
   title: "Welcome to ScanTrack",
   description: "Your ultimate product scanning and tracking solution",
   image: `https://www.shutterstock.com/image-photo/welcome-onboard-support-symbol-concept-260nw-2133778709.jpg`,
   color: ['#6A11CB', '#2575FC'] // Purple to Blue
  },
  {
   title: "Effortless Scanning",
   description: "Scan barcodes with just one tap",
   image: `https://www.shutterstock.com/image-photo/welcome-onboard-support-symbol-concept-260nw-2133778709.jpg`,
   color: ['#11998E', '#38EF7D'] // Teal to Green
  },
  {
   title: "Smart Tracking",
   description: "Monitor your products and get insights",
   image: `https://www.shutterstock.com/image-photo/welcome-onboard-support-symbol-concept-260nw-2133778709.jpg`,
   color: ['#FC466B', '#3F5EFB'] // Pink to Purple
  }
 ];

 return (
  <View style={styles.container}>
   <Swiper
    style={styles.wrapper}
    showsButtons={false}
    loop={false}
    dotStyle={styles.dot}
    activeDotStyle={styles.activeDot}
    paginationStyle={styles.pagination}
   >
    {slides.map((slide, index) => (
     <LinearGradient
      key={index}
      colors={slide.color}
      style={styles.slide}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
     >
      <View style={styles.content}>
       <Image
        source={{ uri: slide.image }}
        style={styles.image}
        resizeMode="contain"
       />
       <View style={styles.textContainer}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
       </View>

       {index === slides.length - 1 && (
        <TouchableOpacity
         style={styles.button}
         onPress={() => router.push('/auth/signIn')}
        >
         <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
       )}
      </View>
     </LinearGradient>
    ))}
   </Swiper>
  </View>
 );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
 wrapper: {},
 slide: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
 },
 content: {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 40,
  paddingBottom: 80,
  paddingTop: 60,
 },
 image: {
  width: '100%',
  height: '50%',
  marginBottom: 30,
 },
 textContainer: {
  alignItems: 'center',
  marginBottom: 40,
 },
 title: {
  color: '#fff',
  fontSize: 28,
  fontWeight: '800',
  marginBottom: 16,
  textAlign: 'center',
 },
 description: {
  color: 'rgba(255,255,255,0.8)',
  fontSize: 16,
  textAlign: 'center',
  lineHeight: 24,
  paddingHorizontal: 20,
 },
 button: {
  width: '100%',
  padding: 18,
  backgroundColor: '#fff',
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 5,
 },
 buttonText: {
  color: '#2575FC',
  fontSize: 18,
  fontWeight: '600',
 },
 dot: {
  backgroundColor: 'rgba(255,255,255,0.3)',
  width: 8,
  height: 8,
  borderRadius: 4,
  margin: 3,
 },
 activeDot: {
  backgroundColor: '#fff',
  width: 20,
  height: 8,
  borderRadius: 4,
  margin: 3,
 },
 pagination: {
  bottom: 70,
 },
});

export default OnboardingScreen;