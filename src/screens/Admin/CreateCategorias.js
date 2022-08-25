import React from 'react';
import { Text, View, TextInput, StyleSheet, Alert, Button } from 'react-native';
import { LogBox } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
LogBox.ignoreAllLogs()

const validationSchema = yup.object({
    nombre: yup.string()
        .required("Nombre de categoria obligatorio")
})

const CreateCategorias = ({ navigation: { goBack }, route }) => {
    const getCategorias = route.params.funcion

    const crearCategoria = async () => {
        await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/categorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
            })
        }).then(() => {
            Alert.alert("Ok", "Categoria nueva creada")
            getCategorias()
            goBack()
        })
    }

    return (
        <View>
            <Formik
                initialValues={{ nombre: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    crearCategoria(values.nombre)
                }}
            >
                {(props) => (
                    <View>
                        <Button title='Guardar' color='blue' onPress={props.handleSubmit} />
                        <TextInput
                            placeholder='Nombre'
                            onChangeText={props.handleChange('nombre')}
                            value={props.values.nombre}
                            onBlur={props.handleBlur('nombre')}
                        />
                        <Text>{props.touched.nombre && props.errors.nombre}</Text>
                    </View>
                )}
            </Formik>
            <Button title='Cancelar' color='red' onPress={() => goBack()} />
        </View>
    )
}

export default CreateCategorias

const styles = StyleSheet.create({})