import {StyleSheet, Text, Touchable, TouchableOpacity, View} from 'react-native'
import {colorTheme, screenHeight} from '../Home_Page'

const PinCard = ({text}) => {
  const {inputText, onPressFunc, coordinates} = text
  console.log(inputText)
  return (
    <TouchableOpacity onPress={onPressFunc}>
      <View style={styles.Card}>
        <Text>{inputText}</Text>
      </View>
    </TouchableOpacity>
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
