/*
"https://www.flaticon.com/authors/those-icons" title="Those Icons"> Those Icons </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'
*/
import { signOut } from '@firebase/auth';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIREBASE_DATABASE,
  FIREBASE_FIRESTORE,
  PERSISTENT_AUTH,
} from '../FirebaseConfig';
import React, { useEffect } from 'react';
import { collection, doc, getDoc, getFirestore } from '@firebase/firestore';
import FastImage from 'react-native-fast-image';
import { backGroundColor, themeColor } from '../default-styles';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
export const pinComponents = new Map();
export let GLOBAL_EMAIL = '';
export let GLOBAL_USERNAME = '';

export const GET_USERNAME = async () => {
  const userDocRef = doc(
    collection(getFirestore(FIREBASE_APP), 'users'),
    GLOBAL_EMAIL.toLowerCase(),
  );
  const userDoc = await getDoc(userDocRef);
  const userData = userDoc.data();
  if (userData) {
    GLOBAL_USERNAME = userData.name;
  }
};

const HomePage = ({ navigation }) => {
  const db = getFirestore(FIREBASE_APP);
  GLOBAL_EMAIL = PERSISTENT_AUTH.currentUser?.email
    ? PERSISTENT_AUTH.currentUser?.email
    : '';
  console.log(GLOBAL_EMAIL);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    GET_USERNAME();
    console.log(GLOBAL_USERNAME);
  }, []);

  return (
    //Screen with 3 buttons
    <View style={{ flex: 1, backgroundColor: backGroundColor }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 10,
            justifyContent: 'flex-end',
          }}>
          <View style={styles.TopRow}>
            <Text style={styles.TitleText}>ATLAS</Text>
            <TouchableOpacity //sign out button --> too change later
              style={styles.SignOut}
              onPress={async () => {
                try {
                  await signOut(PERSISTENT_AUTH);
                  console.log('signed out successfully');
                  navigation.navigate('LoginScreen');
                } catch (error) {
                  console.error('Error signing out:', error);
                  Alert.alert('An error occurred while signing out.');
                }
              }}>
              <FastImage
                source={require('../assets/menu.png')}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 2 }}></View>
      </View>
      <View
        style={{
          marginHorizontal: screenWidth / 20,
          flex: 5,
          justifyContent: 'space-evenly',
        }}>
        <View>
          <TouchableOpacity
            onPress={async () => {
              navigation.navigate('PinScreen');
            }}
            style={{
              ...styles.Button,
              backgroundColor: themeColor,
            }}>
            <FastImage
              source={require('../assets/pin.png')}
              style={{ width: 128, height: 128 }}
            />
            <Text style={styles.text}>Pins</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Friends');
            }}
            style={{
              ...styles.Button,
              backgroundColor: themeColor,
            }}>
            <FastImage
              source={require('../assets/multiple-users-silhouette.png')}
              style={{ width: 128, height: 128 }}
            />
            <Text style={styles.text}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.Button,
              backgroundColor: themeColor,
            }}>
            <FastImage
              source={require('../assets/profile-user.png')}
              style={{ width: 128, height: 128 }}
            />
            <Text style={styles.text}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// styling options
const styles = StyleSheet.create({
  TopRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  SignOut: {
    position: 'absolute',
    bottom: -(screenHeight / 128),
    left: 0,
    right: 0,
    marginLeft: screenWidth / 1.25,
    justifyContent: 'center',
    alignContent: 'center',
  },
  TitleText: {
    position: 'absolute',
    top: -(screenHeight / 18),
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: screenWidth / 4,
    flex: 1,
    fontSize: screenHeight / 14,
    fontWeight: 'bold',
    color: themeColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },

  Button: {
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    width: '100%',
    height: screenHeight / 4.5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenWidth / 20,
  },
  text: {
    fontSize: screenHeight / 30,
    color: 'white',
    fontWeight: '200',
  },
});

export default HomePage;