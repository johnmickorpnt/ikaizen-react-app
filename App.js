import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

import HomeScreen from './screens/Home';
import ProfileScreen from './screens/Profile';
import Shop from './screens/Shop';
import CartScreen from './screens/Cart';
import Auth from './screens/Auth';
const Tab = createBottomTabNavigator();

const homeName = "Home";
const profileName = "Profile";
const shopName = "Shop";
const cartName = "Cart";

export default function App() {
  const [user, setUser] = useState();
  async function retrieve() {
    let result;
    result = await SecureStore.getItemAsync("email");
    return (result) ? (result) : (undefined);
  }

  useEffect(async () => {
    setUser(retrieve());
  }, []);

  return (
    (<Auth />)
  );
}

async function getToken(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log("🔐 Here's your value 🔐 \n" + result);
    setUser(result)
  } else {
    console.log('No values stored under that key.');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
