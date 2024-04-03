import React, {useState} from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native'
import NavigationBar, {
  friendsNavItem,
  homeNavItem,
  profileNavItem,
} from './components/NavigationBar'
import {colorTheme, screenHeight, screenWidth} from './Home_Page'
import PinCard from './components/pin_card'
const components: any[] = []
const Pins = ({navigation}) => {
  const [pinCards, setPinCards] = useState([...components])
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1.5,
          marginHorizontal: screenWidth / 12,
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          onPress={() => {
            setPinCards([
              ...pinCards,
              <PinCard text={(pinCards.length + 1).toString()} />,
            ])
          }}
          style={{
            ...styles.Button,
            backgroundColor: colorTheme,
          }}>
          <Image
            source={require('../assets/add.png')}
            style={{width: 32, height: 32}}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 4.5}}>
        <View style={{marginHorizontal: screenWidth / 24}}>
          <View style={{flex: 1}}></View>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {pinCards.map(item => {
              return item
            })}
          </ScrollView>
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <NavigationBar
          leftItem={{
            ...homeNavItem,
            onPress: () => {
              navigation.navigate('HomeScreen')
            },
          }}
          centerItem={friendsNavItem}
          rightItem={profileNavItem}></NavigationBar>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  Button: {
    width: '100%',
    height: screenHeight / 11,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Pins
