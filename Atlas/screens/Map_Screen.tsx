import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import MapView from 'react-native-maps'
import React from 'react'
import {signOut} from '@firebase/auth'
import {FIREBASE_APP, FIREBASE_AUTH} from '../FirebaseConfig'
import {collection, doc, getDoc, getFirestore} from '@firebase/firestore'
import {useState} from 'react'

const screenHeight = Dimensions.get('window').height

const Map_Screen = ({navigation}) => {
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.welcomeBar}>
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
          <Image
            source={require('../assets/sign_out.png')}
            style={{width: 30, height: 30}}></Image>
        </TouchableOpacity>
        <Text style={styles.welcomeText}>{text}!</Text>
      </View>
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: 37.3352,
            longitude: -121.8811,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          customMapStyle={mapStyle}></MapView>
      </View>
    </SafeAreaView>
  )
}

const colorTheme = '#4192ab'

const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}],
  },
]
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: screenHeight / 8,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  welcomeBar: {
    top: screenHeight / 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  welcomeText: {
    color: colorTheme,
    fontSize: screenHeight / 24,
    fontWeight: 'bold',
    marginLeft: screenHeight / 28,
  },
})
export default Map_Screen
