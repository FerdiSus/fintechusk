import { View, Text, Alert, TextInput, Button, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import API_BASE_URL from "../../../const/url";

const CreateProduct = ({ navigation }) => {
  const [nameProduct, setnameProduct] = useState("");
  const [priceProduct, setpriceProduct] = useState("");
  const [stockProduct, setstockProduct] = useState("");
  const [standProduct, setstandProduct] = useState("");
  const [displayPhoto, setdisplayPhoto] = useState();
  const [descProduct, setdescProduct] = useState("");
  const [categoryProduct, setcategoryProduct] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);


  const getCategories = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}kantin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setcategoryProduct(response.data.categories);
  };

  const createProduct = async () => {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", nameProduct);
    formData.append("price", priceProduct);
    formData.append("stock", stockProduct);
    formData.append("stand", standProduct);
    formData.append("photo", displayPhoto);
    formData.append("desc", descProduct);
    formData.append("categories_id", selectedCategory);
    await axios.post(`${API_BASE_URL}create-product-url`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    Alert.alert("success create product");
    navigation.navigate("HomeKantin", { successCreate: displayPhoto });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <ScrollView>
 <View className="container mx-auto">
      <View className="flex flex-col h-full w-full p-6">        
        <Text className="font-bold text-md" >Name</Text>
        <TextInput
          className="h-12 rounded-md px-6 mb-5 text-lg bg-white border"
          value={nameProduct}
          onChangeText={(e) => setnameProduct(e)}
          placeholder="name product"
        />
         <Text className="font-bold text-md" >Photo</Text>
        <TextInput
            className="h-12 rounded-md px-6 mb-5 text-lg bg-white border"
            value={displayPhoto}
            onChangeText={(e) => setdisplayPhoto(e)}
            placeholder="Photo/url"
        />
        <Text className="font-bold text-md">Price</Text>
        <TextInput
            className="h-12 rounded-md px-6 mb-5 text-lg bg-white border"
            value={priceProduct}
            onChangeText={(e) => setpriceProduct(e)}
            placeholder="price"
        />
        <Text className="font-bold text-md">Stock</Text>
        <TextInput
            className="h-12 rounded-md px-6 mb-5 text-lg bg-white border"
            value={stockProduct}
            onChangeText={(e) => setstockProduct(e)}
            placeholder="stock"
        />
        <Text className="font-bold text-md">Stand</Text>
        <TextInput
            className="h-12 rounded-md px-6 mb-5 text-lg  bg-white border"
            value={standProduct}
            onChangeText={(e) => setstandProduct(e)}
            placeholder="stand"
        />
        <Text className="font-bold text-md">Category</Text>
        <Picker
            selectedValue={selectedCategory}
            onValueChange={(item) => setSelectedCategory(item)}
        >
            <Picker.Item label="Select Category"  value="0" />
            {categoryProduct.map((value, index) => (
            <Picker.Item value={value.id} label={value.name} key={index} />
            ))}
        </Picker>
        <TextInput
          className="h-12 rounded-md px-6 mb-5 text-lg bg-white border mt-3"
          value={descProduct}
          onChangeText={(e) => setdescProduct(e)}
          placeholder="description"
        />
        <TouchableOpacity className="w-full bg-blue-400 p-3 rounded-xl justify-center items-center flex " onPress={createProduct}>
            <Text className="font-bold text-white text-lg">Create</Text>
        </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
   
  );
};

export default CreateProduct;