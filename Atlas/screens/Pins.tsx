import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
} from '@firebase/firestore'
import {FIREBASE_APP} from '../FirebaseConfig'
import {remove} from '@firebase/database'

const db = getFirestore(FIREBASE_APP)
export let currentNavTarget = [0, 0]

const getPinCollection = () => {
  const userDocRef = doc(collection(db, 'users'), GLOBAL_EMAIL.toLowerCase()) //reference to document in firebase
  const pinCollection = collection(userDocRef, 'Pins')
  return pinCollection
}

const loadPinComponents = async () => {
  const querySnapshot = await getDocs(getPinCollection())
  const docs = querySnapshot.docs.map(doc => doc.data())
  return docs
}

const deletePinComponent = async (title: string) => {
  const docToRemove = doc(getPinCollection(), title)
  await deleteDoc(docToRemove)
}

const deleteFunc = (
  card: any,
  setPinCardsCallback: (newCards: any[]) => void,
) => {
  const cardKey = card.title
  pinComponents.delete(cardKey) //remove card from map using unique key to find
  // deletePinComponent(card.title)
  setPinCardsCallback([...pinComponents.values()])
}

const createPinCard = (
  inputTitle: string,
  latitude: number,
  longitude: number,
  specialNum: number,
  key: number,
  setPinCardsCallback: (newCards: any[]) => void,
  onPressNav: () => void,
) => {
  const card = {
    //card data object
    title: `${inputTitle}`,
    description: `${latitude}, ${longitude}`,
    coordinates: {
      lat: latitude,
      long: longitude,
      specialNum: specialNum,
    },
  }
  //function passed into every card's delete button
  const func = {
    onPressDel: deleteFunc.bind(null, card, setPinCardsCallback),
  }
  //Create custom PinCard
  return (
    <PinCard
      text={card}
      onPressNav={onPressNav}
      onPressDel={func.onPressDel}
      key={key}
    />
  )
}

export const requestLocationPermissionAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Atlas needs access to your location',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted')
      return true
    } else {
      console.log('Location permission denied')
      return false
    }
  } catch (err) {
    console.warn(err)
  }
}
// Function to get permission for ios
export const requestLocationPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings')
    })
  }
  const status = await GeoLocation.requestAuthorization('whenInUse')

  if (status === 'granted') {
    console.log('Location permission granted')
    return true
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied')
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow "Atlas" to determine your location.`,
      '',
      [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ],
    )
  }

  return false
}
// Request permission handler, checks running OS
export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    return await requestLocationPermissionAndroid()
  } else {
    return await requestLocationPermissionIOS()
  }
}

const Pins = ({navigation}) => {
  const [pinCards, setPinCards] = useState([...pinComponents.values()])
  const [loading, setLoading] = useState(false)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const showOverlay = () => setIsOverlayVisible(true)
  const hideOverlay = () => setIsOverlayVisible(false)

  const onPressNav = ({latitude = 0, longitude = 0}) => {
    const lat = latitude
    const long = longitude
    currentNavTarget = [latitude, longitude]
    navigation.navigate('Compass')
  }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const fetchedDocs = await loadPinComponents()
  //     const updatedPinCards = fetchedDocs.map(doc => {
  //       const pinCard = createPinCard(
  //         doc.title,
  //         doc.latitude,
  //         doc.longitude,
  //         doc.specialNum,
  //         doc.key,
  //         setPinCards,
  //         onPressNav.bind(null, {
  //           latitude: doc.latitude,
  //           longitude: doc.longitude,
  //         }),
  //       )
  //       pinComponents.set(doc.title, pinCard)
  //       return pinCard
  //     })
  //     setPinCards(updatedPinCards)
  //   }
  //   fetchData()
  // }, [])

  const handleOverlaySubmit = async (title: any, description: any) => {
    await getLocation(title, description)
    hideOverlay()
  }

  const addPinToDB = async (
    title: string,
    latitude: number,
    longitude: number,
    specialNum: number,
    key: number,
  ) => {
    try {
      const data = {
        title: title,
        latitude: latitude,
        longitude: longitude,
        specialNum: specialNum,
        key: key,
      }
      //document name will be email input, within the user's collection
      const userDocRef = doc(
        collection(db, 'users'),
        GLOBAL_EMAIL.toLowerCase(),
      ) //reference to document in firebase
      const pinCollection = doc(collection(userDocRef, 'Pins'), title)
      await setDoc(pinCollection, data) //adding data to document path
    } catch (error) {
      console.error('Error adding data:', error)
    }
  }

  //Gets location and creates card to display
  const getLocation = async (inputTitle: string, desc: String) => {
    if (pinComponents.has(inputTitle)) {
      Alert.alert('Pin with that title already exists')
      return
    }
    setLoading(true) //disables adding new pin until current is done being added
    const res = await requestLocationPermission() //call to permission handler
    if (res) {
      GeoLocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords //output of get CurrentPosition
          const specialNum = Math.random()
          const key = Math.abs(latitude * longitude * specialNum) //unique key for each card. For deletion + DB
          const pinCard = createPinCard(
            inputTitle,
            latitude,
            longitude,
            specialNum,
            key,
            setPinCards,
            onPressNav.bind(null, {
              latitude: latitude,
              longitude: longitude,
            }),
          )
          pinComponents.set(inputTitle, pinCard)
          //update currently shown list
          setPinCards([...pinCards, pinCard])
          //await addPinToDB(inputTitle, latitude, longitude, specialNum, key)
          setLoading(false)
        },
        error => {
          console.log(error.code, error.message)
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
      )
    }
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <PinOverlayInput //Overlay to input info when adding pin, custom component
        isVisible={isOverlayVisible}
        onCancel={hideOverlay}
        onSubmit={handleOverlaySubmit}
      />
      <View //top section, title and add pin button
        style={{
          flex: 1.75,
          marginHorizontal: screenWidth / 12,
        }}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Text //title
            style={styles.TitleText}>
            Pins
          </Text>
        </View>
        <View //add pin button
          style={{flex: 0, justifyContent: 'flex-end'}}>
          {loading ? (
            <View style={{height: screenHeight / 11}}>
              <ActivityIndicator size={'large'} color='grey' />
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={async () => {
                  showOverlay()
                }}
                style={{
                  ...styles.Button,
                  backgroundColor: colorTheme,
                }}>
                <Image
                  source={require('../assets/add.png')}
                  style={{width: 32, height: 32}}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View
        style={{flex: 4.5, marginVertical: 10}} //list of pin cards
      >
        <View style={{marginHorizontal: screenWidth / 28}}>
          <View style={{flex: 1}}></View>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {pinCards.map(item => {
              //maps pin cards to scrollview
              return item
            })}
          </ScrollView>
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <NavigationBar //navigation bar on bottom of screen
          leftItem={{
            ...homeNavItem,
            onPress: () => {
              navigation.navigate('HomeScreen')
            },
          }}
          centerItem={{
            ...friendsNavItem,
            onPress: () => {
              navigation.navigate('Compass')
            },
          }}
          rightItem={profileNavItem}></NavigationBar>
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
})

export default Pins
