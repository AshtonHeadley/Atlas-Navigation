import {StyleSheet, Text, View} from 'react-native'
import {colorTheme, screenHeight} from '../Home_Page'
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from 'react'

const PinCard = ({text}) => {
  const {inputText} = text
  console.log(text)
  return (
    <View style={styles.Card}>
      <Text>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  Card: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colorTheme,
    height: screenHeight / 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
})

export default PinCard
