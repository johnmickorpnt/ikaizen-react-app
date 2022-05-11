import { StyleSheet, Text, View, Button, KeyboardAvoidingView, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import StarRating from 'react-native-star-rating';
import * as SecureStore from 'expo-secure-store';
import FadeInOut from 'react-native-fade-in-out';
const api_url = "https://8ceb-136-158-11-199.ap.ngrok.io";

const Product = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [headers, setHeaders] = useState([]);
    const [subHeaders, setSubHeaders] = useState([]);
    const [cols, setCols] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [credentials, setCredentials] = useState();
    const [response, setResponse] = useState();
    const [msg, setMsg] = useState();
    const [alertShow, setAlertShow] = useState(false);
    const [qty, setQty] = useState(1);
    const [enabled, setEnabled] = useState(true);
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
        wait(1000).then(() => {
            fetchData(route.params.id);
            setRefreshing(false);
        });
    }, []);

    const fetchData = (id) => {
        fetch(api_url + `/api/product/${id}`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((re) => re.json())
            .then((re) => {
                // console.log(re[0]);
                setData(re[0]);
                setReviews(re[1]);
            })
            .catch(error => console.error(error));
    }
    const addToCart = (id) => {
        setIsLoading(true);
        setAlertShow(false);
        setResponse();
        if (qty === "" || qty === undefined) {
            setAlertShow(true);
            return setResponse("No input quantity.");
        }
        let details = {
            "quantity": qty
        }
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch(`${api_url}/api/shop/addToCart/${id}`, {
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
                if (!re.status) return navigation.navigate("LoginScreen");
                setResponse(re.message);
                setAlertShow(true);
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        if (data === undefined)
            return fetchData(route.params.id);

        if (headers.length === 0) {
            for (const [key, val] of Object.entries(JSON.parse(data.description)))
                setHeaders(prevArray => [...prevArray, key]);
            return;
        }
        if (cols.length === 0) {
            for (const [key, val] of Object.entries(JSON.parse(data.description))) {
                setCols(prevArray => [...prevArray, val]);
            }
            return;
        }
        if (subHeaders.length === 0 && cols.length !== 0) {
            cols.forEach((element, index) => {
                if (typeof element !== "object") return console.log(element);
                setSubHeaders(prevArray => [...prevArray, t(element)]);
            });
        }
        if (credentials === undefined)
            return retrieve();
        if (response !== undefined)
            console.log(response);

        if (alertShow) {
            return wait(1500).then(() => setAlertShow(false));
        }
        if (isLoading)
            setIsLoading(false);

    }, [data, headers, cols, subHeaders, response, qty, alertShow]);
    let t = (i) => {
        if (typeof i !== "object") return i;
        for (const [key, val] of Object.entries(i)) {
            return key;
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    let comp = (t, i, key) => {
        return (
            <View key={i}>
                <Text style={{ fontWeight: "bold", paddingHorizontal: 10 }}>{t.toUpperCase()}</Text>
                <Text style={{ marginLeft: 15, textAlign: "justify", paddingHorizontal: 15, textTransform: "capitalize" }}>{(typeof cols[i] === "object") ? (y(cols[i])) : (cols)}</Text>
            </View>
        );
    }
    let y = (e) => {
        let str = "";
        for (const [k, v] of Object.entries(e)) {
            str += `${replaceAll(k, "_", " ")} : ${v}\n`
        }
        return str;
    }
    return (
        <SafeAreaView style={styles.container}>
            {
                (data !== undefined)
                    ?
                    (
                        <View>
                            <ScrollView
                                contentContainerStyle={styles.scrollView}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }
                            >
                                <Image
                                    style={styles.logo}
                                    source={{
                                        uri: api_url + "/storage/images/" + data.prod_image,
                                    }}
                                />
                                <View style={{ flex: 1, flexDirection: "column" }}>
                                    <Text style={{ fontSize: 21, fontWeight: "bold", margin: 5 }}>{data.name}</Text>
                                    {
                                        (data.discount_pct !== null && data.discount_pct !== "null") ?
                                            (
                                                <View style={{ flex: 1, flexDirection: "column", alignItems: "flex-end" }}>
                                                    <Text style={{
                                                        fontSize: 25, color: "#FF1818", textAlign: "right", marginLeft: "auto",
                                                        paddingRight: 18
                                                    }}>
                                                        {discounted(parseInt(data.price.replace(",", "").replace(".00", "").replace("₱", "")))}
                                                    </Text>
                                                    <Text style={{ paddingHorizontal: 18 }}>
                                                        <Text style={{ fontSize: 16, textDecorationLine: "line-through", color: "gray" }}>{data.price}</Text>
                                                        <Text style={{ fontSize: 16, color: "#FF1818" }}> -{data.discount_pct * 100}%</Text>
                                                    </Text>
                                                </View>
                                            ) :
                                            (
                                                <Text style={{ fontSize: 25, color: "#FF1818", textAlign: "right" }}>
                                                    {data.price}
                                                </Text>
                                            )
                                    }
                                    <View>
                                        {(cols !== null && cols.length !== 0) ? (
                                            headers.map((value, index, key) => {
                                                return ((typeof cols === "object") ? (comp(value, index, key)) : (cols))
                                            })
                                        ) : (null)}
                                        <View style={{ marginVertical: 5, paddingEnd: 5 }}>
                                            {(reviews.length <= 0) ?
                                                (
                                                    <Text>
                                                        No reviews
                                                    </Text>
                                                ) :
                                                (
                                                    reviews.map((v, i) => {
                                                        return (
                                                            <View style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "flex-start", marginVertical: 5 }} key={i}>
                                                                <View style={{ width: "25%", paddingHorizontal: 10 }}>
                                                                    <Text style={{ fontSize: 14, marginTop: 3, fontWeight: "bold" }}>{replaceAll(replaceAll(replaceAll(replaceAll(replaceAll(v.user.name, "Dr.", ""), "Prof.", ""), "Mrs.", ""), "Ms.", ""), "Mr.", "").substr(0, v.user.name.indexOf(" ") + 2).trim()}.</Text>
                                                                </View>
                                                                <View style={{ flexShrink: 1, paddingHorizontal: 15, width: "100%", display: "flex", justifyContent: "flex-start" }}>
                                                                    <StarRating
                                                                        containerStyle={{ width: "100%", justifyContent: "center" }}
                                                                        starStyle={{ marginHorizontal: 3 }}
                                                                        starSize={25}
                                                                        disabled={true}
                                                                        maxStars={5}
                                                                        rating={v.rating}
                                                                        fullStarColor={'red'}
                                                                        emptyStarColor={'red'}
                                                                    />
                                                                    <Text style={{ textAlign: "left" }}>
                                                                        {v.comment}
                                                                    </Text>
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        borderBottomColor: 'black',
                                                                        borderBottomWidth: 1,
                                                                        opacity: 0.2
                                                                    }}
                                                                />
                                                            </View>
                                                        );
                                                    })
                                                )
                                            }
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={{ display: "flex", flex: 1, flexDirection: "row", minHeight: 50, width: "100%", flexGrow: 1, justifyContent: "center", paddingHorizontal: 15, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.01)" }}>
                                <TouchableOpacity style={styles.button} onPress={() => {
                                    setAlertShow(false);
                                    addToCart(data.product_id)
                                }}>
                                    <Text style={{ color: "white" }}>Add to cart</Text>
                                </TouchableOpacity>
                                <TextInput style={{ paddingHorizontal: 5, height: 40, width: "15%" }} placeholder="QTY" keyboardType='numeric'
                                    defaultValue={qty.toString()}
                                    value={qty.toString()}
                                    onChangeText={(newQty) => setQty(newQty)}
                                />
                            </View>

                            <FadeInOut visible={alertShow} duration={500} useNativeDriver={true} style={{ position: "absolute", top: 1, width: "100%", minHeight: "10%", padding: 5, display: "flex", justifyContent: "center" }}>
                                <View style={response !== undefined || response !== "" ? (styles.warning) : styles.success}>
                                    <Text style={response !== undefined ? (styles.warningTxt) : styles.success}>
                                        {response !== undefined ? (response) : ("Item added to cart!")}
                                    </Text>
                                </View>
                            </FadeInOut>
                        </View>
                    ) :
                    (<ActivityIndicator size="large" color="#0000ff" />)
            }
        </SafeAreaView>
    );
}

var discounted = (price) => {
    return "₱" + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const styles = StyleSheet.create({
    success: {
        width: "100%", backgroundColor: "#FFC300", padding: 8
    },
    warning: {
        width: "100%", backgroundColor: "#FF1818", padding: 8
    },
    warningTxt: {
        textAlign: "center", color: "white", fontSize: 16
    },
    successTxt: {
        textAlign: "center", color: "black", fontSize: 16
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1
    },
    logo: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        resizeMode: "contain"
    },
    button: {
        margin: 5,
        width: "90%",
        height: 40,
        alignItems: "center",
        backgroundColor: "#FF1818",
        padding: 10,
        borderRadius: 5
    },
    mainLogo: {
        backgroundColor: "#FFC300",
        marginVertical: 15,
        width: "100%",
        height: 100,
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

export default Product;