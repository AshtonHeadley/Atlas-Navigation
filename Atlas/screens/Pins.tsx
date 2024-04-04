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
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native'
import NavigationBar, {
  friendsNavItem,
  homeNavItem,
  profileNavItem,
} from './components/NavigationBar'
import {colorTheme, pinComponents, screenHeight, screenWidth} from './Home_Page'
import PinCard from './components/pin_card'
import GeoLocation from 'react-native-geolocation-service'
import PinOverlayInput from './components/pin_card_overlay'

const Pins = ({navigation}) => {
  const [pinCards, setPinCards] = useState([...pinComponents.values()])
  const [loading, setLoading] = useState(false)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  //   let overLayOutput = {title: '', desc: ''}

  const showOverlay = () => setIsOverlayVisible(true)
  const hideOverlay = () => setIsOverlayVisible(false)

  const handleOverlaySubmit = async (title: any, description: any) => {
    await getLocation(title, description)
    hideOverlay()
  }

  // Function to get permission for location mainly for android
  const requestLocationPermissionAndroid = async () => {
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

  const requestLocationPermissionIOS = async () => {
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

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      return await requestLocationPermissionAndroid()
    } else {
      return await requestLocationPermissionIOS()
    }
  }

  const getLocation = async (inputTitle: String, desc: String) => {
    setLoading(true)
    const res = await requestLocationPermission()
    if (res) {
      GeoLocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords
          const specialNum = Math.random()
          const key = latitude * longitude * specialNum
          const card = {
            inputText: `${inputTitle} :: ${latitude}, ${longitude}`,
            coordinates: {
              lat: latitude,
              long: longitude,
              specialNum: specialNum,
            },
          }
          const func = {
            onPressDel: () => {
              const cardKey =
                card.coordinates.lat *
                card.coordinates.long *
                card.coordinates.specialNum
              pinComponents.delete(cardKey)
              setPinCards([...pinComponents.values()])
            },
          }
          const pinCard = (
            <PinCard text={card} onPressDel={func.onPressDel} key={key} />
          )
          pinComponents.set(key, pinCard)
          setPinCards([...pinCards, pinCard])
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
      <PinOverlayInput
        isVisible={isOverlayVisible}
        onCancel={hideOverlay}
        onSubmit={handleOverlaySubmit}
      />
      <View
        style={{
          flex: 1.75,
          marginHorizontal: screenWidth / 12,
        }}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Text style={styles.TitleText}>Pins</Text>
        </View>
        <View style={{flex: 0, justifyContent: 'flex-end'}}>
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
      <View style={{flex: 4.5, marginVertical: 10}}>
        <View style={{marginHorizontal: screenWidth / 28}}>
          <View style={{flex: 1}}></View>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {pinCards.map(item => {
              return item
            })}
          </ScrollView>
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <NavigationBar
          leftItem={{
            ...homeNavItem,
            onPress: () => {
              navigation.navigate('HomeScreen')
            },
          }}
          centerItem={friendsNavItem}
          rightItem={profileNavItem}></NavigationBar>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  Button: {
    width: '100%',
    height: screenHeight / 11,
    borderRadius: 15,
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
