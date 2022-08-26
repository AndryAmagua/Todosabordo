import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Pressable, StyleSheet, Button, Image } from 'react-native';
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

const ReadPromociones = ({ navigation }) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([])

    const getPromociones = async () => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/promociones');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPromociones()
    }, []);

    return (
        <View>
            {isLoading ? <ActivityIndicator /> :
                (data.length == 0) ?
                    (
                        <View>
                            <Button title='Agregar' color='blue' onPress={() => navigation.navigate('CreatePromociones', { funcion: getPromociones })} />
                            <Text>No hay promociones que mostrar</Text>
                        </View>
                    ) : (
                        <View>
                            <Button title='Agregar' color='blue' onPress={() => navigation.navigate('CreatePromociones', { funcion: getPromociones })} />
                            <FlatList
                                key={'listaPromociones'}
                                numColumns={2}
                                data={data}
                                keyExtractor={(item, index) => item._id}
                                renderItem={({ item }) => (
                                    <View style={styles.card}>
                                        <Pressable
                                            onPress={() => navigation.navigate('EditPromociones', { promocion: item, funcion: getPromociones })}>
                                            <Image source={{ uri: item.imagen }} style={{ height: 200, width: '100%' }} />
                                        </Pressable>
                                        <Text>{item.lugarID.titulo}</Text>
                                    </View>
                                )}
                            />
                        </View>
                    )}
        </View>
    )
}

export default ReadPromociones

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 20
    },
});