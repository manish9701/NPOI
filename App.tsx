import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation';

import { TranslationProvider } from './src/hooks/useTranslation';
import { NotificationProvider } from './src/hooks/useNotifications';

export default function App() {
  return (
    <View style={styles.webContainer}>
      <View style={styles.appContainer}>
        <SafeAreaProvider>
          <TranslationProvider>
            <NotificationProvider>
              <StatusBar style="dark" />
              <AppNavigator />
            </NotificationProvider>
          </TranslationProvider>
        </SafeAreaProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#e5e7eb' : '#fff',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
    } : {}),
  }
});
