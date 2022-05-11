import { StyleSheet, Text, View, Button, Animated, FlatList, TouchableHighlight, Image, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown'
import * as SecureStore from 'expo-secure-store';
import FadeInOut from 'react-native-fade-in-out';
const api_url = "http://192.168.254.100:8000";
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const ShopScreen = ({ navigation, route }) => {
    const [feed, setFeed] = useState();
    const [filteredData, setFilteredData] = useState();
    const [brands, setBrands] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [text, setText] = useState('');
    const [response, setResponse] = useState();
    const [credentials, setCredentials] = useState();
    const [alertShow, setAlertShow] = useState(false);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    async function retrieve() {
        let result = await SecureStore.getItemAsync("credentials");
        try {
            setCredentials(JSON.parse(result));
        } catch (error) {
            console.log("ERROR:", error);
        }
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1500).then(() => {
            if (text !== undefined && text.trim().length > 0) return search();
            fetchData();
            setRefreshing(false);
        });
    }, []);

    useEffect(async () => {
        // Update the document title using the browser API
        if (credentials === undefined)
            return retrieve();
        if (feed === undefined)
            return fetchData();
        if (alertShow) {
            return wait(1500).then(() => setAlertShow(false));
        }
    }, [credentials, response, alertShow]);

    const search = async () => {
        if (text.trim() === "") return fetchData();
        setIsLoading(true);
        let failed = false;
        let msg = "";
        const response = await fetch(`${api_url}/api/shop/search/${text}`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
        }).catch(error => console.error(error))
        const data = await response.json().catch(error => {
            failed = true;
            msg = error
        });
        if (failed && response.status === 200) {
            search();
            return console.log("ERROR");
        }
        if (failed && response.status !== 200) {
            return console.log("DIFFERENT ERROR!", msg, response.status)
        }
        setFilteredData(1);
        setFeed(data);
        setIsLoading(false);
        setRefreshing(false);
        setFilteredData(0);
    }
    const addToCart = (id) => {
        setAlertShow(false);
        fetch(`${api_url}/api/shop/addToCart/${id}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .then((re) => re.json())
            .then((re) => {
                if (!re.status) return navigation.navigate("LoginScreen");
                setResponse(re.message);
                setAlertShow(true);
            })
            .catch(error => console.error(error));
    }
    const fetchData = async () => {
        setIsLoading(true);
        console.log(`${api_url}/api/shop`);
        const response = await fetch(`${api_url}/api/shop`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
            },
        })
            .catch(error => console.error(error))
        console.log(response.status);
        let failed = false;
        let msg = "";
        const data = await response.json().catch(error => {
            failed = true;
            msg = error
        });
        if (failed && response.status === 200) {
            fetchData();
            return console.log("ERROR");
        }
        if (failed && response.status !== 200) {
            return console.log("DIFFERENT ERROR!", response.status)
        }

        setFeed(data.products);
        setBrands(data.brands);
        setIsLoading(false);

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
                <View style={{ padding: 10, flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ position: "relative" }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={newText => setText(newText)}
                            defaultValue={text}
                            placeholder="Search..."
                            returnKeyType='search'
                            onEndEditing={search}
                        />
                        <Ionicons name={"search-outline"} size={20} color={"black"} style={{ position: "absolute", right: 10, top: 15 }} />
                    </View>
                    <View style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12 }}>
                        <View style={{ width: "90%" }}>
                            <SelectDropdown
                                buttonStyle={{ borderWidth: 1, borderRadius: 5, height: 40, width: "100%" }}
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
                        <TouchableOpacity style={{ backgroundColor: "rgba(200,0,0,0.8)", height: 40, flex: 1, alignItems: "center", justifyContent: "center", marginLeft: 5, borderRadius: 5 }}>
                            <Ionicons name={"checkmark"} color={"white"} size={18} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        );
    }
    return (
        <View style={styles.container}>
            {(isLoading && !refreshing) ? (<ActivityIndicator size="large" color="#0000ff" />) :
                (feed !== "undefined" || feed !== undefined) ? (
                    (<FlatList data={feed}
                        extraData={filteredData}
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
                                    <TouchableOpacity style={styles.button} onPress={() => {
                                        setAlertShow(false);
                                        addToCart(item.product_id)
                                    }}>
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
                    />)) : (<ActivityIndicator size="large" color="#0000ff" />)
            }

            <FadeInOut visible={alertShow} duration={500} useNativeDriver={true} style={{ position: "absolute", bottom: 1, width: "100%", height:"10%", padding: 5, display:"flex", justifyContent:"center"}}>
                <View style={{ width: "100%", backgroundColor: "#FFC300", padding:8 }}>
                    <Text style={{ textAlign: "center", color: "black", fontSize:16 }}>
                        Item added to cart!
                    </Text>
                </View>
            </FadeInOut>
        </View>
    );
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
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
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        minWidth: "95%",
    },
});

export default ShopScreen;