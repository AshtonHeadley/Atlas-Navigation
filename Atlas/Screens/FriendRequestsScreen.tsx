import React, {useState, useEffect} from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  doc,
} from '@firebase/firestore'
import {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
} from '../FirebaseConfig'
import {backGroundColor, themeColor} from '../default-styles'
import {screenHeight, screenWidth} from './Home_Page'
// import Icon from 'react-native-vector-icons/FontAwesome';

const FriendRequestsScreen = ({navigation}) => {
  const [friendRequests, setFriendRequests] = useState([])

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const db = FIREBASE_FIRESTORE
        const currentUserEmail = FIREBASE_AUTH.currentUser?.email

        // Get the current user's document
        const currentUserDoc = await getDocs(
          query(
            collection(db, 'users'),
            where('email', '==', currentUserEmail),
          ),
        )
        if (!currentUserDoc.empty) {
          const currentUserId = currentUserDoc.docs[0].id

          // Fetch friend requests from the "PublicPins" subcollection
          const friendRequestsCollection = collection(
            db,
            'users',
            currentUserId,
            'PublicPins',
          )
          const friendRequestsSnapshot = await getDocs(friendRequestsCollection)
          const requests = friendRequestsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          setFriendRequests(requests)
        }
      } catch (error) {
        console.error('Error fetching friend requests:', error)
      }
    }

    fetchFriendRequests()
  }, [])

  const handleAllowFriendRequest = async (
    requestId,
    friendEmail,
    friendName,
  ) => {
    try {
      const db = FIREBASE_FIRESTORE
      const currentUserEmail = FIREBASE_AUTH.currentUser?.email
      const currentUserDoc = await getDocs(
        query(collection(db, 'users'), where('email', '==', currentUserEmail)),
      )

      if (!currentUserDoc.empty) {
        const currentUserId = currentUserDoc.docs[0].id
        const currentUserName = currentUserDoc.docs[0].data().name

        // Find the friend's user document
        const friendDoc = await getDocs(
          query(collection(db, 'users'), where('email', '==', friendEmail)),
        )
        if (!friendDoc.empty) {
          const friendId = friendDoc.docs[0].id
          const friendUserName = friendDoc.docs[0].data().name

          // Add friend to current user's 'friends' subcollection
          await addDoc(collection(db, 'users', currentUserId, 'friends'), {
            email: friendEmail,
            name: friendUserName,
          })

          // Add current user to friend's 'friends' subcollection
          await addDoc(collection(db, 'users', friendId, 'friends'), {
            email: currentUserEmail,
            name: currentUserName,
          })

          // Optionally clean up the friend request
          await deleteDoc(
            doc(db, 'users', currentUserId, 'PublicPins', requestId),
          )
          setFriendRequests(prev => prev.filter(req => req.id !== requestId))
        }
      }
    } catch (error) {
      console.error('Error allowing friend request:', error)
    }
  }

  const handleDenyFriendRequest = async (requestId, friendEmail) => {
    try {
      const db = FIREBASE_FIRESTORE
      const currentUserEmail = FIREBASE_AUTH.currentUser?.email

      // Get the current user's document
      const currentUserDoc = await getDocs(
        query(collection(db, 'users'), where('email', '==', currentUserEmail)),
      )
      if (!currentUserDoc.empty) {
        const currentUserId = currentUserDoc.docs[0].id

        // Delete the friend request document
        const friendRequestDoc = await getDocs(
          query(
            collection(db, 'users', currentUserId, 'PublicPins'),
            where('email', '==', friendEmail),
          ),
        )
        if (!friendRequestDoc.empty) {
          await deleteDoc(friendRequestDoc.docs[0].ref)

          // Remove the friend request from the state
          setFriendRequests(prevRequests =>
            prevRequests.filter(request => request.id !== requestId),
          )

          // Navigate back to the FriendsList screen
          navigation.navigate('Friends')
        }
      }
    } catch (error) {
      console.error('Error denying friend request:', error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 0.3}} />
      <Text style={styles.title}>Friend Requests</Text>
      {friendRequests.length === 0 ? (
        <Text style={styles.noRequests}>
          You have no friend requests at this moment
        </Text>
      ) : (
        <ScrollView>
          {friendRequests.map(request => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>
                  {request.name} ({request.email})
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title='Allow'
                  color={themeColor}
                  onPress={() =>
                    handleAllowFriendRequest(
                      request.id,
                      request.email,
                      request.name,
                    )
                  }
                />
                <Button
                  title='Deny'
                  color={themeColor}
                  onPress={() =>
                    handleDenyFriendRequest(request.id, request.email)
                  }
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <View style={{flex: 1}} />
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.navigate('Friends')
          }}>
          <Text
            style={{
              fontSize: screenWidth / 20,
              color: 'white',
            }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: backGroundColor,
    alignItems: 'center',
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
  backButton: {
    width: '80%',
    minWidth: screenWidth * 0.8,
    height: screenHeight / 11,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColor,
  },
  navButton: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: themeColor,
    flex: 1,
    justifyContent: 'center',
  },
  requestItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: themeColor,
    paddingBottom: 20,
  },
  textContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  noRequests: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'white',
    padding: 10,
    borderRadius: 15,
  },
})

export default FriendRequestsScreen
