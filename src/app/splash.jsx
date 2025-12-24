import { View, Text, Image, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { useTheme } from "../utils/theme";

export default function SplashScreen() {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        router.replace("/login-selection");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar style="light" />

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
        }}
      >
        {/* Logo Container with Background Color */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: "#FFFFFF", // Changed to white for contrast on primary background
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
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

        {/* App Name */}
        <Text
          style={{
            fontSize: 32,
            fontFamily: "Poppins_600SemiBold",
            color: "#FFFFFF",
            marginBottom: 8,
          }}
        >
          VMRDAPLOTS
        </Text>

        {/* Tagline */}
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins_400Regular",
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          Find Your Dream Property
        </Text>
      </Animated.View>
    </View>
  );
}