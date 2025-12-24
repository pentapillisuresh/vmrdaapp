import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import {
  ChevronLeft,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
} from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "../utils/theme";
import { properties, wishlist } from "../utils/dummyData";

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const wishlistProperties = properties.filter((p) => wishlist.includes(p.id));

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
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
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
          <ChevronLeft size={24} color={theme.colors.text} strokeWidth={1.5} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
            }}
          >
            Wishlist
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              marginTop: 2,
            }}
          >
            {wishlistProperties.length} saved properties
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {wishlistProperties.map((property) => (
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
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: property.images[0] }}
                style={{ width: "100%", height: 200 }}
              />

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
                  fill={theme.colors.primary}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            </View>

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

        {wishlistProperties.length === 0 && (
          <View
            style={{
              paddingVertical: 80,
              paddingHorizontal: 40,
              alignItems: "center",
            }}
          >
            <Heart size={64} color={theme.colors.border} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                textAlign: "center",
                marginTop: 24,
                marginBottom: 8,
              }}
            >
              No Saved Properties
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              Start saving properties you like to view them here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
