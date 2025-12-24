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
  Clock,
} from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "../utils/theme";
import { properties, recentlyViewed } from "../utils/dummyData";

export default function RecentlyViewedScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const recentProperties = recentlyViewed
    .map((rv) => ({
      ...properties.find((p) => p.id === rv.propertyId),
      viewedAt: rv.viewedAt,
    }))
    .filter((p) => p.id);

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const formatViewedTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
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
            Recently Viewed
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              marginTop: 2,
            }}
          >
            {recentProperties.length} recently viewed
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
        {recentProperties.map((property) => (
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

              <View
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Clock size={12} color="#FFFFFF" strokeWidth={1.5} />
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "Poppins_500Medium",
                    color: "#FFFFFF",
                  }}
                >
                  {formatViewedTime(property.viewedAt)}
                </Text>
              </View>
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

        {recentProperties.length === 0 && (
          <View
            style={{
              paddingVertical: 80,
              paddingHorizontal: 40,
              alignItems: "center",
            }}
          >
            <Clock size={64} color={theme.colors.border} strokeWidth={1.5} />
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
              No History Yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              Properties you view will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
