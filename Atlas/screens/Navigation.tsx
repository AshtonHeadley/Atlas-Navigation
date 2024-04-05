import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {currentNavTarget, requestLocationPermission} from './Pins'
import GeoLocation from 'react-native-geolocation-service'
import {useEffect, useState} from 'react'
import {gyroscope} from 'react-native-sensors'

const CompassPage = () => {
  const [dist, setDistance] = useState('')

  useEffect(() => {
    setInterval(() => {
      console.log('------------\ngetting location...')
      getLocation()
    }, 3000)
  }, [])

  //Haversine formula vv
  function getDistanceInFeet (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const R = 6378137 // Earth's radius in feet
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const lat1Rad = toRad(lat1)
    const lat2Rad = toRad(lat2)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1Rad) *
        Math.cos(lat2Rad)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    let adjustedDistance = 0
    if (distance <= 15) {
      adjustedDistance = 0
    } else {
      adjustedDistance = distance - 15
    }
    setDistance(
      `${distance} actual meters from Target, ${adjustedDistance} adjusted feet from Target`,
    )
    console.log(dist)
  }

  function toRad (value: number) {
    return (value * Math.PI) / 180
  }

  const getLocation = async () => {
    const res = await requestLocationPermission() //call to permission handler
    if (res) {
      return GeoLocation.getCurrentPosition(
        async position => {
          const {latitude, longitude, accuracy} = position.coords //output of get CurrentPosition
          setDistance(`Getting distance...`)
          console.log([latitude, longitude])
          console.log('Target:')
          getDistanceInFeet(
            latitude,
            longitude,
            currentNavTarget[0],
            currentNavTarget[1],
          )
        },
        error => {
          console.log(error.code, error.message)
        },
        {enableHighAccuracy: false, timeout: 3000, maximumAge: 0},
      )
    }
  }

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}></View>
      <View style={{flex: 3}}>
        <TouchableOpacity>
          <Text>Get location</Text>
        </TouchableOpacity>
        <View>
          <Text>
            Distance from: {currentNavTarget} is {dist}
          </Text>
        </View>
      </View>
      <View style={{flex: 1}}></View>
    </View>
  )
}

export default CompassPage
