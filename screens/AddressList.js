import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as SecureStore from 'expo-secure-store';
import { SwipeListView } from 'react-native-swipe-list-view';
const api_url = "http://192.168.254.100:8000";
import Ionicons from '@expo/vector-icons/Ionicons';

const AddressList = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeAddress, setActiveAddress] = useState();
    const [selected, setSelected] = useState();
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
        // setActiveAddresses([]);
        wait(1000).then(() => {
            fetchData();
            setRefreshing(false);
        });
    }, []);

    const fetchData = () => {
        if (credentials === undefined) return retrieve();
        setIsLoading(true);
        fetch(api_url + `/api/user/addresses`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .then((re) => re.json())
            .then((re) => {
                setData((re.length > 0) ? (re[0]) : (0));
                setSelected(re[1]);
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        if (credentials === undefined)
            return retrieve();

        if (data === undefined)
            return fetchData();
        setIsLoading(false);
    }, [data, activeAddress, selected, credentials]);

    const save = () => {
        setSelected();
        setIsLoading(true);
        fetch(api_url + `/api/user/addresses/activate/${selected}`, {
            method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .then((re) => re.json())
            .then((re) => {
                // console.log(re[1])
                setData((re.length > 0) ? (re[0]) : (0));
                setSelected(re[1]);
                wait(700).then(() => setIsLoading(false));
            })
            .catch(error => console.error(error));
    }
    const header = () => {
        return (
            <View style={{ paddingTop: 32, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", margin:5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 24, textAlign: "center" }}>
                    Address Book 
                </Text>
                <TouchableOpacity style={{ marginLeft: "auto", display: "flex", flexDirection: "row", alignItems: "center", backgroundColor:"red", padding:8, borderRadius:5}}
                onPress={() => navigation.navigate("AddressForm", {"header":"Add an Address"})}>
                    <Text style={{fontSize:14, color:"white"}}>
                        Add an Address
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
    const footer = () => {
        return (
            <View style={{ padding: 8, display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity style={styles.button}
                    onPress={() => save()}>
                    <Text style={{ color: "white" }}>Save as default address</Text>
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            {(isLoading && !refreshing) ?
                (
                    (<ActivityIndicator size="large" color="#0000ff" />)
                ) : ((refreshing) ? (<ActivityIndicator size="large" color="#0000ff" />) :
                    ((data === 0) ?
                        (
                            <Text style={{ fontSize: 28, fontWeight: "bold" }}>No Address</Text>
                        ) :
                        (
                            <SwipeListView data={data}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity style={styles.addressRow}
                                        onPress={() => navigation.navigate("AddressForm", { id: item.id, "header":"Edit an Address" })}
                                        activeOpacity={1}
                                    >
                                        <View style={{ flex: 1, flexDirection: "row" }}>
                                            <BouncyCheckbox
                                                size={18}
                                                isChecked={((item.id === selected) ? (true) : (false))}
                                                fillColor={"black"}
                                                onPress={() => setSelected(item.id)}
                                                disableBuiltInState
                                            />
                                            <View style={{ flexShrink: 1 }}>
                                                <Text>{item.first_name} {item.last_name}</Text>
                                                <Text>{item.street_block}, {item.barangay}, {item.city}, {item.zip}</Text>
                                                <Text>{item.contact_number}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}

                                contentContainerStyle={{ flexGrow: 1, paddingVertical: 24, paddingHorizontal: 20 }}
                                ListHeaderComponent={header}
                                ListFooterComponent={footer}
                                ListFooterComponentStyle={{ flex: 1, justifyContent: "flex-end" }}
                                renderHiddenItem={(data, rowMap) => (
                                    <View style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 12, width: "40%" }}>
                                            <View style={{
                                                display: "flex", flexDirection: "row", margin: 5, justifyContent: "center", alignItems: "center", width: "100%"
                                            }}>
                                                <TouchableOpacity style={{ backgroundColor: "red", padding: 12, margin: 5, borderRadius: 5, width: "75%", height: "100%", display: "flex", justifyContent: "center" }}>
                                                    <Text style={{ color: "white", textAlign: "center" }}>
                                                        Delete
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                disableRightSwipe={true}
                                leftOpenValue={75}
                                rightOpenValue={-170}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh} />
                                } />
                        )
                    )
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1
    },
    logo: {
        width: '50%',
        height: undefined,
        aspectRatio: 1,
        resizeMode: "contain",
        borderRadius: 150 / 2,
    },
    button: {
        margin: 5,
        width: "50%",
        height: 40,
        alignItems: "center",
        backgroundColor: "#FF1818",
        padding: 10,
        borderRadius: 5
    },
    plainBtn: {
        margin: 5,
        width: "50%",
        height: 40,
        alignItems: "center",
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
        width: "100%"
    },
    input2: {
        height: 40,
        margin: 5,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: "50%"
    },
    addressRow: {
        display: "flex",
        flexShrink: 1,
        flex: 1,
        maxHeight: "90%",
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 18,
        paddingHorizontal: 8,
        backgroundColor: "white"
    }
});

export default AddressList;