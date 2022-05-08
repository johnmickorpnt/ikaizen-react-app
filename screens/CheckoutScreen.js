import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
const api_url = "http://192.168.254.100:8000";

const CheckoutScreen = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [activeProd, setActive] = useState([]);
    const [total, setTotal] = useState();
    const [addresses, setAddresses] = useState();
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
                setData(re[0]);
                setAddresses(re[1]);
                setTotal(compute(re[0]));
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
        if (addresses === "undefined")
            return false;

    }, [data, total]);

    const compute = (d) => {
        let t = 0;
        for (const x of d) {
            t += parseInt(x.price.replace("₱", "").replace(",", "").replace(".00", "")) * parseInt(x.quantity);
        }
        return "₱" + t.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    const header = () => {
        return (
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                {addresses !== 'undefined' && addresses.length >= 1 ?
                    (<SelectDropdown
                        buttonStyle={{ borderWidth: 1, borderRadius: 5, height: 40, minWidth: "95%", marginTop: 12 }}
                        data={addresses}
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
                        defaultButtonText={"Address..."}
                    />) :
                    (<Text style={{ fontWeight: "bold", fontSize: 16 }}>No Address. Please go to your profile and add a delivery address.</Text>)
                }
            </View>
        );
    }
    const downIcon = () => {
        return <Ionicons name={"chevron-down-outline"} size={20} color={"black"} />
    }
    const footer = (p) => {
        return (
            <View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 5 }}>
                    <View style={{ width: "100%", paddingHorizontal: 15, marginVertical: 5 }}>
                        <Text style={{ textAlign: "right", width: "100%" }}>
                            SUBTOTAL: {"\n"}
                            <Text style={{ fontWeight: "bold", color: "#FF1818", fontSize: 21 }}>
                                {total}
                            </Text>
                        </Text>
                    </View>
                    <TouchableOpacity style={(addresses.length>=1) ? (styles.button) : (styles.disabledButton)}
                        onPress={() => { console.log("PA ORDER") }}
                        disabled={(addresses.length>=1) ? (false) : (true)}>
                        <Text style={{ color: "white" }}>
                            Place Order
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            {(isLoading && !refreshing) ? (
                (<ActivityIndicator size="large" color="#0000ff" />)
            ) : ((refreshing) ? (<ActivityIndicator size="large" color="#0000ff" />) : (
                (data !== "undefined" && data !== undefined && data.length > 0) ? (<View>
                    <FlatList data={data}
                        keyExtractor={(item) => item.product_id}
                        contentContainerStyle={{ flexGrow: 1 }}
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
                        ListFooterComponentStyle={{ flex: 1, justifyContent: "flex-end" }}
                        ListHeaderComponent={header}
                        ItemSeparatorComponent={separator}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh} />
                        } />
                </View>) : (<Text>You have no selected items in your cart.</Text>)
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
        minHeight: 40,
        maxHeight: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },

    disabledButton:{
        alignItems: "center",
        backgroundColor: 'rgba(100, 100, 100, 0.3)',
        width: "90%",
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flex: 1,
        minHeight: 40,
        maxHeight: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default CheckoutScreen;