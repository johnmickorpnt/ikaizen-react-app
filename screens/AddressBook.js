import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddressList from './AddressList';
import EditAddress from './EditAddress';
const Stack = createNativeStackNavigator();
const api_url = "https://8ceb-136-158-11-199.ap.ngrok.io";


const AddressBook = ({ navigation, route }) => {
    
    return (
        <Stack.Navigator
            screenOptions={{headerShown:false}}>
            <Stack.Screen
                name="AdressList"
                component={AddressList}
            />
            <Stack.Screen 
                name="EditAddress"
                component={EditAddress}
            />
        </Stack.Navigator>
    );
}

export default AddressBook;