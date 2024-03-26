import {useState} from 'react'
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native'

const HomePage = ({navigation}) => {
  const [name, setName] = useState('')
  let text = `Welcome ${name ? name : ''}`
  return (
    <View style={styles.center}>
      <Text>Home Page</Text>
      <Text>{text}</Text>
      <TouchableOpacity
        onPress={async () => {
          try {
            // await signOut(auth)
            console.log('signed out successfully')
            navigation.goBack()
          } catch (error) {
            console.error('Error signing out:', error)
            Alert.alert('An error occurred while signing out.')
          }
        }}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})

export default HomePage
