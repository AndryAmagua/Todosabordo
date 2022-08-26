import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Modal, TextInput, StyleSheet, Image, Alert, Button, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'react-native-image-picker'
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker'
import { LogBox } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
LogBox.ignoreAllLogs()

const validationSchema = yup.object({
    lugarID: yup.string()
        .required("Seleccione el lugar al que pertenece el evento")
})

const EditPromociones = ({ navigation: { goBack }, route }) => {
    const [photo, setPhoto] = useState()

    const [id, setId] = useState(route.params.promocion._id)
    const [imagen, setImagen] = useState(route.params.promocion.imagen)
    const [newImage, setNewImage] = useState(false)
    const [dataLugares, setDataLugares] = useState([])
    const [modalVisible, setModalVisible] = useState(false)

    const getLugares = async () => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares');
            const json = await response.json();
            setDataLugares(json);
        } catch (error) {
            console.error(error);
        }
    }

    const editarPromocion = async (nuevoLugarID) => {
        try {
            setModalVisible(true)
            if (newImage == true) {
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
            }

            await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/promociones/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imagen: url || imagen,
                    lugarID: nuevoLugarID
                })
            }).then(() => {
                Alert.alert("Titulo", "Promocion editada")
                route.params.funcion()
                goBack()
            })
        } catch (error) {
            Alert.alert("Error", error.message)
        } finally {
            setModalVisible(false)
            setNewImage(false)
        }
    }

    const eliminarPromocion = async () => {
        try {
            setModalVisible(true)
            await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/promociones/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(() => {
                Alert.alert("Aviso", "Promocion eliminada")
                route.params.funcion()
                goBack()
            })
        } catch (error) {
            Alert.alert("Error", error.message)
        } finally {
            setModalVisible(false)
        }

    }

    const launchCamera = () => {
        let options = {
            title: 'Take Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images',

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
                setNewImage(true)
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
                setNewImage(true)
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
            <ScrollView>
                <Button title='Regresar' color='grey' onPress={() => goBack()} />
                <Formik
                    initialValues={{
                        lugarID: route.params.promocion.lugarID._id,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        editarPromocion(values.lugarID)
                    }}
                >
                    {(props) => (
                        <View>
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
                                {
                                    dataLugares.map((item) => {
                                        return <Picker.Item label={item.titulo} value={item._id} />
                                    })
                                }
                            </Picker>
                            <Text>{props.touched.lugarID && props.errors.lugarID}</Text>
                            <Button title='Editar' color='blue' onPress={props.handleSubmit} />
                        </View>
                    )}
                </Formik>
                <Button title='Eliminar' color='red' onPress={() => {
                    Alert.alert(
                        "Atencion",
                        "¿Esta seguro de eliminar esta promoción?",
                        [
                            {
                                text: "Cancelar",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => eliminarPromocion() }
                        ]
                    )
                }
                } />
            </ScrollView>
        </View>
    )
}

export default EditPromociones

const styles = StyleSheet.create({
    images: {
        width: 150,
        height: 150,
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 3
    },
})