import { StyleSheet, Text, View, FlatList, Image, Pressable, SafeAreaView, Alert, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Favoritos = ({ navigation }) => {
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
        Alert.alert("Aviso", "Elminado de favoritos")
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
              <Pressable onPress={() => navigation.navigate('Lugar', { lugar: item })}>
                <Image
                  source={{ uri: item.imagenPerfil }}
                  style={styles.imagenFavortio}
                  resizeMode='cover'
                />
              </Pressable>
              <View style={styles.rowView}>
                <Text style={styles.text}>{item.titulo}</Text>
                <Pressable onPress={() => eliminarFavorito(item._id)}>
                  <Image style={styles.iconElm} source={require('../../assets/iconoEliminar.png')} resizeMode={'stretch'} />
                </Pressable>
              </View>
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
    paddingTop: 75
  },
  card: {
    flex: 1,
    marginHorizontal: 35,
    marginVertical: 10
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    backgroundColor: '#005CA8',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  imagenFavortio: {
    width: '100%',
    height: 175,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  text: {
    maxWidth: '50%',
    fontSize: 20,
    color: '#fff',
    marginVertical: 10
  },
  iconElm: {
    width: 30,
    height: 30,
  },
})
