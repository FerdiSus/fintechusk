import { View, Text, Button, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import API_BASE_URL from "../../const/url";
import CreateCategory from "./category-action/CreateCategory";
import EditCategory from "./category-action/EditCategory";

const CategoryAdmin = ({ navigation, route }) => {
  const [dataCategory, setdataCategory] = useState([]);
  const [loading, setloading] = useState(true);
  const { createCategoryCallback, editCategoryCallback } = route.params || {};

  const deleteCategory = async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}category-admin-delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getDataCategory();
  };

  const getDataCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}category-admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setdataCategory(response.data.categories);
    setloading(false);
  };

  useEffect(() => {
    getDataCategory();
    if (createCategoryCallback || editCategoryCallback) {
      getDataCategory();
    }
  }, [createCategoryCallback, editCategoryCallback]);

  return (
    <View className="container mx-auto">
      {loading ? (
        <Text>loading</Text>
      ) : (
        <View className="flex flex-col h-full w-full">
          <View className="flex flex-row justify-between items-center border-gray-300 border-b p-2 bg-white">
            <Text className="font-bold text-2xl">List of Category</Text>
            <TouchableOpacity className="mx-5" onPress={() => navigation.navigate(CreateCategory)}>
                <FontAwesome name="plus-circle" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <View className="p-4">
            {dataCategory.map((value, index) => (
              <View
                className="flex flex-row justify-between items-center bg-white border border-gray-300 rounded-lg p-3 mt-2"
                key={index}
              >
                <Text>Category: {value.name}</Text>
                <View className="flex flex-row">
                  <TouchableOpacity className="bg-yellow-100 p-2 border rounded-lg mr-3" onPress={() =>
                      navigation.navigate("EditCategory", {
                        pid: value.id,
                        pname: value.name,
                      })}>
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-red-100 p-2 border rounded-lg" onPress={() =>
                  Alert.alert(
                    "Peringatan !",
                    "Yakin Hapus Category ini?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel"
                      },
                      {
                        text: "OK",
                        onPress: () => deleteCategory(value.id)
                      }
                    ]
                  )}>
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default CategoryAdmin;