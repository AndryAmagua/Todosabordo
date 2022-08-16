import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

import Categoria from '../../screens/Usuario/Categoria'
import Lugar from '../../screens/Usuario/Lugar'

const Stack = createNativeStackNavigator()

const StackCategoria = (props) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={props.route.name + "-Stack"} component={Categoria} initialParams={{ categoria: props.route.name }} />
            <Stack.Screen name="Lugar" component={Lugar} />
        </Stack.Navigator>
    )
}

export default StackCategoria