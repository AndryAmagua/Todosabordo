import React from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { LogBox, View, Image, ImageBackground, StyleSheet } from 'react-native'
LogBox.ignoreAllLogs()

import StackEventos from './StackEventos'
import StackLugares from './StackLugares'
import StackCategorias from './StackCategorias'
import StackPromociones from './StackPromociones'
import Ajustes from '../../screens/Admin/Ajustes'
import Usuarios from '../../screens/Admin/Usuarios'

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}
            >
                <ImageBackground source={require('../../assets/Fondo4.png')} resizeMode='cover' style={styles.header} >
                    <Image source={require('../../assets/Logo.png')} resizeMode='contain' style={styles.image} />
                </ImageBackground>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    );
}

const DrawerAdmin = (props) => {
    return (
        <Drawer.Navigator useLegacyImplementation
            drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Lugares" component={StackLugares} />
            <Drawer.Screen name="Eventos" component={StackEventos} />
            <Drawer.Screen name="Categorias" component={StackCategorias} />
            <Drawer.Screen name="Promociones" component={StackPromociones} />
            <Drawer.Screen name="Usuarios" component={Usuarios} />
            <Drawer.Screen name="Ajustes" component={Ajustes} initialParams={{ funcion: props.funcion }} />
        </Drawer.Navigator>
    )
}

export default DrawerAdmin

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