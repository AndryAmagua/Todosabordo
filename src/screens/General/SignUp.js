import {
    View, Text, Image, TextInput, LogBox, ScrollView, Alert,
    ImageBackground, StyleSheet, Pressable
} from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Picker } from '@react-native-picker/picker'
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
    contraseña: yup.string()
        .min(4, "*Minimo 4 caracteres")
        .required("*Contraseña obligatoria"),
    validacion: yup.string()
        .required('*Vuelva a ingresar su contraseña')
        .test("passwords-match", "*Los valores no coinciden", function (valor) {
            return this.parent.contraseña == valor;
        }),
    primera: yup.string()
        .required('*Respuesta de seguridad obligatoria'),
    segunda: yup.string()
        .required('*Respuesta de seguridad obligatoria'),
    tercera: yup.string()
        .required('*Respuesta de seguridad obligatoria'),
})

const SignUp = ({ navigation: { goBack } }) => {

    const onSignUp = async (nombre, celular, correo, contraseña, sector, respuestas) => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre,
                    celular: celular,
                    correo: correo.toLowerCase(),
                    contraseña: contraseña,
                    sector: sector,
                    respuestas: respuestas
                })
            });
            const json = await response.json()
            if (json.ok == true) {
                Alert.alert("Aviso", json.message)
                goBack()
            } else {
                Alert.alert("Aviso", json.message)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ImageBackground source={require('../../assets/Fondo2.jpg')} resizeMode="cover" style={styles.container}>
            <ScrollView>
                <View style={styles.containerLogo}>
                    <Image source={require('../../assets/Logo.png')} />
                </View>
                <View style={styles.containerControls}>
                    <Formik
                        initialValues={{ nombre: '', celular: '', sector: '', correo: '', contraseña: '', validacion: '', primera: '', segunda: '', tercera: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            onSignUp(values.nombre, values.celular, values.correo, values.contraseña, values.sector,
                                [values.primera.toLowerCase(), values.segunda.toLowerCase(), values.tercera.toLowerCase()])
                        }}
                    >
                        {(props) => (
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'white'}
                                    placeholder='Nombre'
                                    onChangeText={props.handleChange('nombre')}
                                    value={props.values.nombre}
                                    onBlur={props.handleBlur('nombre')}
                                />
                                <Text style={styles.textError}>{props.touched.nombre && props.errors.nombre}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'white'}
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
                                    style={{ color: 'white' }}
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
                                    placeholderTextColor={'white'}
                                    placeholder='Correo'
                                    onChangeText={props.handleChange('correo')}
                                    value={props.values.correo}
                                    onBlur={props.handleBlur('correo')}
                                />
                                <Text style={styles.textError}>{props.touched.correo && props.errors.correo}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'white'}
                                    placeholder='Contraseña'
                                    secureTextEntry={true}
                                    onChangeText={props.handleChange('contraseña')}
                                    value={props.values.contraseña}
                                    onBlur={props.handleBlur('contraseña')}
                                />
                                <Text style={styles.textError}>{props.touched.contraseña && props.errors.contraseña}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'white'}
                                    placeholder='Validar contraseña'
                                    secureTextEntry={true}
                                    onChangeText={props.handleChange('validacion')}
                                    value={props.values.validacion}
                                    onBlur={props.handleBlur('validacion')}
                                />
                                <Text style={styles.textError}>{props.touched.validacion && props.errors.validacion}</Text>

                                <Text style={styles.subtitle}>Preguntas de seguridad</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'white'}
                                    placeholder='Pelicula favorita'
                                    onChangeText={props.handleChange('primera')}
                                    value={props.values.primera}
                                    onBlur={props.handleBlur('primera')}
                                />
                                <Text style={styles.textError}>{props.touched.primera && props.errors.primera}</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'white'}
                                    placeholder='Comida favorita'
                                    onChangeText={props.handleChange('segunda')}
                                    value={props.values.segunda}
                                    onBlur={props.handleBlur('segunda')}
                                />
                                <Text style={styles.textError}>{props.touched.segunda && props.errors.segunda}</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'white'}
                                    placeholder='Nombre de su primera mascota'
                                    onChangeText={props.handleChange('tercera')}
                                    value={props.values.tercera}
                                    onBlur={props.handleBlur('tercera')}
                                />
                                <Text style={styles.textError}>{props.touched.tercera && props.errors.tercera}</Text>
                                <Pressable style={styles.button} onPress={props.handleSubmit}>
                                    <Text style={styles.buttonText}>REGISTRARSE</Text>
                                </Pressable>

                            </View>
                        )}
                    </Formik>
                </View>
                <View style={styles.containerText}>
                    <Text style={styles.yellowText} onPress={() => goBack()}>Ya tengo una cuenta</Text>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30
    },
    containerControls: {
        justifyContent: 'center',
        paddingHorizontal: 50
    },
    containerText: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40
    },
    subtitle: {
        color: "#ffff",
        textAlign: 'center',
        marginVertical: 10
    },
    yellowText: {
        color: "#FFCB00",
        textAlign: 'center'
    },
    buttonText: {
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

export default SignUp