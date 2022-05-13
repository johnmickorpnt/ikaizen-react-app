import { StyleSheet, Text, View, Button, KeyboardAvoidingView, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
const api_url = "http://192.168.254.100:8000";

const AddressForm = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [contactNumber, setContactNumber] = useState();
    const [city, setCity] = useState();
    const [barangay, setBarangay] = useState();
    const [blockAndLot, setBlockAndLot] = useState();
    const [zip, setZip] = useState();
    const [credentials, setCredentials] = useState();
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
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
    useEffect(() => {
        if (route.params.id === undefined) return setData(0);

        if (credentials === undefined) return retrieve();

        if (data === undefined && route.params.id !== undefined)
            return fetchData(route.params.id);

        console.log(data);
        if (data !== undefined) {
            setFirstName(data.first_name !== undefined ? data.first_name : "");
            setLastName(data.last_name !== undefined ? data.last_name : "");
            setContactNumber(data.contact_number !== undefined ? data.contact_number : "");
            setCity(data.city !== undefined ? data.city : "");
            setBarangay(data.barangay !== undefined ? data.barangay : "");
            setBlockAndLot(data.street_block !== undefined ? data.street_block : "");
            setZip(data.zip !== undefined ? data.zip : "");
        }

        if (credentials.token !== undefined) console.log(credentials.token)
    }, [data, navigation, credentials]);
    const fetchData = (id) => {
        console.log(`${api_url}/api/user/address/${id}`);
        fetch(`${api_url}/api/user/address/${id}`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .then((re) => re.json())
            .then((re) => {
                console.log(re);
                setData(re);
            })
            .catch(error => console.error(error));
    }
    const validated = () => {
        setError(false);
        if (!firstName || !lastName || !contactNumber || !city || !barangay || !blockAndLot || !zip) {
            console.log("Missing inputs");
            let e = { "errors": "Missing Inputs" }
            let list = "";
            for (const [k, v] of Object.entries(e)) {
                list += `-${v}\n`;
            }
            wait(500).then(() => setLoggingIn(false));
            setError(true);
            setErrorMsg(list);
            setLoggingIn(false);
            return false;
        }
        return true;
    }
    const addAddress = async () => {
        if (!validated()) return console.log("NOT VALIDATED");
        if (credentials === undefined) return retrieve();
        let details = {
            "first_name": firstName,
            "last_name": lastName,
            "contact_number": contactNumber,
            "city": city,
            "barangay": barangay,
            "street_block": blockAndLot,
            "zip": zip,
        }
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        console.log(formBody);
        const response = await fetch(`${api_url}/api/user/add-address`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${credentials.token}`
            },
            body: formBody
        })
        const data = await response.json();
        console.log(data.errors);
        if (response.status !== 200) {
            let l = "";
            for (const [k, v] of Object.entries(data.errors)) {
                if (typeof v === "string") l += v;
                for (const [sk, sv] of Object.entries(v)) {
                    l += `-${sv}\n`;
                }
            }
            setIsLoading(false);
            setError(true);
            return setErrorMsg(l);
        }
        navigation.navigate("AddressList");
    }
    const editAddress = async () => {
        if (!validated()) return console.log("NOT VALIDATED");
        if (credentials === undefined) return retrieve();
        let details = {
            "first_name": firstName,
            "last_name": lastName,
            "contact_number": contactNumber,
            "city": city,
            "barangay": barangay,
            "street_block": blockAndLot,
            "zip": zip,
        }
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        console.log(formBody);
        const response = await fetch(`${api_url}/api/user/edit-address/${route.params.id}`, {
            method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${credentials.token}`
            },
            body: formBody
        })
        const data = await response.json();
        console.log(data.errors);
        if (response.status !== 200) {
            let l = "";
            for (const [k, v] of Object.entries(data.errors)) {
                if (typeof v === "string") l += v;
                for (const [sk, sv] of Object.entries(v)) {
                    l += `-${sv}\n`;
                }
            }
            setIsLoading(false);
            setError(true);
            return setErrorMsg(l);
        }
        navigation.navigate("AddressList");
    }
    return (
        <View style={styles.container}>
            {data !== undefined && !isLoading ?
                (<KeyboardAvoidingView style={{ flex: 1, flexShrink: 1, padding: 15, justifyContent: "center", alignItems: "center" }}>
                    <Dialog
                        containerStyle={{ padding: 50 }}
                        visible={error}
                        onTouchOutside={() => {
                            setError(false)
                        }}
                        dialogTitle={<View style={{ paddingHorizontal: 50, paddingVertical: 10 }}><Text style={{ fontWeight: "bold", fontSize: 24 }}>Registration Error</Text></View>}
                    >
                        <DialogContent>
                            <Text>Please make sure you have accomplished in the list:</Text>
                            <Text>{errorMsg}</Text>
                        </DialogContent>
                    </Dialog>
                    <Text style={{ fontSize: 23, fontWeight: "bold", textAlign: "center", marginTop: 30 }}>
                        {route.params.header}
                    </Text>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
                        <TextInput
                            placeholder="First Name"
                            style={styles.input2}
                            value={firstName !== undefined ? firstName : ""}
                            onChangeText={(newText) => setFirstName(newText)}
                        />
                        <TextInput
                            placeholder="Last Name"
                            style={styles.input2}
                            value={lastName !== undefined ? lastName : ""}
                            onChangeText={(newText) => setLastName(newText)}
                        />
                    </View>

                    <TextInput
                        placeholder="Contact Number"
                        keyboardType="numeric"
                        style={styles.input}
                        value={contactNumber !== undefined ? contactNumber : ""}
                        onChangeText={(newText) => setContactNumber(newText)}
                    />
                    <TextInput
                        placeholder="City/Province"
                        style={styles.input}
                        value={city !== undefined ? city : ""}
                        onChangeText={(newText) => setCity(newText)}
                    />
                    <TextInput
                        placeholder="Barangay"
                        style={styles.input}
                        value={barangay !== undefined ? barangay : ""}
                        onChangeText={(newText) => setBarangay(newText)}
                    />
                    <TextInput
                        placeholder="Block and Lot"
                        style={styles.input}
                        value={blockAndLot !== undefined ? blockAndLot : ""}
                        onChangeText={(newText) => setBlockAndLot(newText)}
                    />
                    <TextInput
                        placeholder="Zip"
                        style={styles.input}
                        value={zip !== undefined ? zip : ""}
                        onChangeText={(newText) => setZip(newText)}
                        keyboardType={"numeric"}
                    />
                    <View style={{ flex: 1, alignItems: "flex-end", flexDirection: "row", justifyContent: "flex-end", marginTop: 50 }}>
                        <TouchableOpacity style={styles.plainBtn} onPress={() => navigation.navigate("AddressList")}>
                            <Text>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}
                            onPress={() => {
                                if (route.params.id === undefined) return addAddress();
                                return editAddress();
                            }}
                        >
                            <Text style={{ color: "white" }}>
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>)
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
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 1,
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
export default AddressForm;