import React, {useState} from 'react'
import ImageResizer from '@bam.tech/react-native-image-resizer'
import RNFS from 'react-native-fs'
import {
  Button,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'
import {screenHeight, screenWidth} from '../Home_Page'
import {Alert} from 'react-native'
import {backGroundColor, themeColor} from '../../default-styles'
import {
  launchImageLibrary,
  launchCamera,
  ImageLibraryOptions,
} from 'react-native-image-picker'

const PinOverlayInput = ({
  isVisible = false,
  onCancel,
  onSubmit,
  coordinates = [],
}) => {
  const [title, setTitle] = useState('')
  const [isPress, setIsPress] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled(previousState => !previousState)
  const [image, setImage] = useState('')

  const touchProps = {
    activeOpacity: 1,
    // underlayColor: 'red', // <-- "backgroundColor" will be always overwritten by "underlayColor"
    style: isPress ? styles.btnPress : styles.btnNormal, // <-- but you can still apply other style changes
    onHideUnderlay: () => setIsPress(false),
    onShowUnderlay: () => setIsPress(true),
    onPress: () => console.log('HELLO'), // <-- "onPress" is apparently required
  }

  const handleCancel = () => {
    setTitle('')
    setImage('')
    onCancel()
  }
  const handleSubmit = () => {
    if (title === '') {
      Alert.alert('Enter a title')
      return
    }
    onSubmit(title, image, isEnabled)
    setTitle('')
    setImage('')
  }

  const imgOptions: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
  }

  const handleImage = () => {
    // Prompt user to choose between gallery and camera
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => launchCamera(imgOptions, handleImageSelection),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => launchImageLibrary(imgOptions, handleImageSelection),
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    )
  }

  const handleImageSelection = response => {
    // console.log(response.assets?.[0].base64)
    if (response.didCancel) {
      console.log('User cancelled image picker')
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error)
    } else if (response.assets?.[0]?.uri) {
      ImageResizer.createResizedImage(
        response.assets?.[0]?.uri,
        256,
        256,
        'PNG',
        60,
        0,
      ).then(async response => {
        RNFS.readFile(response.uri, 'base64').then(async res => {
          setImage(res)
        })
      })
    } else {
      console.log('No URI provided')
    }
  }

  return (
    <Modal transparent={true} visible={isVisible} animationType='fade'>
      <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <View
          style={{
            height: '40%',
            width: '90%',
            position: 'absolute',
            backgroundColor: themeColor,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
          }}>
          <Text style={styles.title}>Create Pin</Text>
          <TextInput
            placeholderTextColor={'white'}
            placeholder='Title'
            value={title}
            onChangeText={text => setTitle(text)}
            style={styles.input}
          />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{justifyContent: 'center', marginRight: 8}}>
              <Text style={{color: '#f4f3f4', fontWeight: 'bold'}}>
                Publish Pin?
              </Text>
            </View>
            <Switch
              style={{margin: 5}}
              trackColor={{false: backGroundColor, true: backGroundColor}}
              thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <TouchableOpacity
            style={{
              ...styles.button,
              borderWidth: 1.5,
              borderColor: 'black',
              paddingHorizontal: 50,
            }}
            onPress={handleImage}>
            <Text>Add Image?</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <TouchableHighlight
              {...{...touchProps, underlayColor: 'red'}}
              style={{...styles.button, borderWidth: 1.5, borderColor: 'black'}}
              onPress={handleCancel}>
              <Text style={{fontWeight: 'bold'}}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              {...{...touchProps, underlayColor: 'lime'}}
              style={{
                ...styles.button,
                borderWidth: 1.5,
                borderColor: 'black',
              }}
              onPress={handleSubmit}>
              <Text style={{fontWeight: 'bold'}}>Confirm</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: screenHeight / 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '80%',
    height: screenHeight / 16,
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  descInput: {
    width: '80%',
    height: screenHeight / 8,
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: 'red',
  },
  addImageButton: {
    width: screenWidth / 2,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
  },
  btnNormal: {
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
    height: 30,
    width: 100,
  },
  btnPress: {
    borderColor: 'red',
    borderWidth: 1,
    height: 30,
    width: 100,
  },
})

export default PinOverlayInput
