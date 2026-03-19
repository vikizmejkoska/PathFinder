import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { TrackingProvider } from './src/context/TrackingContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TrackingProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </TrackingProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}