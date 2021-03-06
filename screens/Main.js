import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView, BackHandler, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './Home';
import ProfileScreen from './Profile';
import Shop from './Shop';
import CartScreen from './Cart';

const homeName = "Home";
const profileName = "Profile";
const shopName = "Shop";
const cartName = "Cart";

const Main = () => {
    const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            { text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
    };
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);
    return (
        <Tab.Navigator
            initialRouteName={"TabRoute"}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;
                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === profileName) {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    else if (rn === shopName) {
                        iconName = focused ? 'list' : 'list-outline';
                    }
                    else if (rn === cartName) {
                        iconName = focused ? 'cart' : 'cart-outline';
                    }
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={"#FF1818"} />;
                },
                headerShown: false,
                tabBarShowLabel: false,
                unmountOnBlur: true
            })}>
            {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
            <Tab.Screen name="Shop" component={Shop} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>

    );
}

export default Main;