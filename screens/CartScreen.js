import { StyleSheet, Text, View, Button, Alert, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as SecureStore from 'expo-secure-store';
import { SwipeListView } from 'react-native-swipe-list-view';
const api_url = "http://192.168.254.100:8000";

const CartScreen = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeProd, setActive] = useState([]);
    const [credentials, setCredentials] = useState();
    async function retrieve() {
        let result = await SecureStore.getItemAsync("credentials")
        try {
            setCredentials(JSON.parse(result));
        } catch (error) {
            console.log("ERROR:", error);
        }
    }
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setActive([]);
        wait(1000).then(() => {
            fetchData();
            setRefreshing(false);
        });
    }, [credentials]);
    const fetchData = () => {
        console.log(credentials.token)
        setIsLoading(true);
        fetch(api_url + `/api/cart/`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .then((re) => re.json())
            .then((re) => {
                setData(re);
            })
            .catch(error => console.error(error));
    }

    const deleteProduct = (data) => {
        let id = data.item.product_id;
        fetch(`${api_url}/api/cart/delete/${id}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .then((re) => re.json())
            .then((re) => {
                console.log(re);
                // setIsLoading(true);
                setData(re);
            })
            .catch(error => console.error(error));
    }
    useEffect(() => {

        if (credentials === undefined)
            return retrieve();

        if (data === undefined)
            return fetchData();

        setIsLoading(false);
        data.forEach(element => {
            setActive(prevArray => [...prevArray, element.isActive]);
        })
        if (data.length !== activeProd.length)
            return;
        activeProd.forEach(element => {
            console.log(element)
        });
    }, [credentials, data, navigation]);


    const footer = () => {
        return (
            <View style={{ paddingHorizontal: 10, paddingVertical: 15, display: "flex", flex: 1, flexDirection: "row", justifyContent: "center", width: "100%", alignItems: "center" }}>
                <TouchableOpacity style={{
                    alignItems: "center",
                    padding: 10,
                    width: "50%"
                }}
                    onPress={() => { navigation.navigate("Shop") }}>
                    <Text style={{ textAlign: "center", width: "100%" }}>
                        Continue Shopping
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => {
                    Alert.alert(
                        "Confirm Checkout",
                        "Continue to checkout with selected products?",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => navigation.navigate("CheckoutScreen") }
                        ]
                    );
                }}
                >
                    <Text style={{ color: "white" }}>
                        Proceed to checkout
                    </Text>
                    <Ionicons name={"arrow-forward-circle-outline"} size={25} style={{ marginLeft: "auto", color: "white" }} />
                </TouchableOpacity>
            </View>
        );
    }
    const active = (id, index) => {
        if (active[index] === "undefined") return false;
        console.log(id)
        setActive([]);
        setIsLoading(true);
        fetch(api_url + `/api/cart/active/${id}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .then((re) => re.json())
            .then((re) => {
                setData(re[0]);
                wait(300).then(() => {
                    setIsLoading(false);
                });
            })
            .catch(error => console.error(error));
    }
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };
    return (
        <View style={styles.container}>
            {(isLoading && !refreshing) ? (
                (<ActivityIndicator size="large" color="#0000ff" />)
            ) : ((refreshing || (data === "undefined")) ? (<ActivityIndicator size="large" color="#0000ff" />) :
                (data !== undefined && data.length !== 0) ? (<SwipeListView data={data}
                    contentContainerStyle={{ backgroundColor: "white" }}
                    keyExtractor={(item) => item.product_id}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity style={{ display: "flex", flexShrink: 1, flex: 1, justifyContent: "center", maxHeight: "90%", backgroundColor: "white" }}
                            disabled={(parseInt(item.stocks) > 0) ? (false) : (true)}
                            activeOpacity={1}>
                            {(item.stocks > 0) ?
                                (
                                    <View style={styles.row}>
                                        <View style={{ width: 100 }}>
                                            <Image
                                                style={styles.logo}
                                                source={{
                                                    uri: api_url + "/storage/images/" + item.prod_image,
                                                }}
                                            />
                                        </View>
                                        <View style={{ flexShrink: 1, marginHorizontal: 5 }}>
                                            <Text numberOfLines={2}>{item.name}</Text>
                                            <Text>x{item.quantity}</Text>
                                            <Text style={{ fontWeight: "bold", color: "#FF1818" }}>{subTotal(item.price, item.quantity)}</Text>
                                        </View>
                                        <View style={{ marginLeft: "auto", paddingHorizontal: 5 }}>
                                            <BouncyCheckbox
                                                size={25}
                                                isChecked={((activeProd[index] === 1) ? (true) : (false))}
                                                fillColor={"red"}
                                                onPress={() => {
                                                    active(item.product_id, index)
                                                }}
                                                disableBuiltInState
                                            />
                                        </View>
                                    </View>
                                ) :
                                (
                                    <View style={styles.disabled}>
                                        <Text style={{ color: "white", fontSize: 21, position: "absolute", zIndex: 1, textAlign: "center", width: "100%", fontWeight: "bold" }}>OUT OF STOCK</Text>
                                        <View style={styles.row}>
                                            <View style={{ width: 100 }}>
                                                <Image
                                                    style={styles.logoDisabled}
                                                    source={{
                                                        uri: api_url + "/storage/images/" + item.prod_image,
                                                    }}
                                                />
                                            </View>
                                            <View style={{ flexShrink: 1, marginHorizontal: 5 }}>
                                                <Text numberOfLines={2}>{item.fasf}</Text>
                                                <Text>x{item.quantity}</Text>
                                                <Text style={{ fontWeight: "bold", color: "#FF1818" }}>{subTotal(item.price, item.quantity)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }
                        </TouchableOpacity>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                            <View style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 12, width: "40%" }}>
                                <View style={{
                                    display: "flex", flexDirection: "row", margin: 5, justifyContent: "center", alignItems: "center", width: "100%"
                                }}>
                                    <TouchableOpacity style={{ width: "25%", height: "100%", display: "flex", flexDirection: "row", alignItems: "center", marginHorizontal: 1 }}>
                                        <Ionicons name={"remove"} size={30} color={"black"} />
                                    </TouchableOpacity>
                                    <TextInput placeholder='QTY' style={{ padding: 12, borderWidth: 1, borderRadius: 5, width: "50%", height: "100%" }} keyboardType={"numeric"} />
                                    <TouchableOpacity style={{ width: "25%", height: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginHorizontal: 1 }}>
                                        <Ionicons name={"add"} size={30} color={"red"} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: "100%", }}>
                                    <TouchableOpacity style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: 5 }} onPress={() => deleteProduct(data)}>
                                        <Ionicons name={"trash"} size={40} color={"red"} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    disableRightSwipe={true}
                    leftOpenValue={75}
                    rightOpenValue={-170}
                    ItemSeparatorComponent={separator}
                    ListFooterComponent={footer(navigation)}
                    // ListHeaderComponent={header}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh} />
                    } />) : (
                    <View>
                        <Text style={{ fontSize: 16 }}>
                            Welp, looks like your Cart is empty.
                        </Text>
                        <TouchableOpacity style={{ padding: 15, backgroundColor: "red", borderRadius: 5 }}
                            onPress={() => navigation.navigate("ShopScreen")}>
                            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>SHOP NOW!</Text>
                        </TouchableOpacity>
                    </View>
                ))}
        </View>
    );
}
let subTotal = (p, q) => {
    let price = parseInt(p.replace("₱", "").replace(",", "").replace(".00", "")) * q;
    return "₱" + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

const separator = () => {
    return (
        <View
            style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
                opacity: 0.2
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    actionBtns: {
        backgroundColor: "red",
        height: "100%",
        display: "flex",
        justifyContent: "center",
    },
    disabled: {
        backgroundColor: "gray",
        display: "flex",
        flex: 1,
        flexShrink: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 15
    },
    logo: {
        width: "100%",
        height: 150,
        resizeMode: 'contain',
        borderRadius: 10
    },
    logoDisabled: {
        width: "100%",
        height: 150,
        resizeMode: 'contain',
        borderRadius: 10,
        opacity: .1
    },
    row: {
        display: "flex",
        flex: 1,
        flexShrink: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 15
    },
    rowContainer: {
        borderRadius: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        maxHeight: "50%",
        margin: 0,
        backgroundColor: "red"
    },
    button: {
        alignItems: "center",
        backgroundColor: "#FF1818",
        width: "50%",
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    smButton: {
        alignItems: "center",
        backgroundColor: "red",
        width: "45%",
        padding: 8,
        flexGrow: 1,
        borderRadius: 5,
        justifyContent: "flex-start",
        display: "flex",
        flexDirection: "row",

    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
    },
});

export default CartScreen;