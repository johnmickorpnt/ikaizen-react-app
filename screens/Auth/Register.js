import { StyleSheet, Text, Alert, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Ionicons from '@expo/vector-icons/Ionicons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
const api_url = "http://192.168.254.100:8000";

const Register = ({ navigation, route }) => {
    const [email, setEmail] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(`is success? ${isSuccess}`);
        if(isSuccess) return navigation.navigate("MainScreen")
        if (!registering) return false;
        registerAttempt(firstName, lastName, email, password, confirmPassword);
        setRegistering(false);
    }, [registering, error, isSuccess])

    const registerAttempt = async (fName, lName, email, password, confirmPassword) => {
        console.log("REGISTERING IN");
        setError("");

        if (fName === undefined || lName === undefined || email === undefined || password === undefined || confirmPassword === undefined) {
            setError({ "errors": "Missing Inputs" })
            setRegistering(false);
            return false;
        }
        let details = {
            "first_name": fName,
            "last_name": lName,
            "email": email,
            "password": password,
            "password_confirmation": confirmPassword
        }
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        const response = await fetch(`${api_url}/api/register`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: formBody
        })
        const data = await response.json();

        if (response.status !== 200) {
            let list = "";
            return setError(list)
        }
        
        setIsSuccess(true);
    }
    return (
        <SafeAreaView style={styles.container}>
            
            <View style={{ width: "100%", height: "15%" }}>
                <Image
                    style={styles.mainLogo}
                    source={{
                        uri: "http://192.168.254.100:8000/images/logo1-1-dark.png",
                    }}
                />
            </View>
            <View style={{ width: "100%", padding: 12, marginTop: "auto", flex: 1, alignItems: "center", flexGrow: 1, justifyContent: "center" }}>
                <View style={{ flexDirection: "row", margin: 4 }}>
                    <View style={{ margin: 4, width: "50%" }}>
                        <Text style={{ fontSize: 12, color: "black", fontWeight: "bold", margin: 8 }}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='John.'
                            placeholderTextColor={"black"}
                            defaultValue={firstName}
                            onChangeText={newText => setFirstName(newText)}
                        />
                    </View>
                    <View style={{ margin: 4, width: "50%" }}>
                        <Text style={{ fontSize: 12, color: "black", fontWeight: "bold", margin: 8 }}>Last Name</Text>
                        <TextInput
                            placeholder='Doe'
                            style={styles.input}
                            placeholderTextColor={"black"}
                            defaultValue={lastName}
                            onChangeText={newText => setLastName(newText)}
                        />
                    </View>
                </View>
                <View style={{ margin: 4, width: "100%" }}>
                    <Text style={{ fontSize: 12, color: "black", fontWeight: "bold", margin: 8 }}>Email</Text>
                    <TextInput
                        placeholder='johndoe@email.com'
                        style={styles.input}
                        placeholderTextColor={"black"}
                        keyboardType={"email-address"}
                        defaultValue={email}
                        onChangeText={newText => setEmail(newText)}
                    />
                </View>
                <View style={{ margin: 4, width: "100%" }}>
                    <Text style={{ fontSize: 12, color: "black", fontWeight: "bold", margin: 8 }}>Password</Text>
                    <TextInput
                        placeholder='You Password...'
                        style={styles.input}
                        placeholderTextColor={"black"}
                        secureTextEntry={true}
                        defaultValue={password}
                        onChangeText={newText => setPassword(newText)}
                    />
                </View>
                <View style={{ margin: 8, width: "100%" }}>
                    <Text style={{ fontSize: 12, color: "black", fontWeight: "bold", margin: 8 }}>Confirm Password</Text>
                    <TextInput
                        placeholder='Repeat your password...'
                        style={styles.input}
                        placeholderTextColor={"black"}
                        secureTextEntry={true}
                        defaultValue={confirmPassword}
                        onChangeText={newText => setConfirmPassword(newText)}
                    />
                </View>
                <View style={{ width: "100%", flex: 1, alignItems: "center", marginTop: 8 }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setRegistering(true)}
                    >
                        <Text style={{ color: "white", textAlign: "center" }}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.plainBtn}
                        onPress={() => navigation.navigate("LoginScreen")}
                    >
                        <Text style={{ color: "black", textAlign: "center", textDecorationLine: "underline" }}>Already have an account? Login here!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        // backgroundColor: "black"
    },
    mainLogo: {
        marginVertical: 15,
        width: "100%",
        height: "100%",
        resizeMode: 'contain',
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
        backgroundColor: "#FF1818",
        width: "50%",
        padding: 24,
        borderRadius: 5,
    },
    plainBtn: {
        width: "100%",
        padding: 8,
        borderRadius: 5,
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    input: {
        padding: 12,
        borderRadius: 12,
        borderColor: "black",
        borderWidth: 1,
        width: "100%"
    }
});
export default Register;