import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../../const/url";

const CreateCategory = ({ navigation }) => {
  const [name, setname] = useState("");

  const createCategory = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.post(
      `${API_BASE_URL}category-admin-store`,
      {
        name: name,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigation.navigate("CategoryAdmin", {
      createCategoryCallback: name,
    });
  };

  return (
    <View className="p-4 flex flex-col justify-center h-full w-full">
      <View className="bg-white p-4">
        <Text className="text-lg">Create Category Product</Text>
        <TextInput
          className="h-12 rounded-md px-6 my-4 text-lg bg-gray-200"
          value={name}
          placeholder="Category"
          onChangeText={(e) => setname(e)}
        />
          <TouchableOpacity className="p-2 bg-blue-400 items-center rounded-lg my-2" onPress={createCategory}>
            <Text className="text-white font-bold text-lg">Create</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateCategory;