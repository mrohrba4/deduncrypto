import 'react-native-gesture-handler'; // Import this first
import React from 'react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'; // Optional for wrapping the app in gesture handling HOC
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return <AppNavigator />;
};

// If you want to be extra cautious about gesture handler issues, you can wrap your app in gestureHandlerRootHOC:
export default gestureHandlerRootHOC(App); // Wrap the App with gestureHandlerRootHOC




