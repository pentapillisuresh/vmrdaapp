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
import { ArrowLeft, Shield } from "lucide-react-native";
import { router } from "expo-router";
import { useState, useRef } from "react";
import { useTheme } from "../utils/theme";

export default function OTPVerifyScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)/home");
    }, 1000);
  };

  const handleResend = () => {
    Alert.alert("OTP Sent", "A new OTP has been sent to your phone");
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
            <Shield size={40} color={theme.colors.primary} strokeWidth={1.5} />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 8,
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
            }}
          >
            Enter the 6-digit code sent to{"\n"}+91 98765 43210
          </Text>
        </View>

        {/* OTP Input */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 32,
            paddingHorizontal: 10,
          }}
        >
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={{
                width: 50,
                height: 56,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: digit ? theme.colors.primary : theme.colors.border,
                backgroundColor: theme.colors.input,
                fontSize: 20,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                textAlign: "center",
              }}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        {/* Resend */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              marginBottom: 8,
            }}
          >
            Didn't receive the code?
          </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.primary,
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
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
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
            {loading ? "Verifying..." : "Verify & Continue"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
