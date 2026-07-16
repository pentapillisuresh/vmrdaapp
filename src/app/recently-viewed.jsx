import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Maximize, Clock, TrendingUp } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../utils/theme";
import ApiService from "../components/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "../utils/auth/auth";

export default function RecentlyViewedScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loaded, fontError] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  // Format price
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

  // Format viewed time
  const formatViewedTime = (dateString) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
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

  // Fetch recently viewed properties from API
  const fetchRecentProperties = async () => {
    setLoading(true);
    try {
      // Get token from storage (adjust based on your storage method)
      const { token, user } = await getAuth(); // Replace with actual client data retrieval
      const clientId = user ? user?.id : null;

      if (!token) {
        // Fallback to local storage if no token
        const localHistory = await AsyncStorage.getItem("recentlyViewed");
        if (localHistory) {
          const parsedHistory = JSON.parse(localHistory);
          setRecentProperties(parsedHistory);
        }
        setLoading(false);
        return;
      }

      const response = await ApiService.get(`/propertyView/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        const propertyList = response.map((item) => item.property) || [];
        setRecentProperties(propertyList);

        // Also save to local storage as backup
        await AsyncStorage.setItem("recentlyViewed", JSON.stringify(propertyList));
      }
    } catch (error) {
      console.error("Error fetching recent properties:", error);

      // Fallback to local storage
      const localHistory = await AsyncStorage.getItem("recentlyViewed");
      if (localHistory) {
        const parsedHistory = JSON.parse(localHistory);
        setRecentProperties(parsedHistory);
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      fetchRecentProperties();
    }, [])
  );

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < Math.ceil(recentProperties.length / 2) - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!loaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
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
          <ChevronLeft size={24} color="#1F2937" strokeWidth={1.5} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Poppins_600SemiBold",
              color: "#1F2937",
            }}
          >
            Recently Viewed
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Poppins_400Regular",
              color: "#6B7280",
              marginTop: 2,
            }}
          >
            {recentProperties.length} recently viewed
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Heading Section */}
        <View style={{ alignItems: 'center', marginBottom: 24, paddingHorizontal: 20 }}>
          <View style={{
            backgroundColor: "#FEF3C7",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginBottom: 8
          }}>
            <Text style={{
              color: "#EA580C",
              fontSize: 12,
              fontFamily: "Poppins_500Medium",
              textTransform: 'uppercase'
            }}>
              Recently Viewed
            </Text>
          </View>

          <Text style={{
            fontSize: 28,
            fontFamily: "Poppins_600SemiBold",
            color: "#1F2937",
            textAlign: 'center',
            marginBottom: 4
          }}>
            Recently Viewed Properties
          </Text>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{
              marginTop: 16,
              fontSize: 16,
              fontFamily: "Poppins_500Medium",
              color: "#6B7280"
            }}>
              Loading properties...
            </Text>
          </View>
        ) : recentProperties.length === 0 ? (
          <View style={{
            paddingVertical: 80,
            paddingHorizontal: 40,
            alignItems: "center"
          }}>
            <Clock size={64} color="#E5E7EB" strokeWidth={1.5} />
            <Text style={{
              fontSize: 20,
              fontFamily: "Poppins_600SemiBold",
              color: "#1F2937",
              textAlign: "center",
              marginTop: 24,
              marginBottom: 8,
            }}>
              No History Yet
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: "#6B7280",
              textAlign: "center",
            }}>
              Properties you view will appear here
            </Text>
          </View>
        ) : (
          <>
            {/* Properties Grid - Show 2 per row */}
            <View style={{ paddingHorizontal: 20 }}>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginHorizontal: -8
              }}>
                {recentProperties.slice(currentIndex * 2, currentIndex * 2 + 2).map((property) => (
                  <TouchableOpacity
                    key={property.id}
                    onPress={() => router.push({
                      pathname: "/property-details",
                      params: { id: property.id }
                    })}
                    style={{
                      width: '48%',
                      backgroundColor: "#FFFFFF",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#F3F4F6",
                      overflow: "hidden",
                      marginBottom: 16,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                    activeOpacity={0.8}
                  >
                    {/* Image Container */}
                    <View style={{ position: 'relative' }}>
                      <Image
                        source={{ uri: getPhotoSrc(property.photos) }}
                        style={{ width: '100%', height: 140 }}
                        resizeMode="cover"
                      />

                      {/* Viewed Time Badge */}
                      <View style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}>
                        <Clock size={10} color="#FFFFFF" strokeWidth={1.5} />
                        <Text style={{
                          fontSize: 10,
                          fontFamily: "Poppins_500Medium",
                          color: "#FFFFFF",
                        }}>
                          {formatViewedTime(property.createdAt)}
                        </Text>
                      </View>
                    </View>

                    {/* Property Details */}
                    <View style={{ padding: 12 }}>
                      <Text style={{
                        fontSize: 14,
                        fontFamily: "Poppins_600SemiBold",
                        color: "#003366",
                        marginBottom: 4,
                      }} numberOfLines={2}>
                        {property.title}
                      </Text>

                      <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}>
                        <MapPin
                          size={12}
                          color="#EA580C"
                          strokeWidth={1.5}
                        />
                        <Text style={{
                          fontSize: 11,
                          fontFamily: "Poppins_400Regular",
                          color: "#6B7280",
                          marginLeft: 4,
                          flex: 1,
                        }} numberOfLines={1}>
                          {property.address?.locality}, {property.address?.city}
                        </Text>
                      </View>

                      {/* Property Stats */}
                      {property.profile && (
                        <View style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                        }}>
                          {property.profile.bedrooms > 0 && (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              <Bed
                                size={12}
                                color="#003366"
                                strokeWidth={1.5}
                              />
                              <Text style={{
                                fontSize: 10,
                                fontFamily: "Poppins_400Regular",
                                color: "#6B7280",
                                marginLeft: 2,
                              }}>
                                {property.profile.bedrooms}
                              </Text>
                            </View>
                          )}

                          {property.profile.bathrooms > 0 && (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              <Bath
                                size={12}
                                color="#003366"
                                strokeWidth={1.5}
                              />
                              <Text style={{
                                fontSize: 10,
                                fontFamily: "Poppins_400Regular",
                                color: "#6B7280",
                                marginLeft: 2,
                              }}>
                                {property.profile.bathrooms}
                              </Text>
                            </View>
                          )}

                          {(property.profile.carpetArea || property.profile.plotArea) && (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              <Maximize
                                size={12}
                                color="#003366"
                                strokeWidth={1.5}
                              />
                              <Text style={{
                                fontSize: 10,
                                fontFamily: "Poppins_400Regular",
                                color: "#6B7280",
                                marginLeft: 2,
                              }}>
                                {property.profile.carpetArea || property.profile.plotArea} {property.profile.areaUnit}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}

                      {/* Price */}
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 8
                      }}>
                        <Text style={{
                          fontSize: 16,
                          fontFamily: "Poppins_600SemiBold",
                          color: "#EA580C",
                        }}>
                          {formatPrice(property.price)}
                        </Text>

                        <Text style={{
                          fontSize: 11,
                          fontFamily: "Poppins_500Medium",
                          color: "#003366",
                        }}>
                          View →
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Navigation Controls */}
            {recentProperties.length > 2 && (
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 24,
                marginBottom: 16,
                paddingHorizontal: 20
              }}>
                {/* Prev Button */}
                <TouchableOpacity
                  onPress={handlePrev}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    opacity: currentIndex === 0 ? 0.5 : 1,
                  }}
                  disabled={currentIndex === 0}
                  activeOpacity={0.7}
                >
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: currentIndex === 0 ? "#F3F4F6" : "#FFFFFF",
                  }}>
                    <ChevronLeft size={16} color={currentIndex === 0 ? "#9CA3AF" : "#6B7280"} />
                  </View>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: "Poppins_500Medium",
                    color: currentIndex === 0 ? "#9CA3AF" : "#6B7280",
                  }}>
                    Prev
                  </Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={{ width: 1, height: 16, backgroundColor: "#E5E7EB", marginHorizontal: 16 }} />

                {/* Next Button */}
                <TouchableOpacity
                  onPress={handleNext}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    opacity: currentIndex >= Math.ceil(recentProperties.length / 2) - 1 ? 0.5 : 1,
                  }}
                  disabled={currentIndex >= Math.ceil(recentProperties.length / 2) - 1}
                  activeOpacity={0.7}
                >
                  <Text style={{
                    fontSize: 14,
                    fontFamily: "Poppins_500Medium",
                    color: currentIndex >= Math.ceil(recentProperties.length / 2) - 1 ? "#9CA3AF" : "#6B7280",
                  }}>
                    Next
                  </Text>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: currentIndex >= Math.ceil(recentProperties.length / 2) - 1 ? "#F3F4F6" : "#FFFFFF",
                  }}>
                    <ChevronRight size={16} color={currentIndex >= Math.ceil(recentProperties.length / 2) - 1 ? "#9CA3AF" : "#6B7280"} />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Contact Us Button for Price-less Properties */}
            {recentProperties.some(p => !p.price) && (
              <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
                <Text style={{
                  fontSize: 12,
                  fontFamily: "Poppins_400Regular",
                  color: "#6B7280",
                  textAlign: 'center',
                  marginBottom: 8
                }}>
                  Some properties don't have prices listed
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3B82F6",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    alignSelf: 'center',
                  }}
                  onPress={() => Alert.alert("Contact", "Contact us for price details!")}
                >
                  <Text style={{
                    fontSize: 13,
                    fontFamily: "Poppins_500Medium",
                    color: "#FFFFFF",
                  }}>
                    Contact Us for Price
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}