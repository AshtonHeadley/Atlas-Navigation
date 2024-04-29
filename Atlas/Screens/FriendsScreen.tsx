
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, addDoc } from '@firebase/firestore';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../FirebaseConfig';

const FriendsScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
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
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Search" onPress={handleSearch} />
      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FriendRequestsScreen')}
      >
        <Text style={styles.buttonText}>View Friend Requests</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'themeColor',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'themeColor',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FriendsScreen;