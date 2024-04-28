import React, {lazy, Suspense} from 'react'
import {ActivityIndicator, View, StyleSheet} from 'react-native'

const Login = lazy(() => import('../Login_Screen'))

const LazyLogin = props => {
  return (
    <Suspense
      fallback={
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='grey' />
        </View>
      }>
      <Login {...props} />
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

export default LazyLogin
