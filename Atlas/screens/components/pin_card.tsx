import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {screenHeight, screenWidth} from '../Home_Page'
import {useState} from 'react'
import ExpandableView from './Expandable_View'
import {themeColor} from '../../default-styles'

const PinCard = ({text, onPressDel, onPressNav}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const {title, coordinates} = text
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
          <View style={styles.ImageView}></View>
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
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    height: screenHeight / 8,
    width: screenWidth / 1.25,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#2d6677',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
  },
  TitleText: {
    paddingTop: screenHeight / 32,
    paddingLeft: 10,
    flex: 2,
    fontSize: screenHeight / 32,
    fontWeight: 'bold',
    color: 'white',
  },
  ImageView: {
    backgroundColor: themeColor,
    height: screenHeight / 8,
    borderRadius: 5,
    flex: 1.25,
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
