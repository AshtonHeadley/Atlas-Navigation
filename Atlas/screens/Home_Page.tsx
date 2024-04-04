/*
"https://www.flaticon.com/authors/those-icons" title="Those Icons"> Those Icons </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'
*/
import {signOut} from '@firebase/auth'
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {FIREBASE_APP, FIREBASE_AUTH} from '../FirebaseConfig'
import {collection, doc, getFirestore} from '@firebase/firestore'
import React from 'react'
import {GLOBAL_EMAIL} from './Login_Screen'

export const screenWidth = Dimensions.get('window').width
export const screenHeight = Dimensions.get('window').height
export const pinComponents = new Map()

const HomePage = ({navigation}) => {
  const auth = FIREBASE_AUTH
  const db = getFirestore(FIREBASE_APP)
  const userDocRef = doc(collection(db, 'users'), GLOBAL_EMAIL)

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 10,
            justifyContent: 'flex-end',
          }}>
          <View style={styles.TopRow}>
            <Text style={styles.TitleText}>ATLAS</Text>
            <TouchableOpacity
              style={styles.SignOut}
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
              <Image
                source={require('../assets/menu.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 2}}></View>
      </View>
      <View
        style={{
          marginHorizontal: screenWidth / 20,
          flex: 5,
          justifyContent: 'space-evenly',
        }}>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PinScreen')
            }}
            style={{
              ...styles.Button,
              backgroundColor: colorTheme,
            }}>
            <Image
              source={require('../assets/pin.png')}
              style={{width: 128, height: 128}}
            />
            <Text style={styles.text}>Pins</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.Button,
              backgroundColor: colorTheme,
            }}>
            <Image
              source={require('../assets/multiple-users-silhouette.png')}
              style={{width: 128, height: 128}}
            />
            <Text style={styles.text}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.Button,
              backgroundColor: colorTheme,
            }}>
            <Image
              source={require('../assets/profile-user.png')}
              style={{width: 128, height: 128}}
            />
            <Text style={styles.text}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export const colorTheme = '#4192ab'

const styles = StyleSheet.create({
  TopRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  TitleText: {
    position: 'absolute',
    top: -(screenHeight / 18),
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: screenWidth / 4,
    flex: 1,
    fontSize: screenHeight / 14,
    fontWeight: 'bold',
    color: colorTheme,
  },
  SignOut: {
    position: 'absolute',
    bottom: -(screenHeight / 128),
    left: 0,
    right: 0,
    marginLeft: screenWidth / 1.25,
    justifyContent: 'center',
    alignContent: 'center',
  },
  Button: {
    width: '100%',
    height: screenHeight / 4.5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenWidth / 20,
  },
  text: {
    fontSize: screenHeight / 30,
    color: 'white',
    fontWeight: '200',
  },
})

export default HomePage
