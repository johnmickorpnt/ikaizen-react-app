import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, Image, TouchableOpacity, ScrollView, TextInput, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import Ionicons from '@expo/vector-icons/Ionicons';
const api_url = "http://192.168.254.100:8000";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const ShopScreen = ({ navigation, route }) => {
    const [feed, setFeed] = useState();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false);
            fetchData();
        });
    }, []);
    useEffect(() => {
        // Update the document title using the browser API
        fetchData();
    }, []);

    const fetchData = () => {
        fetch(api_url + "/api/shop", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((re) => re.json())
            .then((re) => setFeed(re))
            .catch(error => console.error(error));
    }
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh} />
                }
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

            <View style={{ position: "relative" }}>
                <TextInput
                    style={styles.input}
                    placeholder="Search..."
                />
                <Ionicons name={"search-outline"} size={20} color={"black"} style={{ position: "absolute", right: 10, top: 15 }} />
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
    },
    input: {
        height: 40,
        margin: 5,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
});

export default ShopScreen;