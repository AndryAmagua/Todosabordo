import { StyleSheet, Text, View, SafeAreaView, ImageBackground, FlatList, Image, Pressable, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'

const Lugares = ({ navigation }) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const getLugares = async () => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/lugares')
            const json = await response.json()
            json.sort(() => Math.random() - 0.5)
            setData(json)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getLugares()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../../assets/Fondo3.png')} resizeMode="cover" style={styles.fondoLugares}>
                {isLoading ? <ActivityIndicator /> : (data.length == 0) ?
                    (
                        <Text style={{ color: 'white', textAlign: 'center' }}>No hay lugares que mostrar</Text>
                    ) : (
                        <FlatList
                            data={data}
                            keyExtractor={(item, index) => item._id}
                            numColumns={2}
                            key={'listaLugares'}
                            initialNumToRender={4}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <Pressable
                                        onPress={() => navigation.navigate('Lugar', { lugar: item })}
                                    >
                                        <Image
                                            source={{ uri: 'data:image/jpeg;base64,' + item.imagenPerfil }}
                                            style={styles.imagenLugar}
                                        />
                                    </Pressable>
                                    <Text style={styles.text}>{item.titulo}</Text>
                                </View>
                            )}
                        />
                    )}
            </ImageBackground>
        </SafeAreaView>
    )
}

export default Lugares

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fondoLugares: {
        flex: 1,
        paddingTop: 75,
    },
    card: {
        flex: 1,
        justifyContent: 'center',
        margin: 15,
    },
    imagenLugar: {
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