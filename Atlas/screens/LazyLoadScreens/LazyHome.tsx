import React, {lazy, Suspense} from 'react'
import {ActivityIndicator, View, StyleSheet} from 'react-native'

const Home = lazy(() => import('../Home_Page'))

const LazyHome = props => {
  return (
    <Suspense
      fallback={
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='grey' />
        </View>
      }>
      <Home {...props} />
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

export default LazyHome
