import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import CartScreen from './CartScreen';
import ShopScreen from './ShopScreen';
import CheckoutScreen from './CheckoutScreen'
const api_url = "https://ikaizenshop.herokuapp.com";

const Cart = ({ navigation, route }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: true, title:"Your Cart" }}
                name="CartScreen"
                component={CartScreen}
            />
            <Stack.Screen
                options={{ headerShown: false }}
                name="ShopScreen"
                component={ShopScreen}
            />
            <Stack.Screen
                options={{ headerShown: true, title:"Checkout" }}
                name="CheckoutScreen"
                component={CheckoutScreen}
            />
        </Stack.Navigator>
    );
};
export default Cart;