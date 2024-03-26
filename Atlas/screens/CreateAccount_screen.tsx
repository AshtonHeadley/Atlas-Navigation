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
  Alert,
} from 'react-native'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from '@firebase/auth'
import {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIREBASE_DATABASE,
  FIREBASE_FIRESTORE,
} from '../FirebaseConfig'
import {
  collection,
  getFirestore,
  addDoc,
  setDoc,
  doc,
} from '@firebase/firestore'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const CreateAccount = ({navigation}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH
  const db = getFirestore(FIREBASE_APP)

  const addUserData = async (
    uid: string,
    userName: string,
    userEmail: string,
  ) => {
    try {
      console.log('Before Firestore operation')
      const data = {
        name: userName,
        email: userEmail,
      }
      const userDocRef = doc(collection(db, 'users'), uid)
      await setDoc(userDocRef, data)
      console.log(`${uid} data added successfully`)
    } catch (error) {
      console.error('Error adding data:', error)
    }
  }

  const signUp = async () => {
    if (!email.includes('@')) {
      Alert.alert('Invalid Email')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(user)
      Alert.alert('Check your email')
      await addUserData(user.uid, name, email)
      navigation.goBack()
    } catch (error) {
      console.log(email)
      Alert.alert(
        'Something went wrong. Double check that you entered a valid email address.',
      )
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

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
          onChangeText={newText => setName(newText)}
        />
        <TextInput
          style={styles.input}
          placeholder='Email'
          placeholderTextColor={colorTheme}
          keyboardType='email-address'
          onChangeText={newText => setEmail(newText)}
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          placeholderTextColor={colorTheme}
          secureTextEntry
          onChangeText={newText => setPassword(newText)}
          textContentType={'oneTimeCode'}
        />
        <TextInput
          style={styles.input}
          placeholder='Confirm Password'
          placeholderTextColor={colorTheme}
          secureTextEntry
          onChangeText={newText => setConfirmPassword(newText)}
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
            <TouchableOpacity
              onPress={signUp}
              style={styles.createAccountButton}>
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
