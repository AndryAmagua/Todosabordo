import React, { useState, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LogBox, View, Image, ImageBackground, Text } from 'react-native'
LogBox.ignoreAllLogs()

import ReadLugares from './ReadLugares'
import EditLugares from './EditLugares'
import Usuarios from './Usuarios'
import Categorias from './ReadCategorias'
import ReadEventos from './ReadEventos'
import EditEventos from './EditEventos'
import Ajustes from './Ajustes'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const image = { uri: "https://reactjs.org/logo-og.png" };

const Inicio = (props) => {
  const [userData, setUserData] = useState({});

  const getUsuario = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('usuario'));
    console.log(user)
    setUserData(user)
  }

  function CustomDrawerContent(props) {
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}
        // contentContainerStyle={{ backgroundColor: '#f43f4f' }}
        >
          <ImageBackground source={image} style={{ padding: 20 }} >
            <Image source={require('../../assets/User.png')}
              style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />
            <Text style={{ color: 'white' }}>{userData.nombre}</Text>
            <Text style={{ color: 'white' }}>{userData.correo}</Text>
          </ImageBackground>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </View>
    );
  }

  function TabLugares() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='ReadLugares' component={ReadLugares} />
        <Stack.Screen name='EditLugares' component={EditLugares} />
      </Stack.Navigator>
    )
  }

  function StackLugares() {
    return (
      <Stack.Navigator initialRouteName='ReadLugares' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='ReadLugares' component={ReadLugares} />
        <Stack.Screen name='EditLugares' component={EditLugares} />
      </Stack.Navigator>
    )
  }

  function StackEventos() {
    return (
      <Stack.Navigator initialRouteName='ReadLugares' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='ReadEventos' component={ReadEventos} />
        <Stack.Screen name='EditEventos' component={EditEventos} />
      </Stack.Navigator>
    )
  }

  useEffect(() => {
    getUsuario();
  }, []);

  return (
    <Drawer.Navigator useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Lugares" component={StackLugares} />
      <Drawer.Screen name="Usuarios" component={Usuarios} />
      <Drawer.Screen name="Categorias" component={Categorias} />
      <Drawer.Screen name="Eventos" component={StackEventos} />
      <Drawer.Screen name="Ajustes" component={Ajustes} initialParams={{ funcion: props.funcion }} />
    </Drawer.Navigator>
  )
}

export default Inicio