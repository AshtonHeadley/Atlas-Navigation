import React, {useState} from 'react'
import {Animated, StyleSheet, View} from 'react-native'

const Skeleton = ({width, height, borderRadius}) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1000) // Simulate loading time
    return () => clearTimeout(timeout)
  }, [])

  const shimmer = Animated.decay(new Animated.Value(1), {
    useNativeDriver: true,
    duration: 1500,
    toValue: 0.5,
    repeatCount: Infinity,
  })

  if (!isLoading) return null

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {width, height, borderRadius},
        {
          backgroundColor: shimmer.interpolate({
            inputRange: [0, 1],
            outputRange: ['#f0f0f0', '#e0e0e0'],
          }),
        },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  skeleton: {
    opacity: 0.8,
    borderRadius: 5,
  },
})

export default Skeleton
