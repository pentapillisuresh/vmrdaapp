import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Smartphone, Mail, ArrowRight, Shield, Sparkles, Building2 } from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "../utils/theme";

const { width, height } = Dimensions.get('window');

export default function LoginSelectionScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <StatusBar style="light" />

      {/* Half Screen Background */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: height * 0.55,
          backgroundColor: theme.colors.primary || '#FF6B35',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      />

      {/* Decorative Elements */}
      <View
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 80,
          left: -40,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -20,
          right: 20,
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          {/* Logo Container */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: 'rgba(255,255,255,0.95)',
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <Image
              source={require("../../assets/images/applogo.png")}
              style={{
                width: "65%",
                height: "65%",
                resizeMode: "contain",
              }}
            />
          </View>

          {/* Premium Badge */}
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              paddingHorizontal: 20,
              paddingVertical: 6,
              borderRadius: 20,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Poppins_500Medium",
                color: '#FFFFFF',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              ✦ Premium Real Estate
            </Text>
          </View>

          {/* Welcome Text */}
          <Text
            style={{
              fontSize: 32,
              fontFamily: "Poppins_700Bold",
              color: '#FFFFFF',
              marginBottom: 6,
              textShadowColor: 'rgba(0,0,0,0.1)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 8,
            }}
          >
            Welcome Back
          </Text>

          {/* Subtitle Text */}
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Poppins_400Regular",
              color: 'rgba(255,255,255,0.85)',
              textAlign: "center",
              maxWidth: 280,
              textShadowColor: 'rgba(0,0,0,0.05)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}
          >
            Sign in to continue your property journey
          </Text>
        </View>

        {/* Login Options Section */}
        <View style={{ gap: 14, marginTop: 10 }}>
          {/* OTP Login Option */}
          <TouchableOpacity
            onPress={() => router.push("/otp-login")}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.04)',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* OTP Icon Container */}
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: theme.colors.primary || '#FF6B35',
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Smartphone
                  size={28}
                  color="#FFFFFF"
                  strokeWidth={1.5}
                />
              </View>

              {/* OTP Text Content */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: "Poppins_600SemiBold",
                    color: '#1A1A1A',
                    marginBottom: 2,
                  }}
                >
                  Continue with OTP
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_400Regular",
                    color: '#888888',
                  }}
                >
                  Quick & secure mobile login
                </Text>
              </View>

              {/* Arrow Icon */}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#F5F6FA',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ArrowRight
                  size={20}
                  color={theme.colors.primary || '#FF6B35'}
                  strokeWidth={2}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Email/Password Login Option */}
          <TouchableOpacity
            onPress={() => router.push("/email-login")}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.04)',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Email Icon Container */}
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#4A90E2',
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Mail
                  size={28}
                  color="#FFFFFF"
                  strokeWidth={1.5}
                />
              </View>

              {/* Email Text Content */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: "Poppins_600SemiBold",
                    color: '#1A1A1A',
                    marginBottom: 2,
                  }}
                >
                  Continue with Email
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_400Regular",
                    color: '#888888',
                  }}
                >
                  Sign in with email & password
                </Text>
              </View>

              {/* Arrow Icon */}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#F5F6FA',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ArrowRight
                  size={20}
                  color="#4A90E2"
                  strokeWidth={2}
                />
              </View>
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
            style={{ flex: 1, height: 1, backgroundColor: '#E0E0E0' }}
          />
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Poppins_400Regular",
              color: '#999999',
              marginHorizontal: 16,
              letterSpacing: 1,
            }}
          >
            OR
          </Text>
          <View
            style={{ flex: 1, height: 1, backgroundColor: '#E0E0E0' }}
          />
        </View>

        {/* Sign Up Section */}
        <View style={{ alignItems: "center", marginTop: 4 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: '#666666',
              marginBottom: 12,
            }}
          >
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/role-selection")}
            activeOpacity={0.7}
            style={{
              backgroundColor: theme.colors.primary || '#FF6B35',
              paddingHorizontal: 40,
              paddingVertical: 14,
              borderRadius: 30,
              shadowColor: theme.colors.primary || '#FF6B35',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: '#FFFFFF',
                letterSpacing: 0.5,
              }}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View
          style={{
            marginTop: 40,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Shield size={14} color="#CCCCCC" />
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
            <Sparkles size={14} color="#CCCCCC" />
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
          <View style={{ width: 1, height: 14, backgroundColor: '#E0E0E0' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Building2 size={14} color="#CCCCCC" />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: '#999999',
              }}
            >
              Trusted
            </Text>
          </View>
        </View>

        {/* Version */}
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Poppins_400Regular",
            color: '#D0D0D0',
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}