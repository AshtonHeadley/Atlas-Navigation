import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs'
import React, {useEffect, useState} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native'
import NavigationBar, {
  friendsNavItem,
  homeNavItem,
  pinNavItem,
} from './components/NavigationBar'
import {
  GLOBAL_EMAIL,
  GLOBAL_USERNAME,
  screenHeight,
  screenWidth,
} from './Home_Page'

import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from '@firebase/firestore'
import {FIREBASE_APP} from '../FirebaseConfig'
import FastImage from 'react-native-fast-image'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker'
import {themeColor} from '../default-styles'
import {queryName} from './CreateAccount_screen'

const db = getFirestore(FIREBASE_APP)
export let currentNavTarget = [0, 0]
export let currentNavTitle = ''

const Profile = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState(null)

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    }

    launchImageLibrary(options, handleResponse)
  }

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    }

    launchCamera(options, handleResponse)
  }

  const handleResponse = response => {
    if (response.didCancel) {
      console.log('User cancelled image picker')
    } else if (response.error) {
      console.log('Image picker error: ', response.error)
    } else {
      let imageUri = response.uri || response.assets?.[0]?.uri
      setSelectedImage(imageUri)
      updateImage(response.assets?.[0]?.uri)
      getUser()
        .then(result => {
          setSelectedImage(result?.imageURI)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    }
  }

  const updateImage = async uri => {
    ImageResizer.createResizedImage(uri, 256, 256, 'PNG', 60, 0).then(
      async response => {
        RNFS.readFile(response.uri, 'base64').then(async res => {
          const userDocRef = doc(
            collection(db, 'users'),
            GLOBAL_EMAIL.toLowerCase(),
          )
          await updateDoc(userDocRef, {
            imageURI: res,
          })
        })
      },
    )
  }

  const [user, setUser] = useState('')
  const [email, setEmail] = useState(null)

  useEffect(() => {
    getUser()
      .then(result => {
        setSelectedImage(result?.imageURI)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const getUser = async () => {
    const userDocRef = doc(collection(db, 'users'), GLOBAL_EMAIL.toLowerCase())
    const userDoc = await getDoc(userDocRef)
    setUser(userDoc.data()?.name)
    setEmail(userDoc.data()?.email)
    return userDoc.data()
  }

  return (
    <View style={{flex: 1, backgroundColor: '#132b33'}}>
      <View style={{...styles.container, flex: 10}}>
        <View
          style={{...styles.container, flex: 1, justifyContent: 'flex-end'}}>
          <Text style={styles.TitleText}>Profile</Text>
        </View>
        <View style={{...styles.container, flex: 4}}>
          <View
            style={
              {
                // shadowColor: '#000',
                // shadowOffset: {
                //   width: 0,
                //   height: 0,
                // },
                // shadowOpacity: 0.5,
                // shadowRadius: 5.5,
              }
            }>
            <Image
              source={{uri: 'data:image/png;base64,' + selectedImage}}
              style={styles.image}
            />
          </View>
          <Text style={styles.subTitleText}>{user}</Text>
          <View style={{margin: 10}} />
          <Text style={styles.bodyText}>Edit Profile Photo:</Text>
          <TouchableOpacity style={styles.Button} onPress={openImagePicker}>
            <Text>Choose Image from Device</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPress={handleCameraLaunch}>
            <Text>Use Camera</Text>
          </TouchableOpacity>
          {/* <Text style={styles.bodyText}>Edit Username:</Text>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => {
              Alert.prompt('Enter new username', '', async output => {
                if (await queryName(output)) {
                  Alert.alert('Username Already Exists')
                  return
                }
                const userDocRef = doc(
                  collection(db, 'users'),
                  GLOBAL_EMAIL.toLowerCase(),
                )
                updateDoc(userDocRef, {name: output})
                setUser(output)
              })
            }}>
            <Text>Edit Username</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <View style={{flex: 1}} />
      <View
        style={{
          flex: 2,
        }}>
        <NavigationBar //navigation bar on bottom of screen
          rightItem={{
            ...homeNavItem,
            onPress: () => {
              navigation.navigate('HomeScreen')
            },
          }}
          centerItem={{
            ...friendsNavItem,
            onPress: () => {
              navigation.navigate('Friends')
            },
          }}
          leftItem={{
            ...pinNavItem,
            onPress: () => {
              navigation.navigate('PinScreen')
            },
          }}
        />
      </View>
    </View>
  )
}

//Styling options for this page
const styles = StyleSheet.create({
  Button: {
    width: screenWidth / 2,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
  },
  container: {
    flex: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 360,
    borderWidth: 3,
    borderColor: themeColor,
  },
  description: {
    fontSize: 18,
    color: 'white',
  },
  TitleText: {
    fontSize: screenHeight / 14,
    fontWeight: 'bold',
    color: themeColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  subTitleText: {
    fontSize: screenHeight / 22,
    fontWeight: 'bold',
    color: 'white',
  },
  bodyText: {
    fontSize: screenHeight / 36,
    color: '#b7b7b7',
  },
})

export default Profile
function uploadString (storageRef: any, message2: any, arg2: string) {
  throw new Error('Function not implemented.')
}
