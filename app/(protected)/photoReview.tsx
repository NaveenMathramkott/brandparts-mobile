import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ImageGalleryScreen = () => {
 const params = useLocalSearchParams();
 const [originalImages, setOriginalImages] = useState<string[]>([]);
 const [processedImages, setProcessedImages] = useState<any[]>([]);
 const [isProcessing, setIsProcessing] = useState(false);
 const [processingIndex, setProcessingIndex] = useState(-1);
 const [showProcessed, setShowProcessed] = useState(false);

 // Parse and process image URIs with proper URI decoding
 const imageUris = React.useMemo(() => {
  try {
   const imagesParam = params.images;
   if (!imagesParam) return [];

   // Handle both stringified array and direct array
   const parsedImages = JSON.parse(imagesParam);

   // Process URIs for Expo
   return parsedImages.map((uri: string) => {
    // First decode the URI to handle URL-encoded characters
    let decodedUri = decodeURIComponent(uri);

    // For Android, ensure proper file URI format
    if (Platform.OS === 'android' && decodedUri.startsWith('file://')) {
     // Remove any double slashes that might cause issues in the path part
     let filePath = decodedUri.replace('file://', '');
     filePath = filePath.replace(/\/+/g, '/');

     // Ensure the path starts with /data/ for Android
     if (!filePath.startsWith('/data/') && filePath.startsWith('/user/')) {
      filePath = '/data' + filePath;
     }

     decodedUri = 'file://' + filePath;
    }

    console.log('Original URI:', uri);
    console.log('Processed URI:', decodedUri);

    return decodedUri;
   });
  } catch (error) {
   console.error('Error parsing images:', error);
   return [];
  }
 }, [params.images]);

 const barcodeData = params.barcodeData as string || '';

 useEffect(() => {
  setOriginalImages(imageUris);
 }, [imageUris]);

 const processBackgroundRemoval = async () => {
  if (originalImages.length === 0) {
   Alert.alert("Error", "No images to process");
   return;
  }

  setIsProcessing(true);
  setShowProcessed(false);
  const results = [];
  const errors = [];

  try {
   // Process each image sequentially
   for (let i = 0; i < originalImages.length; i++) {
    setProcessingIndex(i);
    const imageUri = originalImages[i];

    console.log(`Processing image ${i + 1}/${originalImages.length}`);

    try {
     // Extract filename from URI
     const filename = imageUri.split('/').pop();
     const fileExtension = filename?.split('.').pop()?.toLowerCase();

     // Determine MIME type from extension
     let mimeType = 'image/jpeg';
     if (fileExtension === 'png') mimeType = 'image/png';
     else if (fileExtension === 'webp') mimeType = 'image/webp';

     // Create FormData with only the 'file' key
     const formData = new FormData();

     // Create the file object in the format React Native expects
     const file = {
      uri: imageUri,
      name: filename || `image_${Date.now()}_${i}.${fileExtension || 'jpg'}`,
      type: mimeType,
     };

     // Pass image with 'file' key only
     formData.append('file', file as any);

     console.log(`Uploading image ${i + 1} with 'file' key:`, filename);

     const response = await axios.post(
      'https://backgroundcut.co/api/v1/cut/',
      formData,
      {
       headers: {
        'Authorization': `Token `,
        'Content-Type': 'multipart/form-data',
       },
       timeout: 30000, // 30 second timeout
      }
     );

     console.log(`Image ${i + 1} upload successful:`, response.data);
     results.push({
      index: i,
      success: true,
      data: response.data,
      filename: filename,
      originalUri: imageUri
     });

    } catch (imageError) {
     console.error(`Error uploading image ${i + 1}:`, imageError);
     errors.push({
      index: i,
      error: imageError,
      filename: imageUri.split('/').pop(),
      originalUri: imageUri
     });
    }
   }

   // Update state with processed results
   setProcessedImages(results);
   setShowProcessed(true);

   // Show results
   if (results.length > 0) {
    Alert.alert(
     "Processing Complete",
     `Successfully processed ${results.length} out of ${originalImages.length} images`
    );
   }

   if (errors.length > 0) {
    console.log("Errors encountered:", errors);
    Alert.alert(
     "Some images failed",
     `${errors.length} images failed to process. Check console for details.`
    );
   }

   return { results, errors };

  } catch (error) {
   console.error("General processing error:", error);
   Alert.alert("Error", "Failed to process images");
   throw error;
  } finally {
   setIsProcessing(false);
   setProcessingIndex(-1);
  }
 };

 const toggleView = () => {
  setShowProcessed(!showProcessed);
 };

 const currentImages = showProcessed ? processedImages : originalImages;

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

   {/* View Toggle and Process Button */}
   <View style={styles.controlsContainer}>
    {processedImages.length > 0 && (
     <TouchableOpacity
      style={styles.toggleButton}
      onPress={toggleView}
     >
      <Text style={styles.toggleButtonText}>
       {showProcessed ? 'Show Original' : 'Show Processed'}
      </Text>
     </TouchableOpacity>
    )}

    {!showProcessed && (
     <TouchableOpacity
      style={[styles.processButton, isProcessing && styles.processButtonDisabled]}
      onPress={processBackgroundRemoval}
      disabled={isProcessing}
     >
      {isProcessing ? (
       <>
        <ActivityIndicator size="small" color="#fff" />
        <Text style={styles.processButtonText}>
         Processing {processingIndex + 1}/{originalImages.length}
        </Text>
       </>
      ) : (
       <>
        <Ionicons name="cut-outline" size={20} color="#fff" />
        <Text style={styles.processButtonText}>Remove Background</Text>
       </>
      )}
     </TouchableOpacity>
    )}
   </View>

   {/* Processing Status */}
   {isProcessing && (
    <View style={styles.processingStatus}>
     <Text style={styles.processingText}>
      Processing image {processingIndex + 1} of {originalImages.length}...
     </Text>
    </View>
   )}

   {/* Image Grid */}
   {currentImages.length > 0 ? (
    <ScrollView contentContainerStyle={styles.galleryContainer}>
     <View style={styles.imageGrid}>
      {showProcessed ? (
       // Show processed images
       processedImages.map((result, index) => (
        <View key={`processed-${index}`} style={styles.imageCard}>
         <Image
          source={{ uri: result.data.output_image_url }}
          style={styles.image}
          contentFit="cover"
          transition={200}
         />
         <Text style={styles.imageNumber}>{index + 1}</Text>
         <View style={styles.processedBadge}>
          <Text style={styles.processedBadgeText}>Processed</Text>
         </View>
        </View>
       ))
      ) : (
       // Show original images
       originalImages.map((uri, index) => {
        console.log("Original image URI:", uri);
        return (
         <View key={`original-${index}`} style={styles.imageCard}>
          <Image
           source={{ uri }}
           style={styles.image}
           contentFit="cover"
           placeholder="Loading..."
           onError={(error) => {
            console.error(`Error loading image ${index + 1}:`, error);
           }}
           onLoad={() => {
            console.log(`Image ${index + 1} loaded successfully`);
           }}
          />
          <Text style={styles.imageNumber}>{index + 1}</Text>
          {isProcessing && processingIndex === index && (
           <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#00b894" />
           </View>
          )}
         </View>
        )
       })
      )}
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
     { opacity: currentImages.length > 0 ? 1 : 0.5 }
    ]}
    disabled={currentImages.length === 0}
    onPress={() => {
     const imagesToUpload = showProcessed
      ? processedImages.map(result => result.data.output_image_url)
      : originalImages;
     console.log('Uploading:', { barcodeData, images: imagesToUpload });
    }}
   >
    <Text style={styles.uploadButtonText}>
     {showProcessed ? 'UPLOAD PROCESSED' : 'UPLOAD ORIGINAL'}
    </Text>
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
 controlsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  marginBottom: 10,
 },
 toggleButton: {
  backgroundColor: 'rgba(255,255,255,0.2)',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.3)',
 },
 toggleButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
 },
 processButton: {
  backgroundColor: '#00b894',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 25,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,
 },
 processButtonDisabled: {
  backgroundColor: '#636e72',
  opacity: 0.7,
 },
 processButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
  marginLeft: 8,
 },
 processingStatus: {
  backgroundColor: 'rgba(0,0,0,0.7)',
  padding: 10,
  marginHorizontal: 20,
  borderRadius: 8,
  alignItems: 'center',
  marginBottom: 10,
 },
 processingText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
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
  height: '100%',
  backgroundColor: '#f1f2f6',
 },
 imageNumber: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: '#fff',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 15,
  fontSize: 12,
  fontWeight: 'bold',
 },
 processedBadge: {
  position: 'absolute',
  bottom: 10,
  left: 10,
  backgroundColor: '#00b894',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
 },
 processedBadgeText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: 'bold',
 },
 processingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  justifyContent: 'center',
  alignItems: 'center',
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