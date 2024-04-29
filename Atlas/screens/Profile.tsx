import React, {useEffect, useState, Suspense} from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button
} from 'react-native'
import NavigationBar, {
  friendsNavItem,
  homeNavItem,
  profileNavItem,
} from './components/NavigationBar'
import {
  GLOBAL_EMAIL,
  colorTheme,
  pinComponents,
  screenHeight,
  screenWidth,
} from './Home_Page'
import PinCard from './components/pin_card'
import GeoLocation from 'react-native-geolocation-service'
import PinOverlayInput from './components/pin_card_overlay'
import {
  doc,
  collection,
  setDoc,
  getFirestore,
  getDocs,
  deleteDoc,
  getDoc,
  updateDoc
} from '@firebase/firestore'
import {FIREBASE_APP} from '../FirebaseConfig'
import FastImage from 'react-native-fast-image'
import {
  launchImageLibrary,
  launchCamera,
  ImageLibraryOptions,
} from 'react-native-image-picker'

const db = getFirestore(FIREBASE_APP)
export let currentNavTarget = [0, 0]
export let currentNavTitle = ''

const Profile = ({navigation}) => {
  const [loading, setLoading] = useState(false)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const showOverlay = () => setIsOverlayVisible(true)
  const hideOverlay = () => setIsOverlayVisible(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    getUser()
      .then((result) => {
        setSelectedImage(result.imageURI);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getUser = async () => {
    const userDocRef = doc(collection(db, 'users'), GLOBAL_EMAIL.toLowerCase());
    const userDoc = await getDoc(userDocRef);
    setUser(userDoc.data().name)
    setEmail(userDoc.data().email)
    return userDoc.data();
  }

  const updateImage = async (uri) => {
    const userDocRef = doc(collection(db, 'users'), GLOBAL_EMAIL.toLowerCase());
    await updateDoc(userDocRef, {
      imageURI: uri
    });
  }

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
  
    launchImageLibrary(options, handleResponse);
  };
  
  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
  
    launchCamera(options, handleResponse);
  };
  
  const handleResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      let imageUri = response.uri || response.assets?.[0]?.uri;
      setSelectedImage(imageUri);
      updateImage(imageUri);
    }
  };


return (
  <View style={{ flex: 1, backgroundColor: '#132b33' }}>
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Image
        source={{ uri: selectedImage }}
        style={styles.image}
      />
      <Text style={styles.description}>{user}</Text>
      <Button title="Choose from Device" onPress={() => console.log('Choose Image')} />
      <Button title="Open Camera" onPress={() => console.log('Camera Open')} />
    </View>
    <View
        style={{
          flex: 0.18,
        }}>
      <NavigationBar // Navigation bar at the bottom of the screen
        style={{ height: 10000 }} // Fixed height for navigation bar
        leftItem={{
         ...homeNavItem,
         onPress: () => navigation.navigate('HomeScreen'),
       }}
        centerItem={{
          ...friendsNavItem,
         onPress: () => console.log('Navigate to Friends'),
        }}
        rightItem={{
          ...profileNavItem,
         onPress: () => navigation.navigate('Profile'),
       }}
     />
    </View>
  </View>
);
};

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
    color: colorTheme,
  },
  container: {
    flex: 1,
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
