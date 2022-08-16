import {
    View, ScrollView, Text, StyleSheet, Image, FlatList,
    ImageBackground, LogBox, Pressable, Linking, Alert
} from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
LogBox.ignoreAllLogs()

const Lugar = ({ navigation: { goBack }, route }) => {
    const [data, setData] = useState([])
    let lugar = route.params.lugar

    const getEventos = async () => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/eventos/' + lugar._id)
            const json = await response.json()
            setData(json)
        } catch (error) {
            console.error(error)
        }
    }

    const createFavorito = async () => {
        try {
            const user = JSON.parse(await AsyncStorage.getItem('usuario'))
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/usuarios/favoritos/' + user._id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lugarID: lugar._id
                })
            });
            const json = await response.json()
            Alert.alert("Aviso", json.message)
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        getEventos();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <ImageBackground source={{ uri: 'data:image/jpeg;base64,' + lugar.imagenPerfil }} style={styles.portada}>
                <Pressable onPress={() => goBack()}>
                    <Image style={styles.iconBack} source={require('../../assets/back.png')} />
                </Pressable>
                <Pressable onPress={() => createFavorito()}>
                    <Image style={styles.iconFav} source={require('../../assets/Favorito.png')} />
                </Pressable>
            </ImageBackground>
            <View style={styles.informacion}>
                <Text style={styles.titulo}>{lugar.titulo}</Text>
                <Text style={styles.texto1}>{lugar.descripcion}</Text>
                <FlatList
                    horizontal={true}
                    data={lugar.servicio}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.texto2}>{item}</Text>
                        </View>
                    )}
                />
                <Text style={styles.texto1} onPress={() => Linking.openURL(lugar.ubicacionLink)}>
                    {lugar.ubicacionTitulo}
                </Text>
                <Text style={styles.texto1}>{lugar.contacto}</Text>
                {/* Eventos-Promociones */}
                <Text style={styles.texto2}>Eventos</Text>
                <FlatList
                    horizontal={true}
                    data={data}
                    keyExtractor={(item, index) => item._id}
                    renderItem={({ item }) => (
                        <View style={{
                            backgroundColor: "beige",
                            padding: 10,
                            borderRadius: 5,
                            marginVertical: 10
                        }}>
                            <Image
                                source={{ uri: 'data:image/jpeg;base64,' + item.imagen }}
                                style={styles.images}
                            />
                            <Text>{item.titulo}, {item.fecha}</Text>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    )
}

export default Lugar

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#005CA8'
    },
    images: {
        width: 150,
        height: 150,
        marginHorizontal: 3
    },
    portada: {
        width: "100%",
        height: 350,
        resizeMode: 'stretch',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    iconFav: {
        width: 70,
        height: 70,
        resizeMode: 'center',
        marginHorizontal: 15,
        marginBottom: 50
    },
    iconBack: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        marginHorizontal: 15,
        marginBottom: 60
    },
    informacion: {
        marginTop: -50,
        backgroundColor: '#005CA8',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        paddingHorizontal: 20
    },
    titulo: {
        color: '#ffff',
        fontSize: 40,
        textAlign: 'center',
        marginVertical: 15
    },
    texto1: {
        color: '#fff',
        textAlign: 'justify',
        marginVertical: 5,
        //fontSize: 14
    },
    texto2: {
        color: '#fff',
        textAlign: 'center'
    },
    card: {
        backgroundColor: "#0c2e4a",
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        width: 'auto'
    }

})