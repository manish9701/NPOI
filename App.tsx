import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';

import { TranslationProvider } from './src/hooks/useTranslation';
import { NotificationProvider } from './src/hooks/useNotifications';

export default function App() {
  return (
    <SafeAreaProvider>
      <TranslationProvider>
        <NotificationProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </NotificationProvider>
      </TranslationProvider>
    </SafeAreaProvider>
  );
}
