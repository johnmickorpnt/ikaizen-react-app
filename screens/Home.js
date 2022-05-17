import { StyleSheet, Text, View, Button, FlatList, TextInput, TouchableHighlight, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';

import { useFonts } from '@expo-google-fonts/inter';
import CustomHeader from '../components/CustomHeader';

const api_url = "http://18.206.235.172";
const HomeScreen = ({ navigation }) => {
    const [feed, setFeed] = useState();

    useEffect(() => {
        // Update the document title using the browser API
        fetch(api_url + "/api/home", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((re) => re.json())
            .then((re) => setFeed(re))
            .catch(error => console.error(error))
    }, []);
    return (
        <View style={styles.container}>
            <FlatList data={feed}
                keyExtractor={(item) => item.product_id}
                numColumns={2}
                horizontal={false}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        key={item.key}
                        onPress={() => { console.log(item.product_id) }}>
                        <View style={styles.productItem}>
                            <Image
                                style={styles.logo}
                                source={{
                                    uri: api_url + "/storage/images/" + item.prod_image,
                                }}
                            />
                            <Text style={{ textAlign: "center" }} numberOfLines={2}>{item.name}</Text>
                            <TouchableOpacity style={styles.button}>
                                <Text style={{ color: "white" }}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                ListHeaderComponent={<CustomHeader navigation={navigation}/>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    productItem: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        margin: 5,
        width: 180,
        textAlign: "center"
    },
    logo: {
        marginVertical: 15,
        width: "100%",
        height: 150,
        resizeMode: 'contain',
        borderRadius: 10
    },
    button: {
        marginVertical: 5,
        alignItems: "center",
        backgroundColor: "#FF1818",
        width: "100%",
        padding: 10,
        borderRadius: 5
    },
    mainLogo: {
        backgroundColor: "#FFC300",
        marginVertical: 15,
        width: "100%",
        height: 100,
        resizeMode: 'contain',
    },
    shopBtn: {
        backgroundColor: "#5463FF",
        borderRadius: 5,
        paddingHorizontal: 24,
        paddingVertical: 8,
        width: "100%",
    }
});

export default HomeScreen;