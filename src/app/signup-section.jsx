import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { ArrowLeft, Smartphone } from "lucide-react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useTheme } from "../utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiService from "../components/ApiService";
import { saveAuth } from "../utils/auth/auth";

export default function SignupSectionScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  /* ---------------- REGISTER USER ---------------- */
  const handleRegistration = async () => {
    if (!fullName || !email || !password || phone.length !== 10) {
      Alert.alert("Invalid Details", "Please fill all fields correctly");
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.post("/auth/register", {
        fullName,
        email,
        password,
        phoneNumber: phone,
      });

      if (!response) {
        Alert.alert("Registration Failed", response?.message || "Try again");
        return;
      }

      // Save token & user
      await saveAuth(response.token, response.client);

      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.statusBarStyle} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.surface,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={20} color={theme.colors.text} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 40,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
      >
        {/* Icon */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.colors.surface,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Smartphone size={40} color={theme.colors.primary} />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
            }}
          >
            Create Account
          </Text>
        </View>

        {/* Full Name */}
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={inputStyle(theme)}
        />

        {/* Email */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={inputStyle(theme)}
        />

        {/* Phone */}
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
          style={inputStyle(theme)}
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={inputStyle(theme)}
        />

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegistration}
          disabled={loading}
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            marginTop: 20,
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------------- INPUT STYLE ---------------- */
const inputStyle = (theme) => ({
  backgroundColor: theme.colors.input,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: 16,
  marginBottom: 16,
  fontFamily: "Poppins_400Regular",
  color: theme.colors.text,
});