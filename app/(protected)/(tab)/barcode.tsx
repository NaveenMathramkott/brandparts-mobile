import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BarcodeScanner() {
 const router = useRouter();
 const [permission, requestPermission] = useCameraPermissions();
 const [scanned, setScanned] = useState(false);
 const [isActive, setIsActive] = useState(false);
 const [scannedData, setScannedData] = useState('');
 const [showModal, setShowModal] = useState(false);

 // Handle camera activation with screen focus
 useFocusEffect(
  useCallback(() => {
   setIsActive(true);
   return () => {
    setIsActive(false);
    setScanned(false);
    setShowModal(false);
   };
  }, [])
 );

 // Request camera permissions
 useEffect(() => {
  if (!permission) {
   requestPermission();
  }
 }, [permission]);

 const handleBarCodeScanned = ({ data }) => {
  setScanned(true);
  setScannedData(data);
  setShowModal(true);
 };

 const handleContinue = () => {
  setShowModal(false);
  router.push({
   pathname: '/(protected)/photoUpload',
   params: { barcodeData: scannedData }
  });
 };

 const handleRescan = () => {
  setScanned(false);
  setShowModal(false);
 };

 if (!permission) {
  return <View style={styles.container}><Text style={styles.text}>Loading...</Text></View>;
 }

 if (!permission.granted) {
  return (
   <View style={styles.container}>
    <Text style={styles.text}>No access to camera</Text>
    <TouchableOpacity onPress={requestPermission}>
     <Text style={styles.text}>Grant Permission</Text>
    </TouchableOpacity>
   </View>
  );
 }

 return (
  <View style={styles.container}>
   {isActive && (
    <CameraView
     style={styles.camera}
     facing="back"
     autofocus="on"
     onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
     barcodeScannerSettings={{
      barcodeTypes: ['qr', 'pdf417', 'ean13', 'code128'],
     }}
    >
     <View style={styles.overlay}>
      <View style={styles.scanFrame} />
      <Text style={styles.scanText}>Align barcode within the frame</Text>
     </View>
    </CameraView>
   )}

   <Modal
    visible={showModal}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setShowModal(false)}
   >
    <View style={styles.modalContainer}>
     <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Barcode Scanned</Text>
      <Text style={styles.modalText}>Product ID: {scannedData}</Text>

      <View style={styles.buttonContainer}>
       <TouchableOpacity
        style={[styles.button, styles.rescanButton]}
        onPress={handleRescan}
       >
        <Text style={styles.buttonText}>Rescan</Text>
       </TouchableOpacity>

       <TouchableOpacity
        style={[styles.button, styles.continueButton]}
        onPress={handleContinue}
       >
        <Text style={styles.buttonText}>Continue to Edit</Text>
       </TouchableOpacity>
      </View>
     </View>
    </View>
   </Modal>
  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: 'black',
 },
 camera: {
  flex: 1,
 },
 text: {
  color: "white"
 },
 overlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
 },
 scanFrame: {
  width: 250,
  height: 150,
  borderWidth: 2,
  borderColor: 'white',
  backgroundColor: 'rgba(255,255,255,0.1)',
 },
 scanText: {
  marginTop: 20,
  color: 'white',
  fontSize: 16,
 },
 modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
 },
 modalContent: {
  width: '80%',
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  alignItems: 'center',
 },
 modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 15,
 },
 modalText: {
  fontSize: 16,
  marginBottom: 20,
  textAlign: 'center',

 },
 buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
 },
 button: {
  padding: 10,
  borderRadius: 5,
  minWidth: '45%',
  alignItems: 'center',
 },
 rescanButton: {
  backgroundColor: '#ccc',
 },
 continueButton: {
  backgroundColor: '#007AFF',
 },
 buttonText: {
  color: 'white',
  fontWeight: 'bold',
 },
});