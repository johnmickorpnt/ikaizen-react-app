import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
const api_url = "http://192.168.254.100:8000";

const Login = ({ navigation, route }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loggingIn, setLoggingIn] = useState(false);
    const [user, setUser] = useState();
    const [token, setToken] = useState();
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(`error: "${error}", `, `is success? ${isSuccess}`);
        if (token !== undefined && user !== undefined) {
            return store();
        }
        if (!loggingIn) return false;
        loginAttempt(email, password);
        setLoggingIn(false);
    }, [loggingIn, isSuccess, error, token, user])
    async function save(key, value) {
        await SecureStore.setItemAsync(key, value);
    }
    const loginAttempt = async (e, p) => {
        console.log("LOGGING IN");
        setUser(undefined);
        setToken(undefined);
        setError("");

        if (e === "" || e === "undefined" || e === undefined || p === "" || e === "undefined" || p === undefined) {
            setError("Missing Inputs")
            setLoggingIn(false);
            return false;
        }
        let details = {
            "email": e,
            "password": p
        }
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        const response = await fetch(`${api_url}/api/login`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: formBody
        })
        const data = await response.json();

        if (response.status !== 200) {
            return setError(data.message)
        }
        setToken(data.token);
        setUser(data.email);
    }
    async function store() {
        let credentials = JSON.stringify({
            "email": user,
            "token": token,
        })
        await save("credentials", credentials)
            .then(() => navigation.navigate("MainScreen"))
            .catch(error => console.log(error));
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
                <View style={{ margin: 12, width: "100%" }}>
                    <Text style={{ fontSize: 12, color: "black", fontWeight: "bold", margin: 8 }}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Email...'
                        placeholderTextColor={"black"}
                        defaultValue={email}
                        keyboardType={"email-address"}
                        onChangeText={(newText) => setEmail(newText)}
                    />
                </View>
                <View style={{ margin: 12, width: "100%" }}>
                    <Text style={{ fontSize: 12, color: "black", fontWeight: "bold", margin: 8 }}>Password</Text>
                    <TextInput
                        placeholder='Password...'
                        style={styles.input}
                        placeholderTextColor={"black"}
                        secureTextEntry={true}
                        defaultValue={password}
                        onChangeText={(newText) => setPassword(newText)}
                    />
                </View>
                <View style={{ width: "100%", flex: 1, alignItems: "center", marginTop: "20%" }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setLoggingIn(true)}
                    >
                        <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.plainBtn}
                        onPress={() => navigation.navigate("RegisterScreen")}
                    >
                        <Text style={{ color: "black", textAlign: "center", textDecorationLine: "underline" }}>Don't have an account? Register now!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.plainBtn}>
                        <Text style={{ color: "black", textAlign: "center" }}>Forgot password?</Text>
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

export default Login;