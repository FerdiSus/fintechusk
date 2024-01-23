import { View, Text, ScrollView, Button, RefreshControl, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import API_BASE_URL from "../../const/url";

const TransactionKantin = ({ route, navigation }) => {
  const [transactionKantin, settransactionKantin] = useState([]);
  const [loading, setloading] = useState(true);
  const [nameAuth, setnameAuth] = useState("");
  const [dataKantin, setdataKantin] = useState([]);
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
    const response = await axios.get(`${API_BASE_URL}transaction-kantin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    settransactionKantin(response.data);
    setloading(false);
  };

  const verifPengambilan = async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.put(
      `${API_BASE_URL}transaction-kantin/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    getTransactionKantin();
  };

  const getDataKantin = async () => {
    const token = await AsyncStorage.getItem("token");
    const name = await AsyncStorage.getItem("name");
    const response = await axios.get(`${API_BASE_URL}kantin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setdataKantin(response.data);
    setnameAuth(name);
  };

  useEffect(() => {
    getTransactionKantin();
    getDataKantin();
  }, []);

  const logout = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        `${API_BASE_URL}logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await AsyncStorage.multiRemove(["token", "role"]);
      navigation.navigate("LoginPage");
    } catch (error) {
      await AsyncStorage.multiRemove(["token", "role"]);
      navigation.navigate("LoginPage");
    }
  };

  const onRefresh = () => {
    getTransactionKantin();
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="container mx-auto">
        {loading ? (
          <Text>loading</Text>
        ) : (
          <>
          <View className="flex flex-row justify-between items-center border-gray-300 border-b p-3 bg-white">
            <View className="flex flex-row items-center">
              <FontAwesome name="user-circle-o" size={24} color="black" />
              <Text className="ml-2 p-2">{nameAuth} | Kantin</Text>
    
            </View>
            <View className="flex flex-row">
              <TouchableOpacity className="mx-5" onPress={() => navigation.navigate("CreateProduct")}>
                <FontAwesome name="plus-circle" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="flex mx-2 items-center justify-center" onPress={logout}>
                <FontAwesome name="sign-out" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-col h-full w-full p-3">
            <View className="flex flex-col bg-white rounded-lg p-3">
              <Text className="text-lg font-bold">Transaksi Pembelian Barang</Text>
              {transactionKantin.transactions.map((item, index) => (
                <View
                  className="flex flex-row justify-between items-center bg-white p-3 mt-2 rounded-lg border border-gray-300"
                  key={index}
                >
                  <View className="flex flex-col">
                    <Text>{item.order_code}</Text>
                    <View className="flex flex-row">
                        <Text className="mr-2">{item.products.name}</Text>
                        <Text>
                            {formatToRp(item.price)} | {item.quantity}x
                        </Text>
                    </View>
                    {item.user_transactions.map((val, ind) => (
                        <Text className="font-bold text-blue-300 " key={ind}>{val.name}</Text>
                    ))}
                  </View>
                  <View className="flex flex-row">
                    <Text
                      className={
                        item.status === "dibayar"
                          ? `py-2 text-yellow-600 font-semibold text-sm`
                          : `font-bold text-sm`
                      }
                    >
                      {item.status}
                    </Text>
                    {item.status === "dibayar" ? (
                        <TouchableOpacity className="justify-center p-2 border rounded-full mx-2 bg-blue-500" onPress={() => verifPengambilan(item.id)}>
                            <FontAwesome name="check" size={16} color="white"/>
                        </TouchableOpacity>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default TransactionKantin;