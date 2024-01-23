import { View, Text, Button, FlatList, Modal, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Card from "../../component/Card";
import API_BASE_URL from "../../const/url";
import { FontAwesome } from "@expo/vector-icons";
import { RefreshControl } from "react-native";



const HomeUser = ({ route, navigation }) => {
  const [dataSiswa, setdataSiswa] = useState([]);
  const [loading, setloading] = useState(true);
  const { getDataSiswaCallBack } = route.params || {};
  const { username } = route.params || {};
  const [roleAuth, setroleAuth] = useState("");
  const [name, setname] = useState("");
  const [credit, setcredit] = useState("");
  const [openModal, setopenModal] = useState(false);
  const currentTime = new Date();
  const [refreshing, setRefreshing] = useState(false);
  const seconds = currentTime.getSeconds();

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const topUp = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.post(
      `${API_BASE_URL}topup`,
      {
        credit: parseInt(credit),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setcredit("");
    setopenModal(false);
    navigation.navigate("HistoryUser", { successTopUp: seconds });
  };

  const getDataSiswa = async () => {
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");
    const name = await AsyncStorage.getItem("name");
    const response = await axios.get(`${API_BASE_URL}get-product-siswa`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setdataSiswa(response.data);
    setloading(false);
    setroleAuth(role);
    setname(name);
  };

  useEffect(() => {
    getDataSiswa();
    if (getDataSiswaCallBack) {
      getDataSiswa();
    }
  }, [getDataSiswaCallBack]);

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
    getDataSiswa();
  };

  return (
    <View className="container mx-auto h-full w-full">
      {loading ? (
            <>
             <Text>...loading</Text>
           </>
      ) : (
        <View className="flex flex-col h-full w-full">
          <View className="flex flex-row justify-between items-center border-gray-300 border-b p-2 bg-white">
            <View className="flex flex-row items-center w-full justify-between">
              <Text className="flex p-2 font-bold text-lg">Fintech SMKN 10</Text>
              <TouchableOpacity onPress={logout}>
                <FontAwesome name="sign-out" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex rounded-lg shadow-lg justify-center p-2">
          <View className="flex flex-row rounded-md bg-slate-900 w-full items-center p-6">
            <View className="">
                <Text className="font-bold text-2xl  mr-2 flex text-white"> Hallo {username ?? name}</Text>
                <View className="flex flex-row justify-between items-center my-2">
                 <Text className="ml-2 mr-4 border rounded-md p-2 bg-white">Saldo Anda: {formatToRp(dataSiswa.difference)}</Text> 
                 <FontAwesome name="money"  size={30} color="white" onPress={() => setopenModal(true)} />
                </View>
            </View>
            <Modal
              visible={openModal}
              onRequestClose={() => setopenModal(false)}
            >
              <View className="flex flex-col justify-center items-center h-full w-full">
                <Text className="mb-3">Masukkan Nominal</Text>
                <TextInput
                  keyboardType="numeric"
                  value={credit}
                  className="h-12 rounded-md px-6 mb-4 text-lg bg-gray-200 w-1/2"
                  onChangeText={(e) => setcredit(e)}
                  placeholder="nominal"
                />
                <Button title="top up" onPress={topUp} />
                <Text></Text>
                <Button  title="close" onPress={() => setopenModal(false)} />
              </View>
            </Modal>
          </View>
          </View>
        <View className="flex flex-row">
          <FlatList
            className="mb-48"
             refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(item) => item.id.toString()}
            data={dataSiswa.products}
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
                saldo={dataSiswa.difference}
              />
            )}
          />
        </View>
        </View>
      )}
    </View>
  );
};

export default HomeUser;