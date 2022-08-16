import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, LogBox } from 'react-native';
LogBox.ignoreAllLogs()

const Usuarios = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const getUsuarios = async () => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/usuarios');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUsuarios();
    }, []);

    return (
        <View style={{ padding: 24 }}>
            {isLoading ? <ActivityIndicator /> : (
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => item._id}
                    renderItem={({ item }) => (
                        <View style={{
                            backgroundColor: "beige",
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 5,
                            marginVertical: 10
                        }}>
                            <Text>{item.nombre}, {item.correo}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

export default Usuarios