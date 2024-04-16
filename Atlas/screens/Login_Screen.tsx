import {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {setPersistence, signInWithEmailAndPassword} from '@firebase/auth'
import {FIREBASE_AUTH, PERSISTENT_AUTH} from '../FirebaseConfig'

// Global variable to store the email of the logged-in user
const screenHeight = Dimensions.get('window').height

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH

  // Function to handle user sign-in
  const signIn = async () => {
    //disables pressing log in again
    setLoading(true)
    try {
      //sends auth request to firebase
      const signedInUser = await signInWithEmailAndPassword(
        PERSISTENT_AUTH,
        email,
        password,
      )
      //if auth request works and user's email is verified...
      if (auth.currentUser) {
        if (auth.currentUser.emailVerified) {
          setEmail('')
          setPassword('')
          //allow access to app
          navigation.navigate('HomeScreen')
        } else {
          Alert.alert('Email not verified')
        }
      }
    } catch (error) {
      Alert.alert('Incorrect email or password')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ATLAS</Text>
      {/* Email input field */}
      <TextInput
        style={styles.input}
        placeholder='Email'
        placeholderTextColor='#999'
        keyboardType='email-address'
        onChangeText={newText => setEmail(newText)}
        value={email}
      />
      {/* Password input field */}
      <TextInput
        style={styles.input}
        placeholder='Password'
        placeholderTextColor='#999'
        secureTextEntry
        onChangeText={newText => setPassword(newText)}
        value={password}
      />
      {/* Forget password button */}
      <TouchableOpacity
        onPress={() => {
          // setEmail('ngub24@gmail.com')
          // setPassword('password')
        }}>
        <Text style={styles.forgotPassword}>Forget password?</Text>
      </TouchableOpacity>
      {/* Conditional rendering of login button or activity indicator */}
      {loading ? (
        <ActivityIndicator size={'large'} color='#0000ff' />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              signIn()
            }}
            style={styles.loginButton}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
        </>
      )}
      {/* Create account button */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CreateAccount')
        }}>
        <Text style={styles.createAccount}>Create an Account</Text>
      </TouchableOpacity>
    </View>
  )
}

// Color theme for the screen
const colorTheme = '#4192ab'

//custom styling options
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: screenHeight / 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
  forgotPassword: {
    marginBottom: 20,
    color: colorTheme,
  },
  loginButton: {
    width: '80%',
    height: screenHeight / 18,
    backgroundColor: colorTheme,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: screenHeight / 24,
  },
  loginButtonText: {
    color: '#ffff',
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  socialLoginButton: {
    width: screenHeight / 20,
    height: screenHeight / 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  createAccount: {
    color: colorTheme,
  },
})

export default LoginScreen
