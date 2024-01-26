import { View, Text, Alert, TextInput, Button, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import API_BASE_URL from "../../../const/url";

const CreateUser = ({ navigation }) => {
  const [roleUser, setroleUser] = useState([]);
  const [loading, setloading] = useState(true);
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [selectedRole, setselectedRole] = useState(0);
  const currentTime = new Date();
  const seconds = currentTime.getSeconds();

  const getRoleUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}user-admin-create`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setroleUser(response.data.data);
    setloading(false);
  };

  const createUser = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.post(
      `${API_BASE_URL}user-admin-store`,
      {
        name: name,
        password: password,
        roles_id: selectedRole,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigation.navigate("HomeAdmin", {
      createUserCallback: seconds,
    });
  };

  useEffect(() => {
    getRoleUser();
  }, []);

  return (
    <View className="flex flex-col w-full h-full p-4">
      {loading ? (
        <Text>loading</Text>
      ) : (
        <View className="bg-white p-4 flex flex-col justify-center w-full rounded-lg">
          <TextInput
            className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
            value={name}
            onChangeText={(e) => setname(e)}
            placeholder="name"
          />
          <TextInput
            className="h-12 rounded-md px-6 mb-5 text-lg bg-gray-200"
            value={password}
            onChangeText={(e) => setpassword(e)}
            placeholder="password"
          />
          <Picker
            selectedValue={selectedRole}
            onValueChange={(e) => setselectedRole(e)}
          >
            <Picker.Item label="Select Role"  value="0" />
            {roleUser.map((value, index) => (
              <Picker.Item label={value.name} value={value.id} key={index} />
            ))}
          </Picker>
          <TouchableOpacity className="p-2 bg-blue-400 items-center rounded-lg my-2" onPress={createUser}>
            <Text className="text-white font-bold text-lg">Create</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CreateUser;