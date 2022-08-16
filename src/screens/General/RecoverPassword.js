import { View, Text, TextInput, Button, Alert, Modal, StyleSheet, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
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
            if (json[0] != null) {
                setData(json[0])
                setModalVisible(true)
            } else {
                Alert.alert("Aviso", "No existe un usuario creado con este correo")
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
                            if (data.respuestas[0] == values.primera && data.respuestas[1] == values.segunda && data.respuestas[2] == values.tercera) {
                                Alert.alert("Su contrseña es: ", data.contraseña)
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

                                <Button title='Enviar' color='blue' onPress={props.handleSubmit} />
                            </View>
                        )}
                    </Formik>
                    <Button title='cancelar' color='red' onPress={() => {
                        setModalVisible(false)
                    }} />
                </ImageBackground>
            </Modal>

            <Formik
                initialValues={{ correo: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => { getUsuario(values.correo) }}
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
                        <Button title='enviar' color='blue' onPress={props.handleSubmit} />
                    </View>
                )}
            </Formik>
            <Button title='regresar' color='grey' onPress={() => goBack()} />
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
    }
})