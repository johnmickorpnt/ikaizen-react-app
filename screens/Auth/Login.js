import { StyleSheet, BackHandler, LogBox, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';

const api_url = "https://8ceb-136-158-11-199.ap.ngrok.io";

const Login = ({ navigation, route }) => {
    console.log(route.params)
    // const { isFocused, onFocus, onBlur } = route.params.focused;
    // const [focused, setFocused] = useState(false);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loggingIn, setLoggingIn] = useState(false);
    const [user, setUser] = useState();
    const [token, setToken] = useState();
    const [error, setError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();//Ignore all log notifications
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setEmail();
            setPassword();
            setError(false);
            setErrorMsg();
        });

        if (isSuccess) return navigation.navigate("MainScreen");
        if (token !== undefined && user !== undefined) {
            return store();
        }
        if (!loggingIn) return false;
        loginAttempt(email, password);
        setLoggingIn(false);
    }, [loggingIn, isSuccess, error, token, user, navigation])

    async function save(key, value) {
        await SecureStore.setItemAsync(key, value);
    }
    const loginAttempt = async (e, p) => {
        console.log("LOGGING IN");
        setUser(undefined);
        setToken(undefined);
        setError(false);

        if (e === "" || e === "undefined" || e === undefined || p === "" || e === "undefined" || p === undefined) {
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
            setLoggingIn(false);
            setError(true);
            return setErrorMsg("- " + data.errors);
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
            .catch(error => console.log(error));
        setIsSuccess(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            {(loggingIn && (email !== "undefined" && email !== undefined && password !== undefined && password !== "undefined")) ? (<ActivityIndicator size="large" color="#0000ff" />) : (null)}
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
            <View style={{ width: "100%", height: "15%" }}>
                <Image
                    style={styles.mainLogo}
                    source={{
                        uri: "https://8ceb-136-158-11-199.ap.ngrok.io/images/logo1-1-dark.png",
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