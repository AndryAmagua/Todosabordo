import {
    View, Text, TextInput, LogBox, ScrollView, Alert, Modal, ActivityIndicator,
    ImageBackground, StyleSheet, Pressable
} from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
LogBox.ignoreAllLogs()

const validationSchema = yup.object({
    nombre: yup.string()
        .required("*Nombre de usuario obligatorio"),
    celular: yup.string()
        .min(10, "*Minimo 10 numeros")
        .max(10, "*Maximo 10 numeros")
        .required("*Numero celular obligatorio"),
    sector: yup.string()
        .notOneOf(["Unknown"], "*Sector no valido")
        .required("*Seleccione un sector"),
    correo: yup.string()
        .email('*Correo no valido')
        .required("*Correo Obligatorio"),
    primera: yup.string()
        .required('*Respuesta de seguridad obligatoria'),
    segunda: yup.string()
        .required('*Respuesta de seguridad obligatoria'),
    tercera: yup.string()
        .required('*Respuesta de seguridad obligatoria'),
})

const Edit = ({ navigation: { goBack }, route }) => {
    const usuario = route.params.usuario
    const getData = route.params.funcion
    const [modalVisible, setModalVisible] = useState(false)

    const updateUsuario = async (nombre, celular, correo, sector, respuestas) => {
        try {
            setModalVisible(true)
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/usuarios/' + usuario._id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre,
                    celular: celular,
                    correo: correo.toLowerCase(),
                    sector: sector,
                    respuestas: respuestas
                })
            })
            const json = await response.json()
            AsyncStorage.removeItem('usuario')
            AsyncStorage.setItem('usuario', JSON.stringify(json))
            goBack()
            getData()
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setModalVisible(false)
        }
    }

    return (
        <ImageBackground source={require('../../assets/Fondo4.png')} resizeMode="cover" style={styles.container}>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
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
                        <Text>ACTUALIZANDO...</Text>
                    </View>
                </View>
            </Modal>
            <ScrollView>
                <View style={styles.containerControls}>
                    <Formik
                        initialValues={{
                            nombre: usuario.nombre, celular: usuario.celular, sector: usuario.sector,
                            correo: usuario.correo,
                            primera: usuario.respuestas[0], segunda: usuario.respuestas[1], tercera: usuario.respuestas[2]
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            updateUsuario(values.nombre, values.celular, values.correo, values.sector,
                                [values.primera.toLowerCase(), values.segunda.toLowerCase(), values.tercera.toLowerCase()])
                        }}
                    >
                        {(props) => (
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'#000'}
                                    placeholder='Nombre'
                                    onChangeText={props.handleChange('nombre')}
                                    value={props.values.nombre}
                                    onBlur={props.handleBlur('nombre')}
                                />
                                <Text style={styles.textError}>{props.touched.nombre && props.errors.nombre}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'#000'}
                                    placeholder='Celular'
                                    keyboardType='numeric'
                                    onChangeText={props.handleChange('celular')}
                                    value={props.values.celular}
                                    onBlur={props.handleBlur('celular')}
                                />
                                <Text style={styles.textError}>{props.touched.celular && props.errors.celular}</Text>

                                <Picker
                                    selectedValue={props.values.sector}
                                    onValueChange={props.handleChange('sector')}
                                    onBlur={props.handleBlur('sector')}
                                    style={{ color: '#000' }}
                                >
                                    <Picker.Item label="Selecione un sector" value="Unknown" />
                                    <Picker.Item label="Alpachaca" value="Alpachaca" />
                                    <Picker.Item label="El Sagrario" value="El Sagrario" />
                                    <Picker.Item label="San Francisco" value="San Francisco" />
                                    <Picker.Item label="Priorato y La Laguna" value="Priorato y La Laguna" />
                                    <Picker.Item label=" Los Ceibos" value=" Los Ceibos" />
                                    <Picker.Item label="Caranqui" value="Caranqui" />
                                </Picker>
                                <Text style={styles.textError}>{props.touched.sector && props.errors.sector}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'#000'}
                                    placeholder='Correo'
                                    onChangeText={props.handleChange('correo')}
                                    value={props.values.correo}
                                    onBlur={props.handleBlur('correo')}
                                />
                                <Text style={styles.textError}>{props.touched.correo && props.errors.correo}</Text>

                                <Text style={styles.text}>Preguntas de seguridad</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'#000'}
                                    placeholder='Pelicula favorita'
                                    onChangeText={props.handleChange('primera')}
                                    value={props.values.primera}
                                    onBlur={props.handleBlur('primera')}
                                />
                                <Text style={styles.textError}>{props.touched.primera && props.errors.primera}</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'#000'}
                                    placeholder='Comida favorita'
                                    onChangeText={props.handleChange('segunda')}
                                    value={props.values.segunda}
                                    onBlur={props.handleBlur('segunda')}
                                />
                                <Text style={styles.textError}>{props.touched.segunda && props.errors.segunda}</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'#000'}
                                    placeholder='Nombre de su primera mascota'
                                    onChangeText={props.handleChange('tercera')}
                                    value={props.values.tercera}
                                    onBlur={props.handleBlur('tercera')}
                                />
                                <Text style={styles.textError}>{props.touched.tercera && props.errors.tercera}</Text>
                                <Pressable style={styles.button} onPress={props.handleSubmit}>
                                    <Text style={styles.text3}>EDITAR</Text>
                                </Pressable>

                            </View>
                        )}
                    </Formik>
                </View>
                <Text style={styles.text2} onPress={() => goBack()}>Cancelar</Text>
            </ScrollView>
        </ImageBackground>
    )
}

export default Edit

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 65
    },
    containerControls: {
        justifyContent: 'center',
        paddingHorizontal: 50
    },
    text: {
        color: "#000",
        textAlign: 'center',
        marginVertical: 10
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