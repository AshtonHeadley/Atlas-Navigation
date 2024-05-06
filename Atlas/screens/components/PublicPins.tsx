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

const queryEmail = async (name: string) => {
  const db = getFirestore(FIREBASE_APP)
  try {
    const friendRequestsCollection = collection(db, 'users')
    const q = query(friendRequestsCollection, where('name', '==', name))
    const querySnapshot = await getDocs(q)
    const docs = querySnapshot.docs.map(doc => doc.data())
    return docs[0].email
  } catch (err) {
    console.error(err)
  }
}
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
  }

  useEffect(() => {
    if (isVisible) {
      const loadPins = async () => {
        try {
          const pins = await (
            await getDocs(collection(db, 'PublicPins'))
          ).docs.map(doc => doc.data()) // Call loadPinComponents

          pins.forEach(async pin => {
            const currentDate = new Date()

            if (pin.dateSet && pin.terminationDate) {
              // Convert terminationDate to a Date object
              const terminationDateSeconds = pin.terminationDate.seconds
              const terminationDateNanoseconds = pin.terminationDate.nanoseconds
              const terminationDate = new Date(
                terminationDateSeconds * 1000 +
                  terminationDateNanoseconds / 1e6,
              )

              // Convert terminationDate to the local timezone
              const localTerminationDate = new Date(
                terminationDate.getTime() -
                  terminationDate.getTimezoneOffset() * 60 * 1000,
              )

              // Compare current date with localTerminationDate
              if (currentDate > localTerminationDate) {
                // Pin needs to be terminated, skip handleCreatePin
                console.log(
                  `Skipping public pin "${pin.title}" as it has expired.`,
                )
                deletePinComponent(
                  pin.title,
                  pin.user,
                  pin.published,
                  await queryEmail(pin.user),
                )
              } else {
                handleCreatePin(
                  pin.latitude,
                  pin.longitude,
                  pin.title,
                  pin.imageURI,
                  pin.user,
                  pin.dateSet,
                  pin.terminationDate,
                )
              }
            } else {
              // No termination date set, create the pin
              handleCreatePin(
                pin.latitude,
                pin.longitude,
                pin.title,
                pin.imageURI,
                pin.user,
                pin.dateSet,
                pin.terminationDate,
              )
            }
          })
        } catch (e) {
          console.error('Error loading public pins:', e)
        }
      }
      loadPins()

      return
    } else {
      setSearchVal('')
      pinList.clear
      setPinCards([...pinList])
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
                const filteredCards = pinCards.filter(card =>
                  card.props.text.title
                    .toLowerCase()
                    .includes(input.toLowerCase()),
                )
                setRenderList(filteredCards)
              } else {
                setRenderList([...pinCards])
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
