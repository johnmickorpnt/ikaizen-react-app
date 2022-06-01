import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';


const CustomHeader = (props) => {
    return (
        <View style={{ marginVertical: 20 }}>
            <Image
                style={styles.mainLogo}
                source={{
                    uri: "http://13.229.234.249/images/logo1-1.png",
                }}
            />
            <View style={{ padding: 10, flex: 1, flexDirection: "column", justifyContent: "center" }}>
                <Text style={{ fontSize: 21, textAlign: "center" }}>
                    You can check our products here
                </Text>
                <TouchableOpacity style={styles.shopBtn} onPress={() => { props.navigation.navigate("Shop") }}>
                    <Text style={{ color: "white", textAlign: "center" }}>Shop Now!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    productItem: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        margin: 5,
        width: 180,
        textAlign: "center"
    },
    logo: {
        marginVertical: 15,
        width: "100%",
        height: 150,
        resizeMode: 'contain',
        borderRadius: 10
    },
    button: {
        marginVertical: 5,
        alignItems: "center",
        backgroundColor: "#FF1818",
        width: "100%",
        padding: 10,
        borderRadius: 5
    },
    mainLogo: {
        backgroundColor: "#FFC300",
        marginVertical: 15,
        width: "100%",
        height: 100,
        resizeMode: 'contain',
    },
    shopBtn: {
        backgroundColor: "#5463FF",
        borderRadius: 5,
        paddingHorizontal: 24,
        paddingVertical: 8,
        width: "100%",
    }
});

export default CustomHeader;