import { View, Text, Button,LogBox } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
LogBox.ignoreAllLogs()

const Ajustes = (props) => {
    const logout = async () => {
        AsyncStorage.removeItem('usuario')
        AsyncStorage.setItem('login', "false")
        props.route.params.funcion()
    }

    return (
        <View>
            <Text>Ajustes</Text>
            <Button
                title='LogOut'
                onPress={() => logout()}
            />
        </View>
    )
}

export default Ajustes