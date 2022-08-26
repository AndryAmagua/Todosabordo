import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

import Categoria from '../../screens/Usuario/Categoria'
import Lugar from '../../screens/Usuario/Lugar'
import ImagenPromocion from '../../screens/Usuario/ImagenPromocion'
import Evento from '../../screens/Usuario/Evento'


const Stack = createNativeStackNavigator()

const StackCategoria = (props) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={props.route.name + "-Stack"} component={Categoria} initialParams={{ categoria: props.route.name }} />
            <Stack.Screen name="Lugar" component={Lugar} />
            <Stack.Screen name="ImagenPromocion" component={ImagenPromocion} />
            <Stack.Screen name="Evento" component={Evento} />
        </Stack.Navigator>
    )
}

export default StackCategoria