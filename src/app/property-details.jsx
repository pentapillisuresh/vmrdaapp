import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  Linking,
  Alert,
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
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Phone,
  MessageCircle,
  Mail,
  Check,
  Home,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../utils/theme";
import { properties } from "../utils/dummyData";

const { width } = Dimensions.get("window");

export default function PropertyDetailsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Property not found</Text>
      </View>
    );
  }

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this property: ${property.title} - ${formatPrice(property.price)}\nLocation: ${property.location}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCall = () => {
    Linking.openURL(`tel:${property.ownerPhone}`);
  };

  const handleWhatsApp = () => {
    const cleanPhone = property.ownerPhone.replace(/[^0-9]/g, "");
    const message = `Hi, I'm interested in your property: ${property.title}`;
    Linking.openURL(
      `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`,
    );
  };

  const handleEmail = () => {
    Alert.alert("Email", "Email feature coming soon!");
  };

  const similarProperties = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        p.category === property.category &&
        p.status === "active",
    )
    .slice(0, 3);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="light" />

      {/* Image Gallery */}
      <View style={{ position: "relative" }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {property.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{ width, height: 300 }}
            />
          ))}
        </ScrollView>

        {/* Image Indicators */}
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {property.images.map((_, index) => (
            <View
              key={index}
              style={{
                width: currentImageIndex === index ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor:
                  currentImageIndex === index
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.5)",
              }}
            />
          ))}
        </View>

        {/* Header Buttons */}
        <View
          style={{
            position: "absolute",
            top: insets.top + 12,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => setIsWishlisted(!isWishlisted)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Heart
                size={20}
                color={isWishlisted ? theme.colors.primary : "#FFFFFF"}
                fill={isWishlisted ? theme.colors.primary : "none"}
                strokeWidth={1.5}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Share2 size={20} color="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Badge */}
        {property.featured && (
          <View
            style={{
              position: "absolute",
              top: insets.top + 64,
              left: 20,
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

        {/* Verified Badge */}
        {property.verified && (
          <View
            style={{
              position: "absolute",
              top: insets.top + 64,
              right: 20,
              backgroundColor: theme.colors.success,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Check size={14} color="#FFFFFF" strokeWidth={2} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_500Medium",
                color: "#FFFFFF",
              }}
            >
              Verified
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Property Info */}
        <View style={{ padding: 20 }}>
          {/* Price */}
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.primary,
              marginBottom: 8,
            }}
          >
            {formatPrice(property.price)}
          </Text>

          {/* Title */}
          <Text
            style={{
              fontSize: 22,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            {property.title}
          </Text>

          {/* Location */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <MapPin
              size={18}
              color={theme.colors.textSecondary}
              strokeWidth={1.5}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                marginLeft: 6,
                flex: 1,
              }}
            >
              {property.address}
            </Text>
          </View>

          {/* Stats */}
          {(property.bedrooms > 0 || property.bathrooms > 0) && (
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                paddingVertical: 16,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              {property.bedrooms > 0 && (
                <View style={{ alignItems: "center" }}>
                  <Bed
                    size={24}
                    color={theme.colors.primary}
                    strokeWidth={1.5}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins_600SemiBold",
                      color: theme.colors.text,
                      marginTop: 4,
                    }}
                  >
                    {property.bedrooms}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.textSecondary,
                    }}
                  >
                    Bedrooms
                  </Text>
                </View>
              )}

              {property.bathrooms > 0 && (
                <View style={{ alignItems: "center" }}>
                  <Bath
                    size={24}
                    color={theme.colors.primary}
                    strokeWidth={1.5}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins_600SemiBold",
                      color: theme.colors.text,
                      marginTop: 4,
                    }}
                  >
                    {property.bathrooms}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.textSecondary,
                    }}
                  >
                    Bathrooms
                  </Text>
                </View>
              )}

              <View style={{ alignItems: "center" }}>
                <Maximize
                  size={24}
                  color={theme.colors.primary}
                  strokeWidth={1.5}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins_600SemiBold",
                    color: theme.colors.text,
                    marginTop: 4,
                  }}
                >
                  {property.area}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    color: theme.colors.textSecondary,
                  }}
                >
                  {property.areaUnit}
                </Text>
              </View>
            </View>
          )}

          {/* Description */}
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                marginBottom: 12,
              }}
            >
              Description
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.text,
                lineHeight: 22,
              }}
            >
              {property.description}
            </Text>
          </View>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins_600SemiBold",
                  color: theme.colors.text,
                  marginBottom: 12,
                }}
              >
                Amenities
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {property.amenities.map((amenity, index) => (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      backgroundColor: theme.colors.surfaceElevated,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Check
                      size={14}
                      color={theme.colors.primary}
                      strokeWidth={2}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.text,
                      }}
                    >
                      {amenity}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Owner Info */}
          <View style={{ marginTop: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                marginBottom: 12,
              }}
            >
              Property Listed By
            </Text>

            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins_600SemiBold",
                      color: theme.colors.text,
                      marginBottom: 4,
                    }}
                  >
                    {property.ownerName}
                  </Text>
                  <View
                    style={{
                      backgroundColor: theme.colors.primary,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "Poppins_500Medium",
                        color: "#FFFFFF",
                      }}
                    >
                      {property.ownerRole.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Map Placeholder */}
          <View style={{ marginTop: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                marginBottom: 12,
              }}
            >
              Location
            </Text>

            <View
              style={{
                backgroundColor: theme.colors.surfaceElevated,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
                height: 200,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MapPin
                size={48}
                color={theme.colors.primary}
                strokeWidth={1.5}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_500Medium",
                  color: theme.colors.text,
                  marginTop: 12,
                }}
              >
                {property.location}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Tap to view on map
              </Text>
            </View>
          </View>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins_600SemiBold",
                  color: theme.colors.text,
                  marginBottom: 12,
                }}
              >
                Similar Properties
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    paddingHorizontal: 20,
                  }}
                >
                  {similarProperties.map((prop) => (
                    <TouchableOpacity
                      key={prop.id}
                      onPress={() =>
                        router.push(`/property-details?id=${prop.id}`)
                      }
                      style={{
                        width: 250,
                        backgroundColor: theme.colors.surface,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        overflow: "hidden",
                      }}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: prop.images[0] }}
                        style={{ width: "100%", height: 140 }}
                      />

                      <View style={{ padding: 12 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: "Poppins_600SemiBold",
                            color: theme.colors.text,
                            marginBottom: 4,
                          }}
                          numberOfLines={1}
                        >
                          {prop.title}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <MapPin
                            size={14}
                            color={theme.colors.textSecondary}
                            strokeWidth={1.5}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: "Poppins_400Regular",
                              color: theme.colors.textSecondary,
                              marginLeft: 4,
                            }}
                            numberOfLines={1}
                          >
                            {prop.location}
                          </Text>
                        </View>

                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: "Poppins_600SemiBold",
                            color: theme.colors.primary,
                          }}
                        >
                          {formatPrice(prop.price)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Contact Bar */}
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
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={handleCall}
            style={{
              flex: 1,
              backgroundColor: theme.colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            activeOpacity={0.8}
          >
            <Phone size={18} color="#FFFFFF" strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins_600SemiBold",
                color: "#FFFFFF",
              }}
            >
              Call
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleWhatsApp}
            style={{
              flex: 1,
              backgroundColor: "#25D366",
              borderRadius: 12,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            activeOpacity={0.8}
          >
            <MessageCircle size={18} color="#FFFFFF" strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins_600SemiBold",
                color: "#FFFFFF",
              }}
            >
              WhatsApp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEmail}
            style={{
              width: 50,
              backgroundColor: theme.colors.info,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.8}
          >
            <Mail size={18} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
