import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {colorTheme, screenHeight} from '../Home_Page'
import {useState} from 'react'
import ExpandableView from './Expandable_View'

const PinCard = ({text, onPressDel, onPressNav}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const {title, description, coordinates} = text
  const [bottomWidth, setBottomWidth] = useState(3)
  const [radius, setRadius] = useState(5)

  return (
    <TouchableOpacity
      onPress={() => {
        setIsExpanded(!isExpanded)
        if (isExpanded) {
          setBottomWidth(0)
          setRadius(0)
        } else {
          setBottomWidth(3)
          setRadius(5)
        }
      }}>
      <View
        style={{
          ...styles.Card,
          borderBottomWidth: bottomWidth,
          borderBottomRightRadius: radius,
          borderBottomLeftRadius: radius,
        }}>
        <Text style={styles.TitleText}>{title}</Text>
        <Text style={styles.SubTitleText}>Location: {description}</Text>
      </View>
      <ExpandableView
        expanded={isExpanded}
        onPressDel={onPressDel}
        onPressNav={onPressNav}
        coordinates={coordinates}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  Card: {
    flex: 1,
    padding: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderColor: colorTheme,
    height: screenHeight / 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleText: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    fontSize: screenHeight / 24,
    fontWeight: '300',
    color: colorTheme,
  },
  SubTitleText: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    fontSize: screenHeight / 48,
    fontWeight: 'bold',
    color: 'black',
  },
})

export default PinCard
