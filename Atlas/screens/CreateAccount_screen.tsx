import {useState} from 'react'
import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const CreateAccount = ({navigation}) => {
  const [loading, setLoading] = useState(false)
  return (
    <ScrollView scrollEnabled={false}>
      <View style={styles.TitleView}>
        <View style={{flex: 0.25}}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}>
            <Image
              source={require('../assets/back_arrow.png')}
              style={{width: 40, height: 28}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.Center}>
          <Text style={styles.title}>ATLAS</Text>
        </View>
        <View style={{flex: 0.25}} />
      </View>
      <View style={styles.CreateAccountStyle}>
        <Text style={styles.header}>Create an Account</Text>
      </View>
      <View style={styles.TextFieldViewStyle}>
        <TextInput
          style={styles.input}
          placeholder='Full Name'
          placeholderTextColor={colorTheme}
          //   onChangeText={newText => setName(newText)}
        />
        <TextInput
          style={styles.input}
          placeholder='Email'
          placeholderTextColor={colorTheme}
          keyboardType='email-address'
          //   onChangeText={newText => setEmail(newText)}
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          placeholderTextColor={colorTheme}
          secureTextEntry
          //   onChangeText={newText => setPassword(newText)}
          textContentType={'oneTimeCode'}
        />
        <TextInput
          style={styles.input}
          placeholder='Confirm Password'
          placeholderTextColor={colorTheme}
          secureTextEntry
          //   onChangeText={newText => setConfirmPassword(newText)}
          textContentType={'oneTimeCode'}
        />
      </View>
      <View style={styles.TextFieldViewStyle}>
        <Text style={styles.subText}>
          By creating an account you agree to our
        </Text>
        <TouchableOpacity>
          <Text style={styles.subText}>
            Terms of Service and Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.TextFieldViewStyle}>
        {loading ? (
          <ActivityIndicator size={'large'} color='#0000ff' />
        ) : (
          <>
            <TouchableOpacity style={styles.createAccountButton}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Continue</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const colorTheme = '#4192ab'

const styles = StyleSheet.create({
  Center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  CreateAccountStyle: {
    marginTop: screenHeight / 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextFieldViewStyle: {
    marginTop: screenHeight / 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'baseline',
    flexDirection: 'row',
    padding: screenHeight / 24,
  },
  title: {
    fontSize: screenHeight / 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colorTheme,
  },
  header: {
    fontSize: screenHeight / 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colorTheme,
  },
  subText: {
    fontSize: screenHeight / 60,
    color: colorTheme,
  },
  input: {
    width: '80%',
    height: screenHeight / 16,
    borderWidth: 1,
    borderColor: colorTheme,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  createAccountButton: {
    width: '80%',
    height: screenHeight / 18,
    backgroundColor: colorTheme,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: screenHeight / 24,
  },
})

export default CreateAccount
