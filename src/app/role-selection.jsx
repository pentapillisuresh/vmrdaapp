import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { Home, Users, Building2 } from "lucide-react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useTheme } from "../utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RoleSelectionScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState(null);

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const roles = [
    {
      id: "owner",
      title: "Property Owner",
      description: "I want to sell or rent my property",
      icon: Home,
    },
    {
      id: "agent",
      title: "Real Estate Agent",
      description: "I help clients buy, sell, or rent properties",
      icon: Users,
    },
    {
      id: "builder",
      title: "Builder",
      description: "I develop and sell properties or projects",
      icon: Building2,
    },
  ];

  const handleContinue = async () => {
    if (!selectedRole) return;
    await AsyncStorage.setItem("role",selectedRole);
    router.push({
      pathname: "/signup-section",
      params: {
        role: selectedRole,
      },
    });
  };

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
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: theme.colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 36,
                fontFamily: "Poppins_600SemiBold",
                color: "#FFFFFF",
              }}
            >
              99
            </Text>
          </View>

          <Text
            style={{
              fontSize: 28,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            Join PropertyHub
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              textAlign: "center",
            }}
          >
            Select your role to get started
          </Text>
        </View>

        {/* Role Options */}
        <View style={{ gap: 16, marginBottom: 32 }}>
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            const IconComponent = role.icon;

            return (
              <TouchableOpacity
                key={role.id}
                onPress={() => setSelectedRole(role.id)}
                style={{
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 2,
                  borderColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.border,
                  ...theme.elevation.card,
                }}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: isSelected
                        ? "rgba(255, 255, 255, 0.2)"
                        : theme.colors.background,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 16,
                    }}
                  >
                    <IconComponent
                      size={28}
                      color={isSelected ? "#FFFFFF" : theme.colors.primary}
                      strokeWidth={1.5}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "Poppins_600SemiBold",
                        color: isSelected ? "#FFFFFF" : theme.colors.text,
                        marginBottom: 4,
                      }}
                    >
                      {role.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: isSelected
                          ? "rgba(255, 255, 255, 0.9)"
                          : theme.colors.textSecondary,
                      }}
                    >
                      {role.description}
                    </Text>
                  </View>

                  {/* Selection Indicator */}
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isSelected ? "#FFFFFF" : theme.colors.border,
                      backgroundColor: isSelected ? "#FFFFFF" : "transparent",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {isSelected && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: theme.colors.primary,
                        }}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedRole}
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            opacity: selectedRole ? 1 : 0.5,
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
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
