import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
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
import {
  Search,
  MapPin,
  Heart,
  Bed,
  Bath,
  Maximize,
  SlidersHorizontal,
} from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "../../utils/theme";
import { properties } from "../../utils/dummyData";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const categories = [
    { id: "all", label: "All" },
    { id: "apartment", label: "Apartments" },
    { id: "villa", label: "Villas" },
    { id: "plot", label: "Plots" },
    { id: "land", label: "Land" },
    { id: "commercial", label: "Commercial" },
//     { id: "project", label: "Projects" },
  ];

  const filteredProperties = properties.filter((property) => {
    const matchesCategory =
      selectedCategory === "all" || property.category === selectedCategory;
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && property.status === "active";
  });

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
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
          paddingTop: insets.top + 20,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.background,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Poppins_600SemiBold",
            color: theme.colors.text,
            marginBottom: 8,
          }}
        >
          Find Your Property
        </Text>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.colors.input,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingHorizontal: 16,
            }}
          >
            <Search
              size={20}
              color={theme.colors.textSecondary}
              strokeWidth={1.5}
            />
            <TextInput
              style={{
                flex: 1,
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.text,
                paddingVertical: 12,
                paddingHorizontal: 12,
              }}
              placeholder="Search properties, location..."
              placeholderTextColor={theme.colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push("/filter-properties")}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: theme.colors.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SlidersHorizontal size={20} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 8,
          paddingVertical: 12,
        }}
        style={{
          flexGrow: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
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
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Properties List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredProperties.map((property) => (
          <TouchableOpacity
            key={property.id}
            onPress={() => router.push(`/property-details?id=${property.id}`)}
            style={{
              marginHorizontal: 20,
              marginBottom: 16,
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.border,
              overflow: "hidden",
              ...theme.elevation.card,
            }}
            activeOpacity={0.8}
          >
            {/* Image */}
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: property.images[0] }}
                style={{ width: "100%", height: 200 }}
              />

              {/* Featured Badge */}
              {property.featured && (
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    backgroundColor: theme.colors.primary,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_500Medium",
                      color: "#FFFFFF",
                    }}
                  >
                    Featured
                  </Text>
                </View>
              )}

              {/* Wishlist Button */}
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <Heart
                  size={20}
                  color={theme.colors.primary}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            </View>

            {/* Details */}
            <View style={{ padding: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins_600SemiBold",
                  color: theme.colors.text,
                  marginBottom: 4,
                }}
              >
                {property.title}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <MapPin
                  size={16}
                  color={theme.colors.textSecondary}
                  strokeWidth={1.5}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                    color: theme.colors.textSecondary,
                    marginLeft: 4,
                  }}
                >
                  {property.location}
                </Text>
              </View>

              {/* Property Stats */}
              {(property.bedrooms > 0 || property.bathrooms > 0) && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 12,
                  }}
                >
                  {property.bedrooms > 0 && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Bed
                        size={16}
                        color={theme.colors.textSecondary}
                        strokeWidth={1.5}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_400Regular",
                          color: theme.colors.textSecondary,
                          marginLeft: 4,
                        }}
                      >
                        {property.bedrooms} Bed
                      </Text>
                    </View>
                  )}

                  {property.bathrooms > 0 && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Bath
                        size={16}
                        color={theme.colors.textSecondary}
                        strokeWidth={1.5}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_400Regular",
                          color: theme.colors.textSecondary,
                          marginLeft: 4,
                        }}
                      >
                        {property.bathrooms} Bath
                      </Text>
                    </View>
                  )}

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Maximize
                      size={16}
                      color={theme.colors.textSecondary}
                      strokeWidth={1.5}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.textSecondary,
                        marginLeft: 4,
                      }}
                    >
                      {property.area} {property.areaUnit}
                    </Text>
                  </View>
                </View>
              )}

              {/* Price */}
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_600SemiBold",
                  color: theme.colors.primary,
                }}
              >
                {formatPrice(property.price)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredProperties.length === 0 && (
          <View
            style={{
              paddingVertical: 60,
              paddingHorizontal: 40,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              No Properties Found
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              Try adjusting your filters or search criteria
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
