import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import * as SecureStore from 'expo-secure-store';
const api_url = "https://8ceb-136-158-11-199.ap.ngrok.io";

const CheckoutScreen = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeProd, setActive] = useState([]);
    const [total, setTotal] = useState();
    const [addresses, setAddresses] = useState();
    const [activeAddStr, setActiveAddStr] = useState();
    const [activeAddress, setActiveAddress] = useState();
    const [credentials, setCredentials] = useState();
    const [shippingFee, setShippingFee] = useState(59);
    const [notes, setNotes] = useState("");
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
        wait(1000).then(() => {
            setData();
            setRefreshing(false);
        });
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        fetch(api_url + `/api/checkout`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .then((re) => re.json())
            .then((re) => {
                setData(re[0]);
                setAddresses(re[1]);
                setActiveAddStr(re[3]);
                setActiveAddress(re[4][0]);
                console.log(re[4])
                setTotal(compute(re[0]));
            })
            .catch(error => console.error(error));
    }

    const placeOrder = () => {
        // setIsLoading(true);
        let details = {
            "addressId": activeAddress,
            "notes": notes
        }
        console.log(details);
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch(`${api_url}/api/placeOrder`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${credentials.token}`
            },
            body: formBody
        })
            .then((re) => re.json())
            .then((re) => {
                // if (!re.status) return navigation.navigate("LoginScreen");
                navigation.navigate("Profile", {screen: "UserInfo"})
                // setResponse(re.message);
                // console.log("NICE!")
                // setAlertShow(true);
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
            return false;
        if (total === "undefined")
            return false;
        if (addresses === "undefined")
            return false;

    }, [data, total, credentials]);

    const compute = (d) => {
        let t = 0;
        for (const x of d) {
            t += parseInt(x.price.replace("₱", "").replace(",", "").replace(".00", "")) * parseInt(x.quantity);
        }
        return "₱" + (t + shippingFee).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    const header = () => {
        return (
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                {addresses !== 'undefined' && addresses.length >= 1 ?
                    (<View style={{ padding: 12, display: "flex", alignItems: "center" }}>
                        <Text style={{ fontSize: 18, textAlign: "center", fontWeight: "bold" }}>Your order will be delivered at:</Text>
                        <Text>
                            {activeAddStr}
                        </Text>

                    </View>) :
                    (
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate("AddressList")}>
                            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                                No Address. Please go to your profile and add a delivery address.
                            </Text>
                        </TouchableOpacity>
                    )
                }
            </View >
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
                        ListFooterComponent={
                            <>
                                <View>
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 5 }}>
                                        <View style={{ width: "100%", paddingHorizontal: 15, marginVertical: 5 }}>
                                            <Text style={{ textAlign: "right", width: "100%" }}>
                                                SUBTOTAL: {"\n"}
                                                <Text style={{ fontWeight: "bold", color: "#FF1818", fontSize: 21 }}>
                                                    {total}
                                                </Text>
                                            </Text>
                                            <TextInput placeholder='Notes...' style={{ borderWidth: 1, padding: 10, borderRadius: 5, width: "100%" }}
                                                defaultValue={notes}
                                                value={notes}
                                                onChangeText={newText => setNotes(newText)}
                                            />
                                        </View>
                                        <TouchableOpacity style={(addresses.length >= 1) ? (styles.button) : (styles.disabledButton)}
                                            onPress={() => placeOrder()}
                                            disabled={(addresses.length >= 1) ? (false) : (true)}>
                                            <Text style={{ color: "white" }}>
                                                Place Order
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        }
                        ListFooterComponentStyle={{ flex: 1, justifyContent: "flex-end" }}
                        ListHeaderComponent={header}
                        ItemSeparatorComponent={separator}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh} />
                        }
                    />
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

    disabledButton: {
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