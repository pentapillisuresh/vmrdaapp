import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveAuth = async (token, user) => {
  await AsyncStorage.multiSet([
    ["token", token],
    ["user", JSON.stringify(user)],
  ]);
};

export const clearAuth = async () => {
  await AsyncStorage.multiRemove(["token", "user"]);
};

export const getAuth = async () => {
  const token = await AsyncStorage.getItem("token");
  const user = await AsyncStorage.getItem("user");

  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
};
