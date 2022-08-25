import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

import Perfil from '../../screens/Usuario/Perfil'
import Edit from '../../screens/Usuario/Edit'
import EditContraseña from '../../screens/Usuario/EditContrasena'

const Stack = createNativeStackNavigator()

const StackPerfil = (props) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Perfil" component={Perfil} initialParams={{ funcion: props.route.params.funcion }} />
            <Stack.Screen name="Edit" component={Edit} />
            <Stack.Screen name="EditContraseña" component={EditContraseña} />
        </Stack.Navigator>
    )
}

export default StackPerfil