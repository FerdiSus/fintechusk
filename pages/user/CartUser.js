import {
    View,
    Text,
    Button,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
  import API_BASE_URL from "../../const/url";
  
  const CartUser = ({ navigation, route }) => {
    const [dataHistory, setdataHistory] = useState([]);
    const [loading, setloading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const currentTime = new Date();
    const seconds = currentTime.getSeconds();
    const { successCart } = route.params || {};
  
    const getDataHistory = async () => {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setdataHistory(response.data);
      setloading(false);
    };
  
    const cancelCart = async (id) => {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}keranjang/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getDataHistory();
    };
  
    const payProduct = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        await axios.put(
          `${API_BASE_URL}pay-product`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getDataHistory();
        navigation.navigate("HomeUser", { getDataSiswaCallBack: seconds });
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      getDataHistory();
      if (successCart == successCart || successCart !== successCart) {
        getDataHistory();
      }
    }, [successCart]);
  
    const formatToRp = (value) => {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
      return formatter.format(value);
    };

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
      getDataHistory();
    };
  
    return (
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="">
          {loading ? (
            <>
              <Text>...loading</Text>
            </>
          ) : (
            <>
            <View className="flex flex-row justify-between items-center border-gray-300 border-b p-2 bg-white">
            <View className="flex flex-row items-center w-full justify-between">
              <Text className="flex p-2 font-bold text-lg">Fintech SMKN 10</Text>
              <TouchableOpacity onPress={logout}>
                <FontAwesome name="sign-out" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-col h-full w-full p-4">
            <View className="bg-white rounded-lg ">
              <View className="flex flex-col p-4">
                <View className="flex flex-row justify-between">
                  <Text className="text-lg">Your Cart</Text>
                  <Text>{dataHistory.keranjanglength} Result</Text>
                </View>
  
                {dataHistory.transactionsKeranjang.map((item, index) => (
                  <View
                    key={index}
                    className="flex flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3"
                  >
                    <Text>
                      {item.products.name} | {formatToRp(item.price)} |{" "}
                      {item.quantity}x
                    </Text>
                    <Button title=" X " onPress={() => cancelCart(item.id)} />
                  </View>
                ))}
                <View
                  className={
                    dataHistory.totalPrice > dataHistory.difference
                      ? `bg-red-400  rounded-xl p-4 justify-center items-center`
                      : `bg-white-400  rounded-xl p-4 justify-end `
                  }
                >
                  <View className="flex flex-row items-center justify-between">
                  <Text className="text-black text-xs">Total Price</Text>
                    <Text className="text-black text-xl text-end">
                      {formatToRp(dataHistory.totalPrice ?? "")}
                    </Text>
                  </View>
                </View>

                {dataHistory.totalPrice > dataHistory.difference ? (
                  <Text className="text-center bg-red-400 p-2 rounded-md text-white mt-5">
                    Saldo mu kurang, saldo kamu:{" "}
                    {formatToRp(dataHistory.difference)}
                  </Text>    
                ) : (
                  <Button title="buy" onPress={payProduct} />
                )}
              </View>
            </View>
          </View>
            </>
          )}
        </View>
      </ScrollView>
    );
  };
  
  export default CartUser;