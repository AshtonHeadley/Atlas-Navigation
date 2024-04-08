import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LoginScreen from './screens/Login_Screen'
import CreateAccount from './screens/CreateAccount_screen'
import HomePage from './screens/Home_Page'
import Pins from './screens/Pins'
import {PERSISTENT_AUTH} from './FirebaseConfig'
import CompassPage from './screens/Navigation'
import ExpandableView from './screens/components/Expandable_View'

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
          <Stack.Screen name='LoginScreen' component={LoginScreen} />
        )}
        <Stack.Screen name='CreateAccount' component={CreateAccount} />
        <Stack.Screen name='PinScreen' component={Pins} />
        <Stack.Screen name='Compass' component={CompassPage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
