import { StyleSheet, Text, View, Alert, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
const api_url = "https://ikaizenshop.herokuapp.com";

const Orders = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeProd, setActive] = useState([]);
    const [temp, setTemp] = useState([]);
    const [credentials, setCredentials] = useState();
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    async function retrieve() {
        let result = await SecureStore.getItemAsync("credentials")
        try {
            setCredentials(JSON.parse(result));
        } catch (error) {
            console.log("ERROR:", error);
        }
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setActive([]);
        setTemp([]);
        wait(1000).then(() => {
            retrieve().then(() => fetchData());
            setRefreshing(false);
        });
    }, [data]);
    const fetchData = () => {
        if (credentials === undefined) return retrieve();
        setIsLoading(true);
        fetch(`${api_url}/api/user/orders`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .then((re) => re.json())
            .then((re) => {
                setData((re.length > 0) ? (re) : (0));
            })
            .catch(error => console.error(error));
    }
    useEffect(() => {
        if (credentials === undefined)
            return retrieve();
        if (data === undefined)
            return fetchData();
        setIsLoading(false);
        if (data === 0) return;
        data.forEach(element => {
            setActive(prevArray => [...prevArray, element.isActive]);
        })
    }, [data, temp, credentials]);

    const header = () => {
        return (
            <Text style={{ fontSize: 23, fontWeight: "bold", textAlign: "center", marginTop: 30 }}>
                Orders Made
            </Text>
        );
    }
    const footer = () => {
        return (
            <View style={{ paddingHorizontal: 10, paddingVertical: 15, display: "flex", flex: 1, flexDirection: "row", justifyContent: "center", width: "100%", alignItems: "center" }}>
                <TouchableOpacity style={{
                    alignItems: "center",
                    padding: 10,
                    width: "50%"
                }}>
                    <Text style={{ textAlign: "center", width: "100%" }}>
                        Continue Shopping
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate("CheckoutScreen") }}>
                    <Text style={{ color: "white" }}>
                        Proceed to checkout
                    </Text>
                    <Ionicons name={"arrow-forward-circle-outline"} size={25} style={{ marginLeft: "auto", color: "white" }} />
                </TouchableOpacity>
            </View>
        );
    }
    const check = (o) => {
        setTemp(prevArr => [...prevArr, o]);
    }
    return (
        <View style={styles.container}>
            {(isLoading && !refreshing) ? (
                (<ActivityIndicator size="large" color="#0000ff" />)
            ) : ((refreshing || (data === "undefined")) ? (<ActivityIndicator size="large" color="#0000ff" />) :
                (
                    (data !== 0) ? (
                        <FlatList data={data}
                            extraData={temp}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={{ display: "flex", flexShrink: 1, flex: 1, maxHeight: "90%" }}
                                    onLayout={() => check(item.order_number)}
                                >
                                    <View style={styles.row}>
                                        <View style={{ width: 100 }}>
                                            <Image
                                                style={styles.logo}
                                                source={{
                                                    uri: api_url + "/storage/images/" + item.prod_image,
                                                }}
                                            />
                                        </View>
                                        <View style={{ marginHorizontal: 5, flexGrow: 1, width: "70%" }}>
                                            <Text numberOfLines={2}>{item.name}</Text>
                                            <Text>x{item.quantity}</Text>
                                            <Text style={{ fontWeight: "bold", color: "#FF1818" }}></Text>
                                            <Text style={{ textTransform: "capitalize" }}>{item.order_status}</Text>
                                            {
                                                (temp[index + 1 > data.length ? index : index + 1] !== item.order_number) ?
                                                    (!item.isReviewed && item.order_status === "completed" ? (
                                                        <View style={{ marginLeft: "auto", backgroundColor: "red" }}>
                                                            <TouchableOpacity style={styles.button}
                                                                onPress={() => {
                                                                    navigation.navigate("ReviewsScreen", { "id": item.order_id })
                                                                }}
                                                            >
                                                                <Text style={{ color: "white", textAlign: "center", width: "100%" }}>
                                                                    Review
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    ) :
                                                        (item.order_status === "processing" ?
                                                            (<View style={{ marginLeft: "auto" }}>
                                                                <TouchableOpacity style={styles.cancelBtn}
                                                                    onPress={() => navigation.navigate("CancelScreen", {id:item.order_id})}
                                                                >
                                                                    <Text style={{ color: "black", textAlign: "center", width: "100%" }}>
                                                                        Cancel
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>) :
                                                            (null))) :
                                                    (null)
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                            }
                            ListHeaderComponent={header}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh} />
                            } />
                    ) : (<Text>No Orders</Text>)
                ))}
        </View>
    );
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
    logo: {
        width: "100%",
        height: 150,
        resizeMode: 'contain',
        borderRadius: 10
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
    cancelBtn: {
        alignItems: "center",
        width: "50%",
        backgroundColor: "#FFC300",
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
    },
});

export default Orders;