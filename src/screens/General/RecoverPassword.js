import { View, Text, TextInput, Button, Alert, Modal, StyleSheet, ImageBackground, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard';
import { Formik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
    correo: yup.string()
        .email('Correo no valido')
        .required("Correo Obligatorio"),
})

const validationModal = yup.object({
    primera: yup.string()
        .required('Respuesta de seguridad obligatoria'),
    segunda: yup.string()
        .required('Respuesta de seguridad obligatoria'),
    tercera: yup.string()
        .required('Respuesta de seguridad obligatoria'),
})

const RecoverPassword = ({ navigation: { goBack } }) => {
    const [data, setData] = useState({})
    const [modalVisible, setModalVisible] = useState(false)

    const getUsuario = async (correo) => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/usuarios/recover/' + correo);
            const json = await response.json();
            if (json.ok == true) {
                setData(json)
                setModalVisible(true)
            } else {
                Alert.alert("Aviso", json.message)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ImageBackground style={styles.container} source={require('../../assets/Fondo2.jpg')}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <ImageBackground style={styles.container} source={require('../../assets/Fondo2.jpg')}>
                    <Formik
                        initialValues={{ primera: '', segunda: '', tercera: '' }}
                        validationSchema={validationModal}
                        onSubmit={(values) => {
                            if (data.respuestas[0] == values.primera.toLowerCase() && data.respuestas[1] == values.segunda.toLowerCase() && data.respuestas[2] == values.tercera.toLowerCase()) {
                                Alert.alert(
                                    "Su contrseña es:",
                                    data.contraseña,
                                    [
                                        {
                                            text: "Copiar Contraseña",
                                            onPress: () => Clipboard.setString(data.contraseña),
                                            style: "ok",
                                        },
                                    ],
                                    {
                                        cancelable: true,
                                    }
                                )
                                setModalVisible(false)
                            } else {
                                Alert.alert("Aviso", "Las respuestas no coinciden")
                            }
                        }}
                    >
                        {(props) => (
                            <View>
                                <Text style={styles.text}>¿Pelicula favorita?</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={props.handleChange('primera')}
                                    value={props.values.primera}
                                    onBlur={props.handleBlur('primera')}
                                />
                                <Text style={styles.textError}>{props.touched.primera && props.errors.primera}</Text>
                                <Text style={styles.text}>¿Comida favorita?</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={props.handleChange('segunda')}
                                    value={props.values.segunda}
                                    onBlur={props.handleBlur('segunda')}
                                />
                                <Text style={styles.textError}>{props.touched.segunda && props.errors.segunda}</Text>
                                <Text style={styles.text}>¿Nombre de su primera mascota?</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={props.handleChange('tercera')}
                                    value={props.values.tercera}
                                    onBlur={props.handleBlur('tercera')}
                                />
                                <Text style={styles.textError}>{props.touched.tercera && props.errors.tercera}</Text>

                                <Pressable style={styles.button} onPress={props.handleSubmit}>
                                    <Text style={styles.buttonText}>COMPROBAR</Text>
                                </Pressable>
                            </View>
                        )}
                    </Formik>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.cancelText} onPress={() => {
                            setModalVisible(false)
                        }}>Cancelar</Text>
                    </View>
                </ImageBackground>
            </Modal>

            <Formik
                initialValues={{ correo: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => { getUsuario(values.correo.toLowerCase()) }}
            >
                {(props) => (
                    <View>
                        <View style={styles.containerImage}>
                            <Image source={require('../../assets/Logo.png')} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder='Correo'
                            placeholderTextColor={'white'}
                            onChangeText={props.handleChange('correo')}
                            value={props.values.correo}
                            onBlur={props.handleBlur('correo')}
                        />
                        <Text style={styles.textError}>{props.touched.correo && props.errors.correo}</Text>
                        <Pressable style={styles.button} onPress={props.handleSubmit}>
                            <Text style={styles.buttonText}>ENVIAR</Text>
                        </Pressable>
                    </View>
                )}
            </Formik>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.whiteText} onPress={() => goBack()}>Regresar</Text>
            </View>

        </ImageBackground>
    )
}

export default RecoverPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        paddingHorizontal: 50
    },
    input: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'white',
        color: 'white',
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30
    },
    text: {
        color: "#ffff",
        textAlign: "left",
        marginVertical: 5
    },
    textError: {
        color: "#ffff",
        textAlign: "center",
        marginVertical: 5,
        fontStyle: 'italic'
    },
    whiteText: {
        color: "#fff",
        margin: 50,
        fontSize: 15
    },
    cancelText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 15,
        margin: 15
    },
    buttonText: {
        color: "#000",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 15
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
})