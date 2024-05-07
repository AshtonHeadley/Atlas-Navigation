/**
 * This component represents the Friends screen of the app.
 * It displays the list of friends fetched from the Firebase Firestore database.
 * Users can navigate to the FriendRequestsScreen to view incoming friend requests.
 * Clicking the "+" button navigates to the AddFriendScreen to send friend requests.
 */
import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  GeoPoint,
} from '@firebase/firestore'
import {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
} from '../FirebaseConfig'
// import Icon from 'react-native-vector-icons/FontAwesome'
import {backGroundColor, themeColor} from '../default-styles'
import NavigationBar, {
  friendsNavItem,
  homeNavItem,
  pinNavItem,
  profileNavItem,
} from './components/NavigationBar'
import {requestLocationPermission} from './Pins'
import GeoLocation from 'react-native-geolocation-service'
import {screenHeight, screenWidth} from './Home_Page'

const FriendsScreen = ({navigation}) => {
  const [friends, setFriends] = useState([])
  const [selectedFriend, setSelectedFriend] = useState(null)

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const db = FIREBASE_FIRESTORE
        const currentUserEmail = FIREBASE_AUTH?.currentUser?.email

        // Get the current user's document
        const currentUserDoc = await getDocs(
          query(
            collection(db, 'users'),
            where('email', '==', currentUserEmail),
          ),
        )
        if (!currentUserDoc.empty) {
          const currentUserId = currentUserDoc.docs[0].id

          // Listen for real-time updates to the friends subcollection
          // Updates friends list whenever the friends subcollection changes
          const friendsCollection = collection(
            db,
            'users',
            currentUserId,
            'friends',
          )
          const unsubscribe = onSnapshot(friendsCollection, snapshot => {
            const friendsList = snapshot.docs.map(doc => doc.data())
            setFriends(friendsList)
          })

          // Clean up the listener on unmount
          return () => unsubscribe()
        }
      } catch (error) {
        console.error('Error fetching friends:', error)
      }
    }

    fetchFriends()
  }, [])

  const updateLocation = async (lat, long) => {
    const db = FIREBASE_FIRESTORE
    const currentUserEmail = FIREBASE_AUTH.currentUser?.email

    const currentUserDoc = await getDocs(
      query(collection(db, 'users'), where('email', '==', currentUserEmail)),
    )
    if (!currentUserDoc.empty) {
      const currentUserId = currentUserDoc.docs[0].id

      await setDoc(
        doc(db, 'users', currentUserId),
        {
          location: new GeoPoint(lat, long),
        },
        {merge: true},
      )
    }
  }
  const handleLocationSharingRequest = async () => {
    const res = await requestLocationPermission()

    if (res) {
      GeoLocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords
          updateLocation(latitude, longitude)
          Alert.alert('Location shared successfully')
        },
        error => {
          console.log(error.code, error.message)
          Alert.alert('Error', 'Failed to share your location.')
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      )
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{...styles.title, marginTop: 30}}>Friends List</Text>
      <ScrollView style={styles.listContainer}>
        {friends.map((friend, index) => (
          <TouchableOpacity
            key={index}
            style={styles.friendItem}
            onPress={() => {
              // toggles the share location button
              if (selectedFriend && selectedFriend.id === friend.id) {
                setSelectedFriend(null)
              } else {
                setSelectedFriend(friend)
              }
              console.log(selectedFriend)
            }}>
            <Text style={styles.friendName}>{friend.name}</Text>
            <Text style={styles.friendEmail}>{friend.email}</Text>
            {selectedFriend === friend && (
              <TouchableOpacity
                style={styles.shareLocationButton}
                onPress={handleLocationSharingRequest}>
                <Text style={styles.shareLocationButtonText}>
                  Share Location
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.requestsButton}
        onPress={() => navigation.navigate('FriendRequests')}>
        <Text style={styles.requestsButtonText}>View Friend Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFriend')}>
        <Text
          style={{
            fontSize: screenWidth / 20,
            color: 'white',
          }}>
          Add Friend
        </Text>
        {/* <Icon name='search' size={24} color='white' /> */}
      </TouchableOpacity>
      <NavigationBar //navigation bar on bottom of screen
        rightItem={{
          ...profileNavItem,
          onPress: () => {
            navigation.navigate('Profile')
          },
        }}
        centerItem={{
          ...homeNavItem,
          onPress: () => {
            navigation.navigate('HomeScreen')
          },
        }}
        leftItem={{
          ...pinNavItem,
          onPress: () => {
            navigation.navigate('PinScreen')
          },
        }}
      />
      <View style={{flex: 0.09}} />
    </View>
  )
}

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
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  listContainer: {
    borderRadius: 10,
    padding: 10,
    width: '80%',
    backgroundColor: '#dcdcdc',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: themeColor,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  friendEmail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  requestsButton: {
    backgroundColor: themeColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  requestsButtonText: {
    color: 'white',
    fontSize: 16,
  },
  addButton: {
    width: '80%',
    height: screenHeight / 11,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColor,
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
    backgroundColor: themeColor, // Example background color for the friend item
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    width: '100%',
  },
  shareLocationButton: {
    backgroundColor: themeColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10, // Add some space between the friend's details and the button
  },
  shareLocationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default FriendsScreen
