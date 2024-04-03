import {View, Text, Button, PermissionsAndroid} from 'react-native';
import React, {useState} from 'react';
import GeoLocation from 'react-native-geolocation-service';
const Map_Screen = () => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  // Function to get permission for location mainly for android
  const requestLocationPermission = async () => {
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
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = async () => {
    const res = await requestLocationPermission();

    if (res) {
      GeoLocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation({latitude, longitude});
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
    console.log(currentLocation);
  };

  return (
    <View>
      <Button title="Create Pin" onPress={getLocation} />
      <Text>Latitude: {currentLocation ? currentLocation.latitude : null}</Text>
      <Text>Longitude: {currentLocation ? currentLocation.longitude : null}</Text>
    </View>

  );
};

export default Map_Screen;
