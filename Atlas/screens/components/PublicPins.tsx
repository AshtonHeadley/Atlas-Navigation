import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import {backGroundColor, themeColor} from '../../default-styles'
import {GLOBAL_EMAIL, screenHeight, screenWidth} from '../Home_Page'
import PinCard from './pin_card'
import {
  createPinCard,
  deletePinComponent,
  getPinCollection,
  loadPinComponents,
} from '../Pins'
import {useEffect, useState} from 'react'
import {
  getDocs,
  collection,
  getFirestore,
  deleteDoc,
  doc,
  query,
  where,
} from '@firebase/firestore'
import {FIREBASE_APP} from '../../FirebaseConfig'

const PublicPins = ({isVisible = false, onSubmit}) => {
  const db = getFirestore(FIREBASE_APP)
  const [pinCards, setPinCards] = useState([] as any)
  const [searchVal, setSearchVal] = useState('')
  const [renderList, setRenderList] = useState([] as any)
  const pinList = [] as any

  const handleCreatePin = async (
    latitude: number,
    longitude: number,
    inputTitle: string,
    user: string,
    image = '',
    dateSet: boolean,
    date: Date,
  ) => {
    const specialNum = Math.random()
    const key = Math.abs(latitude * longitude * specialNum) //unique key for each card. For deletion + DB
    const pinCard = createPinCard(
      inputTitle,
      latitude,
      longitude,
      specialNum,
      key,
      image,
      setPinCards,
      () => {},
      user,
      true,
      true,
      dateSet,
      date,
    )
    pinList.push(pinCard)
    setPinCards([...pinCards, pinCard])
    setRenderList((prevList: any) => [...prevList, pinCard])
  }
  const loadPins = async () => {
    try {
      const pins = await (
        await getDocs(collection(db, 'PublicPins'))
      ).docs.map(doc => doc.data()) // Call loadPinComponents
      const currentDate = new Date()
      pins.forEach(async pin => {
        if (pin.dateSet && pin.terminationDate) {
          const terminationDate = new Date(pin.terminationDate.seconds * 1000)
          if (currentDate > terminationDate) {
            console.log(
              `Skipping pin "${pin.title}" as it has expired. Removing Pin from database`,
              deletePinComponent(pin.title, pin.user, pin.published),
            )
          } else {
            await handleCreatePin(
              pin.latitude,
              pin.longitude,
              pin.title,
              pin.user,
              pin.imageURI,
              pin.dateSet,
              pin.terminationDate,
            )
          }
        } else {
          // No termination date set, create the pin
          await handleCreatePin(
            pin.latitude,
            pin.longitude,
            pin.title,
            pin.user,
            pin.imageURI,
            pin.dateSet,
            pin.terminationDate,
          )
        }
      })
    } catch (e) {
      console.error('Error loading public pins:', e)
    }
  }

  useEffect(() => {
    if (isVisible) {
      loadPins()

      return
    } else {
      setSearchVal('')
      pinList.clear
      setPinCards([...pinList])
      setRenderList([])
    }
  }, [isVisible])

  const handleSubmit = () => {
    onSubmit()
  }

  return (
    <Modal transparent={false} visible={isVisible} animationType='fade'>
      <View
        style={{
          backgroundColor: backGroundColor,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <View
          style={{
            height: '100%',
            width: '100%',
            flex: 0.9,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
          }}>
          <Text style={styles.title}>Public Pins</Text>
          <TextInput
            placeholderTextColor={'#d9d9d9'}
            placeholder='Search'
            style={styles.input}
            value={searchVal}
            onChangeText={(input: string) => {
              setSearchVal(input)
              if (input != '') {
                const filteredCards = renderList.filter(card => {
                  return (
                    card.props.text.title
                      .toLowerCase()
                      .includes(input.toLowerCase()) ||
                    card.props.text.user
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  )
                })
                setRenderList(filteredCards)
              } else {
                setRenderList([])
                loadPins()
              }
            }}
          />
          <FlatList
            data={renderList}
            renderItem={({item}) => item}
            keyExtractor={item => item.key}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              ...styles.Button,
              backgroundColor: themeColor,
              ...styles.Shadow,
            }}>
            <Text
              style={{
                fontSize: screenWidth / 20,
                color: 'white',
              }}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: themeColor,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 6,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6.5,
  },
  input: {
    width: '80%',
    height: screenHeight / 16,
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: 'white',
    color: 'white',
  },
  Text: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    fontSize: screenWidth / 20,
    fontWeight: 'bold',
    color: 'white',
  },
  Shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 6,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6.5,
  },
  Button: {
    marginTop: 10,
    width: '100%',
    height: screenHeight / 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default PublicPins
