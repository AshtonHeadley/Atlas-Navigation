// FriendRequestsScreen.js
import React, {useState, useEffect} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
} from '@firebase/firestore'
import {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
} from '../FirebaseConfig'
import {backGroundColor} from '../default-styles'

const FriendRequestsScreen = () => {
  const [friendRequests, setFriendRequests] = useState([] as any)

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
    requestId: any,
    friendEmail: unknown,
    friendName: any,
  ) => {
    try {
      const db = FIREBASE_FIRESTORE
      const currentUserEmail = FIREBASE_AUTH.currentUser?.email

      // Get the current user's document
      const currentUserDoc = await getDocs(
        query(collection(db, 'users'), where('email', '==', currentUserEmail)),
      )
      if (!currentUserDoc.empty) {
        const currentUserId = currentUserDoc.docs[0].id

        // Update the friend request status to "accepted"
        const friendRequestDoc = await getDocs(
          query(
            collection(db, 'users', currentUserId, 'PublicPins'),
            where('email', '==', friendEmail),
          ),
        )
        if (!friendRequestDoc.empty) {
          const requestDocId = friendRequestDoc.docs[0].id
          await updateDoc(friendRequestDoc.docs[0].ref, {status: 'accepted'})

          // Create a new document in the "friends" subcollection
          const friendsCollection = collection(
            db,
            'users',
            currentUserId,
            'friends',
          )
          await addDoc(friendsCollection, {
            email: friendEmail,
            name: friendName,
          })

          // Remove the friend request from the state
          setFriendRequests((prevRequests: any[]) =>
            prevRequests.filter(
              (request: {id: any}) => request.id !== requestId,
            ),
          )
        }
      }
    } catch (error) {
      console.error('Error allowing friend request:', error)
    }
  }

  const handleDenyFriendRequest = async (
    requestId: any,
    friendEmail: unknown,
  ) => {
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
          setFriendRequests((prevRequests: any[]) =>
            prevRequests.filter(
              (request: {id: any}) => request.id !== requestId,
            ),
          )
        }
      }
    } catch (error) {
      console.error('Error denying friend request:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      {friendRequests.map(
        (request: {
          id: React.Key | null | undefined
          name:
            | string
            | number
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | React.ReactPortal
            | null
            | undefined
          email:
            | string
            | number
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | React.ReactPortal
            | null
            | undefined
        }) => (
          <View key={request.id} style={styles.requestItem}>
            <Text>
              {request.name} ({request.email})
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title='Allow'
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
                onPress={() =>
                  handleDenyFriendRequest(request.id, request.email)
                }
              />
            </View>
          </View>
        ),
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: backGroundColor,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  requestItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
})

export default FriendRequestsScreen
