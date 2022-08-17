import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

import Lugares from '../../screens/Usuario/Lugares'
import Lugar from '../../screens/Usuario/Lugar'
import ImagenPromocion from '../../screens/Usuario/ImagenPromocion'

const Stack = createNativeStackNavigator()

const StackLugar = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Lugares" component={Lugares} />
            <Stack.Screen name="Lugar" component={Lugar} />
            <Stack.Screen name="ImagenPromocion" component={ImagenPromocion} />
        </Stack.Navigator>
    )
}

export default StackLugar