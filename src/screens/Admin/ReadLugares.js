import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Pressable, StyleSheet, Button, Image } from 'react-native';
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

const ReadLugares = ({ navigation }) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([])

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

    useEffect(() => {
        getLugares()
    }, []);

    return (
        <View>
            {isLoading ? <ActivityIndicator /> :
                (data.length == 0) ?
                    (
                        <View>
                            <Button title='Agregar' color='blue' onPress={() => navigation.navigate('CreateLugares', { funcion: getLugares })} />
                            <Text>No hay lugares que mostrar</Text>
                        </View>
                    ) : (
                        <View>
                            <Button title='Agregar' color='blue' onPress={() => navigation.navigate('CreateLugares', { funcion: getLugares })} />
                            <FlatList
                                key={'listaLugares'}
                                numColumns={2}
                                data={data}
                                keyExtractor={(item, index) => item._id}
                                renderItem={({ item }) => (
                                    <View style={styles.card}>
                                        <Pressable
                                            onPress={() => navigation.navigate('EditLugares', { lugar: item, funcion: getLugares })}>
                                            <Image source={{ uri: item.imagenPerfil }} style={{ height: 200, width: '100%' }} />
                                        </Pressable>
                                        <Text>{item.titulo}</Text>
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
    card: {
        flex: 1,
        padding: 20
    },
});