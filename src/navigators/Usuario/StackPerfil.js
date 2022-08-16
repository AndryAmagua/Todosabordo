import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

import Perfil from '../../screens/Usuario/Perfil'
import Edit from '../../screens/Usuario/Edit'

const Stack = createNativeStackNavigator()

const StackPerfil = (props) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
                <Stack.Screen name="Perfil" component={Perfil} initialParams={{ funcion: props.route.params.funcion }}/>
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Edit" component={Edit} />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default StackPerfil