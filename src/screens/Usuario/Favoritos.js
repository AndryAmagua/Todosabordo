import { StyleSheet, Text, View, FlatList, Image, Button, SafeAreaView, Alert, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Favoritos = () => {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false)

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onRefresh = async () => {
    setIsFetching(true);
    await sleep(2000);
    getFavoritos()
    setIsFetching(false);
  }

  const getFavoritos = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('usuario'))
      const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/usuarios/' + user._id);
      const json = await response.json();
      setData(json.favoritos);
    } catch (error) {
      console.error(error);
    }
  }

  const eliminarFavorito = async (lugarID) => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('usuario'))
      const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/usuarios/favoritos/' + user._id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lugarID: lugarID
        })
      });
      const json = await response.json()
      if (json) {
        Alert.alert("Aviso", "Lugar elminado de favoritos")
      } else {
        Alert.alert("Aviso", "No se pudo eliminar de favoritos")
      }
      getFavoritos()
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getFavoritos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.fondoFavoritos} source={require('../../assets/Fondo3.png')}>
        <FlatList
          data={data}
          onRefresh={onRefresh}
          refreshing={isFetching}
          keyExtractor={(item, index) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: 'data:image/jpeg;base64,' + item.imagenPerfil }}
                style={styles.imagenFavortio}
              />
              <Text style={styles.text}>{item.titulo}</Text>
              {/* <Text>{item.descripcion}</Text> */}
              <Button title='Eliminar' color='red' onPress={() => eliminarFavorito(item._id)} />
            </View>
          )}
        />
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Favoritos

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fondoFavoritos: {
    flex: 1,
    resizeMode: 'cover', 
    paddingTop: 55
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 35,
    marginVertical: 10
  },
  imagenFavortio: {
    width: '100%',
    height: 175,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    color: 'black',
    marginVertical: 10
  }
})
