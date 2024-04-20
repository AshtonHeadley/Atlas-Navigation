import React, {useEffect, useState} from 'react'
import {StyleSheet, View, TouchableOpacity, Animated, Text} from 'react-native'
import {screenHeight, screenWidth} from '../Home_Page'
import {themeColor} from '../../default-styles'

const ExpandableView = ({
  expanded,
  onPressNav = () => {},
  onPressDel = () => {},
  onPressAdd = () => {},
  addPin = false,
  coordinates = {lat: 0, long: 0},
}) => {
  const {lat, long} = coordinates
  const [height] = useState(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(height, {
      toValue: !expanded ? screenHeight / 12 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start()
  }, [expanded, height])

  return expanded ? (
    <View />
  ) : (
    <Animated.View
      style={{
        height,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: '#2d6677',
        marginBottom: 7.5,
        width: screenWidth / 1.25,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 4,
          height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
      }}>
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {addPin ? (
            <TouchableOpacity onPress={onPressAdd} style={styles.button}>
              <Text style={styles.SubTitleText}>Add</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={onPressDel} style={styles.button}>
                <Text style={styles.SubTitleText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressNav} style={styles.button}>
                <Text style={styles.SubTitleText}>Navigate</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: screenHeight / 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: themeColor,
  },
  button: {
    padding: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 3,
    backgroundColor: 'white',
  },
  SubTitleText: {
    fontSize: screenHeight / 48,
    fontWeight: 'bold',
    color: 'black',
  },
})

export default ExpandableView
