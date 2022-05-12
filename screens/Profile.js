import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import AddressBook from './AddressBook';
import Orders from './Orders';
import Review from './Review';

const Stack = createNativeStackNavigator();
const ProfileScreen = ({ navigation, route }) => {
    useEffect(() =>{
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("restart");
        });
        return unsubscribe;
    }, [navigation])
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen
                name="UserInfo"
                component={UserInfo}
            />
            <Stack.Screen
                name="AddressScreen"
                component={AddressBook}
            />
            <Stack.Screen 
                name="OrdersScreen"
                component={Orders}
            />
            <Stack.Screen 
                name="ReviewsScreen"
                component={Review}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        width: "100%",
        height: 150,
        resizeMode: 'contain',
        borderRadius: 10
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
        alignItems: "center",
        backgroundColor: "#FF1818",
        width: "90%",
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flex: 1,
        minHeight: 40,
        maxHeight: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },

    disabledButton: {
        alignItems: "center",
        backgroundColor: 'rgba(100, 100, 100, 0.3)',
        width: "90%",
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flex: 1,
        minHeight: 40,
        maxHeight: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default ProfileScreen;