import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {currentNavTarget, requestLocationPermission} from './Pins'
import GeoLocation from 'react-native-geolocation-service'
import {useEffect, useState} from 'react'
import {gyroscope} from 'react-native-sensors'

const CompassPage = () => {
  let id: any
  let target = {latitude: currentNavTarget[0], longitude: currentNavTarget[1]}
  let options

  function success (pos: {coords: any}) {
    const crd = pos.coords
    console.log('-----------------')
    console.log(crd.latitude, crd.longitude)
    console.log('-----------------')
    if (
      target.latitude === crd.latitude &&
      target.longitude === crd.longitude
    ) {
      console.log('Congratulations, you reached the target')
      GeoLocation.clearWatch(id)
    }
  }

  function error (err: {code: any; message: any}) {
    console.error(`ERROR(${err.code}): ${err.message}`)
  }

  target = {
    latitude: 0,
    longitude: 0,
  }

  options = {
    enableHighAccuracy: false,
  }

  id = GeoLocation.watchPosition(success, error, options)

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}></View>
      <View style={{flex: 3}}>
        <TouchableOpacity>
          <Text>Get location</Text>
        </TouchableOpacity>
        <View>
          <Text>Target: {currentNavTarget}</Text>
        </View>
      </View>
      <View style={{flex: 1}}></View>
    </View>
  )
}

export default CompassPage
