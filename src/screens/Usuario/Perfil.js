import { StyleSheet, Button, View, SafeAreaView, ImageBackground, Text, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Perfil = ({ route, navigation }) => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
    celular: ""
  })
  const logout = async () => {
    AsyncStorage.removeItem('usuario')
    AsyncStorage.setItem('login', "false")
    route.params.funcion()
  }

  const getData = async () => {
    const usuario = JSON.parse(await AsyncStorage.getItem('usuario'))
    setUsuario(usuario)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/Fondo4.png')} style={styles.fondo}>
        <Image source={require('../../assets/User.png')} />
        <Text style={styles.text}>{usuario.nombre}</Text>
        <Text style={styles.text}>{usuario.correo}</Text>
        <Text style={styles.text}>{usuario.celular}</Text>
        <Button
          title='Editar información'
          color={'#005CA8'}
          onPress={() => navigation.navigate('Edit')}
        />
        <Button
          title='Cerrar Sesion'
          color={'#005CA8'}
          onPress={() => logout()}
        />
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Perfil

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fondo: {
    flex: 1,
    paddingTop: 55,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  text: {
    color: '#000',
  }
})