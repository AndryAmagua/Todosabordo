import {
    View, Text, TextInput, LogBox,
    ImageBackground, StyleSheet, Pressable
} from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import AsyncStorage from '@react-native-async-storage/async-storage'
LogBox.ignoreAllLogs()

const validationSchema = yup.object({
    contraseña: yup.string()
        .min(4, "*Minimo 4 caracteres")
        .required("*Contraseña obligatoria"),
    validacion: yup.string()
        .required('*Vuelva a ingresar su contraseña')
        .test("passwords-match", "*Los valores no coinciden", function (valor) {
            return this.parent.contraseña == valor;
        })
})

const EditContraseña = ({ navigation: { goBack }, route }) => {
    const usuario = route.params.usuario
    const updateContraseña = async (contraseña) => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/usuarios/contrasena/' + usuario._id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contraseña: contraseña
                })
            })
            const json = await response.json()
            AsyncStorage.removeItem('usuario')
            AsyncStorage.setItem('usuario', JSON.stringify(json))
            goBack()
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ImageBackground source={require('../../assets/Fondo4.png')} resizeMode="cover" style={styles.container}>
            <View style={styles.containerControls}>
                <Formik
                    initialValues={{ contraseña: '', validacion: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => { updateContraseña(values.contraseña) }}
                >
                    {(props) => (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'#000'}
                                placeholder='Nueva contraseña'
                                secureTextEntry={true}
                                onChangeText={props.handleChange('contraseña')}
                                value={props.values.contraseña}
                                onBlur={props.handleBlur('contraseña')}
                            />
                            <Text style={styles.textError}>{props.touched.contraseña && props.errors.contraseña}</Text>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'#000'}
                                placeholder='Validar contraseña'
                                secureTextEntry={true}
                                onChangeText={props.handleChange('validacion')}
                                value={props.values.validacion}
                                onBlur={props.handleBlur('validacion')}
                            />
                            <Text style={styles.textError}>{props.touched.validacion && props.errors.validacion}</Text>
                            <Pressable style={styles.button} onPress={props.handleSubmit}>
                                <Text style={styles.text3}>GUARDAR</Text>
                            </Pressable>

                        </View>
                    )}
                </Formik>
                <Text style={styles.text2} onPress={() => goBack()}>Cancelar</Text>
            </View>
        </ImageBackground>
    )
}

export default EditContraseña

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 65
    },
    containerControls: {
        paddingHorizontal: 50,
        flex: 1,
        justifyContent: 'center',
    },
    text2: {
        color: "#005CA8",
        textAlign: 'center',
        marginVertical: 25
    },
    text3: {
        color: "#ffff",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 15
    },
    textError: {
        color: "#000",
        textAlign: "center",
        marginVertical: 5,
        fontStyle: 'italic'
    },
    button: {
        backgroundColor: "#005CA8",
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
        borderColor: '#000',
        color: '#000'
    }
})