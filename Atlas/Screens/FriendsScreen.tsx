/**
 * This component represents the Friends screen of the app.
 * It displays the list of friends fetched from the Firebase Firestore database.
 * Users can navigate to the FriendRequestsScreen to view incoming friend requests.
 * Clicking the "+" button navigates to the AddFriendScreen to send friend requests.
 */
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  GeoPoint,
  updateDoc,
} from '@firebase/firestore';
import {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
} from '../FirebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import {backGroundColor, themeColor} from '../default-styles';
import NavigationBar, {
  friendsNavItem,
  homeNavItem,
  profileNavItem,
} from './components/NavigationBar';
import {requestLocationPermission, setCurrentNavxTarget} from './Pins';
import GeoLocation from 'react-native-geolocation-service';
import {set} from '@firebase/database';

const FriendsScreen = ({navigation}) => {
  const [friends, setFriends] = useState([]);
  const [location, setLocation] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState<{id: string} | null>(
    null,
  );
  const [locationPermission, setLocationPermission] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const db = FIREBASE_FIRESTORE;
        const currentUserEmail = FIREBASE_AUTH.currentUser.email;

        // Get the current user's document
        const currentUserDoc = await getDocs(
          query(
            collection(db, 'users'),
            where('email', '==', currentUserEmail),
          ),
        );
        if (!currentUserDoc.empty) {
          const currentUserId = currentUserDoc.docs[0].id;

          // Listen for real-time updates to the friends subcollection
          // Updates friends list whenever the friends subcollection changes
          const friendsCollection = collection(
            db,
            'users',
            currentUserId,
            'friends',
          );
          const unsubscribe = onSnapshot(friendsCollection, snapshot => {
            const friendsList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setFriends(friendsList);
          });

          // Clean up the listener on unmount
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  
  const updateLocation = async (lat, long) => {
    const db = FIREBASE_FIRESTORE;
    const currentUserEmail = FIREBASE_AUTH.currentUser.email;

    const currentUserDoc = await getDocs(
      query(collection(db, 'users'), where('email', '==', currentUserEmail)),
    );
    if (!currentUserDoc.empty) {
      const currentUserId = currentUserDoc.docs[0].id;
      await setDoc(
        doc(db, 'users', currentUserId),
        {
          location: new GeoPoint(lat, long),
          targetFriend: selectedFriend.email,
        },
        {merge: true},
      );
    }
  };


  useEffect(() => {
    const fetchLocation = async () => {
      const currentUserEmail = FIREBASE_AUTH.currentUser.email;
      try {
        const db = FIREBASE_FIRESTORE;
        //Todo: Fetch the location of the selected friend
        if (selectedFriend) {
          const friendDocRef = collection(db, 'users');
          const unsubscribe = onSnapshot(
            query(friendDocRef, where('email', '==', selectedFriend.email)),
            snapshot => {
              if (!snapshot.empty) {
                const friendLocation = snapshot.docs[0].data().location;
                const targetFriend = snapshot.docs[0].data().targetFriend;
                console.log(targetFriend);
                if (friendLocation && targetFriend === currentUserEmail) {
                  const {latitude, longitude} = friendLocation;
                  setLocation({latitude, longitude});
                  setLocationPermission(true);
                } else {
                  setLocationPermission(false);
                  console.log('Location not available');
                }
              }
            }
          );
          
          // Clean up the listener on unmount
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };
  
    fetchLocation();
  }, [selectedFriend]);
  const navigateToFriendLocation = async () => {
    const db = FIREBASE_FIRESTORE;
    // Implement navigation logic here

    const friendDoc = await getDocs(
      query(
        collection(db, 'users'),
        where('email', '==', selectedFriend.email),
      ),
    );
    if(friendDoc.docs[0].data().targetFriend == FIREBASE_AUTH.currentUser.email){
      const {latitude, longitude} = location;
      setCurrentNavxTarget(selectedFriend.name, latitude, longitude);
      navigation.navigate('Compass');

    }else{
      Alert.alert('Your Friend turned off navigation sharing');
    }
  };

  
  let id: any;

  // Requests location permission and shares the current location with the selected friend
  const handleLocationSharingRequest = async () => {
    const res = await requestLocationPermission();

    setIsSharingLocation(true);
    if (res) {
      id = GeoLocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          updateLocation(latitude, longitude);
          Alert.alert('Location shared successfully');
        },
        error => {
          console.log(error.code, error.message);
          Alert.alert('Error', 'Failed to share your location.');
        },
        {enableHighAccuracy: true, distanceFilter: 5},
      );
    }
  };

  const handleStopSharingLocation = async () => {
    // Logic to stop sharing location
    setIsSharingLocation(false);
    GeoLocation.clearWatch(id);
    // Update Firestore to remove the location sharing data
    try {
      const db = FIREBASE_FIRESTORE;
      const currentUserEmail = FIREBASE_AUTH.currentUser.email;
  
      const currentUserDoc = await getDocs(
        query(collection(db, 'users'), where('email', '==', currentUserEmail)),
      );
      if (!currentUserDoc.empty) {
        const currentUserId = currentUserDoc.docs[0].id;
        await updateDoc(
          doc(db, 'users', currentUserId),
          { location: null, targetFriend: null},
        );
      }
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ATLAS</Text>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Friends List</Text>
        {friends.map((friend, index) => (
          <TouchableOpacity
            key={index}
            style={styles.friendItem}
            onPress={() => {
              // toggles the share location button
              if (selectedFriend && selectedFriend.id === friend.id) {
                setSelectedFriend(null);
              } else {
                setSelectedFriend(friend);
                console.log(friend.id);
              }
            }}>
            <Text style={styles.friendName}>
              {(friend as {name: string}).name}
            </Text>
            <Text style={styles.friendEmail}>
              ({(friend as {email: string}).email})
            </Text>
            {selectedFriend === friend && (
              <>
                <TouchableOpacity
                  style={styles.shareLocationButton}
                  onPress={handleLocationSharingRequest}>
                  <Text style={styles.shareLocationButtonText}>
                    Share Location
                  </Text>
                </TouchableOpacity>
                {locationPermission && (
                  <TouchableOpacity
                    style={styles.navigationButton} 
                    onPress={() => {
                      navigateToFriendLocation();
                     
                    }}>
                    <Text style={styles.navigationButtonText}>Navigate</Text>
                  </TouchableOpacity>
                )}
                
                {isSharingLocation && (
                  <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={handleStopSharingLocation}>
                    <Text style={styles.navigationButtonText}>Stop Sharing</Text>
                  </TouchableOpacity>
                )}

              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.requestsButton}
        onPress={() => navigation.navigate('FriendRequests')}>
        <Text style={styles.requestsButtonText}>View Friend Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFriend')}>
        <Icon name="search" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('HomeScreen')}>
          <Icon name="home" size={24} color={themeColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Friends')}>
          <Icon name="users" size={24} color={themeColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}>
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
  friendItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  shareLocationButton: {
    backgroundColor: themeColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  shareLocationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationButton: {
    backgroundColor: themeColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FriendsScreen;
