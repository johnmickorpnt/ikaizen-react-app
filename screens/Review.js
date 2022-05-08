import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, Dimensions, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import StarRating from 'react-native-star-rating';
import Ionicons from '@expo/vector-icons/Ionicons';
const api_url = "http://192.168.254.100:8000";

const Review = ({ navigation, route }) => {
    const [data, setData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState();
    const [ratings, setRatings] = useState([]);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => {
            fetchData();
            setRefreshing(false);
        });
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        fetch(`${api_url}/api/user/201/orders/${route.params.id}/review`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((re) => re.json())
            .then((re) => {
                setData((re.length > 0) ? (re) : (0));
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        if (data === undefined)
            return fetchData();
        if (ratings.length === data.length) return;
        data.forEach(element => {
            setRatings(prevArr => [...prevArr, 5])
        })
        setIsLoading(false);
    }, [data]);

    const header = () => {
        return (
            <View>
                <Text style={{ fontSize: 23, fontWeight: "bold", textAlign: "center", marginTop: 30 }}>
                    Review an Order
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "500", textAlign: "center" }}>
                    Share your experience with others!
                </Text>
            </View>
        );
    }
    const updateRating = (rating, index) => {
        const oldRatings = [...ratings];
        oldRatings[index] = rating;
        setRatings(oldRatings);
    }
    const footer = () => {
        return (
            <View style={{ flex: 1, flexDirection: "column", flexGrow: 1, alignItems: "center", padding: 12, width: "100%" }}>
                <TouchableOpacity style={styles.plainBtn}
                    onPress={() => navigation.navigate("OrdersScreen")}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={{ color: "white" }}>Submit Review</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            {(isLoading && !refreshing) ? (
                (<ActivityIndicator size="large" color="#0000ff" />)
            ) : ((refreshing || (data === "undefined")) ? (<ActivityIndicator size="large" color="#0000ff" />) :
                (
                    (data !== 0) ? (
                        <FlatList data={data}
                            keyExtractor={(item) => item.product_id}
                            renderItem={({ item, index }) => (
                                <View style={{ width: Dimensions.get('screen').width, flex: 1, flexShrink: 1 }}>
                                    <View style={{ width: "100%", flex: 1, flexDirection: "row", padding: 15, alignItems: "center", flexWrap: "wrap" }}>
                                        <Image
                                            style={{ width: 70, height: 70 }}
                                            source={{
                                                uri: api_url + "/storage/images/" + item.prod_image,
                                            }}
                                        />
                                        <Text style={{ marginLeft: 10 }} numberOfLines={2}>{item.name}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center" }}>
                                        <View style={{ width: "100%", flex: 1, alignItems: "center" }}>
                                            <View style={{ display: "flex", flex: 1, flexDirection: "row", maxHeight: 45, alignItems: "center", flexShrink: 1, width: "100%", justifyContent: "space-between", paddingHorizontal: 15 }}>
                                                <StarRating
                                                    containerStyle={{width:"100%", justifyContent:"center"}}
                                                    starStyle={{marginHorizontal:3}}
                                                    disabled={false}
                                                    maxStars={5}
                                                    rating={ratings[index]}
                                                    fullStarColor={'red'}
                                                    emptyStarColor={'red'}
                                                    selectedStar={(rating) => updateRating(rating, index)}
                                                />
                                            </View>
                                            <View style={{ flexShrink: 1, width: Dimensions.get('screen').width, padding: 15, justifyContent: "center", alignItems: "center" }}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder='What did you think about the product?'
                                                    multiline={true}
                                                    numberOfLines={4}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                            }
                            ListHeaderComponent={header}
                            ListFooterComponent={footer}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh} />
                            } />
                    ) : (<Text>No Orders</Text>)
                ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 1,
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
        width: "100%",
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    plainBtn: {
        margin: 5,
        width: "100%",
        height: 40,
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
    },
    input: {
        margin: 5,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: "100%"
    },
});


export default Review