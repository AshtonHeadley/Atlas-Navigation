import React from 'react'
import {View, StyleSheet} from 'react-native'
import NavigationItem from './NavigationItem'
import {screenHeight} from '../Home_Page'

export const homeNavItem = {
  icon: require('../../assets/pin.png'),
  onPress: () => console.log('Going to Home'),
  title: 'Pins',
}
export const leftNavItem = {
  icon: require('../../assets/pin.png'),
  onPress: () => console.log('Pin Pressed'),
  title: 'Pins',
}
export const centerNavItem = {
  icon: require(`../../assets/multiple-users-silhouette.png`),
  onPress: () => console.log('Friends Pressed'),
  title: 'Friends',
}
export const rightNavItem = {
  icon: require(`../../assets/profile-user.png`),
  onPress: () => console.log('Profile Pressed'),
  title: 'Profile',
}

const NavigationBar = ({leftItem, centerItem, rightItem}) => {
  return (
    <View style={styles.container}>
      <NavigationItem item={leftItem} />
      <NavigationItem item={centerItem} />
      <NavigationItem item={rightItem} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: screenHeight / 80,
  },
})

export default NavigationBar
