import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View, Pressable, Modal, LogBox } from 'react-native';
LogBox.ignoreAllLogs()

const ReadCategorias = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [nombre, setNombre] = useState('');

    function crearCategoria() {
        fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/categorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
            })
        }).then(() => {
            setModalVisible(!modalVisible);
            setNombre('');
            getCategorias();
        })
    }

    const getCategorias = async () => {
        try {
            const response = await fetch('https://tabapi-andryamagua5-gmailcom.vercel.app/categorias');
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCategorias();
    }, []);
    return (
        <View style={{ padding: 24 }}>
            <Pressable
                onPress={() => setModalVisible(true)}>
                <Text>Añadir</Text>
            </Pressable>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    setNombre('');
                }}
            >
                <View>
                    <TextInput
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="nombre"
                    />
                    <Pressable
                        onPress={() => crearCategoria()}
                    >
                        <Text>CREAR</Text>
                    </Pressable>
                </View>
            </Modal>
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
                            <Text>{item.nombre}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

export default ReadCategorias