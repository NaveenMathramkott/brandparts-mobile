import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
 Alert,
 Image,
 Modal,
 Platform,
 ScrollView,
 StyleSheet,
 Text,
 TouchableOpacity,
 View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../../components/Loader";
import { useAuth } from "../../hooks/useAuth";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ImageCaptureScreen() {
 const { barcodeData } = useLocalSearchParams();
 const { user, accessToken } = useAuth();
 const [images, setImages] = useState<string[]>([]);
 const [processedResults, setProcessedResults] = useState({});
 const [bgRemovedImages, setBgRemovedImages] = useState<any[]>([]);
 const [isUploading, setIsUploading] = useState(false);
 const [permission, requestPermission] = useCameraPermissions();
 const [flashMode, setFlashMode] = useState<"off" | "torch">("off");
 const [isCameraActive, setIsCameraActive] = useState(true);
 const [mediaPermission, setMediaPermission] = useState<boolean>(false);
 const cameraRef = useRef<CameraView>(null);

 // Request media library permissions on mount
 useEffect(() => {
  const requestMediaPermission = async () => {
   if (Platform.OS !== "web") {
    try {
     const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
     setMediaPermission(status === "granted");
     if (status !== "granted") {
      Alert.alert(
       "Permission Required",
       "We need gallery access to select images. Please enable it in your device settings.",
       [{ text: "OK" }]
      );
     }
    } catch (error) {
     console.error("Error requesting media library permissions:", error);
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
    Alert.alert("Error", "Failed to take picture. Please try again.");
   }
  } else {
   Alert.alert("Maximum Limit", "You can only take 5 photos");
  }
 };

 const removeBackgroundApi = async () => {
  // Check if we have images to upload
  if (images.length === 0) {
   Alert.alert("Error", "No images to upload");
   return;
  }

  setIsUploading(true);

  try {
   console.log(`Processing ${images.length} images in bulk`);

   // Create FormData for all images
   const formData = new FormData();

   // Process each image and add to FormData
   for (let i = 0; i < images.length; i++) {
    const imageUri = images[i];

    // Extract filename from URI
    const filename = imageUri.split("/").pop();
    const fileExtension = filename?.split(".").pop()?.toLowerCase();

    // Determine MIME type from extension
    let mimeType = "image/jpeg";
    if (fileExtension === "png") mimeType = "image/png";
    else if (fileExtension === "webp") mimeType = "image/webp";

    // Create the file object in the format React Native expects
    const file = {
     uri: imageUri,
     name:
      filename || `image_${Date.now()}_${i}.${fileExtension || "jpg"}`,
     type: mimeType,
    };

    // Append each image to FormData with 'file' key (creates an array)
    formData.append("productImages", file as any);

    console.log(`Added image ${i + 1} to FormData:`, filename);
   }

   console.log(`Uploading ${images.length} images in single request`);

   // Make single API call with all images
   const response = await axios.post(
    `${apiUrl}/api/product/remove-background`,
    formData,
    {
     headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
     },
     timeout: 30000, // Increased timeout for bulk upload
    }
   );

   console.log("Bulk upload successful:", response.data);

   // Process the response
   const results = {
    success: true,
    data: response.data,
    totalImages: images.length,
    uploadedAt: new Date().toISOString(),
   };

   // Update state with processed results
   setProcessedResults(results);
   setBgRemovedImages(response?.data?.results);

   // Clear original images after successful upload
   setImages([]);

   // Show success message
   Alert.alert(
    "Upload Complete",
    `Successfully processed ${images.length} images in bulk`
   );

   return { results, errors: [] };
  } catch (error) {
   console.error("Bulk upload error:", error);

   // Handle different error types
   let errorMessage = "Failed to process images";
   if (error.response) {
    errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || "Unknown error"
     }`;
   } else if (error.request) {
    errorMessage = "Network error: Unable to reach server";
   } else if (error.code === "ECONNABORTED") {
    errorMessage = "Upload timeout: Try with fewer images";
   }

   Alert.alert("Upload Error", errorMessage);

   return { results: [], errors: [{ error, totalImages: images.length }] };
  } finally {
   setIsUploading(false);
  }
 };

 const removeImage = (index: number) => {
  const newImages = [...images];
  newImages.splice(index, 1);
  setImages(newImages);
 };

 const removeProcessedImage = (index: number) => {
  const newResults = [...bgRemovedImages];
  newResults.splice(index, 1);
  setBgRemovedImages(newResults);
 };

 const toggleFlash = () => {
  setFlashMode(flashMode === "torch" ? "off" : "torch");
 };


 const uploadImage = async () => {
  setIsUploading(true);
  if (bgRemovedImages.length === 0 && !barcodeData) {
   return;
  }
  const imageUrls = bgRemovedImages.map(
   (item) => item?.data?.output_image_url
  );
  const newPayload = {
   "image-urls": imageUrls,
   productId: barcodeData,
   skuId: barcodeData,
   userId: user?.id,
   username: user?.name,
   seller: user?.seller,
   sellerId: user?.sellerId
  };
  console.log(
   "new payload----",
   JSON.stringify(newPayload, null, 2)
  );
  try {
   await axios.post(
    `${apiUrl}/api/product/upload-product-images`,
    newPayload,
    {
     headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
     },
    }
   );

   return Alert.alert(
    "Upload Successfull",
    `Created new product ${barcodeData}`,
    [
     {
      text: "OK",
      onPress: () => {
       router.push(`/(protected)/(tab)/barcode`);
      },
      style: "default",
     },
    ]
   );
  } catch (error) {
   console.log("error", error);
   Alert.alert(
    "Duplicate found",
    "Failed to upload images Try with other product or SKU."
   );
  } finally {
   setIsUploading(false);
  }
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
    <Text style={styles.permissionText}>
     We need your permission to use the camera
    </Text>
    <TouchableOpacity
     style={styles.permissionButton}
     onPress={requestPermission}
    >
     <Text style={styles.permissionButtonText}>Grant Permission</Text>
    </TouchableOpacity>
   </View>
  );
 }



 return (
  <LinearGradient colors={["gray", "white", "gray"]} style={styles.container}>
   <SafeAreaView>
    {/* Header */}
    <View style={styles.header}>
     <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={28} color="#fff" />
     </TouchableOpacity>
     <Text style={styles.headerTitle}>
      {bgRemovedImages.length === 0 ? "REMOVE BACKGROUND" : "UPLOAD"}
     </Text>
     <TouchableOpacity
      style={[
       styles.uploadButton,
       bgRemovedImages.length === 0 && styles.uploadButtonDisabled,
      ]}
      onPress={uploadImage}
      disabled={isUploading && bgRemovedImages.length === 0}
     >
      {isUploading ? (
       <Text style={styles.uploadButtonText}>Uploading...</Text>
      ) : (
       <Ionicons name="cloud-upload" size={20} color="#fff" />
      )}
     </TouchableOpacity>
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
          height: Math.random() * 10 + 20, // Random height for barcode lines
          backgroundColor: index % 2 === 0 ? "#000" : "#333", // Alternating colors
         },
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
      <>
       <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        enableTorch={flashMode === "torch"}
        autofocus="on"
       />
       <View style={styles.cameraOverlay}>
        <View style={styles.captureFrame}>
         <View style={[styles.corner, styles.topLeft]} />
         <View style={[styles.corner, styles.topRight]} />
         <View style={[styles.corner, styles.bottomLeft]} />
         <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Text style={styles.captureText}>
         Align product within frame
        </Text>
       </View>
      </>
     )}

     <View style={styles.cameraControls}>
      <TouchableOpacity
       style={styles.controlButton}
       onPress={toggleFlash}
      >
       <Ionicons
        name={flashMode === "torch" ? "flash" : "flash-off"}
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
     {/* Show processed results if available, otherwise show captured images */}
     {bgRemovedImages.length > 0 ? (
      <>
       {bgRemovedImages.map((result, index) => (
        <View key={index} style={styles.polaroidCard}>
         <View style={styles.polaroidHeader}>
          <Text style={styles.polaroidText}>#{index + 1}</Text>
          <TouchableOpacity
           onPress={() => removeProcessedImage(index)}
          >
           <AntDesign name="closecircle" size={20} color="#ff4757" />
          </TouchableOpacity>
         </View>
         <Image
          source={{ uri: result?.data?.output_image_url }}
          style={styles.polaroidImage}
         />
        </View>
       ))}
      </>
     ) : (
      <>
       {images.map((uri, index) => (
        <View key={index} style={styles.polaroidCard}>
         <View style={styles.polaroidHeader}>
          <Text style={styles.polaroidText}>#{index + 1}</Text>
          <TouchableOpacity onPress={() => removeImage(index)}>
           <AntDesign name="closecircle" size={20} color="#ff4757" />
          </TouchableOpacity>
         </View>
         <Image source={{ uri }} style={styles.polaroidImage} />
        </View>
       ))}
      </>
     )}
    </ScrollView>
    <TouchableOpacity
     style={[
      styles.submitButton,
      images.length === 0 && styles.submitButtonDisabled,
     ]}
     onPress={removeBackgroundApi}
     disabled={isUploading}
    >
     {isUploading ? (
      <Text style={styles.submitButtonText}>Removing BG...</Text>
     ) : (
      <>
       <Ionicons name="pricetag" size={20} color="#fff" />
       <Text style={styles.submitButtonText}>Remove Background</Text>
      </>
     )}
    </TouchableOpacity>
   </SafeAreaView>
   <Modal
    visible={isUploading}
    transparent={true}
    animationType="fade"
   ><View style={styles.loaderStyle}>
     <Loader />
    </View></Modal>
  </LinearGradient>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
 loadingContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#000",
 },
 permissionContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  backgroundColor: "#0f0c29",
 },
 permissionText: {
  color: "#fff",
  fontSize: 18,
  marginBottom: 20,
  textAlign: "center",
 },
 permissionButton: {
  backgroundColor: "#302b63",
  paddingVertical: 15,
  paddingHorizontal: 30,
  borderRadius: 30,
 },
 permissionButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
 },
 header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: 20,
  paddingHorizontal: 20,
  height: 60,
 },
 headerTitle: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
  letterSpacing: 1,
 },
 barcodeDisplayContainer: {
  alignItems: "center",
  marginVertical: 10,
  marginHorizontal: 20,
  backgroundColor: "#fff",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#ddd",
  padding: 10,
 },
 barcodeVisualization: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "flex-start",
  height: 30,
  paddingHorizontal: 10,
  paddingTop: 5,
  borderRadius: 4,
 },
 barcodeLine: {
  width: 3,
  marginRight: 2,
 },
 barcodeNumber: {
  color: "black",
  fontSize: 18,
  letterSpacing: 5,
  fontWeight: "bold",
  marginTop: 5,
  fontFamily: "monospace",
 },
 cameraContainer: {
  height: 360,
  width: "100%",
  marginBottom: 6,
  overflow: "hidden",
  position: "relative",
 },
 camera: {
  flex: 1,
  width: "100%",
  height: "100%",
 },
 cameraOverlay: {
  flex: 1,
  backgroundColor: "transparent",
  position: "absolute",
  top: "46%",
  left: "50%",
  transform: "translate(-50%, -60%)",
  height: "60%",
  width: "80%",
 },
 captureFrame: {
  width: "100%",
  height: "100%",
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.5)",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  position: "relative",
 },
 corner: {
  position: "absolute",
  width: 30,
  height: 30,
  borderColor: "#fff",
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
  marginTop: 10,
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: 16,
  fontWeight: "500",
  textShadowColor: "rgba(0, 0, 0, 0.5)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
  textAlign: "center",
 },
 cameraControls: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  padding: 10,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
 },
 controlButton: {
  padding: 10,
  opacity: 0.9,
 },
 captureButton: {
  width: 50,
  height: 50,
  borderRadius: 35,
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 3,
  borderColor: "#fff",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 5,
  elevation: 5,
 },
 captureButtonInner: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  justifyContent: "center",
  alignItems: "center",
 },
 galleryContainer: {
  paddingHorizontal: 15,
  paddingBottom: 20,
 },
 polaroidCard: {
  width: 120,
  height: 160,
  backgroundColor: "#fff",
  borderRadius: 5,
  marginRight: 15,
  padding: 4,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 5,
 },
 polaroidImage: {
  width: "100%",
  height: "80%",
  backgroundColor: "#f1f2f6",
  marginTop: 6,
  borderRadius: 8,
 },
 polaroidHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 2,
  paddingHorizontal: 2,
 },
 polaroidText: {
  color: "#576574",
  fontSize: 14,
  fontWeight: 700,
 },
 uploadOptionsContainer: {
  flexDirection: "row",
 },

 submitButton: {
  backgroundColor: '#fb626c',
  padding: 10,
  borderRadius: 30,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
  marginHorizontal: 20,
 },
 submitButtonDisabled: {
  backgroundColor: "#636e72",
  opacity: 0.6,
 },
 submitButtonText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "bold",
  paddingLeft: 10,
 },
 uploadButton: {
  backgroundColor: '#fb626c',
  padding: 10,
  borderRadius: 30,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
 },
 uploadButtonDisabled: {
  backgroundColor: "#636e72",
  opacity: 0.6,
 },
 uploadButtonText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "bold",
 },
 loaderStyle: {
  flex: 1,
  backgroundColor: "rgba(255, 255, 255, 0.2)",
 },
});
