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
          flex: 1.75,
          marginHorizontal: screenWidth / 12,
        }}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Text style={styles.TitleText}>Pins</Text>
        </View>
        <View style={{flex: 0, justifyContent: 'flex-end'}}>
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
      </View>
      <View style={{flex: 4.5}}>
        <View style={{marginHorizontal: screenWidth / 28}}>
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
  TitleText: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: screenWidth / 4,
    flex: 1,
    fontSize: screenHeight / 14,
    fontWeight: 'bold',
    color: colorTheme,
  },
})

export default Pins
