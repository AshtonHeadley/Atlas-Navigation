import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LoginScreen from './Screens/Login_Screen'
import CreateAccount from './Screens/CreateAccount_screen'
import HomePage from './Screens/Home_Page'
import Pins from './Screens/Pins'
import {PERSISTENT_AUTH} from './FirebaseConfig'

const Stack = createNativeStackNavigator()

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = PERSISTENT_AUTH.onAuthStateChanged(user => {
      setIsLoggedIn(!!user) // Check if a user object exists
    })
    return unsubscribe
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLoggedIn ? (
          <Stack.Screen name='HomeScreen' component={HomePage} />
        ) : (
          <Stack.Screen name='Login' component={LoginScreen} />
        )}
        <Stack.Screen name='CreateAccount' component={CreateAccount} />
        <Stack.Screen name='PinScreen' component={Pins} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
