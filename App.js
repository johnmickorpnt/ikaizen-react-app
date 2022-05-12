import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import Auth from './screens/Auth';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
