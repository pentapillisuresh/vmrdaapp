import { View, Text, Image, Animated, ImageBackground, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { useTheme } from "../utils/theme";
import { getAuth } from "../utils/auth/auth";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.5)).current;

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const bootstrap = async () => {
    const { token } = await getAuth();

    if (token) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/login-selection");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (loaded || error) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 30,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        bootstrap();
      }, 2500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      style={{
        flex: 1,
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
      }}
      resizeMode="cover"
    >
      {/* Overlay Gradient for better readability */}
      <LinearGradient
        colors={[
          'rgba(0,0,0,0.2)',
          'rgba(0,0,0,0.4)',
          'rgba(0,0,0,0.6)',
        ]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <StatusBar style="light" />

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
          paddingHorizontal: 30,
        }}
      >
        {/* Logo Container - Clean, no background colors */}
        <Animated.View
          style={{
            width: 120,
            height: 120,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
            transform: [{ scale: logoScaleAnim }],
          }}
        >
          {/* App Logo Image */}
          <Image
            source={require("../../assets/images/applogo.png")}
            style={{
              width: 120,
              height: 120,
              resizeMode: "contain",
            }}
          />
        </Animated.View>

        {/* App Name */}
        <Text
          style={{
            fontSize: 42,
            fontFamily: "Poppins_700Bold",
            color: "#FFFFFF",
            marginBottom: 4,
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 0, height: 3 },
            textShadowRadius: 12,
            letterSpacing: 3,
          }}
        >
          VMRDAPLOTS
        </Text>

        {/* Decorative Line */}
        <View
          style={{
            width: 80,
            height: 2,
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderRadius: 1,
            marginBottom: 14,
          }}
        />

        {/* Tagline */}
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins_400Regular",
            color: "rgba(255, 255, 255, 0.95)",
            letterSpacing: 4,
            textTransform: "uppercase",
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
          }}
        >
          Find Your Dream Property
        </Text>

        {/* Loading Dots - Static, no animation */}
        <View
          style={{
            marginTop: 50,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === 1 ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                marginHorizontal: 6,
              }}
            />
          ))}
        </View>

        {/* Version Text */}
        <Text
          style={{
            position: 'absolute',
            bottom: -80,
            fontSize: 12,
            fontFamily: "Poppins_400Regular",
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: 2,
          }}
        >
          Version 1.0.0
        </Text>
      </Animated.View>
    </ImageBackground>
  );
}