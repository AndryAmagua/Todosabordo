import {
    View, ScrollView, Text, StyleSheet, Image, FlatList,
    ImageBackground, LogBox, Pressable, Linking, Alert
} from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
LogBox.ignoreAllLogs()

const Lugar = ({ navigation: { goBack, navigate }, route }) => {
    const [data, setData] = useState([])
    const [vista, setVista] = useState('Eventos')

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
            <ImageBackground source={{ uri: lugar.imagenPerfil }} style={styles.portada}>
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
                <View style={styles.buttonsContainer}>
                    <Text onPress={() => setVista('Eventos')}
                        style={vista == 'Eventos' ? styles.subtituloOn : styles.subtituloOff}>Eventos</Text>
                    <Text onPress={() => setVista('Promociones')}
                        style={vista == 'Promociones' ? styles.subtituloOn : styles.subtituloOff}>Promociones</Text>
                </View>
                {
                    vista == 'Eventos' ? (
                        <FlatList
                            key={'listaEventos'}
                            horizontal={true}
                            data={data}
                            keyExtractor={(item, index) => item._id}
                            renderItem={({ item }) => (
                                <View style={styles.card2}>
                                    <Pressable
                                        onPress={() => navigate('Evento', { evento: item })}
                                    >
                                        <Image
                                            source={{ uri: item.imagen }}
                                            style={styles.imagenEvento}
                                            resizeMode='cover'
                                        />
                                    </Pressable>
                                    <Text style={styles.texto2}>{item.titulo}</Text>
                                </View>
                            )}
                        />
                    ) : (
                        <FlatList
                            key={'listaPromociones'}
                            numColumns={3}
                            data={data}
                            keyExtractor={(item, index) => item._id}
                            renderItem={({ item }) => (
                                <View style={styles.card3}>
                                    <Pressable
                                        onPress={() => navigate('ImagenPromocion', { uri: item.imagen })}
                                    >
                                        <Image
                                            source={{ uri: item.imagen }}
                                            style={styles.imagenPromocion}
                                            resizeMode='cover'
                                        />
                                    </Pressable>
                                </View>
                            )}
                        />
                    )
                }

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
        marginBottom: 60,
        tintColor: 'white' || 'black'
    },
    informacion: {
        marginTop: -50,
        backgroundColor: '#005CA8',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        paddingHorizontal: 20
    },
    imagenEvento: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    imagenPromocion: {
        width: '100%',
        height: 150,
        borderRadius: 10,
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
    },
    subtituloOn: {
        color: '#fff',
        textAlign: 'center',
        backgroundColor: "#0c2e4a",
        borderRadius: 10,
        padding: 10
    },
    subtituloOff: {
        color: '#fff',
        textAlign: 'center',
        borderRadius: 10,
        padding: 10
    },
    texto2: {
        color: '#fff',
        maxWidth: 150,
        paddingHorizontal: 5
    },
    card: {
        backgroundColor: "#0c2e4a",
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        width: 'auto'
    },
    card2: {
        flex: 1,
        justifyContent: 'center',
        margin: 5,
    },
    card3: {
        flex: 1,
        maxWidth: '33%',
        justifyContent: 'center',
        margin: 5,
    },
    buttonsContainer: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }

})