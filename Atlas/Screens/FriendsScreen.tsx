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
  Image,
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
  deleteDoc,
  getDoc,
  updateDoc,
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
import {requestLocationPermission, setCurrentNavxTarget} from './Pins'
import GeoLocation from 'react-native-geolocation-service'
import {screenHeight, screenWidth} from './Home_Page'
import FastImage from 'react-native-fast-image'

export let globalFriendList = []

const FriendsScreen = ({navigation}) => {
  const [friends, setFriends] = useState([])
  const [location, setLocation] = useState([])
  const [selectedFriend, setSelectedFriend] = useState<{id: string} | null>(
    null,
  )
  const [locationPermission, setLocationPermission] = useState(false)
  const [isSharingLocation, setIsSharingLocation] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [imageMap, setImageMap] = useState({})

  const handleFriendImage = async friendEmail => {
    const db = FIREBASE_FIRESTORE
    const userRef = doc(collection(db, 'users'), friendEmail)
    const currentUserDoc = await getDoc(userRef)
    const docData = currentUserDoc.data()
    setImageMap(prevImageMap => ({
      ...prevImageMap,
      [friendEmail]: docData.imageURI,
    }))
  }

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const db = FIREBASE_FIRESTORE
        const currentUserEmail = FIREBASE_AUTH.currentUser.email

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
            const friendsList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }))
            setFriends(friendsList)

            friendsList.forEach(val => {
              handleFriendImage(val.email)
              globalFriendList.push(val.email)
            })
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

  const [permittedFriend, setPermittedFriend] = useState(null)

  const updateLocation = async (lat, long) => {
    setPermittedFriend(selectedFriend.email)
    const db = FIREBASE_FIRESTORE
    const currentUserEmail = FIREBASE_AUTH.currentUser.email
    const currentUserDoc = await getDocs(
      query(collection(db, 'users'), where('email', '==', currentUserEmail)),
    )
    if (!currentUserDoc.empty) {
      const currentUserId = currentUserDoc.docs[0].id
      await setDoc(
        doc(db, 'users', currentUserId),
        {
          location: new GeoPoint(lat, long),
          targetFriend: selectedFriend.email,
        },
        {merge: true},
      )
    }
  }
  const fetchLocation = async () => {
    const currentUserEmail = FIREBASE_AUTH.currentUser.email
    try {
      const db = FIREBASE_FIRESTORE
      //Todo: Fetch the location of the selected friend
      if (selectedFriend) {
        const friendDocRef = collection(db, 'users')
        const unsubscribe = onSnapshot(
          query(friendDocRef, where('email', '==', selectedFriend.email)),
          snapshot => {
            if (!snapshot.empty) {
              const friendLocation = snapshot.docs[0].data().location
              const targetFriend = snapshot.docs[0].data().targetFriend

              if (friendLocation && targetFriend === currentUserEmail) {
                const {latitude, longitude} = friendLocation
                setLocation({latitude, longitude})
                setLocationPermission(true)
              } else {
                setLocationPermission(false)
                navigation.navigate('Friends')
              }
            }
          },
        )

        // Clean up the listener on unmount
        return () => unsubscribe()
      }
    } catch (error) {
      console.error('Error fetching location:', error)
    }
  }

  useEffect(() => {
    fetchLocation()
  }, [selectedFriend])
  const navigateToFriendLocation = async () => {
    const db = FIREBASE_FIRESTORE
    // Implement navigation logic here

    const friendDoc = await getDocs(
      query(
        collection(db, 'users'),
        where('email', '==', selectedFriend.email),
      ),
    )
    if (
      friendDoc.docs[0].data().targetFriend == FIREBASE_AUTH.currentUser.email
    ) {
      const {latitude, longitude} = location
      setCurrentNavxTarget(selectedFriend.name, latitude, longitude)
      navigation.navigate('Compass')
    } else {
      Alert.alert('Your Friend turned off navigation sharing')
    }
  }

  const [watchId, setWatchId] = useState(null)

  const startLocationSharing = () => {
    if (watchId) {
      GeoLocation.clearWatch(watchId)
    }
    const newWatchId = GeoLocation.watchPosition(
      position => {
        console.log('hello')
        const {latitude, longitude} = position.coords
        updateLocation(latitude, longitude)
      },
      error => {
        console.log(error.code, error.message)
        Alert.alert('Error', 'Failed to share your location.')
      },

      {enableHighAccuracy: true, distanceFilter: 5},
    )
    setWatchId(newWatchId)
    Alert.alert('Location shared successfully')
  }

  // Requests location permission and shares the current location with the selected friend
  const handleLocationSharingRequest = async () => {
    const res = await requestLocationPermission()

    if (res) {
      if (isSharingLocation) {
        console.log('here')
        handleStopSharingLocation()
      }
      setIsSharingLocation(true)
      startLocationSharing()
    } else {
      Alert.alert(
        'Location permission required',
        'Please allow location permission to share your location.',
      )
    }
  }

  const handleStopSharingLocation = async () => {
    setIsSharingLocation(false)
    GeoLocation.clearWatch(watchId)
    setWatchId(null) // Reset the watchId state
    setLocationPermission(false)

    // Update Firestore to remove the location sharing data
    try {
      const db = FIREBASE_FIRESTORE
      const currentUserEmail = FIREBASE_AUTH.currentUser.email

      const currentUserDoc = await getDocs(
        query(collection(db, 'users'), where('email', '==', currentUserEmail)),
      )
      if (!currentUserDoc.empty) {
        const currentUserId = currentUserDoc.docs[0].id
        await updateDoc(doc(db, 'users', currentUserId), {
          location: null,
          targetFriend: null,
        })
      }
    } catch (error) {
      console.error('Error updating Firestore:', error)
    }
  }

  const handleRemoveFriend = async friendEmail => {
    try {
      const db = FIREBASE_FIRESTORE
      const currentUserEmail = FIREBASE_AUTH.currentUser.email
      globalFriendList.splice(globalFriendList.indexOf(friendEmail), 1)

      // Get the current user's document
      const currentUserDoc = await getDocs(
        query(collection(db, 'users'), where('email', '==', currentUserEmail)),
      )
      if (!currentUserDoc.empty) {
        const currentUserId = currentUserDoc.docs[0].id

        // Find the friend's document
        const friendDoc = await getDocs(
          query(collection(db, 'users'), where('email', '==', friendEmail)),
        )
        if (!friendDoc.empty) {
          const friendId = friendDoc.docs[0].id

          // Remove the friend from the current user's 'friends' subcollection
          const friendsCollection = collection(
            db,
            'users',
            currentUserId,
            'friends',
          )
          const friendSnapshot = await getDocs(
            query(friendsCollection, where('email', '==', friendEmail)),
          )
          if (!friendSnapshot.empty) {
            const friendDocId = friendSnapshot.docs[0].id
            await deleteDoc(
              doc(db, 'users', currentUserId, 'friends', friendDocId),
            )
          }

          // Remove the current user from the friend's 'friends' subcollection
          const friendFriendsCollection = collection(
            db,
            'users',
            friendId,
            'friends',
          )
          const friendFriendSnapshot = await getDocs(
            query(
              friendFriendsCollection,
              where('email', '==', currentUserEmail),
            ),
          )
          if (!friendFriendSnapshot.empty) {
            const friendFriendDocId = friendFriendSnapshot.docs[0].id
            await deleteDoc(
              doc(db, 'users', friendId, 'friends', friendFriendDocId),
            )
          }
        }
      }

      // Update the FriendsList on the UI
      setFriends(prevFriends =>
        prevFriends.filter(friend => friend.email !== friendEmail),
      )
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  const handleExit = page => {
    if (isSharingLocation) {
      Alert.alert(
        'You are currently sharing your location with someone',
        'If you leave now this will disable sharing',
        [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Confirm',
            onPress: async () => {
              handleStopSharingLocation()
              navigation.navigate(page)
            },
          },
        ],
        {cancelable: true},
      )
    } else {
      navigation.navigate(page)
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
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <Text style={styles.friendName}>{friend.name}</Text>
              </View>
              <Image
                source={{
                  uri: 'data:image/png;base64,' + imageMap[friend.email],
                }}
                style={{
                  width: 70,
                  height: 70,
                  borderColor: themeColor,
                  borderRadius: 5,
                }}
              />
            </View>
            {selectedFriend === friend && (
              <View style={{alignItems: 'center', marginBottom: 10}}>
                <TouchableOpacity
                  style={styles.shareLocationButton}
                  onPress={handleLocationSharingRequest}>
                  <Text style={styles.shareLocationButtonText}>
                    Share Location
                  </Text>
                </TouchableOpacity>
                {!isSharingLocation && locationPermission && (
                  <TouchableOpacity
                    style={styles.shareLocationButton}
                    onPress={() => {
                      navigateToFriendLocation()
                    }}>
                    <Text style={styles.shareLocationButtonText}>Navigate</Text>
                  </TouchableOpacity>
                )}
                {friend.email == permittedFriend && isSharingLocation && (
                  <TouchableOpacity
                    style={styles.shareLocationButton}
                    onPress={handleStopSharingLocation}>
                    <Text style={styles.shareLocationButtonText}>
                      Stop Sharing
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.shareLocationButton}
                  onPress={async () => {
                    try {
                      Alert.alert(
                        'Are you sure you want to remove this person?',
                        '',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => {},
                          },
                          {
                            text: 'Confirm',
                            onPress: async () => {
                              handleRemoveFriend(friend.email)
                            },
                          },
                        ],
                        {cancelable: true},
                      )
                    } catch (error) {
                      console.error('Error signing out:', error)
                      Alert.alert('An error occurred while signing out.')
                    }
                  }}>
                  <Text style={styles.shareLocationButtonText}>
                    Remove Friend
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('FriendRequests')}>
          <FastImage
            source={require('../assets/request.png')}
            style={{width: 40, height: 40}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddFriend')}>
          <FastImage
            source={require('../assets/add.png')}
            style={{width: 32, height: 32}}
          />
          {/* <Icon name='search' size={24} color='white' /> */}
        </TouchableOpacity>
      </View>
      <NavigationBar //navigation bar on bottom of screen
        rightItem={{
          ...profileNavItem,
          onPress: () => handleExit('Profile'),
        }}
        centerItem={{
          ...homeNavItem,
          onPress: () => handleExit('HomeScreen'),
        }}
        leftItem={{
          ...pinNavItem,
          onPress: () => handleExit('PinScreen'),
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
    // backgroundColor: '#dcdcdc',
    maxHeight: '60%',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: themeColor,
  },
  friendName: {
    marginLeft: 20,
    fontSize: 30,
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
    width: '30%',
    height: screenHeight / 11,
    borderRadius: 360,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#898989',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.45,
    shadowRadius: 3.5,
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
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#2d6677', // Example background color for the friend item
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
    backgroundColor: backGroundColor,
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
