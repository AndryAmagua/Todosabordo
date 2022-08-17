import {
  View, Text, StyleSheet, TextInput, LogBox,
  Image, Alert, ImageBackground, Pressable, SafeAreaView, ScrollView
} from 'react-native'
import React from 'react'
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

  const navegacion = props.navigation
  const onSignIn = async (correo, contraseña) => {
    try {
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
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/Fondo2.jpg')} resizeMode="cover" style={styles.image}>
        <View style={styles.containerImage}>
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
                  <Text style={styles.textError}>{props.touched.correo && props.errors.correo}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder='Contraseña'
                    placeholderTextColor={'white'}
                    secureTextEntry={true}
                    onChangeText={props.handleChange('contraseña')}
                    value={props.values.contraseña}
                    onBlur={props.handleBlur('contraseña')}
                  />
                  <Text style={styles.textError}>{props.touched.contraseña && props.errors.contraseña}</Text>
                  <Text style={styles.textoBlanco} onPress={() => navegacion.navigate('Recover-Password')}>*Olvide mi contraseña</Text>
                  <Pressable style={styles.button} onPress={props.handleSubmit}>
                    <Text style={styles.text3}>INGRESAR</Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
        <View style={styles.containerText}>
          <Text style={styles.textoBlanco}>No eres miembro?  </Text>
          <Text style={styles.text2} onPress={() => props.navigation.navigate('Sign-Up')}>  Crear una cuenta</Text>
        </View>
      </ImageBackground >

    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1
  },
  containerImage: {
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
  textoBlanco: {
    color: "#ffff",
    textAlign: "right",
  },
  text2: {
    color: "#FFCB00"
  },
  text3: {
    color: "#000",
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 15
  },
  textError: {
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
  }
})

export default SigIn