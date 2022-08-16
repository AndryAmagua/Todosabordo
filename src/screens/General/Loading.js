import React from "react"
import { ActivityIndicator, StyleSheet, SafeAreaView, ImageBackground } from "react-native"

const Loading = () => (
  <SafeAreaView style={styles.container}>
    <ImageBackground source={require('../../assets/Fondo1.jpg')} resizeMode="cover" style={styles.image}>
      <ActivityIndicator size="large" color="#005CA8" />
    </ImageBackground>
  </SafeAreaView>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
})

export default Loading