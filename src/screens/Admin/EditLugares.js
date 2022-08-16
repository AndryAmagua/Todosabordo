import { View, Text, TextInput, FlatList, Alert, Button, Image, StyleSheet, LogBox, ScrollView, Modal } from 'react-native'
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
        .required("Número de contacto obligatorio"),
    valoracion: yup.string()
        .required("Valoración obligatoria")
})

const EditLugares = ({ navigation, route }) => {
    const [id, setId] = useState(route.params.lugar._id);
    const [imagen, setImagen] = useState(route.params.lugar.imagenPerfil);
    const [servicio, setServicio] = useState(route.params.lugar.servicio);
    const [modalVisible, setModalVisible] = useState(false)

    function editarLugar(nuevoTitulo, nuevaDescripcion, nuevaUbicacionTitulo, nuevaUbicacionLink, nuevoContacto, nuevaValoracion) {
        fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: nuevoTitulo,
                descripcion: nuevaDescripcion,
                imagenPerfil: imagen,
                ubicacionTitulo: nuevaUbicacionTitulo,
                ubicacionLink: nuevaUbicacionLink,
                contacto: nuevoContacto,
                servicio: servicio,
                valoracion: nuevaValoracion,
            })
        }).then(() => {
            Alert.alert("Titulo", "Lugar Editado")
            route.params.funcion()
            navigation.navigate("ReadLugares")
        })
    }

    function eliminarLugar() {
        fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(() => {
            Alert.alert("Aviso", "Lugar Eliminado")
            route.params.funcion()
            navigation.navigate("ReadLugares")
        })
    }

    function cancelar() {
        setModalVisible(!modalVisible);
    }
    function confirmar() {
        eliminarLugar();
        setModalVisible(!modalVisible);
    }

    const launchCamera = () => {
        let options = {
            title: 'Take Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images',

            },
            includeBase64: true,
            maxWidth: 500,
            maxHeight: 500,
            quality: 0.5
        };
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setImagen(response.assets[0].base64)
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
            includeBase64: true,
            maxWidth: 500,
            maxHeight: 500,
            quality: 0.5
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setImagen(response.assets[0].base64)
            }
        });

    }

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                style={{ padding: 20 }}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <Text>Esta seguro que desea eliminar este lugar</Text>
                <Button title='Si' color='blue' onPress={confirmar} />
                <Button title='No' color='blue' onPress={cancelar} />
            </Modal>
            <ScrollView>
                <Button title='Regresar' color='grey' onPress={() => navigation.navigate("ReadLugares")} />
                <Formik
                    initialValues={{
                        titulo: route.params.lugar.titulo,
                        descripcion: route.params.lugar.descripcion,
                        ubicacionTitulo: route.params.lugar.ubicacionTitulo,
                        ubicacionLink: route.params.lugar.ubicacionLink,
                        contacto: route.params.lugar.contacto,
                        valoracion: route.params.lugar.valoracion
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        editarLugar(values.titulo, values.descripcion, values.ubicacionTitulo, values.ubicacionLink, values.contacto, values.valoracion)
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
                                    source={{ uri: 'data:image/jpeg;base64,' + imagen }}
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
                                keyExtractor={(item, index) => item._id}
                                renderItem={({ item }) => (
                                    <View style={{
                                        backgroundColor: "beige",
                                        borderWidth: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginVertical: 10
                                    }}>
                                        <Text>{item}</Text>
                                    </View>
                                )}
                            />
                            <TextInput
                                placeholder='Valoración'
                                onChangeText={props.handleChange('valoracion')}
                                value={props.values.valoracion}
                                onBlur={props.handleBlur('valoracion')}
                            />
                            <Text>{props.touched.valoracion && props.errors.valoracion}</Text>
                            <Button title='Editar' color='blue' onPress={props.handleSubmit} />
                        </View>
                    )}
                </Formik>
                <Button title='Eliminar' color='red' onPress={() => setModalVisible(true)} />
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