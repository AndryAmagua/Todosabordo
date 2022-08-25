import { StyleSheet, Pressable, SafeAreaView, ImageBackground, Text, Image } from 'react-native'
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
        <Text style={styles.text}>{usuario.nombre.toUpperCase()}</Text>
        <Text style={styles.text}>{usuario.correo}</Text>
        <Text style={styles.text}>{usuario.celular}</Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Edit', { usuario: usuario, funcion: getData })}>
          <Text style={styles.buttonText}>EDITAR INFORMACIÓN</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('EditContraseña', { usuario: usuario })}>
          <Text style={styles.buttonText}>CAMBIAR CONTRASEÑA</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => logout()}>
          <Text style={styles.buttonText}>CERRAR SESIÓN</Text>
        </Pressable>
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
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: "#005CA8",
    width: 'auto',
    height: 'auto',
    padding: 12,
    borderRadius: 10
  },
})