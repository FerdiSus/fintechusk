import { View, Text, Image, Button, TextInput, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../const/url";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const Card = ({
  id,
  name,
  photo,
  stand,
  stock,
  price,
  role,
  navigation,
  deleteProduct,
  saldo,
}) => {
  const [quantity, setquantity] = useState("1");

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const addToCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (saldo === 0) {
        Alert.alert("Isi saldo kamu terlebih dahulu");
      } else {
        setquantity("1");
        Alert.alert(
          "Success",
          "Cek Cart sekarang!!",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("CartUser", {
                  successCart: [quantity, price, id],
                });
              },
            },
          ],
          { cancelable: false }
        );

        await axios.post(
          `${API_BASE_URL}addcart`,
          {
            products_id: id,
            price: price,
            quantity: parseInt(quantity),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {}
  };

  return (
    <View className="bg-white rounded-lg shadow-md my-3 mx-5 ">
      <View className="p-3 w-full">
      <Image
        
        source={{ uri: photo }}
        className="w-full h-40 rounded-lg mb-2"
      />
        <Text className="text-gray-500">{name}</Text>
        <Text className="my-1 font-bold text-xl">{formatToRp(price)}</Text>
        <View className="flex flex-row justify-between items-center mt-2">
          <View className="flex flex-row">
            <Entypo name="shop" size={18} color="gray" />
            <Text className="ml-2 text-gray-500">{stand}</Text>
          </View>
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons name="shopping" size={18} color="gray" />
            <Text className="ml-2 text-gray-500">{stock}</Text>
          </View>
        </View>
        <Text></Text>
        {role === "siswa" ? (
          <View className="flex flex-row items-center justify-end mt-2">
            <TextInput
              className="h-9 w-10 rounded-md text-lg bg-gray-200 mr-2 text-center"
              value={quantity}
              onChangeText={(e) => setquantity(e)}
            />
            <TouchableOpacity className="border bg-white rounded-lg py-2 px-6 " onPress={() => addToCart(quantity)}>
              <FontAwesome name="cart-plus" size={24} color="black"/>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex flex-row items-center justify-evenly">
            <View className="flex">
            <TouchableOpacity className="py-2 px-10 border border-slate-800 rounded-lg bg-yellow-400" onPress={() => navigation.navigate("EditProduct", { id: id })} >
                <Text className=" font-bold text-sm">Edit</Text>
            </TouchableOpacity>
            </View>
            <View className="flex">
            <TouchableOpacity className="py-2 px-10 border border-slate-800 rounded-lg bg-red-400"
             onPress={() =>
              Alert.alert(
                "Peringatan !",
                "Yakin hapus Produk ini?",
                [
                {
                  text: "cancel",
                  style: "cancel"
                },
                {
                  text: "OK",
                  onPress: () => deleteProduct(id)
                },
                ]
              )
             }
               >
                <Text className="text-white font-bold text-sm">Delete</Text>
            </TouchableOpacity>
            </View>
          </View>
          )}
      </View>
    </View>
  );
};

export default Card;