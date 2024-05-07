import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {screenHeight, screenWidth} from '../Home_Page'
import {useState} from 'react'
import ExpandableView from './Expandable_View'
import {themeColor} from '../../default-styles'
import FastImage from 'react-native-fast-image'

const PinCard = ({
  text,
  onPressDel = () => {},
  onPressNav = () => {},
  onPressAdd = () => {},
  image = '',
  addPin = false,
  creator = '',
  dateSet = false,
  date,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const {title, coordinates} = text
  const [bottomWidth, setBottomWidth] = useState(3)
  const [vertMargin, setVertMargin] = useState(8)
  const [radius, setRadius] = useState(5)

  const convertDate = () => {
    const regex = /seconds=(\d+)/
    const match = date.match(regex)
    if (match) {
      const seconds = parseInt(match[1], 10)
      const dateObject = new Date(seconds * 1000)
      return `${dateObject.toLocaleDateString()}, ${dateObject.toLocaleTimeString()}`
    }
    return date
  }

  const cardHeight = dateSet ? screenHeight / 6.75 : screenHeight / 8

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
            minHeight: screenHeight / 8,
          }}>
          <View style={{flex: 2}}>
            <Text style={styles.TitleText}>{title}</Text>
            <Text style={{...styles.SubTitleText, fontWeight: 'bold'}}>
              {creator}
            </Text>
            {dateSet ? (
              <Text style={styles.SubTitleText}>Deletes: {convertDate()}</Text>
            ) : (
              <View />
            )}
          </View>
          <FastImage
            source={{uri: 'data:image/png;base64,' + image}}
            style={styles.ImageView}
          />
        </View>
        <ExpandableView
          expanded={isExpanded}
          onPressDel={onPressDel}
          onPressNav={onPressNav}
          coordinates={coordinates}
          addPin={addPin}
          onPressAdd={onPressAdd}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  Card: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
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
    maxHeight: screenHeight / 3,
  },
  TitleText: {
    marginRight: 10,
    paddingTop: screenHeight / 32,
    paddingLeft: 8,
    fontSize: screenHeight / 36,
    fontWeight: 'bold',
    color: 'white',
    justifyContent: 'center',
    alignContent: 'center',
  },
  ImageView: {
    // backgroundColor: themeColor,
    height: screenHeight / 8,
    borderRadius: 5,
    flex: 1.25,
  },
  SubTitleText: {
    marginRight: 10,
    paddingLeft: 10,
    fontSize: screenHeight / 48,
    // fontWeight: 'bold',
    color: '#CCCC',
    marginBottom: 10,
  },
})

export default PinCard
