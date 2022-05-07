import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, Image, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import ShopScreen from './ShopScreen';
import Product from './Product';
const Shop = ({ navigation, route }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: false }}
                name="ShopScreen"
                component={ShopScreen}
            />
            <Stack.Screen
                name="ProductScreen"
                options={({ route }) => ({ title: route.params.name })}
                component={Product}
            />
        </Stack.Navigator>
    );
};

export default Shop;