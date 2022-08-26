import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Pressable, StyleSheet, Image, Button } from 'react-native';
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()


const Eventos = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true)
  const [dataEventos, setDataEventos] = useState([])


  const getEventos = async () => {
    try {
      const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/eventos');
      const json = await response.json();
      setDataEventos(json);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getEventos()
  }, []);

  return (
    <View>
      {isLoading ? <ActivityIndicator /> :
        (dataEventos.length == 0) ?
          (
            <View>
              <Button title='Agregar' color='blue' onPress={() => navigation.navigate('CreateEventos', { funcion: getEventos })} />
              <Text>No hay eventos que mostrar</Text>
            </View>
          ) : (
            <View style={styles.container}>
              <Button title='Agregar' color='blue' onPress={() => navigation.navigate('CreateEventos', { funcion: getEventos })} />
              <FlatList
                key={'ListaEventos'}
                numColumns={2}
                data={dataEventos}
                keyExtractor={(item, index) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Pressable
                      onPress={() => navigation.navigate('EditEventos', { evento: item, funcion: getEventos })}>
                      <Image source={{ uri: item.imagen }} style={{ height: 200, width: '100%' }} />
                    </Pressable>
                    <Text>{item.lugarID.titulo}</Text>
                    <Text>{item.titulo}</Text>
                    <Text>{new Date(item.fecha).toLocaleDateString()}</Text>
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
  container: {
    height: '100%',
  },
  card: {
    flex: 1,
    padding: 20
  }
});