import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, Dimensions, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
const api_url = "http://13.229.234.249";
import Dialog, { DialogContent } from 'react-native-popup-dialog';

const CancelForm = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [ids, setIds] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [details, setDetails] = useState();
    const [credentials, setCredentials] = useState();
    const [order] = useState(route.params.id);
    const [errorMsg, setErrorMsg] = useState();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [error, setError] = useState(false);
    const [reasons, setReasons] =
        useState(["Change of delivery address", "Change of Contact Number",
            "I don't want the iteam anymore",
            "I decided for an alternative product",
            "Change/combine order",
            "Duplicate order"]);

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
        wait(1000).then(() => {
            fetchData();
            setRefreshing(false);
        });
    }, [data]);

    const fetchData = () => {
        setIsLoading(true);
        if (credentials === undefined) return retrieve();
        fetch(`${api_url}/api/user/orders/${order}/cancel`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .then((re) => re.json())
            .then((re) => {
                setData((re.length > 0) ? (re[0]) : (0));
                setIds(re[1]);
            })
            .catch(error => console.error(error));
    }

    const requestCancel = async () => {
        setIsLoading(true);
        console.log("SAVING IN");
        setError(false);
        // let t = {
        //     "ratings[]": ratings,
        //     "feedBack[]": feedback,
        //     "ids[]": ids
        // };
        
        var formBody = [];

        // for (var property in t) {
        //     var encodedKey = encodeURIComponent(property);
        //     var encodedValue = encodeURIComponent(t[property]);
        //     formBody.push(encodedKey + "=" + encodedValue);
        // }
        // formBody = formBody.join("&");
        // let response = await fetch(`${api_url}/api/user/orders/${order}/review`, {
        //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
        //     headers: {
        //         'Accept': 'application/x-www-form-urlencoded',
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Authorization': `Bearer ${credentials.token}`
        //     },
        //     body: formBody
        // });
        // if (response.status === 200) {
        //     setDialogVisible(true);
        // }
        // setIsLoading(false);

    }

    useEffect(() => {
        if (data === undefined)
            return fetchData();




        setIsLoading(false);

    }, [data, credentials]);

    const header = () => {
        return (
            <View>
                <Text style={{ fontSize: 23, fontWeight: "bold", textAlign: "center", marginTop: 30 }}>
                    Cancel order
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "500", textAlign: "center" }}>
                    Before we cancel your order, please let us know why.
                </Text>
            </View>
        );
    }

    const footer = () => {
        return (
            <View style={{ flex: 1, flexDirection: "column", flexGrow: 1, alignItems: "center", padding: 12, width: "100%" }}>
                <TouchableOpacity style={styles.plainBtn}
                    onPress={() => navigation.navigate("OrdersScreen")}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    onPress={requestCancel}>
                    <Text style={{ color: "white" }}>Submit request to cancel</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Dialog
                containerStyle={{ padding: 50 }}
                visible={dialogVisible}
                onTouchOutside={() => {
                    setDialogVisible(false)
                    navigation.navigate("OrdersScreen");
                }}
                dialogTitle={<View style={{ paddingHorizontal: 50, paddingVertical: 10 }}><Text style={{ fontWeight: "bold", fontSize: 24 }}>Review Saved</Text></View>}
            >
                <DialogContent>
                    <Text>Your feedback has been recorded. Thank you for choosing I-Kaizen!</Text>
                </DialogContent>
            </Dialog>
            {(isLoading && !refreshing) ? (
                (<ActivityIndicator size="large" color="#0000ff" />)
            ) : ((refreshing || (data === "undefined")) ? (<ActivityIndicator size="large" color="#0000ff" />) :
                (
                    (data !== 0) ? (
                        <FlatList data={data}
                            keyExtractor={(item) => item.product_id}
                            renderItem={({ item, index }) => (
                                <View style={{ width: Dimensions.get('screen').width, flex: 1, flexShrink: 1 }}>
                                    <View style={{ width: "100%", flex: 1, flexDirection: "row", padding: 15, alignItems: "center", flexWrap: "wrap" }}>
                                        <Image
                                            style={{ width: 70, height: 70 }}
                                            source={{
                                                uri: api_url + "/storage/images/" + item.prod_image,
                                            }}
                                        />
                                        <Text style={{ marginLeft: 10 }} numberOfLines={2}>{item.name}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center" }}>
                                        <View style={{ width: "100%", flex: 1, alignItems: "center" }}>
                                            <View style={{ flexShrink: 1, width: Dimensions.get('screen').width, padding: 15, justifyContent: "center", alignItems: "center" }}>
                                                <SelectDropdown
                                                    buttonStyle={{ borderWidth: 1, borderRadius: 5, height: 40, width: "100%" }}
                                                    data={reasons}
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
                                                    defaultButtonText={"Reasons for cancelling"}
                                                />
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder='Please tell us why you are cancelling this order.'
                                                    multiline={true}
                                                    numberOfLines={4}
                                                    value={details}
                                                    onChangeText={(newText) => (setDetails(newText))}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                            }
                            ListHeaderComponent={header}
                            ListFooterComponent={footer}
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

const downIcon = () => {
    return <Ionicons name={"chevron-down-outline"} size={20} color={"black"} />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 1,
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
        width: "100%",
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    plainBtn: {
        margin: 5,
        width: "100%",
        height: 40,
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
    },
    input: {
        margin: 5,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: "100%"
    },
});


export default CancelForm;