import {onAuthStateChanged, signOut} from '@firebase/auth'
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {FIREBASE_APP, FIREBASE_AUTH} from '../FirebaseConfig'
import {collection, doc, getDoc, getFirestore} from '@firebase/firestore'
import {useState} from 'react'

const HomePage = ({navigation}) => {
  const auth = FIREBASE_AUTH
  const db = getFirestore(FIREBASE_APP)
  const docId = auth.currentUser?.uid
  const userDocRef = doc(collection(db, 'users'), docId)
  const [name, setName] = useState('')

  const getUserName = async () => {
    try {
      let output = (await getDoc(userDocRef)).get('name')
      setName(output)
    } catch (error) {
      console.log(error)
    }
  }

  getUserName()

  let text = `Welcome ${name ? name : ''}`
  /*

<TouchableOpacity
        onPress={async () => {
          try {
            await signOut(auth)
            console.log('signed out successfully')
            navigation.goBack()
          } catch (error) {
            console.error('Error signing out:', error)
            Alert.alert('An error occurred while signing out.')
          }
        }}>
        <Text>Sign Out</Text>
      </TouchableOpacity>


*/
  return (
    <View style={styles.center}>
      <View>
        <Text>ATLAS</Text>
        <TouchableOpacity
          onPress={async () => {
            try {
              await signOut(auth)
              console.log('signed out successfully')
              navigation.goBack()
            } catch (error) {
              console.error('Error signing out:', error)
              Alert.alert('An error occurred while signing out.')
            }
          }}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <View></View>
      <View></View>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})

export default HomePage
