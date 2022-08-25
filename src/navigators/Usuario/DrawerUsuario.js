import React, { useState, useEffect } from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { LogBox, ImageBackground, Text, Image, View, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
LogBox.ignoreAllLogs()

import TabUsuario from './TabUsuario'
import StackCategoria from './StackCategoria'

const Drawer = createDrawerNavigator()

const DrawerUsuario = (props) => {
    const [categorias, setCategorias] = useState([])

    const getCategorias = async () => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/categorias')
            const json = await response.json()
            setCategorias(json)
        } catch (error) {
            console.error(error)
        }
    }

    function CustomDrawerContent(props) {
        return (
            <View style={styles.container}>
                <DrawerContentScrollView {...props}
                    style={styles.container}
                >
                    <ImageBackground source={require('../../assets/Fondo4.png')} resizeMode='cover' style={styles.header} >
                        <Image source={require('../../assets/Logo.png')} resizeMode='contain' style={styles.image} />
                    </ImageBackground>
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            </View>
        );
    }

    useEffect(() => {
        getCategorias()
    }, [])

    return (
        <Drawer.Navigator initialRouteName='Inicio' useLegacyImplementation
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTintColor: 'white',
                headerTransparent: true,
                headerTitleStyle: {
                    fontSize: 30,
                }
            }}>
            <Drawer.Screen name="Inicio" component={TabUsuario} initialParams={{ funcion: props.funcion }}
                options={{
                    headerTitle: '',
                    headerRight: () => {
                        return (
                            <>
                                <Image source={require('../../assets/Logo.png')} style={styles.logo} resizeMode='center' />
                            </>
                        )
                    }
                }} />
            {
                categorias.map(item => {
                    return (
                        <Drawer.Screen key={item._id} name={item.nombre} component={StackCategoria} />
                    )
                })
            }
        </Drawer.Navigator>
    )
}

export default DrawerUsuario

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        padding: 0
    },
    header: {
        padding: 20,
        top: -10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 130,
        height: 80
    },
    logo: {
        alignSelf: 'flex-start',
    },
    text: {
        color: 'black',
        marginTop: 10
    }
})
