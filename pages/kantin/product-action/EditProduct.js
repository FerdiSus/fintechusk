import { View, Text, TextInput, Image, Button, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import API_BASE_URL from "../../../const/url";

const EditProduct = ({ navigation, route }) => {
  const [nameProduct, setnameProduct] = useState("");
  const [descProduct, setdescProduct] = useState("");
  const [photoProduct, setphotoProduct] = useState("");
  const [standProduct, setstandProduct] = useState("");
  const [stockProduct, setstockProduct] = useState("");
  const [priceProduct, setpriceProduct] = useState("");
  const [categoryProduct, setcategoryProduct] = useState([]);
  const [selectedCategory, setselectedCategory] = useState(0);
  const [loading, setloading] = useState(true);
  const { id } = route.params;

  const updateProduct = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log(
      nameProduct,
      priceProduct,
      stockProduct,
      standProduct,
      photoProduct,
      selectedCategory
    );
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", nameProduct);
    formData.append("price", priceProduct);
    formData.append("stock", stockProduct);
    formData.append("stand", standProduct);
    formData.append("photo", photoProduct);
    formData.append("desc", descProduct);
    formData.append("categories_id", selectedCategory);

    const response = await axios.post(
      `${API_BASE_URL}product-update-url/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Update success:", response.data);

    navigation.navigate("HomeKantin", {
      successEdit: [
        nameProduct,
        descProduct,
        photoProduct,
        priceProduct,
        standProduct,
        stockProduct,
        selectedCategory,
      ],
    });
  };


  const getDataProduct = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}product-edit/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setnameProduct(response.data.products.name);
    setdescProduct(response.data.products.desc);
    setstandProduct(response.data.products.stand.toString());
    setstockProduct(response.data.products.stock.toString());
    setpriceProduct(response.data.products.price.toString());
    setcategoryProduct(response.data.categories);
    setphotoProduct(response.data.products.photo);
    setselectedCategory(response.data.products.categories_id);
    setloading(false);
  };

  useEffect(() => {
    getDataProduct();
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
               value={photoProduct}
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
           <TouchableOpacity className="w-full bg-blue-400 p-3 rounded-xl justify-center items-center flex" onPress={updateProduct}>
               <Text className="font-bold text-white text-lg">Edit Product</Text>
           </TouchableOpacity>
           </View>
   
         </View>
       </ScrollView>
  );
};

export default EditProduct;