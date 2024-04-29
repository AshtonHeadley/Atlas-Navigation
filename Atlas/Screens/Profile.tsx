import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs'
import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, View, Image, Button} from 'react-native'
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
  updateDoc,
} from '@firebase/firestore'
import {FIREBASE_APP} from '../FirebaseConfig'
import FastImage from 'react-native-fast-image'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker'
import {themeColor} from '../default-styles'

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

  const [user, setUser] = useState(null)
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
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Image
          source={{uri: 'data:image/png;base64,' + selectedImage}}
          style={styles.image}
        />
        <Text style={styles.description}>{user}</Text>
        <Button title='Choose from Device' onPress={openImagePicker} />
        <Button title='Open Camera' onPress={handleCameraLaunch} />
      </View>
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
          }}
          leftItem={{
            ...pinNavItem,
            onPress: () => {
              navigation.navigate('PinScreen')
            },
          }}></NavigationBar>
      </View>
    </View>
  )
}

//Styling options for this page
const styles = StyleSheet.create({
  Button: {
    width: '100%',
    height: screenHeight / 11,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 4,
    //   height: 6,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 3.5,
  },
  TitleText: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: screenWidth / 4,
    flex: 1,
    fontSize: screenHeight / 14,
    fontWeight: 'bold',
    color: themeColor,
  },
  container: {
    flex: 5,
    justifyContent: 'center',
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
  },
  description: {
    fontSize: 18,
    color: 'white',
  },
})

export default Profile
function uploadString (storageRef: any, message2: any, arg2: string) {
  throw new Error('Function not implemented.')
}
