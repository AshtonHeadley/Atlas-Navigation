import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native"

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export const LoginScreen = ({}) => {
    const [email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const checkInput = () => {
    if(email == 'ADMIN' && password == 'ADMINPASS'){
        console.log("Logged in!")
        //navigation.navigate('Profile', {name: 'Jane'})
    }
    else{
      console.log("Failed to Log in!")
    }
    };
        return (
            <View style={styles.container}>
          <Text style={styles.title}>ATLAS</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            onChangeText={newText => setEmail(newText)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            onChangeText={newText => setPassword(newText)}
          />
          <TouchableOpacity>      
            <Text style={styles.forgotPassword}>Forget password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={checkInput}
                            style={styles.loginButton}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
          <View style={styles.socialLoginContainer}>
            <TouchableOpacity style={styles.socialLoginButton}>
              <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png'}}
                    style={{width: screenHeight/20, height: screenHeight/20}} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.createAccount}>Create an Account</Text>
          </TouchableOpacity>
        </View>
        )
}

const colorTheme = '#2596bd'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: screenHeight/18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colorTheme,
  },
  input: {
    width: '80%',
    height: 40,
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
    height: screenHeight/18,
    backgroundColor: colorTheme,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: screenHeight/24,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  socialLoginButton: {
    width: screenHeight/20,
    height: screenHeight/20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  createAccount: {
    color: colorTheme,
  },
});