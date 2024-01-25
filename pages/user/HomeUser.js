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
  const [debit, setdebit] = useState("");
  const [openModal, setopenModal] = useState(false);
  const [openModalw, setopenModalw] = useState(false);
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

  const withdrawBank = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.post(
      `${API_BASE_URL}withdraw-bank`,
      {
        debit: parseInt(debit),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setdebit("");
    setopenModalw(false);
    getDataSiswa();
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
          <View className="flex rounded-lg shadow-lg p-2">
          <View className="flex flex-row rounded-md bg-slate-900 w-full items-center p-6">
            <View className="flex flex-row">
                <View className="">
                 <Text className="font-bold text-2xl  mr-2 flex text-white"> Hallo {username ?? name}</Text>
                  <View className="flex justify-between items-center my-2">
                   <Text className="ml-2 mr-4 border rounded-md p-2 bg-white font-bold">Saldo Anda: {formatToRp(dataSiswa.difference)}</Text> 
                 </View>
                </View>
                <View className="flex flex-row  items-center">
                 <TouchableOpacity className="bg-white rounded-lg p-2 mr-3" onPress={() => setopenModal(true)}>
                    <Text className="font-bold">Top Up</Text>
                 </TouchableOpacity>
                 <TouchableOpacity className="bg-white rounded-lg p-2 " onPress={() => setopenModalw(true)}>
                    <Text className="font-bold">Tarik Tunai</Text>
                 </TouchableOpacity>
                </View>
            </View>
            <Modal
              visible={openModal}
              onRequestClose={() => setopenModal(false)}
            >
              <View className="flex flex-col items-center h-full w-full">
                <View className="justify-center items-center mb-52 mt-10">
                  <Text className="font-bold text-4xl">Top UP</Text>
                </View>
                <Text className="mb-3 font-bold">Masukkan Nominal Top Up</Text>
                <TextInput
                  keyboardType="numeric"
                  value={credit}
                  className="h-12 rounded-md px-6 mb-4 text-lg bg-gray-200 w-1/2"
                  onChangeText={(e) => setcredit(e)}
                  placeholder="nominal"
                />
                <View className="flex flex-row">
                <TouchableOpacity className="bg-blue-400 rounded-lg py-2 px-5 mr-5" onPress={() => setopenModal(false)}>
                  <Text className="text-white font-bold">CLOSE</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-blue-400 rounded-lg py-2 px-5" onPress={topUp}>
                  <Text className="text-white font-bold">TOP UP</Text>
                </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              visible={openModalw}
              onRequestClose={() => setopenModalw(false)}
            >
              <View className="flex flex-col  items-center h-full w-full">
                <View className="justify-center items-center mb-52 mt-10">
                  <Text className="font-bold text-4xl">Penarikan Tunai</Text>
                </View>
                <Text className="mb-3 font-bold">Masukkan Nominal Penarikan</Text>
                <TextInput
                  keyboardType="numeric"
                  value={debit}
                  className="h-12 rounded-md px-6 mb-4 text-lg bg-gray-200 w-1/2"
                  onChangeText={(e) => setdebit(e)}
                  placeholder="nominal"
                />
                <View className="flex flex-row">
                <TouchableOpacity className="bg-blue-400 rounded-lg py-2 px-5 mr-5" onPress={() => setopenModalw(false)}>
                  <Text className="text-white font-bold">CLOSE</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-blue-400 rounded-lg py-2 px-5" onPress={withdrawBank}>
                  <Text className="text-white font-bold">TARIK</Text>
                </TouchableOpacity>
                </View>
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