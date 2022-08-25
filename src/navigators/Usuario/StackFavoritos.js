import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

import Favoritos from '../../screens/Usuario/Favoritos'
import Lugar from '../../screens/Usuario/Lugar'

const Stack = createNativeStackNavigator()

const StackFavoritos = (props) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Favoritos" component={Favoritos} />
            <Stack.Screen name="Lugar" component={Lugar} />
        </Stack.Navigator>
    )
}

export default StackFavoritos