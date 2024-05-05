import React from 'react'
import {View, StyleSheet} from 'react-native'
import NavigationItem from './NavigationItem'
import {screenHeight} from '../Home_Page'

export const homeNavItem = {
  icon: require('../../assets/home.png'),
  title: 'Home',
}
export const pinNavItem = {
  icon: require('../../assets/pin.png'),
  title: 'Pins',
}
export const friendsNavItem = {
  icon: require(`../../assets/multiple-users-silhouette.png`),
  title: 'Friends',
}
export const profileNavItem = {
  icon: require(`../../assets/profile-user.png`),
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
    alignItems: 'center',
    marginTop: screenHeight / 80,
  },
})

export default NavigationBar
