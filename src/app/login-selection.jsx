import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { Smartphone, Mail, ArrowRight } from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "../utils/theme";

export default function LoginSelectionScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.statusBarStyle} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          {/* Logo Container with Background Color */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: theme.colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            {/* App Logo Image */}
            <Image
              source={require("../../assets/images/applogo.png")}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
            />
          </View>

          {/* Welcome Text */}
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            Welcome Back
          </Text>

          {/* Subtitle Text */}
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              textAlign: "center",
            }}
          >
            Sign in to continue to PropertyHub
          </Text>
        </View>

        {/* Login Options Section */}
        <View style={{ gap: 16, marginBottom: 32 }}>
          {/* OTP Login Option */}
          <TouchableOpacity
            onPress={() => router.push("/otp-login")}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: theme.colors.border,
              ...theme.elevation.card,
            }}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* OTP Icon Container */}
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: theme.colors.background,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Smartphone
                  size={28}
                  color={theme.colors.primary}
                  strokeWidth={1.5}
                />
              </View>

              {/* OTP Text Content */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Poppins_600SemiBold",
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}
                >
                  Continue with OTP
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                    color: theme.colors.textSecondary,
                  }}
                >
                  Quick and secure mobile login
                </Text>
              </View>

              {/* Arrow Icon */}
              <ArrowRight
                size={24}
                color={theme.colors.textSecondary}
                strokeWidth={1.5}
              />
            </View>
          </TouchableOpacity>

          {/* Email/Password Login Option */}
          <TouchableOpacity
            onPress={() => router.push("/email-login")}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: theme.colors.border,
              ...theme.elevation.card,
            }}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Email Icon Container */}
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: theme.colors.background,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Mail
                  size={28}
                  color={theme.colors.primary}
                  strokeWidth={1.5}
                />
              </View>

              {/* Email Text Content */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Poppins_600SemiBold",
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}
                >
                  Continue with Email
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                    color: theme.colors.textSecondary,
                  }}
                >
                  Sign in with email and password
                </Text>
              </View>

              {/* Arrow Icon */}
              <ArrowRight
                size={24}
                color={theme.colors.textSecondary}
                strokeWidth={1.5}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Divider Section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 24,
          }}
        >
          <View
            style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }}
          />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              marginHorizontal: 16,
            }}
          >
            OR
          </Text>
          <View
            style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }}
          />
        </View>

        {/* Sign Up Section */}
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              marginBottom: 8,
            }}
          >
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/role-selection")}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.primary,
              }}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}