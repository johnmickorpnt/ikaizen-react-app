import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
const api_url = "http://192.168.254.100:8000";

const UserInfo = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [activeProd, setActive] = useState([]);
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
        fetch(api_url + `/api/user/201`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((re) => re.json())
            .then((re) => {
                setData(re);
            })
            .catch(error => console.error(error));
    }
    useEffect(() => {
        if (data === undefined)
            return fetchData();
        setIsLoading(false);

    }, [data]);
    return (
        <SafeAreaView style={styles.container}>
            {
                (data !== undefined)
                    ?
                    (
                        <View style={{ flexGrow: 1 }}>
                            <ScrollView
                                contentContainerStyle={styles.scrollView}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }
                            >
                                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", flexGrow: 1, alignItems: "center", padding: 50, height: "100%" }}>
                                    <Image
                                        style={styles.logo}
                                        source={{
                                            uri: "https://i.pravatar.cc/300",
                                        }}
                                    />
                                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                                        {data.name}
                                    </Text>
                                    <Text style={{ fontSize: 16 }}>
                                        {data.email}
                                    </Text>
                                    <View style={{ marginTop: 15, width: "100%" }}>
                                        <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate("OrdersScreen")}>
                                            <Text style={{ color: "white" }}>My orders</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddressScreen")}>
                                            <Text style={{ color: "white", fontWeight: "900" }}>
                                                Address Book
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.button}>
                                            <Text style={{ color: "white", fontWeight: "900" }}>Logout</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View >
                    ) :
                    (<ActivityIndicator size="large" color="#0000ff" />)
            }
        </SafeAreaView >
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

export default UserInfo;