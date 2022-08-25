import { Image, ImageBackground, StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

const Evento = ({ navigation: { goBack }, route }) => {
    let evento = route.params.evento
    return (
        <View style={styles.container}>
            <View style={{height: '75%'}}>
                <ImageBackground source={{ uri: evento.imagen }} style={styles.image} resizeMode={'stretch'}>
                    <Pressable onPress={() => goBack()}>
                        <Image style={styles.iconBack} source={require('../../assets/back.png')} />
                    </Pressable>
                </ImageBackground>
            </View>
            <View style={styles.informacion}>
                <Text style={styles.titulo}>{evento.titulo}</Text>
                <Text style={styles.texto}>{new Date(evento.fecha).toLocaleDateString() + "\n" + new Date(evento.fecha).toLocaleTimeString()}</Text>
            </View>
        </View>
    )
}

export default Evento

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        height: '100%',
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    informacion: {
        height: '25%',
        backgroundColor: '#005CA8',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 20
    },
    iconBack: {
        tintColor: '#fff',
        margin: 15,
        width: 50,
        height: 50
    },
    titulo:{
        color: '#fff',
        fontSize: 25,
        textAlign: 'center'
    },
    texto:{
        color: '#fff',
        textAlign: 'center'
    }
})