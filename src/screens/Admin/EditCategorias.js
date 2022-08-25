import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Alert, Button, Modal } from 'react-native';
import { LogBox } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
LogBox.ignoreAllLogs()

const validationSchema = yup.object({
    nombre: yup.string()
        .required("Nombre de categoria obligatorio")
})

const EditCategorias = ({ navigation: { goBack }, route }) => {
    const getCategorias = route.params.funcion
    const [id, setId] = useState(route.params.categoria._id)
    const [modalVisible, setModalVisible] = useState(false)

    const editarCategoria = async (nuevoNombre) => {
        await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/categorias/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nuevoNombre,
            })
        }).then(() => {
            Alert.alert("Ok", "Categoria editada")
            getCategorias()
            goBack()
        })
    }

    const eliminarCategoria = async () => {
        await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/categorias/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(() => {
            Alert.alert("Aviso", "Categoria eliminada")
            getCategorias()
            goBack()
        })
    }

    function cancelar() {
        setModalVisible(false)
    }
    function confirmar() {
        eliminarCategoria()
        setModalVisible(false)
    }

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <Text>Esta seguro que desea eliminar esta categoria</Text>
                <Button title='Si' color='blue' onPress={confirmar} />
                <Button title='No' color='blue' onPress={cancelar} />
            </Modal>
            <Button title='Regresar' color='grey' onPress={() => goBack()} />
            <Formik
                initialValues={{ nombre: route.params.categoria.nombre }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    editarCategoria(values.nombre)
                }}
            >
                {(props) => (
                    <View>
                        <TextInput
                            placeholder='Nombre'
                            onChangeText={props.handleChange('nombre')}
                            value={props.values.nombre}
                            onBlur={props.handleBlur('nombre')}
                        />
                        <Text>{props.touched.nombre && props.errors.nombre}</Text>
                        <Button title='Guardar' color='blue' onPress={props.handleSubmit} />
                    </View>
                )}
            </Formik>
            <Button title='Eliminar' color='red' onPress={() => setModalVisible(true)} />
        </View>
    )
}

export default EditCategorias

const styles = StyleSheet.create({})