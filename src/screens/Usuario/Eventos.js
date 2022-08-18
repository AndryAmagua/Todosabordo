import { StyleSheet, Text, View, SafeAreaView, Image, ImageBackground, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'

const Eventos = () => {
  const [data, setData] = useState([])

  const getEventos = async () => {
    try {
      const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/eventos');
      const json = await response.json()
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const result = json.filter(evento => new Date(evento.fecha) > yesterday);
      setData(result)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getEventos()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/Fondo3.png')} resizeMode="cover" style={styles.fondoEventos}>
        <FlatList
          key={'listaEventos'}
          data={data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item._id}
          
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.imagen }}
                style={styles.imagenEvento}
              />
              
              <Text style={styles.text}>{item.titulo}</Text>
              <Text style={styles.textAlt}>{new Date(item.fecha).toLocaleDateString() + " - " + new Date(item.fecha).toLocaleTimeString() + "\nEn " + item.lugarID.titulo}</Text>
            </View>
          )}
        />
      </ImageBackground>
    </SafeAreaView>
  )
}
export default Eventos

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fondoEventos: {
    flex: 1
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    margin: 15,
    marginTop: 55
  },
  imagenEvento: {
    width: 250,
    height: "65%",
    resizeMode: 'cover',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    color: '#000',
    marginTop: 15,
    width: 250
  },
  textAlt: {
    color: '#000',
    marginTop: 5,
    paddingHorizontal: 10,
    width: 250
  }
})