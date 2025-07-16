import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ImageCaptureScreen() {
 const { barcodeData } = useLocalSearchParams();
 const [images, setImages] = useState<string[]>([]);
 const [permission, requestPermission] = useCameraPermissions();
 const [flashMode, setFlashMode] = useState<'off' | 'torch'>('off');
 const [isCameraActive, setIsCameraActive] = useState(true);
 const [mediaPermission, setMediaPermission] = useState<boolean>(false);
 const cameraRef = useRef<CameraView>(null);

 // Request media library permissions on mount
 useEffect(() => {
  const requestMediaPermission = async () => {
   if (Platform.OS !== 'web') {
    try {
     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
     setMediaPermission(status === 'granted');
     if (status !== 'granted') {
      Alert.alert(
       'Permission Required',
       'We need gallery access to select images. Please enable it in your device settings.',
       [{ text: 'OK' }]
      );
     }
    } catch (error) {
     console.error('Error requesting media library permissions:', error);
    }
   }
  };

  requestMediaPermission();
 }, []);

 useFocusEffect(
  useCallback(() => {
   setIsCameraActive(true);
   return () => setIsCameraActive(false);
  }, [])
 );

 const takePicture = async () => {
  if (cameraRef.current && images.length < 5) {
   try {
    const photo = await cameraRef.current.takePictureAsync({
     quality: 0.8,
     skipProcessing: true,
     base64: true,
    });
    setImages([...images, photo.uri]);
   } catch (error) {
    console.error("Error taking picture:", error);
    Alert.alert('Error', 'Failed to take picture. Please try again.');
   }
  }
 };



 const testImage = async () => {
  const formData = new FormData();

  // Append each image to the form data
  images.forEach((uri, index) => {
   // Extract filename from URI
   const filename = uri.split('/').pop();

   // Infer the MIME type from the file extension
   let mimeType = 'image/jpeg';
   if (filename?.endsWith('.png')) mimeType = 'image/png';

   // Append the file
   formData.append('images', {
    uri,
    name: filename || `image_${index}.jpg`,
    type: mimeType,
   } as any);
  });

  console.log("images file--", JSON.stringify(formData, null, 2));
 };

 useEffect(() => {
  testImage();
 }, [images]);



 const removeImage = (index: number) => {
  const newImages = [...images];
  newImages.splice(index, 1);
  setImages(newImages);
 };

 const toggleFlash = () => {
  setFlashMode(flashMode === 'torch' ? 'off' : 'torch');
 };

 if (!permission) {
  return (
   <View style={styles.loadingContainer}>
    <Text>Requesting permissions...</Text>
   </View>
  );
 }

 if (!permission.granted) {
  return (
   <View style={styles.permissionContainer}>
    <Text style={styles.permissionText}>We need your permission to use the camera</Text>
    <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
     <Text style={styles.permissionButtonText}>Grant Permission</Text>
    </TouchableOpacity>
   </View>
  );
 }

 return (
  <LinearGradient
   colors={['gray', 'white', 'gray']}
   style={styles.container}
  >
   <SafeAreaView>
    {/* Header */}
    <View style={styles.header}>
     <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={28} color="#fff" />
     </TouchableOpacity>
     <Text style={styles.headerTitle}>PRODUCT CAPTURE</Text>
     {/* {images.length > 0 && (
      <TouchableOpacity
       style={styles.submitButton}
       onPress={() => {
        // Handle submission with images and barcodeData
        router.push({
         pathname: '/(protected)/photoReview',
         params: {
          barcodeData: String(barcodeData),
          images: JSON.stringify(images)
         }
        });
       }}
      >
       <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
     )} */}
    </View>

    {/* Barcode Display - Movie Ticket Style */}
    <View style={styles.barcodeDisplayContainer}>
     {/* Barcode Visualization */}
     <View style={styles.barcodeVisualization}>
      {Array.from({ length: 45 }).map((_, index) => (
       <View
        key={index}
        style={[
         styles.barcodeLine,
         {
          height: Math.random() * 30 + 26, // Random height for barcode lines
          backgroundColor: index % 2 === 0 ? '#000' : '#333' // Alternating colors
         }
        ]}
       />
      ))}
     </View>

     {/* Barcode Number Display */}
     <Text style={styles.barcodeNumber}>ID:{barcodeData}</Text>
    </View>

    {/* Camera View */}
    <View style={styles.cameraContainer}>
     {isCameraActive && (
      <CameraView
       ref={cameraRef}
       style={styles.camera}
       facing="back"
       enableTorch={flashMode === 'torch'}
       autofocus="on"
      >
       <View style={styles.cameraOverlay}>
        <View style={styles.captureFrame}>
         <View style={[styles.corner, styles.topLeft]} />
         <View style={[styles.corner, styles.topRight]} />
         <View style={[styles.corner, styles.bottomLeft]} />
         <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Text style={styles.captureText}>Align product within frame</Text>
       </View>
      </CameraView>
     )}

     <View style={styles.cameraControls}>
      <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
       <Ionicons
        name={flashMode === 'torch' ? 'flash' : 'flash-off'}
        size={28}
        color="#fff"
       />
      </TouchableOpacity>

      <TouchableOpacity
       style={styles.captureButton}
       onPress={takePicture}
       disabled={images.length >= 5}
      >
       <View style={styles.captureButtonInner}>
        <FontAwesome name="camera" size={24} color="#fff" />
       </View>
      </TouchableOpacity>
     </View>
    </View>

    {/* Image Gallery - Polaroid Style */}
    <ScrollView
     horizontal
     showsHorizontalScrollIndicator={false}
     contentContainerStyle={styles.galleryContainer}
    >
     {images.map((uri, index) => {
      console.log("images in first palce", JSON.stringify(uri, null, 2));
      return (
       <View key={index} style={styles.polaroidCard}>
        <TouchableOpacity onPress={() => removeImage(index)}>
         <AntDesign name="closecircle" size={20} color="#ff4757" />
        </TouchableOpacity>
        <Image source={{ uri }} style={styles.polaroidImage} />
        <View style={styles.polaroidFooter}>
         <Text style={styles.polaroidText}>#{index + 1}</Text>
        </View>
       </View>
      )
     })}

    </ScrollView>
   </SafeAreaView>
  </LinearGradient>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
 loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000',
 },
 permissionContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  backgroundColor: '#0f0c29',
 },
 permissionText: {
  color: '#fff',
  fontSize: 18,
  marginBottom: 20,
  textAlign: 'center',
 },
 permissionButton: {
  backgroundColor: '#302b63',
  paddingVertical: 15,
  paddingHorizontal: 30,
  borderRadius: 30,
 },
 permissionButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
 },
 header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 20,
  paddingHorizontal: 20,
 },
 headerTitle: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  letterSpacing: 1,
 },
 barcodeDisplayContainer: {
  alignItems: 'center',
  marginVertical: 20,
  marginHorizontal: 20,
  backgroundColor: '#fff',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ddd',
  padding: 10
 },
 barcodeVisualization: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start',
  height: 60,
  paddingHorizontal: 10,
  paddingTop: 5,
  borderRadius: 4,
 },
 barcodeLine: {
  width: 3,
  marginRight: 2,
 },
 barcodeNumber: {
  color: 'black',
  fontSize: 18,
  letterSpacing: 5,
  fontWeight: 'bold',
  marginTop: 5,
  fontFamily: 'monospace',
 },
 cameraContainer: {
  height: '52%',
  marginBottom: 6,
  overflow: 'hidden',
 },
 camera: {
  flex: 1,
 },
 cameraOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
 },
 captureFrame: {
  width: '80%',
  height: '70%',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.5)',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  position: 'relative',
 },
 corner: {
  position: 'absolute',
  width: 30,
  height: 30,
  borderColor: '#fff',
 },
 topLeft: {
  top: -1,
  left: -1,
  borderTopWidth: 3,
  borderLeftWidth: 3,
 },
 topRight: {
  top: -1,
  right: -1,
  borderTopWidth: 3,
  borderRightWidth: 3,
 },
 bottomLeft: {
  bottom: -1,
  left: -1,
  borderBottomWidth: 3,
  borderLeftWidth: 3,
 },
 bottomRight: {
  bottom: -1,
  right: -1,
  borderBottomWidth: 3,
  borderRightWidth: 3,
 },
 captureText: {
  marginTop: 20,
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: 16,
  fontWeight: '500',
  textShadowColor: 'rgba(0, 0, 0, 0.5)',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
 },
 cameraControls: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
 },
 controlButton: {
  padding: 10,
  opacity: 0.9,
 },
 captureButton: {
  width: 50,
  height: 50,
  borderRadius: 35,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 3,
  borderColor: '#fff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 5,
  elevation: 5,
 },
 captureButtonInner: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  justifyContent: 'center',
  alignItems: 'center',
 },
 galleryContainer: {
  paddingHorizontal: 15,
  paddingBottom: 20,
 },
 polaroidCard: {
  width: 120,
  height: 130,
  backgroundColor: '#fff',
  borderRadius: 5,
  marginRight: 15,
  padding: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 5,
 },
 polaroidImage: {
  width: '100%',
  height: '80%',
  backgroundColor: '#f1f2f6',
 },
 polaroidFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 5,
  paddingHorizontal: 5,
 },
 polaroidText: {
  color: '#576574',
  fontSize: 12,
  fontWeight: 'bold',
 },
 uploadOptionsContainer: {
  flexDirection: 'row',
 },
 uploadCard: {
  width: 120,
  height: 130,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  borderStyle: 'dashed',
  borderRadius: 5,
  marginRight: 15,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
 },
 uploadText: {
  color: 'rgba(255, 255, 255, 0.7)',
  marginTop: 10,
  fontSize: 12,
  textAlign: 'center',
  fontWeight: 'bold',
 },
 uploadSubText: {
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: 10,
  textAlign: 'center',
  marginTop: 2,
 },
 submitButton: {
  backgroundColor: '#00b894',
  padding: 12,
  borderRadius: 30,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
 },
 submitButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
 },
});
