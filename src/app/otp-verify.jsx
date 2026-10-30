import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { ArrowLeft, Sparkles } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveAuth } from "../utils/auth/auth";
import ApiService from "../components/ApiService";

const { width, height } = Dimensions.get('window');

export default function OTPVerifyScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const inputRefs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { phone, otps: otpParam, isNewUser } = useLocalSearchParams();

  const [loaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_700Bold,
  });

  /* ---------------- AUTO FILL OTP FROM PATH ---------------- */
  // useEffect(() => {
  //   console.log("OTP:::",otpParam)
  //   if (otpParam && otpParam.length === 6) {
  //     setOtp(otpParam.split(""));
  //     setTimeout(() => inputRefs.current[5]?.focus(), 100);
  //   }
  // }, [otpParam]);

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

      const response = await ApiService.post('/auth/login/phone/verify', { phone, otp: otpCode });

      if (!response?.success) {
        Alert.alert("Verification Failed", response?.message || "Invalid OTP");
        return;
      } else
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
        contentContainerStyle={{
          paddingTop: 40,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Poppins_700Bold",
              color: '#1A1A1A',
              marginBottom: 8,
            }}
          >
            Verify OTP
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: '#666666',
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Enter the 6-digit code sent to{"\n"}
            <Text style={{ fontFamily: "Poppins_600SemiBold", color: '#1A1A1A' }}>
              +91 {phone}
            </Text>
          </Text>
        </View>

        {/* OTP Inputs */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 32,
            paddingHorizontal: 4,
          }}
        >
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={(v) => handleOtpChange(v, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                width: 52,
                height: 60,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: digit 
                  ? theme.colors.primary || '#FF6B35' 
                  : focusedIndex === index 
                    ? theme.colors.primary || '#FF6B35'
                    : '#E8E8E8',
                backgroundColor: '#FFFFFF',
                textAlign: "center",
                fontSize: 22,
                fontFamily: "Poppins_600SemiBold",
                color: '#1A1A1A',
                shadowColor: digit || focusedIndex === index ? theme.colors.primary || '#FF6B35' : '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: digit || focusedIndex === index ? 0.1 : 0.02,
                shadowRadius: 8,
                elevation: digit || focusedIndex === index ? 4 : 1,
              }}
            />
          ))}
        </View>

        {/* Resend */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: '#666666',
            }}
          >
            Didn't receive the code?
          </Text>
          <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
            <Text
              style={{
                color: theme.colors.primary || '#FF6B35',
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
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
            backgroundColor: theme.colors.primary || '#FF6B35',
            paddingVertical: 18,
            borderRadius: 50,
            alignItems: "center",
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
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              letterSpacing: 0.5,
            }}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </Text>
        </TouchableOpacity>

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
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: '#999999',
              }}
            >
              🔒 Secure
            </Text>
          </View>
          <View style={{ width: 1, height: 14, backgroundColor: '#E0E0E0' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: '#999999',
              }}
            >
              ✦ Premium
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}