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
} from 'react-native'
import NavigationBar, {
  friendsNavItem,
  homeNavItem,
  profileNavItem,
} from './components/NavigationBar'
import {
  GET_USERNAME,
  GLOBAL_EMAIL,
  GLOBAL_USERNAME,
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
} from '@firebase/firestore'
import {FIREBASE_APP} from '../FirebaseConfig'
import FastImage from 'react-native-fast-image'
import {backGroundColor, themeColor} from '../default-styles'
import PublicPins from './components/PublicPins'
import {isEnabled} from 'react-native/Libraries/Performance/Systrace'

const db = getFirestore(FIREBASE_APP)
export let currentNavTarget = [0, 0]
export let currentNavTitle = ''

export const getPinCollection = (collectionName: string) => {
  const userDocRef = doc(
    collection(db, collectionName),
    GLOBAL_EMAIL.toLowerCase(),
  ) //reference to document in firebase
  const pinCollection = collection(userDocRef, 'Pins')
  return pinCollection
}

export const loadPinComponents = async (collectionName: string) => {
  const querySnapshot = await getDocs(getPinCollection(collectionName))
  const docs = querySnapshot.docs.map(doc => doc.data())
  return docs
}

const deletePinComponent = async (title: string, published: boolean) => {
  const docToRemove = doc(getPinCollection('users'), title)
  await deleteDoc(docToRemove)
  if (published) {
    deleteDoc(doc(collection(db, 'PublicPins'), title + GLOBAL_EMAIL))
  }
}

const deleteFunc = (
  card: any,
  setPinCardsCallback: (newCards: any[]) => void,
) => {
  const cardKey = card.title
  pinComponents.delete(cardKey) //remove card from map using unique key to find
  deletePinComponent(card.title, card.published)
  setPinCardsCallback([...pinComponents.values()])
}

const copyPinFunc = (card: any) => {
  //document name will be email input, within the user's collection
  const userDocRef = doc(collection(db, 'users'), GLOBAL_EMAIL.toLowerCase()) //reference to document in firebase
  const pinCollection = doc(collection(userDocRef, 'Pins'), card.title)
  setDoc(pinCollection, card) //adding data to document path
}

