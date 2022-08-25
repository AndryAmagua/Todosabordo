import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ReadEventos from '../../screens/Admin/ReadEventos'
import CreateEventos from '../../screens/Admin/CreateEventos'
import EditEventos from '../../screens/Admin/EditEventos'

const Stack = createNativeStackNavigator()

const StackEventos = () => {
    return (
        <Stack.Navigator initialRouteName='ReadEventos' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='ReadEventos' component={ReadEventos} />
            <Stack.Screen name='CreateEventos' component={CreateEventos} />
            <Stack.Screen name='EditEventos' component={EditEventos} />
        </Stack.Navigator>
    )
}

export default StackEventos