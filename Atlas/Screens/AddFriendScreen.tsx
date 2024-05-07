/**
 * This component allows users to send friend requests to other users.
 * It provides an input field to enter the email of the user to send a request to.
 * Clicking the "Send Friend Request" button sends the request to the specified user.
 * If the user is found, a friend request is sent and stored in the Firebase Firestore database.
 * If the user is not found, an appropriate message is displayed.
 */
import React, {useState} from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import {collection, query, where, getDocs, addDoc} from '@firebase/firestore'
import {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
} from '../FirebaseConfig'
import {backGroundColor, themeColor} from '../default-styles'
import {screenHeight, screenWidth} from './Home_Page'
import NavigationBar, {
  profileNavItem,
  homeNavItem,
  pinNavItem,
} from './components/NavigationBar'
// import Icon from 'react-native-vector-icons/FontAwesome'

const AddFriendScreen = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSendFriendRequest = async () => {
    try {
      const db = FIREBASE_FIRESTORE
      const usersCollection = collection(db, 'users')
      const q = query(usersCollection, where('email', '==', email))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        // User found, send friend request
        const userId = querySnapshot.docs[0].id
        await sendFriendRequest(userId)
        Alert.alert('Friend request sent')
      } else {
        // User not found
        Alert.alert('User not found')
      }
    } catch (error) {
      console.error(error)
      Alert.alert('An error occurred. Please try again.')
    }
  }

  const sendFriendRequest = async userId => {
    try {
      const db = FIREBASE_FIRESTORE
      const currentUserId = FIREBASE_AUTH.currentUser?.uid
      const currentUserEmail = FIREBASE_AUTH.currentUser?.email

      // Get the current user's document
      const currentUserDoc = await getDocs(
        query(collection(db, 'users'), where('email', '==', currentUserEmail)),
      )
      const currentUserName = currentUserDoc.docs[0].data().name

      // Check if a friend request already exists
      const friendRequestsCollection = collection(
        db,
        'users',
        userId,
        'PublicPins',
      )
      const q = query(
        friendRequestsCollection,
        where('email', '==', currentUserEmail),
      )
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        // Create a new friend request document
        const friendRequestData = {
          email: currentUserEmail,
          name: currentUserName,
        }
        await addDoc(friendRequestsCollection, friendRequestData)
        console.log('Friend request sent successfully')
      } else {
        console.log('Friend request already exists')
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
      throw error
    }
  }

  return (
    <View style={styles.container}>
      <View style={{justifyContent: 'center', flex: 1}}>
        <TextInput
          style={styles.input}
          placeholder='Enter email'
          placeholderTextColor={'white'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize={'none'}
        />
        <TouchableOpacity
          onPress={handleSendFriendRequest}
          style={{
            ...styles.backButton,
            alignSelf: 'center',
            height: screenHeight / 16,
          }}>
          <Text
            style={{
              fontSize: screenWidth / 20,
              color: 'white',
            }}>
            Send Friend Request
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: screenHeight / 22,
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: 'white',
    color: 'white',
    alignSelf: 'center',
    marginTop: 5,
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
  backButton: {
    width: '80%',
    height: screenHeight / 11,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColor,
  },
})

export default AddFriendScreen
