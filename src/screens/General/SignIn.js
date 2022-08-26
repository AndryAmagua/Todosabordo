import {
  View, Text, StyleSheet, TextInput, LogBox, ActivityIndicator,
  Image, Alert, ImageBackground, Pressable, SafeAreaView, ScrollView, Modal
} from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import AsyncStorage from '@react-native-async-storage/async-storage'
LogBox.ignoreAllLogs()

const validationSchema = yup.object({
  correo: yup.string()
    .email('Correo no valido')
    .required("Correo Obligatorio"),
  contraseña: yup.string()
    .min(4, "Minimo 4 caracteres")
    .required("Contraseña obligatoria"),
})

const SigIn = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [security, setSecurity] = useState(true)
  const navegacion = props.navigation

  const onSignIn = async (correo, contraseña) => {
    try {
      setModalVisible(true)
      const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo.toLowerCase(),
          contraseña: contraseña,
        })
      });
      const json = await response.json();
      const value = JSON.stringify(json)
      if (json.correo) {
        AsyncStorage.setItem('usuario', value)
        AsyncStorage.setItem('login', "true")
        props.route.params.funcion()
      } else {
        Alert.alert("Aviso", json.message)
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setModalVisible(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
      // onRequestClose={() => {
      //     setModalVisible(false);
      // }}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: '#00000099'
        }}>
          <View style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center"
          }}>
            <ActivityIndicator size="large" color="#005CA8" />
            <Text>INGRESANDO...</Text>
          </View>
        </View>
      </Modal>
      <ImageBackground source={require('../../assets/Fondo2.jpg')} resizeMode="cover" style={styles.imageBackground}>
        <View style={styles.containerLogo}>
          <Image source={require('../../assets/Logo.png')} />
        </View>
        <View style={styles.containerControls}>
          <ScrollView>
            <Formik
              initialValues={{ correo: '', contraseña: '' }}
              validationSchema={validationSchema}
              onSubmit={(values) => { onSignIn(values.correo, values.contraseña) }}
            >
              {(props) => (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder='Correo'
                    placeholderTextColor={'white'}
                    onChangeText={props.handleChange('correo')}
                    value={props.values.correo}
                    onBlur={props.handleBlur('correo')}
                  />
                  <Text style={styles.errorText}>{props.touched.correo && props.errors.correo}</Text>
                  <View style={styles.viewPassword}>
                    <TextInput
                      style={{ flex: 1, color: 'white'}}
                      placeholder='Contraseña'
                      placeholderTextColor={'white'}
                      secureTextEntry={security}
                      onChangeText={props.handleChange('contraseña')}
                      value={props.values.contraseña}
                      onBlur={props.handleBlur('contraseña')}
                    />
                    <Pressable onPress={() => setSecurity(!security)}>
                      <Image source={require('../../assets/showPassword.png')} style={styles.icon} resizeMode={'contain'} />
                    </Pressable>
                  </View>
                  <Text style={styles.errorText}>{props.touched.contraseña && props.errors.contraseña}</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.whiteText} onPress={() => navegacion.navigate('Recover-Password')}>*Olvide mi contraseña</Text>
                  </View>

                  <Pressable style={styles.button} onPress={props.handleSubmit}>
                    <Text style={styles.buttonText}>INGRESAR</Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
        <View style={styles.containerText}>
          <Text style={styles.whiteText}>No eres miembro?  </Text>
          <Text style={styles.yellowText} onPress={() => props.navigation.navigate('Sign-Up')}>  Crear una cuenta</Text>
        </View>
      </ImageBackground >

    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageBackground: {
    flex: 1
  },
  containerLogo: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerControls: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 50
  },
  containerText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteText: {
    color: "#ffff",
    margin: 5
  },
  yellowText: {
    color: "#FFCB00"
  },
  buttonText: {
    color: "#000",
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 15
  },
  errorText: {
    color: "#ffff",
    textAlign: "center",
    marginVertical: 5,
    fontStyle: 'italic'
  },
  button: {
    backgroundColor: "#FFCB00",
    width: '50%',
    height: 'auto',
    alignSelf: 'center',
    padding: 12,
    marginTop: 20,
    borderRadius: 10
  },
  input: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'white',
    color: 'white',
    placeholderTextColor: 'white'
  },
  icon: {
    tintColor: '#fff',
    height: 25,
    width: 25,
    padding: 10,
    margin: 5
  },
  viewPassword: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'white',
    paddingHorizontal: 10
  }
})

export default SigIn