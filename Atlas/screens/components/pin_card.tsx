import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {colorTheme, screenHeight, screenWidth} from '../Home_Page'
import {useState} from 'react'
import ExpandableView from './Expandable_View'

const PinCard = ({text, onPressDel, onPressNav}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const {title, description, coordinates} = text
  const [bottomWidth, setBottomWidth] = useState(3)
  const [vertMargin, setVertMargin] = useState(8)
  const [radius, setRadius] = useState(5)

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setIsExpanded(!isExpanded)
          if (isExpanded) {
            setBottomWidth(0)
            setRadius(0)
            setVertMargin(0)
          } else {
            setBottomWidth(3)
            setRadius(5)
            setVertMargin(8)
          }
        }}>
        <View
          style={{
            ...styles.Card,
            // borderBottomWidth: bottomWidth,
            borderBottomRightRadius: radius,
            borderBottomLeftRadius: radius,
            marginVertical: vertMargin,
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
    </View>
  )
}

const styles = StyleSheet.create({
  Card: {
    marginHorizontal: 20,
    padding: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderColor: colorTheme,
    height: screenHeight / 8,
    width: screenWidth / 1.25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d6677',
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
  },
  TitleText: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    fontSize: screenHeight / 24,
    fontWeight: 'bold',
    color: 'white',
  },
  SubTitleText: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    fontSize: screenHeight / 48,
    // fontWeight: 'bold',
    color: '#CCCC',
  },
})

export default PinCard
