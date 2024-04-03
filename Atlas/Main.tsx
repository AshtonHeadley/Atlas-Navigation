import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LoginScreen from './screens/Login_Screen'
import CreateAccount from './screens/CreateAccount_screen'
import HomePage from './screens/Home_Page'
import Pins from './screens/Pins'

const Stack = createNativeStackNavigator()

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='CreateAccount' component={CreateAccount} />
        <Stack.Screen name='HomeScreen' component={HomePage} />
        <Stack.Screen name='PinScreen' component={Pins} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
