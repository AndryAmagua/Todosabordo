import React, { useEffect, useState } from 'react';
import {
  ScrollView, Text, View, TextInput, StyleSheet, Image, Alert, Button,
  Modal, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker'
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import { LogBox } from 'react-native'
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

const CreateLugares = ({ navigation: { goBack }, route }) => {
  const [K_OPTIONS, setK_OPTIONS] = useState([])
  const getLugares = route.params.funcion
  const [photo, setPhoto] = useState()

  const [imagen, setImagen] = useState('')
  const [categorias, setCategorias] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  const launchCamera = () => {
    let options = {
      title: 'Take Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',

      },
      includeExtra: true,
      quality: 0.5
    }
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
    })
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
    }
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
    })

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

  const getCategorias = async () => {
    try {
      const arrayCategorias = []
      if (arrayCategorias.length == 0) {
        const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/categorias');
        const json = await response.json();
        json.map((item) => {
          arrayCategorias.push({
            item: item.nombre,
            id: item.nombre
          })
        })
        setK_OPTIONS(arrayCategorias)
        console.log(K_OPTIONS)
      }
    } catch (error) {
      console.error(error);
    }
  }

  function onMultiChange() {
    return (item) => setCategorias(xorBy(categorias, [item]))
  }

  const createLugares = async (titulo, descripcion, ubicacionTitulo, ubicacionLink, servicio, contacto) => {
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

      const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: titulo,
          descripcion: descripcion,
          imagenPerfil: url,
          ubicacionTitulo: ubicacionTitulo,
          ubicacionLink: ubicacionLink,
          contacto: contacto,
          servicio: servicio
        })
      });
      console.log(response)
      const json = await response.json();
      if (json.ok == false) {
        Alert.alert("Aviso", json.message)
      } else {
        Alert.alert("Aviso", json.message)
        setImagen('')
        setCategorias([])
        getLugares()
        goBack()
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setModalVisible(false)
    }
  }

  useEffect(() => {
    getCategorias()
  }, [])

  return (
    <View style={{ flex: 1 }}>
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
        <Formik
          initialValues={{ titulo: '', descripcion: '', ubicacionTitulo: '', ubicacionLink: '', contacto: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            var nuevoArray = []
            categorias.map((item) => {
              nuevoArray.push(item.item)
            })
            if (categorias.length == 0) {
              Alert.alert("Aviso", "Seleccione una o mas categorias")
            } else if (imagen == '') {
              Alert.alert("Aviso", "Imagen de portada no seleccionada")
            } else {
              createLugares(values.titulo, values.descripcion, values.ubicacionTitulo, values.ubicacionLink, nuevoArray, values.contacto)
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
            </View>
          )}
        </Formik>

      </ScrollView>
      <View>
        <SelectBox
          key={'selectCategoria'}
          label="Seleccione las categorías correspondientes al lugar"
          options={K_OPTIONS}
          selectedValues={categorias}
          onMultiSelect={onMultiChange()}
          onTapClose={onMultiChange()}
          hideInputFilter={true}
          arrowIconColor={'#005CA8'}
          searchIconColor={'#005CA8'}
          toggleIconColor={'#005CA8'}
          isMulti
        />
      </View>
      <Button title='cancelar' color='red' onPress={() => {
        setImagen('')
        setCategorias([])
        goBack()
      }} />
    </View>
  )
}

export default CreateLugares

const styles = StyleSheet.create({
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  }
})