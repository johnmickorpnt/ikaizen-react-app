import { StyleSheet, Text, View, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();
import * as SecureStore from 'expo-secure-store';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Main from './Main';


const Auth = () => {
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
        if (credentials === null || credentials.length === 0) {
            setIsLoading(true);
            return retrieve();
        }
        if(credentials === 0) 
        wait(500).then(() => setIsLoading(false));
        console.log(credentials, loading);
        if (!loading)
            console.log(credentials, loading);
    }, [credentials, loading]);

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