import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, FlatList, Text, View, Pressable, Modal, TextInput, StyleSheet, Dimensions, Image, TouchableOpacity, Alert, Button } from 'react-native';
import * as ImagePicker from 'react-native-image-picker'
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import { LogBox } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
LogBox.ignoreAllLogs()

// const K_OPTIONS = [
//     {
//         item: 'Gastronomía',
//         id: 'Gastronomía',
//     },
//     {
//         item: 'Hotelería',
//         id: 'Hotelería',
//     },
//     {
//         item: 'Aventura',
//         id: 'Aventura',
//     },
//     {
//         item: 'Diversión',
//         id: 'Diversión',
//     }
// ]

const K_OPTIONS = []
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

const ReadLugares = ({ navigation }) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [imagen, setImagen] = useState('');
    const [categorias, setCategorias] = useState([])


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

    function renderFileUri() {
        if (imagen) {
            return <Image
                source={{ uri: 'data:image/jpeg;base64,' + imagen }}
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
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getCategorias = async () => {
        try {
            if (K_OPTIONS.length == 0) {
                const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/categorias');
                const json = await response.json();
                json.map((item) => {
                    K_OPTIONS.push({
                        item: item.nombre,
                        id: item.nombre
                    })
                })
            }

        } catch (error) {
            console.error(error);
        }
    }

    function onMultiChange() {
        return (item) => setCategorias(xorBy(categorias, [item]))
    }

    const createLugares = async (titulo, descripcion, ubicacionTitulo, ubicacionLink, servicio, contacto, valoracion) => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo: titulo,
                    descripcion: descripcion,
                    imagenPerfil: imagen,
                    ubicacionTitulo: ubicacionTitulo,
                    ubicacionLink: ubicacionLink,
                    contacto: contacto,
                    servicio: servicio,
                    valoracion: valoracion,
                })
            });
            const json = await response.json();
            if (json.ok == false) {
                Alert.alert("Aviso", json.message)
            } else {
                Alert.alert("Aviso", json.message)
                setModalVisible(!modalVisible)
                setImagen('')
                setCategorias([])
                getLugares()
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getLugares();
        getCategorias();
    }, []);

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                style={{ padding: 20 }}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    setImagen('');
                    setCategorias([]);
                }}
            >
                <ScrollView>
                    <Formik
                        initialValues={{ titulo: '', descripcion: '', ubicacionTitulo: '', ubicacionLink: '', contacto: '', valoracion: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            const nuevoArray = []
                            categorias.map((item) => {
                                nuevoArray.push(item.item)
                            })
                            if (categorias.length == 0) {
                                Alert.alert("Aviso", "Seleccione una o mas categorias")
                            } else if (imagen == '') {
                                Alert.alert("Aviso", "Imagen de portada no seleccionada")
                            } else {
                                createLugares(values.titulo, values.descripcion, values.ubicacionTitulo, values.ubicacionLink, nuevoArray, values.contacto, values.valoracion)
                            }
                        }}
                    >
                        {(props) => (
                            <View>
                                <Button title='submit' color='blue' onPress={props.handleSubmit} />
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
                                    <View>
                                        {renderFileUri()}
                                    </View>
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
                                <TextInput
                                    placeholder='Valoración'
                                    onChangeText={props.handleChange('valoracion')}
                                    value={props.values.valoracion}
                                    onBlur={props.handleBlur('valoracion')}
                                />
                                <Text>{props.touched.valoracion && props.errors.valoracion}</Text>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
                <View style={{ margin: 20 }}>
                    <SelectBox
                        label="Seleccione las categorías correspondientes al lugar"
                        options={K_OPTIONS}
                        selectedValues={categorias}
                        onMultiSelect={onMultiChange()}
                        onTapClose={onMultiChange()}
                        hideInputFilter={true}
                        isMulti
                    />
                </View>
                <Button title='cancelar' color='red' onPress={() => {
                    setModalVisible(!modalVisible);
                    setImagen('');
                    setCategorias([]);
                }} />
            </Modal>
            {isLoading ? <ActivityIndicator /> :
                (data.length == 0) ?
                    (
                        <View>
                            <Button title='Agregar' color='blue' onPress={() => setModalVisible(true)} />
                            <Text>No hay lugares que mostrar</Text>
                        </View>
                    ) : (
                        <View>
                            <Button title='Agregar' color='blue' onPress={() => setModalVisible(true)} />
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => item._id}
                                renderItem={({ item }) => (
                                    <View style={{
                                        backgroundColor: "beige",
                                        borderWidth: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginVertical: 10
                                    }}>
                                        <Pressable
                                            onPress={() => navigation.navigate('EditLugares', { lugar: item, funcion: getLugares })}>
                                            <Text>{item.titulo}, {item.descripcion}</Text>
                                        </Pressable>
                                    </View>
                                )}
                            />
                        </View>
                    )}
        </View>
    )
}

export default ReadLugares

const styles = StyleSheet.create({
    images: {
        width: 150,
        height: 150,
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 3,
        resizeMode: 'stretch'
    }
});