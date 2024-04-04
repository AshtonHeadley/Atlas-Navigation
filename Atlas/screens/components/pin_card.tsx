import {StyleSheet, Text, Touchable, TouchableOpacity, View} from 'react-native'
import {colorTheme, screenHeight} from '../Home_Page'
import {useState} from 'react'
import ExpandableView from './Expandable_View'

const PinCard = ({text, onPressDel}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const {inputText, coordinates} = text
  const [bottomWidth, setBottomWidth] = useState(3)
  const [radius, setRadius] = useState(10)

  return (
    <TouchableOpacity
      onPress={() => {
        if (isExpanded) {
          setBottomWidth(0)
          setRadius(0)
        } else {
          setBottomWidth(3)
          setRadius(10)
        }
        setIsExpanded(!isExpanded)
      }}>
      <View
        style={{
          ...styles.Card,
          borderBottomWidth: bottomWidth,
          borderBottomRightRadius: radius,
          borderBottomLeftRadius: radius,
        }}>
        <Text>{inputText}</Text>
      </View>
      <ExpandableView expanded={isExpanded} onPressDel={onPressDel} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  Card: {
    flex: 1,
    padding: 5,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderColor: colorTheme,
    height: screenHeight / 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default PinCard
