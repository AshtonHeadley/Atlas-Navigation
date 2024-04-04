import React, {useEffect, useState} from 'react'
import {StyleSheet, View, TouchableOpacity, Animated, Text} from 'react-native'
import {colorTheme, screenHeight} from '../Home_Page'

const ExpandableView = ({expanded = false, onPressDel}) => {
  const [height] = useState(new Animated.Value(0))
  useEffect(() => {
    Animated.timing(height, {
      toValue: !expanded ? screenHeight / 12 : 0,
      duration: 10,
      useNativeDriver: false,
    }).start()
  }, [expanded, height])

  return (
    <Animated.View
      style={{
        height,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: colorTheme,
        marginBottom: 7.5,
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={onPressDel} style={styles.button}>
            <Text style={styles.SubTitleText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.SubTitleText}>Navigate</Text>
          </TouchableOpacity>
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
    color: colorTheme,
  },
  button: {
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
