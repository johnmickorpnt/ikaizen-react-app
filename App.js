import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from './screens/Home';
import ProfileScreen from './screens/Profile';
import ShopScreen from './screens/Shop';
import CartScreen from './screens/Cart';
const Tab = createBottomTabNavigator();

const homeName = "Home";
const profileName = "Profile";
const shopName = "Shop";
const cartName = "Cart";

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
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
          tabBarShowLabel:false
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Shop" component={ShopScreen} />
        <Tab.Screen name="Cart" component={CartScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
