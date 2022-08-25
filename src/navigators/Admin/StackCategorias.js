import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ReadCategorias from '../../screens/Admin/ReadCategorias'
import CreateCategorias from '../../screens/Admin/CreateCategorias'
import EditCategorias from '../../screens/Admin/EditCategorias'

const Stack = createNativeStackNavigator()

const StackCategorias = () => {
    return (
        <Stack.Navigator initialRouteName='ReadCategorias' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='ReadCategorias' component={ReadCategorias} />
            <Stack.Screen name='CreateCategorias' component={CreateCategorias} />
            <Stack.Screen name='EditCategorias' component={EditCategorias} />
        </Stack.Navigator>
    )
}

export default StackCategorias