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
import { sendSMS } from "../components/sendSMS";

export default function OTPLoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      Alert.alert("Invalid Phone", "Please enter a valid 10 digit phone number");
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.post('/auth/login/phone', { phone: phone },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.success) {
        Alert.alert("Error", data.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      // Store required data
      await sendSMS(response.phone, response.otp)
      await AsyncStorage.setItem("phone", response.phone);
      await AsyncStorage.setItem("isNewUser", JSON.stringify(response.isNewUser));
      await AsyncStorage.setItem("otp_expires_at", response.expires_at);

      // ⚠️ OTP should NOT be stored in production (only for testing)
      await AsyncStorage.setItem("otp_debug", response.otp);
      setLoading(false);
console.log("rrr::",)
      // Navigate to OTP verify screen
      router.push({
        pathname: "/otp-verify",
        params: {
          phone: response.phone,
          otps: response.otp,
          isNewUser: String(response.isNewUser),
        },
      });
    } catch (error) {
      setLoading(false);
      Alert.alert("Network Error", "Please try again later");
      console.error("OTP API Error:", error.message);
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
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 40,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
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
            <Smartphone
              size={40}
              color={theme.colors.primary}
              strokeWidth={1.5}
            />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            Enter Phone Number
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              textAlign: "center",
            }}
          >
            We'll send you an OTP to verify{"\n"}your phone number
          </Text>
        </View>

        {/* Phone Input */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            Phone Number
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.colors.input,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_500Medium",
                color: theme.colors.text,
                marginRight: 8,
              }}
            >
              +91
            </Text>

            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.text,
                paddingVertical: 16,
              }}
              placeholder="Enter 10 digit mobile number"
              placeholderTextColor={theme.colors.placeholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        {/* Send OTP Button */}
        <TouchableOpacity
          onPress={handleSendOTP}
          disabled={loading}
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            marginBottom: 16,
            opacity: loading ? 0.7 : 1,
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: "#FFFFFF",
            }}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary,
            textAlign: "center",
            lineHeight: 18,
          }}
        >
          By continuing, you agree to our{" "}
          <Text style={{ color: theme.colors.primary }}>Terms of Service</Text>{" "}
          and{" "}
          <Text style={{ color: theme.colors.primary }}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </View>
  );
}
