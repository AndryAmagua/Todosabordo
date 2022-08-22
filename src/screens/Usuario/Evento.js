import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Evento = ({ navigation: { goback }, route }) => {
    let uri = route.params.uri
    return (
        <View style={styles.container}>
            <Image source={{ uri: uri }} style={styles.image} resizeMode={'stretch'}/>
        </View>
    )
}

export default Evento

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: '50%',
        width: '100%'
    }
})