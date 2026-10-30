import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { ArrowLeft, Phone, Shield, Sparkles } from "lucide-react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useTheme } from "../utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiService from "../components/ApiService";
import { sendSMS } from "../components/sendSMS";

const { width, height } = Dimensions.get('window');

export default function OTPLoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_700Bold,
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
      // await sendSMS(response.phone, response.otp)
      await AsyncStorage.setItem("phone", response.phone);
      await AsyncStorage.setItem("isNewUser", JSON.stringify(response.isNewUser));
      await AsyncStorage.setItem("otp_expires_at", response.expires_at);

      // ⚠️ OTP should NOT be stored in production (only for testing)
      await AsyncStorage.setItem("otp_debug", response.otp);
      setLoading(false);
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
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#F0F2F5',
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={22} color="#1A1A1A" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: theme.colors.primary || '#FF6B35',
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
              shadowColor: theme.colors.primary || '#FF6B35',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <Phone
              size={44}
              color="#FFFFFF"
              strokeWidth={2}
            />
          </View>

          <Text
            style={{
              fontSize: 26,
              fontFamily: "Poppins_700Bold",
              color: '#1A1A1A',
              marginBottom: 6,
            }}
          >
            Enter Phone Number
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: '#666666',
              textAlign: "center",
            }}
          >
            We'll send you an OTP to verify{"\n"}your phone number
          </Text>
        </View>

        {/* Phone Input */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: '#1A1A1A',
              marginBottom: 8,
            }}
          >
            Phone Number
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: '#FFFFFF',
              borderRadius: 50,
              borderWidth: 1,
              borderColor: '#E8E8E8',
              paddingHorizontal: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: '#1A1A1A',
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
                color: '#1A1A1A',
                paddingVertical: 18,
              }}
              placeholder="Enter 10 digit mobile number"
              placeholderTextColor="#999999"
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
            backgroundColor: theme.colors.primary || '#FF6B35',
            borderRadius: 50,
            paddingVertical: 18,
            alignItems: "center",
            marginBottom: 16,
            opacity: loading ? 0.7 : 1,
            shadowColor: theme.colors.primary || '#FF6B35',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 6,
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: "#FFFFFF",
              letterSpacing: 0.5,
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
            color: '#888888',
            textAlign: "center",
            lineHeight: 18,
          }}
        >
          By continuing, you agree to our{" "}
          <Text style={{ color: theme.colors.primary || '#FF6B35', fontFamily: "Poppins_500Medium" }}>
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text style={{ color: theme.colors.primary || '#FF6B35', fontFamily: "Poppins_500Medium" }}>
            Privacy Policy
          </Text>
        </Text>

        {/* Trust Indicators */}
        <View
          style={{
            marginTop: 30,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Shield size={14} color="#CCCCCC" strokeWidth={2} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: '#999999',
              }}
            >
              Secure
            </Text>
          </View>
          <View style={{ width: 1, height: 14, backgroundColor: '#E0E0E0' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} color="#CCCCCC" strokeWidth={2} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: '#999999',
              }}
            >
              Premium
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}