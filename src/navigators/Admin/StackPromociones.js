import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ReadPromociones from '../../screens/Admin/ReadPromociones'
import EditPromociones from '../../screens/Admin/EditPromociones'
import CreatePromociones from '../../screens/Admin/CreatePromociones'

const Stack = createNativeStackNavigator();

const StackPromociones = () => {
    return (
        <Stack.Navigator initialRouteName='ReadPromociones' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='ReadPromociones' component={ReadPromociones} />
            <Stack.Screen name='EditPromociones' component={EditPromociones} />
            <Stack.Screen name='CreatePromociones' component={CreatePromociones} />
        </Stack.Navigator>
    )
}

export default StackPromociones