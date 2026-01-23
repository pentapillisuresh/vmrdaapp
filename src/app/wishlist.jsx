import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import {useFonts,Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium} from "@expo-google-fonts/poppins";
import { ChevronLeft, MapPin, Bed, Bath, Maximize, Heart, Trash2 } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../utils/theme";
import ApiService from "../components/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loaded, fontError] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        const parsedFavorites = JSON.parse(favorites);
        
        // If we have property IDs only, fetch property details
        if (parsedFavorites.length > 0 && typeof parsedFavorites[0] === 'string') {
          fetchFavoriteProperties(parsedFavorites);
        } else {
          setWishlistProperties(parsedFavorites);
        }
      } else {
        setWishlistProperties([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setWishlistProperties([]);
    }
  };

  // Fetch property details for favorite IDs
  const fetchFavoriteProperties = async (propertyIds) => {
    setLoading(true);
    try {
      // Fetch each property detail
      const propertiesPromises = propertyIds.map(async (id) => {
        try {
          const response = await ApiService.get(`/properties/${id}`);
          return response.data?.property || null;
        } catch (error) {
          console.error(`Error fetching property ${id}:`, error);
          return null;
        }
      });

      const properties = await Promise.all(propertiesPromises);
      const validProperties = properties.filter(p => p !== null);
      setWishlistProperties(validProperties);
    } catch (error) {
      console.error('Error fetching favorite properties:', error);
      Alert.alert("Error", "Failed to load favorite properties");
    } finally {
      setLoading(false);
    }
  };

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const formatPrice = (price) => {
    if (!price) return "Contact Us";
    const num = parseFloat(price);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lac`;
    }
    return `₹${num.toLocaleString()}`;
  };

  // Get photo source
  const getPhotoSrc = (photos) => {
    if (!photos) return "https://via.placeholder.com/400x300?text=No+Image";
    
    try {
      if (Array.isArray(photos) && photos.length > 0) {
        return photos[0];
      } else if (typeof photos === 'string') {
        if (photos.startsWith('[')) {
          const parsed = JSON.parse(photos);
          return parsed[0] || "https://via.placeholder.com/400x300?text=No+Image";
        }
        return photos;
      }
    } catch (error) {
      console.error('Error parsing photos:', error);
    }
    
    return "https://via.placeholder.com/400x300?text=No+Image";
  };

  // Remove from favorites
  const removeFavorite = async (propertyId) => {
    Alert.alert(
      "Remove from Favorites",
      "Are you sure you want to remove this property from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const favorites = await AsyncStorage.getItem("favorites");
              if (favorites) {
                const parsedFavorites = JSON.parse(favorites);
                
                // Check if it's an array of IDs or full objects
                if (parsedFavorites.length > 0 && typeof parsedFavorites[0] === 'string') {
                  // Array of IDs
                  const updatedFavorites = parsedFavorites.filter(id => id !== propertyId);
                  await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                  fetchFavoriteProperties(updatedFavorites);
                } else {
                  // Array of full objects
                  const updatedFavorites = parsedFavorites.filter(item => item.id !== propertyId);
                  await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                  setWishlistProperties(updatedFavorites);
                }
              }
            } catch (error) {
              console.error('Error removing favorite:', error);
              Alert.alert("Error", "Failed to remove from favorites");
            }
          },
        },
      ]
    );
  };

  if (!loaded && !fontError) {
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
            My Favorites
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
        {wishlistProperties.length === 0 ? (
          <View
            style={{
              paddingVertical: 80,
              paddingHorizontal: 40,
              alignItems: "center",
            }}
          >
            <Heart size={64} color={theme.colors.border} fill={theme.colors.border} strokeWidth={1.5} />
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
              No Favorites Yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Explore properties and tap the ❤️ icon to save your favorites.
            </Text>
            
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home")}
              style={{
                backgroundColor: theme.colors.primary,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: "#FFFFFF",
                }}
              >
                Browse Properties
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            {wishlistProperties.map((property) => (
              <TouchableOpacity
                key={property.id}
                onPress={() => router.push({
                  pathname: "/property-details",
                  params: { id: property.id }
                })}
                style={{
                  marginBottom: 16,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                activeOpacity={0.8}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: getPhotoSrc(property.photos) }}
                    style={{ width: "100%", height: 200 }}
                    resizeMode="cover"
                  />

                  {/* Remove Button */}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      removeFavorite(property.id);
                    }}
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
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                    activeOpacity={0.7}
                  >
                    <Trash2
                      size={18}
                      color="#DC2626"
                      strokeWidth={1.5}
                    />
                  </TouchableOpacity>

                  {/* Favorite Icon */}
                  <View style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}>
                    <Heart
                      size={16}
                      color="#DC2626"
                      fill="#DC2626"
                      strokeWidth={1.5}
                    />
                  </View>
                </View>

                <View style={{ padding: 16 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Poppins_600SemiBold",
                      color: "#003366",
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
                      color={theme.colors.primary}
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
                      {property.address?.city}, {property.address?.locality}
                    </Text>
                  </View>

                  {property.profile && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 12,
                      }}
                    >
                      {property.profile.bedrooms > 0 && (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Bed
                            size={16}
                            color="#003366"
                            strokeWidth={1.5}
                          />
                          <Text
                            style={{
                              fontSize: 13,
                              fontFamily: "Poppins_400Regular",
                              color: theme.colors.text,
                              marginLeft: 4,
                            }}
                          >
                            {property.profile.bedrooms} Bed
                          </Text>
                        </View>
                      )}

                      {property.profile.bathrooms > 0 && (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Bath
                            size={16}
                            color="#003366"
                            strokeWidth={1.5}
                          />
                          <Text
                            style={{
                              fontSize: 13,
                              fontFamily: "Poppins_400Regular",
                              color: theme.colors.text,
                              marginLeft: 4,
                            }}
                          >
                            {property.profile.bathrooms} Bath
                          </Text>
                        </View>
                      )}

                      {(property.profile.carpetArea || property.profile.plotArea) && (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Maximize
                            size={16}
                            color="#003366"
                            strokeWidth={1.5}
                          />
                          <Text
                            style={{
                              fontSize: 13,
                              fontFamily: "Poppins_400Regular",
                              color: theme.colors.text,
                              marginLeft: 4,
                            }}
                          >
                            {property.profile.carpetArea || property.profile.plotArea} {property.profile.areaUnit}
                          </Text>
                        </View>
                      )}
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
          </View>
        )}
      </ScrollView>
    </View>
  );
}