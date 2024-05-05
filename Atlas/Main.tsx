import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/Login_Screen';
import CreateAccount from './screens/CreateAccount_screen';
import CompassPage from './screens/Navigation';
import Pins from './screens/LazyLoadScreens/LazyPins';
import Home from './screens/LazyLoadScreens/LazyHome';
import { PERSISTENT_AUTH } from './FirebaseConfig';
import Profile from './screens/Profile';
import FriendsScreen from './screens/FriendsScreen';
import FriendRequestsScreen from './screens/FriendRequestsScreen';
import AddFriendScreen from './screens/AddFriendScreen';

const Stack = createNativeStackNavigator();

const Main = () => {
  const [loggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = PERSISTENT_AUTH.onAuthStateChanged(user => {
      setIsLoggedIn(!!user); // Check if a user object exists
    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name='CreateAccount' component={CreateAccount} />
        {loggedIn ? (
          <>
            <Stack.Screen name='HomeScreen' component={Home} />
            <Stack.Screen name='PinScreen' component={Pins} />
            <Stack.Screen name='Compass' component={CompassPage} />
            <Stack.Screen name='Friends' component={FriendsScreen} />
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='FriendRequests' component={FriendRequestsScreen} />
            <Stack.Screen name='AddFriend' component={AddFriendScreen} />
          </>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;