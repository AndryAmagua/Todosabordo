import {
    View, Text, TextInput, FlatList, Alert, Button, Image, StyleSheet,
    LogBox, ScrollView, Modal, ActivityIndicator
} from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'react-native-image-picker'
import { Formik } from 'formik'
import * as yup from 'yup'
LogBox.ignoreAllLogs()

const validationSchema = yup.object({
    titulo: yup.string()
        .required("Titulo de lugar obligatorio"),
    descripcion: yup.string()
        .required("Descripción de lugar obligatoria"),
    ubicacionTitulo: yup.string()
        .required("Titulo de dirección obligatorio"),
    ubicacionLink: yup.string()
        .required("Link de dirección obligatorio"),
    contacto: yup.string()
        .max(10, "Maximo 10 números")
        .required("Número de contacto obligatorio")
})

const EditLugares = ({ navigation: { goBack }, route }) => {
    const [photo, setPhoto] = useState()

    const [id, setId] = useState(route.params.lugar._id)
    const [imagen, setImagen] = useState(route.params.lugar.imagenPerfil)
    const [newImage, setNewImage] = useState(false)
    const [servicio, setServicio] = useState(route.params.lugar.servicio)
    const [modalVisible, setModalVisible] = useState(false)

    const editarLugar = async (nuevoTitulo, nuevaDescripcion, nuevaUbicacionTitulo, nuevaUbicacionLink, nuevoContacto) => {
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

            await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo: nuevoTitulo,
                    descripcion: nuevaDescripcion,
                    imagenPerfil: url || imagen,
                    ubicacionTitulo: nuevaUbicacionTitulo,
                    ubicacionLink: nuevaUbicacionLink,
                    contacto: nuevoContacto,
                    servicio: servicio,
                })
            }).then(() => {
                Alert.alert("Titulo", "Lugar Editado")
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

    const eliminarLugar = async () => {
        try {
            setModalVisible(true)
            await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(() => {
                Alert.alert("Aviso", "Lugar Eliminado")
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
                        titulo: route.params.lugar.titulo,
                        descripcion: route.params.lugar.descripcion,
                        ubicacionTitulo: route.params.lugar.ubicacionTitulo,
                        ubicacionLink: route.params.lugar.ubicacionLink,
                        contacto: route.params.lugar.contacto,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        editarLugar(values.titulo, values.descripcion, values.ubicacionTitulo, values.ubicacionLink, values.contacto)
                    }}
                >
                    {(props) => (
                        <View>
                            <TextInput
                                placeholder='Titulo'
                                onChangeText={props.handleChange('titulo')}
                                value={props.values.titulo}
                                onBlur={props.handleBlur('titulo')}
                            />
                            <Text>{props.touched.titulo && props.errors.titulo}</Text>
                            <TextInput
                                placeholder='Descripción'
                                onChangeText={props.handleChange('descripcion')}
                                value={props.values.descripcion}
                                onBlur={props.handleBlur('descripcion')}
                            />
                            <Text>{props.touched.descripcion && props.errors.descripcion}</Text>
                            {/* -----------> Imagen */}
                            <Text >Imagen de Portada</Text>
                            <View>
                                <Image
                                    source={{ uri: imagen }}
                                    style={styles.images}
                                />
                            </View>
                            <View>
                                <Button title='Abrir Camara' color='blue' onPress={launchCamera} />
                                <Button title='Abrir Galeria' color='blue' onPress={launchImageLibrary} />
                            </View>
                            {/* -----------> Imagen */}
                            <TextInput
                                placeholder='Ubicación titulo'
                                onChangeText={props.handleChange('ubicacionTitulo')}
                                value={props.values.ubicacionTitulo}
                                onBlur={props.handleBlur('ubicacionTitulo')}
                            />
                            <Text>{props.touched.ubicacionTitulo && props.errors.ubicacionTitulo}</Text>
                            <TextInput
                                placeholder='Ubicación link'
                                onChangeText={props.handleChange('ubicacionLink')}
                                value={props.values.ubicacionLink}
                                onBlur={props.handleBlur('ubicacionLink')}
                            />
                            <Text>{props.touched.ubicacionLink && props.errors.ubicacionLink}</Text>
                            <TextInput
                                placeholder='Contacto'
                                keyboardType='numeric'
                                onChangeText={props.handleChange('contacto')}
                                value={props.values.contacto}
                                onBlur={props.handleBlur('contacto')}
                            />
                            <Text>{props.touched.contacto && props.errors.contacto}</Text>
                            <FlatList
                                data={servicio}
                                horizontal={true}
                                keyExtractor={(item, index) => item._id}
                                renderItem={({ item }) => (
                                    <View style={{
                                        backgroundColor: "beige",
                                        borderWidth: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginVertical: 10,
                                        flex: 1
                                    }}>
                                        <Text>{item}</Text>
                                    </View>
                                )}
                            />
                            <Button title='Editar' color='blue' onPress={props.handleSubmit} />
                        </View>
                    )}
                </Formik>
                <Button title='Eliminar' color='red' onPress={() => {
                    Alert.alert(
                        "Atencion",
                        "¿Esta seguro de eliminar este lugar?",
                        [
                            {
                                text: "Cancelar",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => eliminarLugar() }
                        ]
                    )
                }
                } />
            </ScrollView>
        </View>
    )
}

export default EditLugares

const styles = StyleSheet.create({
    images: {
        width: 150,
        height: 150,
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 3
    },
})