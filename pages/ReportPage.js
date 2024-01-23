import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../const/url";

const ReportPage = ({ route, navigation }) => {
    const [transactionKantin, setTransactionKantin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const formatToRp = (value) => {
        const formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        });
        return formatter.format(value);
    };

    const getTransactionKantin = async () => {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}report-admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTransactionKantin(response.data);
        console.log(transactionKantin)
        setLoading(false);
    };

    useEffect(() => {
        getTransactionKantin();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        getTransactionKantin().then(() => setRefreshing(false));
    };

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View className="container mx-auto">
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <>
                        <View className="flex flex-row justify-between items-center border-gray-300 border-b p-3 bg-white">
                            <View className="flex flex-col items-center">
                                <Text className="font-bold text-lg text-center">Report Transaction</Text>
                            </View>
                        </View>
                        <View className="flex flex-col h-full w-full p-3">
                            {
                                transactionKantin.map((item) => (
                                    <View className="flex flex-col bg-white rounded-lg p-3">
                                        {/* <Text className="text-lg font-bold">Riwayat Pembelian Barang</Text> */}
                                        <text>{item.created_at}</text>
                                    </View>
                                ))
                            }
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

export default ReportPage;
