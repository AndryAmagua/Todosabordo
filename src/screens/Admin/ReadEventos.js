import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, FlatList, Text, View, Pressable, Modal, TextInput, StyleSheet, Image, Alert, Button } from 'react-native';
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

const Eventos = ({ navigation }) => {
  const [photo, setPhoto] = useState()
  const [url, setUrl] = useState()
  const [isLoading, setLoading] = useState(true);
  const [dataEventos, setDataEventos] = useState([]);
  const [dataLugares, setDataLugares] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [date, setDate] = useState(new Date())
  const [openDate, setOpenDate] = useState(false)
  const [imagen, setImagen] = useState();

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
        console.log(response)
        const file = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName
        }
        formData.append('myFile', file)
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

  const getEventosLugares = async () => {
    try {
      const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/eventos');
      const json = await response.json();
      setDataEventos(json);
    } catch (error) {
      console.error(error);
    } finally {
      const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares');
      const json = await response.json();
      setDataLugares(json);
      setLoading(false);
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
      data.append('file', photo)
      data.append('upload_preset', 'todosabordo')
      data.append("cloud_name", "todosabordo")
      await fetch("https://api.cloudinary.com/v1_1/todosabordo/upload", {
        method: "post",
        body: data
      }).then(res => res.json()).
        then(data => {
          console.log("------->\n" + data.secure_url)
          setUrl(data.secure_url)
          console.log(url)
        }).catch(err => {
          Alert.alert("An Error Occured While Uploading")
        })

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
      setModalVisible(!modalVisible)
      setImagen('')
      getEventosLugares()
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getEventosLugares()
  }, []);

  return (
    <View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        style={{ padding: 20 }}
        onRequestClose={() => {
          setModalVisible(false);
          setImagen('');
        }}
      >
        <ScrollView>
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
                    // setDate(date.toLocaleDateString() + " - " + date.toLocaleTimeString().substr(0, 5))
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
        </ScrollView>
        <Button title='cancelar' color='red' onPress={() => {
          setModalVisible(false);
          setImagen('');
        }} />
      </Modal>

      {isLoading ? <ActivityIndicator /> :
        (dataEventos.length == 0) ?
          (
            <View>
              <Button title='Agregar' color='blue' onPress={() => setModalVisible(true)} />
              <Text>No hay eventos que mostrar</Text>
            </View>
          ) : (
            <View>
              <Button title='Agregar' color='blue' onPress={() => setModalVisible(true)} />
              <FlatList
                data={dataEventos}
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
                      onPress={() => navigation.navigate('EditEventos', { evento: item, funcion: getEventosLugares })}>
                      <Text>{item.titulo}</Text>
                    </Pressable>
                  </View>
                )}
              />
            </View>
          )}
    </View>
  )
}

export default Eventos

const styles = StyleSheet.create({
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  }
});