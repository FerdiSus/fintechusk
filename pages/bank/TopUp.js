import { View, FlatList, Text, RefreshControl, Button, TouchableOpacity,ScrollView } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../const/url";
import { FontAwesome } from "@expo/vector-icons";



const TopUp= ({navigation})=>{
const [loading, setloading] = useState(true);
const [dataBank, setdataBank] = useState([]);
const [refreshing, setRefreshing] = useState(false);
const [nameAuth, setnameAuth] = useState("");
const [roles, setRoles] = useState([]);


const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });
    return formatter.format(value);
    };
    
const getDataBank = async () => {
    const token = await AsyncStorage.getItem("token");
    const name = await AsyncStorage.getItem("name");
    const response = await axios.get(`${API_BASE_URL}bank`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    const roles = await axios.get(`${API_BASE_URL}roles`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    console.log("bank", response.data);
    console.log("roles", roles.data.data);
    setdataBank(response.data);
    setRoles(roles.data);
    setnameAuth(name);
    setloading(false);
    };

    useEffect(() => {
        getDataBank();
      }, []);

    const acceptTopUp = async (id) => {
        const token = await AsyncStorage.getItem("token");
        await axios.put(
          `${API_BASE_URL}topup-success/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        getDataBank();
      };

      const logout = async () => {
        const token = await AsyncStorage.getItem("token");
        await axios.post(
          `${API_BASE_URL}logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await AsyncStorage.multiRemove(["token", "role", "name"]);
        navigation.navigate("LoginPage");
      };
    
 const onRefresh = () => {
    getDataBank();
 };

return(
    <View className="w-full ">
            <View className="flex flex-row justify-between items-center border-gray-300 border-b p-3 bg-white">
              <View className="flex flex-row items-center">
                <FontAwesome name="user-circle-o" size={24} color="black" />
                <Text className="p-2 text-sm font-bold"> {nameAuth} | Bank</Text>
              </View>
              <View className="flex flex-row">
              <TouchableOpacity onPress={logout}>
                <FontAwesome name="sign-out" size={24} color="black" />
              </TouchableOpacity>
              </View>
            </View>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              className="px-3 mb-16"
              data={dataBank.wallets}
              renderItem={({ item, index }) => (
                <View
                  className="flex flex-row justify-between p-3 bg-white border border-gray-300 rounded-lg mt-2"
                  key={index}
                >
                  <View className="flex flex-col justify-center">
                    <View className="flex flex-row items-center">
                      <Text className="font-semibold">{item.user.name}</Text>
                      {item.user.roles_id !== 4 ? (
                        <Text className="ml-1 p-1 bg-yellow-400 rounded">
                          Bank
                        </Text>
                      ) : (
                        <Text className="ml-1 p-1 bg-blue-400 rounded text-white">
                          Siswa
                        </Text>
                      )}
                    </View>

                    <Text>
                      Credit {formatToRp(item.credit) ?? "0"} | Debit{" "}
                      {formatToRp(item.debit) ?? "0"}
                    </Text>
                  </View>

                  <View className="flex flex-row items-center">
                    <Text
                      className={
                        item.status === "process"
                          ? "text-red-500 mr-2"
                          : "text-slate-500"
                      }
                    >
                      {item.status}
                    </Text>
                    {item.status === "selesai" ? (
                      <></>
                    ) : (
                      <TouchableOpacity className="justify-center p-2 border rounded-full mx-2 bg-blue-500" onPress={() => acceptTopUp(item.id)}>
                          <FontAwesome name="check" size={16} color="white"/>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
    </View>
)

}

export default TopUp;