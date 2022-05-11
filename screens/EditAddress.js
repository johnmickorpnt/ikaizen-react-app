import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
const api_url = "https://8ceb-136-158-11-199.ap.ngrok.io";

const EditAddress = ({ navigation, route }) => {
    const [data, setData] = useState();
    useEffect(() => {
        if (data === "undefined" || data === undefined)
            return fetchData(route.params.id);
        console.log(data);
    }, [data]);
    const fetchData = (id) => {
        fetch(api_url + `/api/user/201/addresses/edit/${id}`, {
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
    return (
        <View style={styles.container}>
            {data !== undefined ?
                (< View style={{ flex: 1, flexShrink: 1, padding: 15, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 23, fontWeight: "bold", textAlign: "center", marginTop: 30 }}>
                        Edit Address Book
                    </Text>
                    <TextInput
                        placeholder="First Name"
                        style={styles.input}
                        value={data.first_name}
                    />
                    <TextInput
                        placeholder="Last Name"
                        style={styles.input}
                        value={data.last_name}
                    />
                    <TextInput
                        placeholder="Contact Number"
                        keyboardType="numeric"
                        style={styles.input}
                        value={data.contact_number}
                    />
                    <TextInput
                        placeholder="City/Province"
                        style={styles.input}
                        value={data.city}
                    />
                    <TextInput
                        placeholder="Barangay"
                        style={styles.input}
                        value={data.barangay}
                    />
                    <TextInput
                        placeholder="Block and Lot"
                        style={styles.input}
                        value={data.street_block}
                    />
                    <TextInput
                        placeholder="Zip"
                        style={styles.input}
                        value={data.zip}
                    />
                    <View style={{flex:1, alignItems:"center", flexDirection:"row", justifyContent:"flex-end"}}>
                        <TouchableOpacity style={styles.plainBtn} onPress={() => navigation.navigate("UserInfo")}>
                            <Text>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={{ color: "white" }}>
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>)
                : (<ActivityIndicator size="large" color="#0000ff" />)
            }
        </View >
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
        borderRadius: 5,
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
        paddingHorizontal: 8
    }
});
export default EditAddress;