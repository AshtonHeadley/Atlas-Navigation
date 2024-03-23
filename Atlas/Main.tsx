// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Screens/Login_Screen';
import MapScreen from './Screens/Map_Screen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Home" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;