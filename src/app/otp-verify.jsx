import { useState, useRef,useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";
import { ArrowLeft, Shield } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveAuth } from "../utils/auth/auth";
import ApiService from "../components/ApiService";

export default function OTPVerifyScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const inputRefs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const { phone, otps: otpParam, isNewUser } = useLocalSearchParams();

  const [loaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  /* ---------------- AUTO FILL OTP FROM PATH ---------------- */
  useEffect(() => {
    console.log("OTP:::",otpParam)
    if (otpParam && otpParam.length === 6) {
      setOtp(otpParam.split(""));
      setTimeout(() => inputRefs.current[5]?.focus(), 100);
    }
  }, [otpParam]);

  /* ---------------- OTP INPUT HANDLERS ---------------- */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await ApiService.post('/auth/login/phone/verify',{ phone, otp: otpCode });

      if (!response?.success) {
        Alert.alert("Verification Failed", response?.message || "Invalid OTP");
        return;
      }else 
      await saveAuth(response.token, response.user);
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Verify OTP Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResend = async () => {
    try {
      setLoading(true);

      const response = await ApiService.post(
        "/auth/resend-otp",
        { phone }
      );

      if (!response?.success) {
        Alert.alert("Error", response?.message || "Failed to resend OTP");
        return;
      }

      Alert.alert("OTP Sent", response.message);

      // ⚠️ DEV ONLY (remove in production)
      if (response.otp) {
        setOtp(response.otp.split(""));
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      Alert.alert("Error", "Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) return null;

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
          <ArrowLeft size={20} color={theme.colors.text} />
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
            <Shield size={40} color={theme.colors.primary} />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
            }}
          >
            Verify OTP
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Enter the 6-digit code sent to{"\n"}+91 {phone}
          </Text>
        </View>

        {/* OTP Inputs */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={(v) => handleOtpChange(v, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                width: 50,
                height: 56,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: digit ? theme.colors.primary : theme.colors.border,
                backgroundColor: theme.colors.input,
                textAlign: "center",
                fontSize: 20,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
              }}
            />
          ))}
        </View>

        {/* Resend */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ color: theme.colors.textSecondary }}>
            Didn’t receive the code?
          </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text
              style={{
                color: theme.colors.primary,
                fontFamily: "Poppins_600SemiBold",
                marginTop: 6,
              }}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          style={{
            backgroundColor: theme.colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
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
            {loading ? "Verifying..." : "Verify & Continue"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