export const createPinCard = (
  inputTitle: string,
  latitude: number,
  longitude: number,
  specialNum: number,
  key: number,
  setPinCardsCallback: (newCards: any[]) => void,
  onPressNav: () => void,
  user: string,
  published = false,
  addPin = false,
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
    published: published,
    user: user,
  }
  //function passed into every card's delete button
  const func = {
    onPressDel: deleteFunc.bind(null, card, setPinCardsCallback),
  }
  const func2 = {
    onPressAdd: copyPinFunc.bind(null, card),
  }
  //Create custom PinCard
  return (
    <PinCard
      text={card}
      onPressNav={onPressNav}
      onPressDel={func.onPressDel}
      key={key}
      addPin={addPin}
      onPressAdd={func2.onPressAdd}
      creator={user}
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

  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const showSearch = () => setIsSearchVisible(true)
  const hideSearch = () => setIsSearchVisible(false)

  const onPressNav = ({title = '', latitude = 0, longitude = 0}) => {
    const lat = latitude
    const long = longitude
    currentNavTarget = [latitude, longitude]
    currentNavTitle = title
    navigation.navigate('Compass')
  }

  const handleCreatePin = async (
    latitude: number,
    longitude: number,
    inputTitle: string,
    isPublished = false,
    user: string,
    newPin = true,
    addPin = false,
  ) => {
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
        title: inputTitle,
        latitude: latitude,
        longitude: longitude,
      }),
      user,
      isPublished,
      addPin,
    )
    if (newPin) {
      await addPinToDB(
        inputTitle,
        latitude,
        longitude,
        specialNum,
        key,
        isPublished,
      )
    }
    pinComponents.set(inputTitle, pinCard)
    setPinCards([...pinComponents.values()])
  }
  useEffect(() => {
    if (!isSearchVisible) {
      const loadPins = async () => {
        try {
          const pins = await loadPinComponents('users') // Call loadPinComponents
          pins.forEach(pin => {
            handleCreatePin(
              pin.latitude,
              pin.longitude,
              pin.title,
              pin.published,
              pin.user,
              false,
            )
          })
        } catch (e) {
          console.error('Error loading pins:', e)
        }
      }
      loadPins()
    }
    return
  }, [isSearchVisible])

  const handleOverlaySubmit = async (
    title: any,
    description: any,
    isEnabled: boolean,
  ) => {
    await getLocation(title, isEnabled)
    hideOverlay()
  }

  const handleSearchSubmit = async () => {
    hideSearch()
  }

  const addPinToDB = async (
    title: string,
    latitude: number,
    longitude: number,
    specialNum: number,
    key: number,
    published = false,
  ) => {
    const data = {
      title: title,
      latitude: latitude,
      longitude: longitude,
      specialNum: specialNum,
      key: key,
      user: GLOBAL_USERNAME,
      published,
    }
    try {
      //document name will be email input, within the user's collection
      const userDocRef = doc(
        collection(db, 'users'),
        GLOBAL_EMAIL.toLowerCase(),
      ) //reference to document in firebase
      const pinCollection = doc(collection(userDocRef, 'Pins'), title)
      await setDoc(pinCollection, data) //adding data to document path
    } catch (error) {
      console.error('Error adding data to user:', error)
    }
    if (published) {
      try {
        const pinCollection = doc(
          collection(db, 'PublicPins'),
          title + GLOBAL_EMAIL,
        )
        await setDoc(pinCollection, data) //adding data to document path
      } catch (error) {
        console.error('Error adding data to Public Pins:', error)
      }
    }
  }

  //Gets location and creates card to display
  const getLocation = async (inputTitle: string, isEnabled: boolean) => {
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
          handleCreatePin(
            latitude,
            longitude,
            inputTitle,
            isEnabled,
            GLOBAL_USERNAME,
            true,
          )
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
    <View style={{flex: 1, backgroundColor: backGroundColor}}>
      <PinOverlayInput //Overlay to input info when adding pin, custom component
        isVisible={isOverlayVisible}
        onCancel={hideOverlay}
        onSubmit={handleOverlaySubmit}
      />
      <PublicPins isVisible={isSearchVisible} onSubmit={handleSearchSubmit} />
      <View //top section, title and add pin button
        style={{
          flex: 1.7,
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 3}} />
          <View style={{flex: 4}}>
            <Text style={styles.TitleText}>Pins</Text>
          </View>
          <TouchableOpacity
            style={{...styles.ImageView, flex: 1.5}}
            onPress={async () => {
              showSearch()
            }}>
            <FastImage
              source={require('../assets/magnifying-glass.png')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View //add pin button
            style={{
              flex: 1,
              marginHorizontal: screenWidth / 12,
              marginVertical: 5,
            }}>
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
                    backgroundColor: themeColor,
                  }}>
                  <FastImage
                    source={require('../assets/add.png')}
                    style={{width: 32, height: 32}}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
      <View
        style={{flex: 4, marginVertical: 10}} //list of pin cards
      >
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              // justifyContent: 'center',
              // alignItems: 'center',
            }}>
            {pinCards.map(item => (
              <View key={item.key} style={{alignSelf: 'center'}}>
                {item}
              </View>
            ))}
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
              pinComponents.clear()
              setPinCards([...pinComponents.values()])
              navigation.navigate('HomeScreen')
            },
          }}
          centerItem={{
            ...friendsNavItem,
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
    fontSize: screenHeight / 14,
    fontWeight: 'bold',
    color: themeColor,
  },
  ImageView: {
    // backgroundColor: themeColor,
    height: screenHeight / 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignContent: 'center',
  },
})

export default Pins
