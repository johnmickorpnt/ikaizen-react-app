import { StyleSheet, Text, View, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();
import * as SecureStore from 'expo-secure-store';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Main from './Main';
const api_url = "http://13.229.234.249";

const Auth = ({ navigation, route }) => {
    const [credentials, setCredentials] = useState("");
    const [loading, setIsLoading] = useState(false);
    async function retrieve() {
        try {
            let result = await SecureStore.getItemAsync("credentials")
            if (!result) return setCredentials(0)
            setCredentials(JSON.parse(result));
        } catch (error) {
            console.log("ERROR:", error);
            setCredentials(0);
        }
    }
    const wait = async (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    useEffect(() => {
        console.log(credentials)
        if (credentials === null || credentials.length === 0) {
            setIsLoading(true);
            return retrieve();
        }
        if (credentials !== 0) {
            return testLogin();
        }
        if (credentials === 0)
            wait(500).then(() => setIsLoading(false));

        if (credentials === undefined)
            return navigation.navigate("LoginScreen")
        if (!loading)
            console.log(credentials, loading);

    }, [credentials, loading]);

    const testLogin = async () => {
        let re = await fetch(`${api_url}/api/user/`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
        })
            .catch(e => navigation.navigate("LoginScreen"));
        if (re.status === 401) {
            return logout();
        }
    }
    async function logout() {
        await SecureStore.deleteItemAsync("credentials")
            .then(() => setCredentials(0))
            .finally(() => navigation.navigate("LoginScreen"))
            .catch((error) => console.log(error));
    }
    return (
        <NavigationContainer>
            {loading && credentials.length === 0 ? (<ActivityIndicator size="large" color="#0000ff" />) :
                (
                    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={(credentials) ? ("MainScreen") : ("LoginScreen")}>
                        <Stack.Screen
                            name="LoginScreen"
                            component={Login}
                        />
                        <Stack.Screen
                            name="MainScreen"
                            component={Main}
                        />
                        <Stack.Screen
                            name="RegisterScreen"
                            component={Register}
                        />
                    </Stack.Navigator>
                )}
        </NavigationContainer>
    );
}

export default Auth;