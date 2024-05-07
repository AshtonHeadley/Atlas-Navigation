import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../FirebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import { backGroundColor, themeColor } from '../default-styles';
import NavigationBar, {
  friendsNavItem,
  homeNavItem,
  profileNavItem,
} from './components/NavigationBar'

const FriendsScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const db = FIREBASE_FIRESTORE;
        const currentUserEmail = FIREBASE_AUTH.currentUser.email;
 
        // Get the current user's document
        const currentUserDoc = await getDocs(query(collection(db, 'users'), where('email', '==', currentUserEmail)));
        if (!currentUserDoc.empty) {
          const currentUserId = currentUserDoc.docs[0].id;
 
          // Fetch friends from the "friends" subcollection
          const friendsCollection = collection(db, 'users', currentUserId, 'friends');
          const friendsSnapshot = await getDocs(friendsCollection);
          const friendsList = friendsSnapshot.docs.map((doc) => doc.data());
          setFriends(friendsList);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  const handleRemoveFriend = async (friendEmail) => {
    try {
      const db = FIREBASE_FIRESTORE;
      const currentUserEmail = FIREBASE_AUTH.currentUser.email;

      // Get the current user's document
      const currentUserDoc = await getDocs(query(collection(db, 'users'), where('email', '==', currentUserEmail)));
      if (!currentUserDoc.empty) {
        const currentUserId = currentUserDoc.docs[0].id;

        // Find the friend's document
        const friendDoc = await getDocs(query(collection(db, 'users'), where('email', '==', friendEmail)));
        if (!friendDoc.empty) {
          const friendId = friendDoc.docs[0].id;

          // Remove the friend from the current user's 'friends' subcollection
          const friendsCollection = collection(db, 'users', currentUserId, 'friends');
          const friendSnapshot = await getDocs(query(friendsCollection, where('email', '==', friendEmail)));
          if (!friendSnapshot.empty) {
            const friendDocId = friendSnapshot.docs[0].id;
            await deleteDoc(doc(db, 'users', currentUserId, 'friends', friendDocId));
          }

          // Remove the current user from the friend's 'friends' subcollection
          const friendFriendsCollection = collection(db, 'users', friendId, 'friends');
          const friendFriendSnapshot = await getDocs(query(friendFriendsCollection, where('email', '==', currentUserEmail)));
          if (!friendFriendSnapshot.empty) {
            const friendFriendDocId = friendFriendSnapshot.docs[0].id;
            await deleteDoc(doc(db, 'users', friendId, 'friends', friendFriendDocId));
          }
        }
      }

      // Update the FriendsList on the UI
      setFriends((prevFriends) => prevFriends.filter((friend) => friend.email !== friendEmail));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
<View style={styles.container}>
      <Text style={styles.title}>ATLAS</Text>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Friends List</Text>
        {friends.map((friend, index) => (
          <View key={index} style={styles.friendItem}>
            <Text style={styles.friendName}>{friend.name}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFriend(friend.email)}>
              <Icon name="times" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.requestsButton} onPress={() => navigation.navigate('FriendRequests')}>
        <Text style={styles.requestsButtonText}>View Friend Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddFriend')}>
        <Icon name="search" size={24} color="white" />
      </TouchableOpacity>
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
    backgroundColor: backGroundColor,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: themeColor,
    marginBottom: 30,
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: themeColor,
  },
  friendItem: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  friendEmail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 5,
  },
  requestsButton: {
    backgroundColor: themeColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  requestsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: themeColor,
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
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
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  removeButton: {
    backgroundColor: themeColor,
    padding: 5,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FriendsScreen;