import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, LogBox, Button, Pressable } from 'react-native';
LogBox.ignoreAllLogs()

const ReadCategorias = ({ navigation }) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([])

    const getCategorias = async () => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/categorias');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCategorias()
    }, [])

    return (
        <View>
            {isLoading ? <ActivityIndicator /> :
                (data.length == 0) ?
                    (
                        <View>
                            <Button title='Agregar' color='blue' onPress={() => navigation.navigate('CreateCategorias', { funcion: getCategorias })} />
                            <Text>No hay categorias que mostrar</Text>
                        </View>
                    ) : (
                        <View>
                            <Button title='Agregar' color='blue' onPress={() => navigation.navigate('CreateCategorias', { funcion: getCategorias })} />
                            <FlatList
                                data={data}
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
                                            onPress={() => navigation.navigate('EditCategorias', { categoria: item, funcion: getCategorias })}>
                                            <Text>{item.nombre}</Text>
                                        </Pressable>
                                    </View>
                                )}
                            />
                        </View>
                    )}
        </View>
    )
}

export default ReadCategorias