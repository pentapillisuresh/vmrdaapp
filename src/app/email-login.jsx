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
import { ArrowLeft, Mail, Lock } from "lucide-react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useTheme } from "../utils/theme";

export default function EmailLoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)/home");
    }, 1000);
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
            <Mail size={40} color={theme.colors.primary} strokeWidth={1.5} />
          </View>

          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            Sign In
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              textAlign: "center",
            }}
          >
            Enter your credentials to continue
          </Text>
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            Email Address
          </Text>

          <TextInput
            style={{
              backgroundColor: theme.colors.input,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingHorizontal: 16,
              paddingVertical: 16,
              fontSize: 16,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.text,
            }}
            placeholder="Enter your email"
            placeholderTextColor={theme.colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            Password
          </Text>

          <TextInput
            style={{
              backgroundColor: theme.colors.input,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingHorizontal: 16,
              paddingVertical: 16,
              fontSize: 16,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.text,
            }}
            placeholder="Enter your password"
            placeholderTextColor={theme.colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginBottom: 32 }}
          onPress={() =>
            Alert.alert("Forgot Password", "Password reset feature coming soon")
          }
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.primary,
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
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
            {loading ? "Signing In..." : "Sign In"}
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
