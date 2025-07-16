import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image'; // Using expo-image instead of react-native's Image
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ImageGalleryScreen = () => {
 const params = useLocalSearchParams();

 // Parse and process image URIs with proper URI decoding
 const imageUris = React.useMemo(() => {
  try {
   const imagesParam = params.images;
   if (!imagesParam) return [];

   // Handle both stringified array and direct array
   const parsedImages = typeof imagesParam === 'string'
    ? JSON.parse(imagesParam)
    : Array.isArray(imagesParam)
     ? imagesParam
     : [];

   // Process URIs for Expo
   return parsedImages.map((uri: string) => {
    // For Android, ensure proper file URI format
    if (Platform.OS === 'android' && uri.startsWith('file://')) {
     // Remove any double slashes that might cause issues
     return uri.replace(/\/+/g, '/');
    }
    return uri;
   });
  } catch (error) {
   console.error('Error parsing images:', error);
   return [];
  }
 }, [params.images]);

 const barcodeData = params.barcodeData as string || '';

 return (
  <LinearGradient colors={['gray', 'white', 'gray']} style={styles.container}>
   {/* Header */}
   <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()}>
     <Ionicons name="arrow-back" size={28} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>PRODUCT GALLERY</Text>
    <View style={{ width: 28 }} />
   </View>

   {/* Barcode Display */}
   <View style={styles.barcodeContainer}>
    <Text style={styles.barcodeLabel}>PRODUCT CODE</Text>
    <Text style={styles.barcodeValue}>{barcodeData}</Text>
   </View>

   {/* Image Grid */}
   {imageUris.length > 0 ? (
    <ScrollView contentContainerStyle={styles.galleryContainer}>
     <View style={styles.imageGrid}>
      {imageUris.map((uri, index) => (
       <View key={`${uri}-${index}`} style={styles.imageCard}>
        <Image
         source={{ uri }}
         style={styles.image}
         contentFit="cover"
         transition={200}
        />
        <Text style={styles.imageNumber}>{index + 1}</Text>
       </View>
      ))}
     </View>
    </ScrollView>
   ) : (
    <View style={styles.emptyContainer}>
     <Text style={styles.emptyText}>No images available</Text>
    </View>
   )}

   {/* Upload Button */}
   <TouchableOpacity
    style={[
     styles.uploadButton,
     { opacity: imageUris.length > 0 ? 1 : 0.5 }
    ]}
    disabled={imageUris.length === 0}
    onPress={() => console.log('Uploading:', { barcodeData, images: imageUris })}
   >
    <Text style={styles.uploadButtonText}>UPLOAD PRODUCT</Text>
    <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
   </TouchableOpacity>
  </LinearGradient>
 );
};



const styles = StyleSheet.create({
 container: {
  flex: 1,
  paddingBottom: 20,
 },
 header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 20,
  paddingTop: 50,
 },
 headerTitle: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  letterSpacing: 1,
 },
 barcodeContainer: {
  backgroundColor: 'rgba(255,255,255,0.1)',
  padding: 15,
  marginHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
  marginBottom: 20,
 },
 barcodeLabel: {
  color: 'rgba(255,255,255,0.7)',
  fontSize: 12,
  marginBottom: 5,
  letterSpacing: 1,
 },
 barcodeValue: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  letterSpacing: 3,
 },
 galleryContainer: {
  paddingHorizontal: 15,
  paddingBottom: 20,
 },
 imageGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
 },
 imageCard: {
  width: Dimensions.get('window').width / 2.2,
  height: Dimensions.get('window').width / 2.2,
  marginBottom: 15,
  borderRadius: 12,
  backgroundColor: 'rgba(255,255,255,0.1)',
  overflow: 'hidden',
  position: 'relative',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
 },
 image: {
  width: '100%',
  height: '80%',
  backgroundColor: '#f1f2f6',
 },
 imageNumber: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: '#fff',
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 20,
  fontSize: 14,
  fontWeight: 'bold',
 },
 uploadButton: {
  backgroundColor: '#00b894',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 18,
  borderRadius: 30,
  marginHorizontal: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
 },
 uploadButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  marginRight: 10,
 },
 emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
 },
 emptyText: {
  color: 'rgba(255,255,255,0.5)',
  fontSize: 16,
 },
});

export default ImageGalleryScreen;