import { View, Text, Button, FlatList, TouchableOpacity, Alert} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../const/url";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import CreateUser from "./user-action/CreateUser";
import EditUser from "./user-action/EditUser";

const HomeAdmin = ({ navigation, route }) => {
  const [loading, setloading] = useState(true);
  const [dataAdmin, setdataAdmin] = useState([]);
  const { userEdit, createUserCallback } = route.params || {};

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const getDataAdmin = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}getsiswa`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setdataAdmin(response.data);
    setloading(false);
  };

  const deleteUser = async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}user-admin-delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getDataAdmin();
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

  useEffect(() => {
    getDataAdmin();
    if (userEdit || createUserCallback) {
      getDataAdmin();
    }
  }, [userEdit, createUserCallback]);

  return (
    <View className="container mx-auto">
      {loading ? (
        <>
          <Text>...loading</Text>
          <Button title="logout" onPress={logout} />
        </>
      ) : (
        <View className="flex flex-col">
        <View className="flex flex-row justify-between items-center border-gray-300 border-b p-3 bg-white">
              <View className="flex flex-row items-center">
                <FontAwesome name="user-circle-o" size={24} color="black" />
                <Text className="ml-2 p-2 text-sm font-bold">{dataAdmin.user.name} | Admin</Text>
              </View>
              <View className="flex flex-row">
              <TouchableOpacity className="mx-5" onPress={() => navigation.navigate(CreateUser)}>
                <FontAwesome name="plus-circle" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="justify-center" onPress={logout}>
                <FontAwesome name="sign-out" size={24} color="black" />
              </TouchableOpacity>
              </View>
            </View>
          <View className="w-full rounded-lg">
            <View className="flex flex-row bg-slate-900 rounded-lg my-2 p-4 justify-around">
              <View className="flex flex-col items-center">
                <FontAwesome name="shopping-cart" size={24} color="white" />
                <Text className="text-white">{dataAdmin.products.length}</Text>
                <Text className="text-white">Products</Text>
              </View>
              <View className="border border-gray-300"></View>
              <View className="flex flex-col items-center">
                <Entypo name="wallet" size={24} color="white" />
                <Text className="text-white">{dataAdmin.wallet_count}</Text>
                <Text className="text-white"> TopUp </Text>
              </View>
              <View className="border border-gray-300"></View>
              <View className="flex flex-col items-center justify-center">
                <FontAwesome name="user-circle-o" size={24} color="white" />
                <Text className="text-white">{dataAdmin.users.length}</Text>
                <Text className="text-white"> User</Text>
              </View>
            </View>
          </View>
          <FlatList
            className="h-full"
            data={dataAdmin.users}
            renderItem={({ item, index }) => (
              <View
                key={index}
                className="flex flex-row justify-between items-center mx-4 bg-white p-4 mt-2 border rounded-lg"
              >
                <View className="flex flex-row items-center">
                  <Text className="ml-2 text-center font-bold text-lg">{item.name}</Text>
                </View>
                <Text className="text-center">{item.roles.name}</Text>
                <View className="flex flex-row justify-between">
                  <TouchableOpacity className="p-2 border rounded-md bg-yellow-100 mr-3" onPress={()=> navigation.navigate("EditUser", {
                        id: item.id,
                      })} >
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="p-2 border rounded-md bg-red-100 " onPress={() =>
                  Alert.alert(
                    "Peringatan !",
                    "Yakin Hapus User Ini?",
                    [
                      {
                        text: "cancel",
                        style: "cancel"
                      },
                      {
                        text: "OK",
                        onPress: () =>  deleteUser(item.id)
                      }
                    ]
                    )}>
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default HomeAdmin;