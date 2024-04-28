import React, {lazy, Suspense} from 'react'
import {ActivityIndicator, View, StyleSheet} from 'react-native'

const Pins = lazy(() => import('../Pins'))

const LazyPins = props => {
  return (
    <Suspense
      fallback={
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='grey' />
        </View>
      }>
      <Pins {...props} />
    </Suspense>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
})

export default LazyPins
