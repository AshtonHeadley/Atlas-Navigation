/**
* This component allows users to send friend requests to other users.
* It provides an input field to enter the email of the user to send a request to.
* Clicking the "Send Friend Request" button sends the request to the specified user.
* If the user is found, a friend request is sent and stored in the Firebase Firestore database.
* If the user is not found, an appropriate message is displayed.
*/
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../FirebaseConfig';
import { backGroundColor, themeColor } from '../default-styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddFriendScreen = ({ navigation }) => {
 const [email, setEmail] = useState('');
 const [message, setMessage] = useState('');

 const handleSendFriendRequest = async () => {
   try {
     const db = FIREBASE_FIRESTORE;
     const usersCollection = collection(db, 'users');
     const q = query(usersCollection, where('email', '==', email));
     const querySnapshot = await getDocs(q);

     if (!querySnapshot.empty) {
       // User found, send friend request
       const userId = querySnapshot.docs[0].id;
       await sendFriendRequest(userId);
       setMessage('Friend request sent');
     } else {
       // User not found
       setMessage('User not found');
     }
   } catch (error) {
     console.error(error);
     setMessage('An error occurred. Please try again.');
   }
 };

 const sendFriendRequest = async (userId) => {
   try {
     const db = FIREBASE_FIRESTORE;
     const currentUserId = FIREBASE_AUTH.currentUser.uid;
     const currentUserEmail = FIREBASE_AUTH.currentUser.email;

     // Get the current user's document
     const currentUserDoc = await getDocs(query(collection(db, 'users'), where('email', '==', currentUserEmail)));
     const currentUserName = currentUserDoc.docs[0].data().name;

     // Check if a friend request already exists
     const friendRequestsCollection = collection(db, 'users', userId, 'PublicPins');
     const q = query(friendRequestsCollection, where('email', '==', currentUserEmail));
     const querySnapshot = await getDocs(q);

     if (querySnapshot.empty) {
       // Create a new friend request document
       const friendRequestData = {
         email: currentUserEmail,
         name: currentUserName,
       };
       await addDoc(friendRequestsCollection, friendRequestData);
       console.log('Friend request sent successfully');
     } else {
       console.log('Friend request already exists');
     }
   } catch (error) {
     console.error('Error sending friend request:', error);
     throw error;
   }
 };

 return (
   <View style={styles.container}>
     <TextInput
       style={styles.input}
       placeholder="Enter email"
       placeholderTextColor={"white"}
       color="white"
       value={email}
       onChangeText={setEmail}
     />
     <Button title="Send Friend Request" onPress={handleSendFriendRequest} color={themeColor} />
     <Text style={styles.message}>{message}</Text>
     <View style={styles.bottomNavigation}>
  <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('HomeScreen')}>
    <Icon name="home" size={24} color={themeColor} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Friends')}>
    <Icon name="users" size={24} color={themeColor} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
    <Icon name="user" size={24} color={themeColor} />
  </TouchableOpacity>
</View>
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   padding: 20,
   backgroundColor: backGroundColor,
 },
 input: {
   height: 40,
   borderColor: 'white',
   borderWidth: 1,
   marginBottom: 10,
   paddingHorizontal: 10,
 },
 message: {
   marginTop: 10,
   fontSize: 16,
   marginBottom: 20,
   color: 'white',
   fontWeight: 'bold',
 },
 bottomNavigation: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: 'white',
  borderTopWidth: 1,
  borderTopColor: '#ccc',
  paddingVertical: 10,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
},
navButton: {
  alignItems: 'center',
},
});

export default AddFriendScreen;