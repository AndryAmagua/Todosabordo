import React from 'react'
import { Image, LogBox } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
LogBox.ignoreAllLogs()

import StackLugar from './StackLugar'
import Eventos from '../../screens/Usuario/Eventos'
import StackFavoritos from './StackFavoritos'
import StackPerfil from './StackPerfil'

const Tab = createBottomTabNavigator()

const TabUsuario = (props) => {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                backgroundColor: '#005CA8',
            }
        }}>
            <Tab.Screen name="StackLugares" component={StackLugar} options={{
                tabBarIcon: ({ focused }) => (<Image source={require("../../assets/iconoLugares.png")}
                    style={{ tintColor: focused ? '#FFCB00' : 'white', width: 20, height: 20 }} />)
            }} />
            <Tab.Screen name="Eventos" component={Eventos} options={{
                tabBarIcon: ({ focused }) => (<Image source={require("../../assets/iconoEventos.png")}
                    style={{ tintColor: focused ? '#FFCB00' : 'white', width: 20, height: 20 }} />)
            }} />
            <Tab.Screen name="StackFavoritos" component={StackFavoritos} options={{
                tabBarIcon: ({ focused }) => (<Image source={require("../../assets/iconoFavoritos.png")}
                    style={{ tintColor: focused ? '#FFCB00' : 'white', width: 20, height: 20 }} />)
            }} />
            <Tab.Screen name="StackPerfil" component={StackPerfil} initialParams={{ funcion: props.route.params.funcion }} options={{
                tabBarIcon: ({ focused }) => (<Image source={require("../../assets/iconoAjustes.png")}
                    style={{ tintColor: focused ? '#FFCB00' : 'white', width: 20, height: 20 }} />)
            }} />
        </Tab.Navigator>
    )
}

export default TabUsuario