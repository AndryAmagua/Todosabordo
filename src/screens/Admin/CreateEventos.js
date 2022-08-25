import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, TextInput, StyleSheet, Image, Alert, Button } from 'react-native';
import * as ImagePicker from 'react-native-image-picker'
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker'
import { LogBox } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
LogBox.ignoreAllLogs()

const validationSchema = yup.object({
    titulo: yup.string()
        .required("Titulo de evento obligatorio"),
    lugarID: yup.string()
        .required("Seleccione el lugar al que pertenece el evento")
        .notOneOf(["default"], "Opción no valida")
})

const CreateEventos = ({ navigation: { goBack }, route }) => {
    const getEventos = route.params.funcion
    const [photo, setPhoto] = useState()
    const [dataLugares, setDataLugares] = useState([])

    const [date, setDate] = useState(new Date())
    const [openDate, setOpenDate] = useState(false)
    const [imagen, setImagen] = useState()

    const launchCamera = () => {
        let options = {
            title: 'Take Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            includeExtra: true,
            quality: 0.5
        };
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const uri = response.assets[0].uri
                const source = {
                    uri: response.assets[0].uri,
                    type: response.assets[0].type,
                    name: response.assets[0].fileName
                }
                setPhoto(source)
                setImagen(uri)
            }
        });
    }

    const launchImageLibrary = () => {
        let options = {
            title: 'Select Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images',

            },
            includeExtra: true,
            quality: 0.5
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const uri = response.assets[0].uri
                const source = {
                    uri: response.assets[0].uri,
                    type: response.assets[0].type,
                    name: response.assets[0].fileName
                }
                setPhoto(source)
                setImagen(uri)
            }
        });

    }

    function renderFileUri() {
        if (imagen) {
            return <Image
                source={{ uri: imagen }}
                style={styles.images}
            />
        } else {
            return <Image source={{ uri: 'https://pbs.twimg.com/profile_images/486929358120964097/gNLINY67_400x400.png' }}
                style={styles.images}
            />
        }
    }

    const getLugares = async () => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares');
            const json = await response.json();
            setDataLugares(json)
        } catch (error) {
            console.error(error);
        }
    }

    function mostrarFecha() {
        if (date != '') {
            return <Text>{date.toLocaleDateString() + " - " + date.toLocaleTimeString()}</Text>
        } else {
            return <Text>Aqui va la fecha</Text>
        }
    }

    const createEvento = async (titulo, lugarID) => {
        try {
            const data = new FormData();
            var url=""
            data.append('file', photo)
            data.append('upload_preset', 'todosabordo')
            data.append("cloud_name", "todosabordo")
            const res = await fetch("https://api.cloudinary.com/v1_1/todosabordo/upload", {
                method: "post",
                body: data
            })
            const value = await res.json()
            url = value.secure_url

            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/eventos', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo: titulo,
                    imagen: url,
                    fecha: date,
                    lugarID: lugarID
                })
            });
            const json = await response.json();
            Alert.alert("Ok", json.message)
            setImagen('')
            getEventos()
            goBack()
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getLugares()
    }, []);

    return (
        <View>
            <Formik
                initialValues={{ titulo: '', lugarID: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    if (imagen == '') {
                        Alert.alert("Aviso", "Imagen no seleccionada")
                    } else {
                        createEvento(values.titulo, values.lugarID)
                    }
                }}
            >
                {(props) => (
                    <View>
                        <Button title='Guardar' color='blue' onPress={props.handleSubmit} />
                        <TextInput
                            placeholder='Titulo'
                            onChangeText={props.handleChange('titulo')}
                            value={props.values.titulo}
                            onBlur={props.handleBlur('titulo')}
                        />
                        <Text>{props.touched.titulo && props.errors.titulo}</Text>
                        {/* -----------> Imagen */}
                        <Text >Imagen de Portada</Text>
                        <View>
                            <View>
                                {renderFileUri()}
                            </View>
                        </View>
                        <View>
                            <Button title='Abrir Camara' color='blue' onPress={launchCamera} />
                            <Button title='Abrir Galeria' color='blue' onPress={launchImageLibrary} />
                        </View>
                        {/* -----------> Imagen */}

                        {mostrarFecha()}
                        <Button title="Dia" onPress={() => setOpenDate(true)} />
                        <DatePicker
                            modal
                            open={openDate}
                            date={new Date()}
                            mode={"datetime"}
                            onConfirm={(date) => {
                                setOpenDate(false)
                                setDate(date)
                            }}
                            onCancel={() => {
                                setOpenDate(false)
                            }}
                        />
                        <Picker
                            selectedValue={props.values.lugarID}
                            onValueChange={props.handleChange('lugarID')}
                            onBlur={props.handleBlur('lugarID')}
                        >
                            <Picker.Item label="Selecciones un lugar" value="default" />
                            {
                                dataLugares.map((item) => {
                                    return <Picker.Item label={item.titulo} value={item._id} />
                                })
                            }
                        </Picker>
                        <Text>{props.touched.lugarID && props.errors.lugarID}</Text>
                    </View>
                )}
            </Formik>
            <Button title='cancelar' color='red' onPress={() => {
                setImagen('')
                goBack()
            }} />
        </View>
    )
}

export default CreateEventos

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    card: {
        flex: 1,
        padding: 20
    },
    images: {
        width: 150,
        height: 150,
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 3,
    }
})