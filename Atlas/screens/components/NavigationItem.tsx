import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native'
import {colorTheme, screenHeight} from '../Home_Page'
import FastImage from 'react-native-fast-image'

const NavigationItem = ({item}) => {
  const {icon, title, onPress} = item // Destructure item props
  return (
    <View style={styles.item}>
      <Text style={styles.text}>{title}</Text>
      <TouchableOpacity style={styles.touchable} onPress={onPress}>
        <FastImage source={icon} style={{width: 48, height: 48}} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flex: 1, // Makes items occupy equal space
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    backgroundColor: colorTheme,
    borderRadius: 15,
    padding: 12,
  },
  text: {
    fontSize: screenHeight / 46,
    color: 'black',
  },
})

export default NavigationItem
