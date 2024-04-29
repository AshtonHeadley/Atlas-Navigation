import React, {lazy, useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LoginScreen from './Screens/Login_Screen'
import CreateAccount from './Screens/CreateAccount_screen'
import CompassPage from './Screens/Navigation'
import Pins from './Screens/LazyLoadScreens/LazyPins'
import Home from './Screens/LazyLoadScreens/LazyHome'
import {PERSISTENT_AUTH} from './FirebaseConfig'
import Profile from './Screens/Profile'
import FriendsScreen from './Screens/FriendsScreen'
import FriendRequestsScreen from './Screens/FriendRequestsScreen'

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
        <Stack.Screen name='CreateAccount' component={CreateAccount} />
        <Stack.Screen name='PinScreen' component={Pins} />
        <Stack.Screen name='Compass' component={CompassPage} />
        <Stack.Screen name='Friends' component={FriendsScreen} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='FriendRequests' component={FriendRequestsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
