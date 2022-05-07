import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, Image, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown'

const api_url = "http://192.168.254.100:8000";
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const ShopScreen = ({ navigation, route }) => {
    const [feed, setFeed] = useState();
    const [brands, setBrands] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1500).then(() => {
            fetchData();
            setRefreshing(false);
        });
    }, []);

    useEffect(() => {
        // Update the document title using the browser API
        setIsLoading(true);
        fetchData();
        if (feed !== null)
            wait(800).then(() => setIsLoading(false))
    }, []);

    const fetchData = () => {
        fetch(api_url + "/api/shop", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((re) => re.json())
            .then((re) => {
                setFeed(re[0]);
                setBrands(re[1]);
            })
            .catch(error => console.error(error));
    }

    return (
        <View style={styles.container}>
            {(isLoading && !refreshing) ? (<ActivityIndicator size="large" color="#0000ff" />) :
                (<FlatList data={feed}
                    keyExtractor={(item) => item.product_id}
                    numColumns={2}
                    horizontal={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => {
                                navigation.navigate("ProductScreen", {
                                    "name": item.name,
                                    "id": item.product_id
                                })
                            }}>
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
                    ListHeaderComponent={header(navigation, brands)}
                />)}
        </View>
    );
}

const header = (navigation, brands) => {
    return (
        <View style={{ marginTop: 20 }}>
            <Image
                style={styles.mainLogo}
                source={{
                    uri: "http://192.168.254.100:8000/images/logo1-1.png",
                }}
            />

            <View style={{ padding: 10, flex: 1, flexDirection: "column", justifyContent: "center", alignItems:"center" }}>
                <View style={{ position: "relative" }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search..."
                    />
                    <Ionicons name={"search-outline"} size={20} color={"black"} style={{ position: "absolute", right: 10, top: 15 }} />
                </View>
                <SelectDropdown
                    buttonStyle={{ borderWidth: 1, borderRadius: 5, height: 40, minWidth:"95%", marginTop:12 }}
                    data={brands}
                    onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    renderDropdownIcon={downIcon}
                    defaultButtonText={"Brand Name..."}
                />
            </View>
        </View >
    );
}

const downIcon = () => {
    return <Ionicons name={"chevron-down-outline"} size={20} color={"black"} />
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
        minWidth:"95%",
    },
});

export default ShopScreen;