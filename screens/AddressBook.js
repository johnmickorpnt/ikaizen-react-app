import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddressList from './AddressList';
import AddressForm from './AddressForm';
const Stack = createNativeStackNavigator();
const api_url = "http://192.168.254.100:8000";


const AddressBook = ({ navigation, route }) => {
    const [initRoute, setInitRoute] = useState();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("address book");
            setInitRoute("AddressList")
        });
        return unsubscribe;
    }, [navigation]);
    return (
        <Stack.Navigator
            initialRouteName='AddressList'
            screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="AddressList"
                component={AddressList}
            />
            <Stack.Screen
                name="AddressForm"
                component={AddressForm}
            />
        </Stack.Navigator>
    );
}

export default AddressBook;