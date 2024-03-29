import { View, Text, Button, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Card from "../../component/Card";
import API_BASE_URL from "../../const/url";
import { FontAwesome } from "@expo/vector-icons";
import CreateProduct from "./product-action/CreateProduct";

const HomeKantin = ({ route, navigation }) => {
  const [dataKantin, setdataKantin] = useState([]);
  const [loading, setloading] = useState(true);
  const [roleAuth, setroleAuth] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [nameAuth, setnameAuth] = useState("");
  const { successCreate, successEdit } = route.params || {};

  const deleteProduct = async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}delete-product-url/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("berhasil delete");
    getDataKantin();
  };

  const getDataKantin = async () => {
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");
    const name = await AsyncStorage.getItem("name");
    const response = await axios.get(`${API_BASE_URL}kantin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setdataKantin(response.data);
    setroleAuth(role);
    setnameAuth(name);
    setloading(false);
  };

  useEffect(() => {
    getDataKantin();
    if (successCreate || successEdit) {
      getDataKantin();
    }
  }, [successCreate, successEdit]);

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
    getDataKantin();
  };

  return (
    <View className="container mx-auto h-full w-full ">
      {loading ? (
        <>
          <Text>...loading</Text>
          <Button title="logout" onPress={logout} />
        </>
      ) : (
        <View className="flex flex-col h-full w-full">
          <View className="flex flex-row justify-between items-center border-gray-300 border-b p-3 bg-white">
            <View className="flex flex-row items-center">
              <FontAwesome name="user-circle-o" size={24} color="black" />
              <Text className="ml-2 p-2">{nameAuth} | Kantin</Text>
            </View>
            <View className="flex flex-row">
              <TouchableOpacity className="mx-5" onPress={() => navigation.navigate(CreateProduct)}>
                <FontAwesome name="plus-circle" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="flex mx-2 items-center justify-center" onPress={logout}>
                <FontAwesome name="sign-out" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList 
           refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            className="flex flex-col my-5"
            data={dataKantin.products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <Card
                key={index}
                name={item.name}
                desc={item.desc}
                photo={item.photo}
                price={item.price}
                role={roleAuth}
                stand={item.stand}
                stock={item.stock}
                id={item.id}
                navigation={navigation}
                deleteProduct={deleteProduct}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default HomeKantin;