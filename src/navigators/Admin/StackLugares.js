import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ReadLugares from '../../screens/Admin/ReadLugares'
import EditLugares from '../../screens/Admin/EditLugares'
import CreateLugares from '../../screens/Admin/CreateLugares'

const Stack = createNativeStackNavigator();

const StackLugares = () => {
    return (
        <Stack.Navigator initialRouteName='ReadLugares' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='ReadLugares' component={ReadLugares} />
            <Stack.Screen name='EditLugares' component={EditLugares} />
            <Stack.Screen name='CreateLugares' component={CreateLugares} />
        </Stack.Navigator>
    )
}

export default StackLugares