import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, FlatList, Text, View, Pressable, LogBox, StyleSheet } from 'react-native';
LogBox.ignoreAllLogs()

const Categoria = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  var categoria = route.params.categoria

  const getLugares = async () => {
    try {
      const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares/categoria/' + categoria);
      const json = await response.json();
      json.sort(() => Math.random() - 0.5)
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLugares();
  }, []);

  return (
    <ImageBackground source={require('../../assets/Fondo3.png')} resizeMode="cover" style={styles.container}>
      {isLoading ? <ActivityIndicator size="large" color="#fff"/> : (data.length == 0) ?
        (
          <Text style={{ color: 'white', textAlign: 'center' }}>No hay lugares que mostrar</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => item._id}
            numColumns={2}
            key={'listaCategoria'}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Pressable
                  onPress={() => navigation.navigate('Lugar', { lugar: item })}
                >
                  <Image
                    source={{ uri: 'data:image/jpeg;base64,' + item.imagenPerfil }}
                    style={styles.image}
                  />
                </Pressable>
                <Text style={styles.text}>{item.titulo}</Text>
              </View>
            )}
          />
        )}
    </ImageBackground>
  )
}

export default Categoria

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 75
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    margin: 15
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    color: 'black',
    marginTop: 15
  }
})