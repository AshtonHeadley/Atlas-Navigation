import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  currentNavTarget,
  currentNavTitle,
  requestLocationPermission,
} from './Pins'
import GeoLocation from 'react-native-geolocation-service'
import {useState, useRef, useEffect} from 'react'
import CompassHeading from 'react-native-compass-heading'
import {colorTheme, screenHeight, screenWidth} from './Home_Page'

const CompassPage = ({navigation}) => {
  const [location, setLocation] = useState({latitude: 0, longitude: 0})
  const [heading, setHeading] = useState(0)
  const [azimuth, setAzimuth] = useState(0)
  const [distance, setDistance] = useState('')
  const [arrowDirection, setArrowDirection] = useState(0)
  let compassid: any
  let id: any

  const handleGoBack = () => {
    GeoLocation.clearWatch(id)
    CompassHeading.stop(compassid)
  }

  const target = {
    latitude: parseFloat(currentNavTarget[0].toFixed(5)),
    longitude: parseFloat(currentNavTarget[1].toFixed(5)),
  }

  const calculateAzimuth = (lat, lon) => {
    lat = parseFloat(lat.toFixed(5))
    lon = parseFloat(lon.toFixed(5))
    const y = Math.sin(target.longitude - lon) * Math.cos(target.latitude)
    const x =
      Math.cos(lat) * Math.sin(target.latitude) -
      Math.sin(lat) *
        Math.cos(target.latitude) *
        Math.cos(target.longitude - lon)
    let azimuth = (Math.atan2(y, x) * 180) / Math.PI
    azimuth = (azimuth + 360) % 360
    return azimuth.toFixed(0)
  }

  const calculateDistance = (lat1, lon1) => {
    lat1 = parseFloat(lat1.toFixed(5))
    lon1 = parseFloat(lon1.toFixed(5))
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180 // φ, λ in radians
    const φ2 = (target.latitude * Math.PI) / 180
    const Δφ = ((target.latitude - lat1) * Math.PI) / 180
    const Δλ = ((target.longitude - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const d = R * c
    setDistance(d.toFixed(0))
    return d
  }
  useEffect(() => {
    const degree_update_rate = 0.1
    compassid = CompassHeading.start(
      degree_update_rate,
      ({heading, accuracy}) => {
        setHeading(heading)
      },
    )
    requestLocationPermission()
    id = GeoLocation.watchPosition(
      position => {
        const {
          coords: {latitude, longitude, accuracy},
        } = position
        setLocation({latitude, longitude})
        setAzimuth(parseInt(calculateAzimuth(latitude, longitude)))
        if (calculateDistance(latitude, longitude) <= 5) {
          Alert.alert('You have reached your destination!')
          handleGoBack()
          return
        }
      },
      error => {
        console.error(error.message) // Handle location errors (e.g., GPS disabled)
      },
      {
        enableHighAccuracy: true, // Set to true for maximum accuracy
        distanceFilter: 5, // Minimum distance change to trigger update (in meters)
      },
    )
    return () => {
      GeoLocation.clearWatch(id)
      CompassHeading.stop(compassid)
    }
  }, [])

  useEffect(() => {
    const direct = (azimuth - heading + 360) % 360
    setArrowDirection(direct)
  }, [azimuth, heading])

  return (
    <View style={{flex: 1, backgroundColor: '#132b33'}}>
      <View style={{flex: 1}}></View>
      <View
        style={{
          flex: 0.5,
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <Text style={styles.TitleText}>{currentNavTitle}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 0.5,
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <Text style={{...styles.Text, ...styles.Shadow}}>{distance} m</Text>
          </View>
        </View>
      </View>
      <View style={{flex: 4}}>
        <View style={styles.container}>
          <Animated.Image
            source={require('../assets/navigation.png')}
            style={[
              styles.image,
              {
                transform: [{rotate: `${arrowDirection}deg`}],
              },
            ]}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: 30,
          marginHorizontal: screenWidth / 12,
        }}>
        <TouchableOpacity
          onPress={() => {
            handleGoBack()
            navigation.pop()
          }}
          style={{
            ...styles.Button,
            backgroundColor: colorTheme,
            ...styles.Shadow,
          }}>
          <Text
            style={{
              fontSize: screenWidth / 20,
              // fontWeight: 'bold',
              color: 'white',
            }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    padding: 100,
    width: 125,
    height: 125,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
  },
  Button: {
    width: '100%',
    height: screenHeight / 11,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleText: {
    // position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignContent: 'center',
    // marginLeft: screenWidth / 4,
    flex: 1,
    fontSize: screenWidth / 10,
    fontWeight: 'bold',
    color: '#66a7bb',
  },
  Text: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    fontSize: screenWidth / 20,
    fontWeight: 'bold',
    color: 'white',
  },
  Shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 6,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
  },
})

export default CompassPage
