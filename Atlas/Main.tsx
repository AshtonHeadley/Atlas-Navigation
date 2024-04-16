import React, {lazy, useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LoginScreen from './screens/Login_Screen'
import CompassPage from './screens/Navigation'
import Pins from './screens/LazyPins'
import Home from './screens/LazyHome'
import {PERSISTENT_AUTH} from './FirebaseConfig'

const Stack = createNativeStackNavigator()

const Main = () => {
  const [loggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    const unsubscribe = PERSISTENT_AUTH.onAuthStateChanged(user => {
      setIsLoggedIn(!!user) // Check if a user object exists
    })
    return unsubscribe
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {loggedIn ? (
          <Stack.Screen name='HomeScreen' component={Home} />
        ) : (
          <Stack.Screen name='LoginScreen' component={LoginScreen} />
        )}
        <Stack.Screen
          name='CreateAccount'
          component={lazy(() => import('./screens/CreateAccount_screen'))}
        />
        <Stack.Screen name='PinScreen' component={Pins} />
        <Stack.Screen name='Compass' component={CompassPage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
