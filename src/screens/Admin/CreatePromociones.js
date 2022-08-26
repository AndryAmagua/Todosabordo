import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, StyleSheet, Image, Alert, Button, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'react-native-image-picker'
import { Picker } from '@react-native-picker/picker'
import { LogBox } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
LogBox.ignoreAllLogs()

const validationSchema = yup.object({
    lugarID: yup.string()
        .required("Seleccione el lugar al que pertenece el evento")
        .notOneOf(["default"], "Opción no valida")
})

const CreateEventos = ({ navigation: { goBack }, route }) => {
    const getPromociones = route.params.funcion
    const [photo, setPhoto] = useState()
    const [dataLugares, setDataLugares] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
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

    const createPromocion = async (titulo, lugarID) => {
        try {
            setModalVisible(true)
            const data = new FormData();
            var url = ""
            data.append('file', photo)
            data.append('upload_preset', 'todosabordo')
            data.append("cloud_name", "todosabordo")
            const res = await fetch("https://api.cloudinary.com/v1_1/todosabordo/upload", {
                method: "post",
                body: data
            })
            const value = await res.json()
            url = value.secure_url

            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/promociones', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imagen: url,
                    lugarID: lugarID
                })
            });
            const json = await response.json();
            Alert.alert("Ok", json.message)
            setImagen('')
            getPromociones()
            goBack()
        } catch (error) {
            Alert.alert("Error", error.message)
        } finally {
            setModalVisible(false)
        }
    }

    useEffect(() => {
        getLugares()
    }, []);

    return (
        <View>
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
                        <Text>CARGANDO...</Text>
                    </View>
                </View>
            </Modal>
            <Formik
                initialValues={{ lugarID: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    if (imagen == '') {
                        Alert.alert("Aviso", "Imagen no seleccionada")
                    } else {
                        createPromocion(values.lugarID)
                    }
                }}
            >
                {(props) => (
                    <View>
                        <Button title='Guardar' color='blue' onPress={props.handleSubmit} />
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