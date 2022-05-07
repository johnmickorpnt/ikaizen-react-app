import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Ionicons from '@expo/vector-icons/Ionicons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
const api_url = "http://192.168.254.100:8000";

const CheckoutScreen = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [activeProd, setActive] = useState([]);
    const [total, setTotal] = useState();
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
    }, []);
    const fetchData = () => {
        setIsLoading(true);
        fetch(api_url + `/api/checkout`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((re) => re.json())
            .then((re) => {
                setData(re);
                setTotal(compute(re));
            })
            .catch(error => console.error(error));
    }
    useEffect(() => {
        if (data === undefined)
            return fetchData();
        setIsLoading(false);
        data.forEach(element => {
            setActive(prevArray => [...prevArray, element.isActive]);
        })
        if (data.length !== activeProd.length)
            return false;
        if (total === "undefined")
            return false;

        console.log(total);
    }, [data, total]);

    const compute = (d) => {
        let t = 0;
        for (const x of d) {
            t += parseInt(x.price.replace("₱", "").replace(",", "").replace(".00", "")) * parseInt(x.quantity);
        }
        return "₱" + t.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    const footer = (p) => {
        return (
            <View style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", width: "100%", alignItems: "center", marginTop:"auto"}}>
                <View style={{ width: "100%", paddingHorizontal: 15, marginVertical: 5 }}>
                    <Text style={{ textAlign: "right", width: "100%" }}>
                        SUBTOTAL: {"\n"}
                        <Text style={{ fontWeight: "bold", color: "#FF1818", fontSize: 21 }}>
                            {total}
                        </Text>
                    </Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => { console.log("PA ORDER") }}>
                    <Text style={{ color: "white" }}>
                        Place Order
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            {(isLoading && !refreshing) ? (
                (<ActivityIndicator size="large" color="#0000ff" />)
            ) : ((refreshing) ? (<ActivityIndicator size="large" color="#0000ff" />) : (
                <View>
                    <FlatList data={data}
                        keyExtractor={(item) => item.product_id}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity style={{ display: "flex", flexShrink: 1, flex: 1, maxHeight: "90%" }}>
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
                                </View>
                            </TouchableOpacity>
                        )}
                        ListFooterComponent={footer}
                        ItemSeparatorComponent={separator}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh} />
                        } />
                </View>
            ))}
        </SafeAreaView>
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
        width: "90%",
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
});

export default CheckoutScreen;