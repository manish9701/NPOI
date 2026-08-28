import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const handleContinue = () => {
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/india_gov_logo.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      
      <TouchableOpacity 
        style={styles.continueBtn} 
        onPress={handleContinue}
        activeOpacity={0.85}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 40,
  },
  continueBtn: {
    backgroundColor: '#3D3BF3',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 999,
    position: 'absolute',
    bottom: 50,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  }
});
