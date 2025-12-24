import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { ChevronLeft, X } from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "../utils/theme";

export default function FilterPropertiesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState(null);
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const categories = [
    "Apartment",
    "Villa",
    "Plot",
    "Land",
    "Commercial",

  ];

  const bedroomOptions = ["1", "2", "3", "4", "5+"];

  const handleReset = () => {
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
    setBedrooms(null);
    setMinArea("");
    setMaxArea("");
  };

  const handleApply = () => {
    router.back();
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
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
            activeOpacity={0.7}
          >
            <ChevronLeft
              size={24}
              color={theme.colors.text}
              strokeWidth={1.5}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
            }}
          >
            Filters
          </Text>
        </View>

        <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.primary,
            }}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Category */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 12,
            }}
          >
            Property Type
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() =>
                    setSelectedCategory(isSelected ? null : category)
                  }
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 20,
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.surface,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.border,
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_500Medium",
                      color: isSelected ? "#FFFFFF" : theme.colors.text,
                    }}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Price Range */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 12,
            }}
          >
            Price Range
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.textSecondary,
                  marginBottom: 8,
                }}
              >
                Min Price (₹)
              </Text>
              <TextInput
                style={{
                  backgroundColor: theme.colors.input,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                }}
                placeholder="Min"
                placeholderTextColor={theme.colors.placeholder}
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.textSecondary,
                  marginBottom: 8,
                }}
              >
                Max Price (₹)
              </Text>
              <TextInput
                style={{
                  backgroundColor: theme.colors.input,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                }}
                placeholder="Max"
                placeholderTextColor={theme.colors.placeholder}
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Bedrooms */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 12,
            }}
          >
            Bedrooms
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            {bedroomOptions.map((option) => {
              const isSelected = bedrooms === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => setBedrooms(isSelected ? null : option)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.surface,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.border,
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_600SemiBold",
                      color: isSelected ? "#FFFFFF" : theme.colors.text,
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Area Range */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 12,
            }}
          >
            Area (sq.ft)
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.textSecondary,
                  marginBottom: 8,
                }}
              >
                Min Area
              </Text>
              <TextInput
                style={{
                  backgroundColor: theme.colors.input,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                }}
                placeholder="Min"
                placeholderTextColor={theme.colors.placeholder}
                value={minArea}
                onChangeText={setMinArea}
                keyboardType="numeric"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.textSecondary,
                  marginBottom: 8,
                }}
              >
                Max Area
              </Text>
              <TextInput
                style={{
                  backgroundColor: theme.colors.input,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                }}
                placeholder="Max"
                placeholderTextColor={theme.colors.placeholder}
                value={maxArea}
                onChangeText={setMaxArea}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Apply Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.background,
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          ...theme.elevation.modal,
        }}
      >
        <TouchableOpacity
          onPress={handleApply}
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
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
            Apply Filters
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
