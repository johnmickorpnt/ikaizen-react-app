import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from '@expo-google-fonts/inter';


const api_url = "http://192.168.254.100:8000";
const HomeScreen = ({ navigation }) => {
    const [feed, setFeed] = useState();
    let [fontsLoaded] = useFonts({
        'open-sans': require('../assets/fonts/OpenSans-Regular.ttf'),
        'open-sans-bold': require('../assets/fonts/OpenSans-Bold.ttf'),
    });

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
                ListHeaderComponent={header(navigation)}
            />
        </View>
    );
};

const header = (navigation) => {
    return (
        <View style={{ marginVertical: 20 }}>
            <Image
                style={styles.mainLogo}
                source={{
                    uri: "http://192.168.254.100:8000/images/logo1-1.png",
                }}
            />
            <View style={{ padding: 10, flex: 1, flexDirection: "column", justifyContent: "center"}}>
                <Text style={{ fontSize: 21, textAlign: "center", fontFamily:"open-sans-bold" }}>
                    You can check our products here
                </Text>
                <TouchableOpacity style={styles.shopBtn} onPress={() => { navigation.navigate("Shop") }}>
                    <Text style={{ color: "white", textAlign: "center", fontFamily:"open-sans" }}>Shop Now!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
        borderRadius:5
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