import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const Loader = () => {
 const spinValue = useRef(new Animated.Value(0)).current;

 useEffect(() => {
  const spin = () => {
   spinValue.setValue(0);
   Animated.loop(
    Animated.timing(spinValue, {
     toValue: 1,
     duration: 1000,
     easing: Easing.linear,
     useNativeDriver: true,
    })
   ).start();
  };

  spin();

  return () => {
   spinValue.stopAnimation(); // Clean up animation on unmount
  };
 }, [spinValue]);

 const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
 });

 return (
  <View style={styles.wrapper}>
   <Animated.View
    style={[
     styles.loader,
     {
      transform: [{ rotate: spin }],
     },
    ]}
   />
  </View>
 );
};

const styles = StyleSheet.create({
 wrapper: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: "transparent"
 },
 loader: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#fb626c',
  borderBottomWidth: 7,
  borderLeftWidth: 4,
  borderRightWidth: 4,
  borderColor: 'white',
  borderTopColor: '#fccfd2',
  borderLeftColor: '#fccfd2',
  borderRightColor: '#fccfd2',
 },
});

export default Loader;