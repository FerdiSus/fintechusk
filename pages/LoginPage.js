import { View, Text, TextInput, Button, ToastAndroid } from "react-native";
import API_BASE_URL from "../const/url";
import axios from "axios";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginPage = ({ navigation }) => {
    const [name, setname] = useState("");
    const [password, setpassword] = useState("");
  
    const navigateToPage = (role) => {
      switch (role) {
        case "admin":
          navigation.navigate("MainAdmin");
          break;
        case "kantin":
          navigation.navigate("MainKantin");
          break;
        case "bank":
          navigation.navigate("MainBank");
          break;
        default:
          navigation.navigate("MainUser");
          break;
      }
    };
  
    const saveTokenRole = async (token, role, name) => {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("role", role);
      await AsyncStorage.setItem("name", name);
    };
  
    const login = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}login`, {
          name: name,
          password: password,
        });
        const token = response.data.token;
        const role = response.data.message;
        saveTokenRole(token, role, name);
        setname("");
        setpassword("");
        navigateToPage(role);
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
    };

  return(
    <View className="flex min-h-full flex-col px-6 py-12 lg:px-8">
    <Text className="text-3xl font-bold mt-40 text-center mb-5 ">Fintech Login</Text>
    <View className=" container w-full h-1/1 p-4 rounded-md  shadow-xl">
      <TextInput
        value={name}
        className="h-12 rounded-md px-4  text-lg mb-4 bg-white"
        onChangeText={(text) => setname(text)}
        placeholder="name"
      />
      <TextInput
        value={password}
        secureTextEntry={true}
        className="h-12 rounded-md px-4 mb-5 text-lg bg-white"
        onChangeText={(text) => setpassword(text)}
        placeholder="password"
      />
      <Button title="Login"  onPress={login}  />
    </View>
  </View>
  )  
}
export default  LoginPage;