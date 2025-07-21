import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
 Alert,
 Image,
 Keyboard,
 KeyboardAvoidingView,
 Platform,
 StyleSheet,
 Text,
 TextInput,
 TouchableOpacity,
 TouchableWithoutFeedback,
 View
} from 'react-native';
import { brandIcon } from "../../assets/icons/index";
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

const SignInScreen = () => {
 const [credentials, setCredentials] = useState({
  email: '',
  password: '',
 });
 const [showPassword, setShowPassword] = useState(false);
 const router = useRouter();
 const { signIn, isLoading } = useAuth();
 const [isSubmitting, setIsSubmitting] = useState(false);




 const handleLogin = async () => {
  if (!credentials.email.trim() || !credentials.password.trim()) {
   Alert.alert('Error', 'Please fill in all fields');
   return;
  }

  setIsSubmitting(true);

  try {
   const response = await authService.signIn({ email: credentials.email, password: credentials.password });
   const userData = {
    id: response._id,
    name: response.username,
    email: response.email,
    role: response.role,
   };

   await signIn(userData, response.token);
   router.push(`/(protected)/(tab)/home`)
   console.log("respone", JSON.stringify(response, null, 2));
  } catch (error) {
   Alert.alert('Login Failed', error instanceof Error ? error.message : 'An error occurred');
  } finally {
   setIsSubmitting(false);
  }
 };

 const handleInputChange = (field, value) => {
  setCredentials(prev => ({ ...prev, [field]: value }));
 };

 const isButtonDisabled = isSubmitting || isLoading || !credentials.email.trim() || !credentials.password.trim();


 return (
  <KeyboardAvoidingView
   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   style={styles.container}
  >
   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <LinearGradient
     colors={['#eee', 'white']}
     style={styles.gradient}
    >
     <View style={styles.innerContainer}>
      <Image
       source={brandIcon}
       style={styles.logo}
      />

      <Text style={styles.title}>Background Remover</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.inputContainer}>
       <Text style={styles.inputLabel}>Email Address</Text>
       <View style={styles.inputWrapper}>
        <Feather name="mail" size={20} color="#6c757d" style={styles.inputIcon} />
        <TextInput
         style={styles.input}
         placeholder="Enter your email"
         placeholderTextColor="#adb5bd"
         value={credentials.email}
         onChangeText={(value) => handleInputChange('email', value)}
         keyboardType="email-address"
         autoCapitalize="none"
         autoCorrect={false}
        />
       </View>
      </View>

      <View style={styles.inputContainer}>
       <Text style={styles.inputLabel}>Password</Text>
       <View style={styles.inputWrapper}>
        <Feather name="lock" size={20} color="#6c757d" style={styles.inputIcon} />
        <TextInput
         style={styles.input}
         placeholder="Enter your password"
         placeholderTextColor="#adb5bd"
         value={credentials.password}
         onChangeText={(value) => handleInputChange('password', value)}
         secureTextEntry={!showPassword}
        />
        <TouchableOpacity
         onPress={() => setShowPassword(!showPassword)}
         style={styles.passwordToggle}
         disabled={isButtonDisabled}
        >
         <Feather
          name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color="#6c757d"
         />
        </TouchableOpacity>
       </View>
      </View>

      {/* <TouchableOpacity style={styles.forgotPassword}>
       <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
       style={[styles.button, isLoading && styles.buttonDisabled]}
       onPress={handleLogin}
       disabled={isLoading}
      >
       {isLoading ? (
        <Text style={styles.buttonText}>Signing In...</Text>
       ) : (
        <Text style={styles.buttonText}>Sign In</Text>
       )}
      </TouchableOpacity>

     </View>
    </LinearGradient>
   </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
 );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#eee",
 },
 gradient: {
  flex: 1,
  justifyContent: 'center',
 },
 innerContainer: {
  paddingHorizontal: 30,
 },
 logo: {
  width: 80,
  height: 80,
  alignSelf: 'center',
  marginBottom: 30,
 },
 title: {
  fontSize: 28,
  fontWeight: '700',
  color: '#212529',
  textAlign: 'center',
  marginBottom: 8,
 },
 subtitle: {
  fontSize: 16,
  color: '#6c757d',
  textAlign: 'center',
  marginBottom: 40,
 },
 inputContainer: {
  marginBottom: 20,
 },
 inputLabel: {
  fontSize: 14,
  color: '#495057',
  marginBottom: 8,
  fontWeight: '600',
 },
 inputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 10,
  paddingHorizontal: 15,
  borderWidth: 1,
  borderColor: '#dee2e6',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
 },
 inputIcon: {
  marginRight: 10,
 },
 input: {
  flex: 1,
  height: 50,
  fontSize: 16,
  color: '#212529',
 },
 passwordToggle: {
  padding: 10,
 },
 forgotPassword: {
  alignSelf: 'flex-end',
  marginBottom: 25,
 },
 forgotPasswordText: {
  color: '#4267B2',
  fontSize: 14,
  fontWeight: '500',
 },
 button: {
  backgroundColor: '#fc7c8c',
  padding: 16,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 10,
  elevation: 3,
  shadowColor: '#4267B2',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
 },
 buttonDisabled: {
  opacity: 0.7,
 },
 buttonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '600',
 },
 signUpContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 10,
 },
 signUpText: {
  color: '#6c757d',
  fontSize: 14,
 },
 signUpLink: {
  color: '#4267B2',
  fontSize: 14,
  fontWeight: '600',
 },
});

export default SignInScreen;