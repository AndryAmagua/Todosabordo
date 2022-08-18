import { Pressable, Image, ImageBackground, StyleSheet, View } from 'react-native'
import React from 'react'

const ImagenPromocion = ({ navigation: { goBack }, route }) => {
    let uri = route.params.uri
    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: uri }}
                style={styles.imagenPromocion}
                resizeMode='stretch'
            >
                <Pressable onPress={() => goBack()}>
                    <Image style={styles.iconBack} source={require('../../assets/back.png')} />
                </Pressable>
            </ImageBackground>
        </View>
    )
}

export default ImagenPromocion

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imagenPromocion: {
        flex:1,
        alignItems: 'flex-end',
        justifyContent:'flex-end'
    },
    iconBack: {
        width: 50,
        height: 50,
        marginHorizontal: 25,
        marginBottom: 25
    },
})