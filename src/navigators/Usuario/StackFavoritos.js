import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

import Favoritos from '../../screens/Usuario/Favoritos'
import Lugar from '../../screens/Usuario/Lugar'
import ImagenPromocion from '../../screens/Usuario/ImagenPromocion'
import Evento from '../../screens/Usuario/Evento'

const Stack = createNativeStackNavigator()

const StackFavoritos = (props) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Favoritos" component={Favoritos} />
            <Stack.Screen name="Lugar" component={Lugar} />
            <Stack.Screen name="ImagenPromocion" component={ImagenPromocion} />
            <Stack.Screen name="Evento" component={Evento} />
        </Stack.Navigator>
    )
}

export default StackFavoritos