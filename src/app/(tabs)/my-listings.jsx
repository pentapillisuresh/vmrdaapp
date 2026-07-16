import {View,Text,ScrollView,TouchableOpacity,Image,Alert, ActivityIndicator, TextInput} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import {useFonts,Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium} from "@expo-google-fonts/poppins";
import {Eye,MessageCircle,Heart,Edit,Trash2,TrendingUp,MapPin,Bed,Bath,Maximize,Search,Filter,Tag,Plus} from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../../utils/theme";
import ApiService from "../../components/ApiService";
import { getAuth } from "../../utils/auth/auth";

export default function MyListingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState("active");
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const [loaded, fontError] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const tabs = [
    { id: "active", label: "Active", status: "verified" },
    { id: "pending", label: "Pending", status: "pending" },
    { id: "inactive", label: "Inactive", status: "inactive" },
    { id: "expired", label: "Expired", status: "rejected" },
    { id: "sold", label: "Sold", isSold: true },
  ];

  const transformPropertyData = (property) => {
    return {
      id: property?.id,
      title: property?.title || property?.propertyName,
      location: `${property?.address?.locality}, ${property?.address?.city}`,
      category: property?.category?.id || "all",
      price: parseFloat(property?.price) || 0,
      images: property?.photos || [],
      featured: property?.status === "verified",
      bedrooms: property?.profile?.bedrooms || 0,
      bathrooms: property?.profile?.bathrooms || 0,
      area: property?.profile?.carpetArea || property.profile?.plotArea || property.profile?.landArea || 0,
      areaUnit: property?.profile?.areaUnit || "sqft",
      status: property?.isActive ? "active" : "inactive",
      isSold: property?.isSold || false,
      isProject: property?.isProject || false
    };
  };

  // Fetch listings from API
  const fetchListings = async () => {
    setLoading(true);
    try {
      // Get client ID from storage
      const {user, token} = await getAuth();

      if (!user || !user.id) {
        Alert.alert("Error", "Please login to view your listings");
        setLoading(false);
        return;
      }

      // Call the API with proper authentication
      const response = await ApiService.get(`/properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          clientId: user.id
        }
      });

      // Handle different response structures
      let properties = [];

      if (response?.properties) {
        // If response has properties array
        properties = response.properties;
      } else if (Array.isArray(response)) {
        // If response is directly an array
        properties = response;
      } else if (response?.data?.properties) {
        // If response has data.properties
        properties = response.data.properties;
      } else if (response?.data && Array.isArray(response.data)) {
        // If response.data is an array
        properties = response.data;
      }

      // Filter properties that belong to the current user
      const userProperties = properties.filter(property =>
        property.clientId === user.id || property.createdBy === user.id
      );

      setListings(userProperties);
      filterListings(userProperties, searchQuery, filterStatus);
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert("Error", "Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filterListings = (listingsToFilter, query, status) => {
    let filtered = listingsToFilter;

    if (query) {
      filtered = filtered.filter(
        (listing) =>
          (listing?.title?.toLowerCase() || '').includes(query.toLowerCase()) ||
          (listing?.propertyName?.toLowerCase() || '').includes(query.toLowerCase()) ||
          (listing?.address?.locality?.toLowerCase() || '').includes(query.toLowerCase()) ||
          (listing?.address?.city?.toLowerCase() || '').includes(query.toLowerCase())
      );
    }

    if (status !== "all") {
      const tab = tabs.find(t => t.id === status);
      if (tab?.isSold) {
        filtered = filtered.filter((listing) => listing?.isSold === true);
      } else if (tab?.status) {
        filtered = filtered.filter((listing) => listing?.status === tab.status);
      }
    }

    setFilteredListings(filtered);
  };

  // Handle filter changes
  useEffect(() => {
    filterListings(listings, searchQuery, filterStatus);
  }, [searchQuery, filterStatus, listings]);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [])
  );

  // Handle Delete
  const handleDelete = (listing) => {
    setSelectedListing(listing);
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${listing?.title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(listing),
        },
      ]
    );
  };

  const confirmDelete = async (listing) => {
    try {
      const {token, user} = await getAuth();

      const response = await ApiService.delete(`/properties/${listing?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        // Remove deleted property from list
        setListings((prev) => prev.filter((l) => l.id !== listing?.id));
        Alert.alert("Success", "Property deleted successfully");
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      Alert.alert("Error", "Failed to delete property. Please try again.");
    }
  };

  // Handle Edit
  const handleEdit = (listing) => {
    router.push({
      pathname: "/post-property",
      params: { edit: listing.id }
    });
  };

  // Handle Mark as Sold
  const handleSold = (listing) => {
    Alert.alert(
      "Mark as Sold",
      `Are you sure you want to mark "${listing?.title}" as SOLD? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark as Sold",
          style: "destructive",
          onPress: () => confirmSold(listing.id),
        },
      ]
    );
  };

  const confirmSold = async (id) => {
    try {
      const {token,user} = await getAuth(); // Replace with actual token retrieval
      
      const response = await ApiService.put(`/properties/${id}`, 
        { isSold: true }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        Alert.alert("Success", "Property marked as SOLD successfully!");
        fetchListings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error marking as sold:', error);
      Alert.alert("Error", "Failed to update property status.");
    }
  };

  // Get photo source - FIXED VERSION
  const getPhotoSrc = (photos) => {
    if (!photos) {
      console.log("No photos available");
      return "https://via.placeholder.com/400x300?text=No+Image";
    }

    try {
      console.log("Photos data:", photos); // Debug log

      if (Array.isArray(photos)) {
        // If it's an array
        if (photos.length > 0) {
          const firstPhoto = photos[0];
          // Check if photo is an object with uri property
          if (typeof firstPhoto === 'object' && firstPhoto.uri) {
            return firstPhoto.uri;
          }
          // Check if photo is an object with url property
          else if (typeof firstPhoto === 'object' && firstPhoto.url) {
            return firstPhoto.url;
          }
          // Check if it's a string URL
          else if (typeof firstPhoto === 'string') {
            return firstPhoto;
          }
        }
      }
      else if (typeof photos === 'string') {
        // If it's a JSON string
        if (photos.startsWith('[') || photos.startsWith('{')) {
          try {
            const parsed = JSON.parse(photos);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const firstPhoto = parsed[0];
              if (typeof firstPhoto === 'object' && firstPhoto.uri) {
                return firstPhoto.uri;
              } else if (typeof firstPhoto === 'string') {
                return firstPhoto;
              }
            } else if (typeof parsed === 'object' && parsed.uri) {
              return parsed.uri;
            }
          } catch (e) {
            console.log("Failed to parse photos JSON:", e);
          }
        } else {
          // If it's a simple string URL
          return photos;
        }
      }
      else if (typeof photos === 'object' && photos.uri) {
        // If it's an object with uri property
        return photos.uri;
      }
      else if (typeof photos === 'object' && photos.url) {
        // If it's an object with url property
        return photos.url;
      }
    } catch (error) {
      console.error("Error parsing photos:", error);
    }
    return "https://via.placeholder.com/400x300?text=No+Image";
  };
  
  // Format price
  const formatPrice = (price) => {
    if (!price) return "Contact For Price";
    const num = parseFloat(price);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lac`;
    }
    return `₹${num.toLocaleString()}`;
  };

  // Get status color
  const getStatusColor = (listing) => {
    if (listing?.isSold) {
      return {
        bg: "#FEE2E2",
        text: "#DC2626",
        label: "Sold"
      };
    }

    switch(listing?.status) {
      case 'verified':
        return { bg: "#D1FAE5", text: "#059669", label: "Active" };
      case 'pending':
        return { bg: "#FEF3C7", text: "#D97706", label: "Pending" };
      case 'draft':
        return { bg: "#E5E7EB", text: "#374151", label: "Draft" };
      default:
        return { bg: "#E5E7EB", text: "#374151", label: "Inactive" };
    }
  };

  // Safe image component to prevent crashes
  const SafeImage = ({ uri, style, ...props }) => {
    const [error, setError] = useState(false);

    // Validate URI
    const isValidUri = uri && (uri.startsWith('http') || uri.startsWith('https') || uri.startsWith('file://'));

    if (!isValidUri || error) {
      return (
        <View style={[style, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#999', fontSize: 12 }}>No Image</Text>
        </View>
      );
    }

    return (
      <Image
        source={{ uri }}
        style={style}
        resizeMode="cover"
        onError={() => setError(true)}
        {...props}
      />
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
          paddingTop: insets.top + 20,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
              }}
            >
              Manage Listings
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                marginTop: 4,
              }}
            >
              View and manage all your property listings
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/post-property")}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 30,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Plus size={18} color="#FFFFFF" />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: "#FFFFFF",
              }}
            >
              Add New
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 12,
          padding: 12,
          marginTop: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Search Input */}
            <View style={{ flex: 1, position: 'relative' }}>
              <Search
                size={20}
                color={theme.colors.textSecondary}
                style={{ position: 'absolute', left: 12, top: 10, zIndex: 1 }}
              />
              <TextInput
                style={{
                  flex: 1,
                  height: 40,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 8,
                  paddingLeft: 40,
                  paddingRight: 12,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                  backgroundColor: theme.colors.background,
                }}
                placeholder="Search by title or location..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Filter Button */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                backgroundColor: theme.colors.background,
                justifyContent: 'center',
                paddingVertical: 8,
              }}
              onPress={() => Alert.alert("Filter", "Filter functionality coming soon")}
            >
              <Filter size={18} color={theme.colors.textSecondary} />
              <Text style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.text
              }}>
                Filter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 8,
          paddingVertical: 12,
          paddingBottom: 16,
        }}
        style={{
          flexGrow: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        }}
      >
        {tabs.map((tab) => {
          const isSelected = filterStatus === tab.id;
          const count = listings.filter((listing) => {
            if (tab.isSold) return listing?.isSold === true;
            if (tab.status) return listing?.status === tab.status;
            return true;
          }).length;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setFilterStatus(tab.id)}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.background,
                borderWidth: 1,
                borderColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
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
                {tab.label}
              </Text>
              {count > 0 && (
                <View
                  style={{
                    backgroundColor: isSelected
                      ? "rgba(255, 255, 255, 0.3)"
                      : theme.colors.border,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 10,
                    minWidth: 24,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Poppins_600SemiBold",
                      color: isSelected ? "#FFFFFF" : theme.colors.text,
                    }}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Properties List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ paddingVertical: 80, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{
              marginTop: 16,
              fontSize: 16,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text
            }}>
              Loading your listings...
            </Text>
          </View>
        ) : (
          <>
            {/* Results Count */}
            <View style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              backgroundColor: theme.colors.surface,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}>
              <Text style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary
              }}>
                Showing{" "}
                <Text style={{
                  fontFamily: "Poppins_600SemiBold",
                  color: theme.colors.text
                }}>
                  {filteredListings.length}
                </Text>{" "}
                of {listings.length} listings
              </Text>
            </View>

            {filteredListings.map((listing) => {
              const status = getStatusColor(listing);
              const profile = listing?.propertyProfile || listing?.profile || {};
              const address = listing?.address || {};
              return (
                <View
                  key={listing.id || listing._id}
                  style={{
                    marginHorizontal: 20,
                    marginBottom: 16,
                    backgroundColor: theme.colors.surface,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    overflow: "hidden",
                  }}
                >
                  {/* Sold Badge */}
                  {listing?.isSold && (
                    <View style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 10,
                      backgroundColor: "#DC2626",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 6,
                      borderWidth: 1.5,
                      borderColor: "#FFFFFF"
                    }}>
                      <Text style={{
                        fontSize: 11,
                        fontFamily: "Poppins_600SemiBold",
                        color: "#FFFFFF",
                        textTransform: 'uppercase'
                      }}>
                        SOLD
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() => router.push({
                      pathname: "/property-details",
                      params: { id: listing.id || listing._id }
                    })}
                    activeOpacity={0.8}
                  >
                    <SafeImage
                      uri={getPhotoSrc(listing.photos)}
                      style={{ width: "100%", height: 180 }}
                    />

                    <View style={{ padding: 16 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 12,
                        }}
                      >
                        <View style={{ flex: 1, marginRight: 12 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: "Poppins_600SemiBold",
                              color: theme.colors.text,
                              marginBottom: 6,
                            }}
                            numberOfLines={2}
                          >
                            {listing.title || "Untitled Property"}
                          </Text>

                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                            <MapPin size={14} color={theme.colors.textSecondary} />
                            <Text style={{
                              fontSize: 13,
                              fontFamily: "Poppins_400Regular",
                              color: theme.colors.textSecondary,
                            }}>
                              {address?.locality ? `${address.locality}, ${address.city}` : address?.city || "Location not specified"}
                            </Text>
                          </View>

                          <Text style={{
                            fontSize: 18,
                            fontFamily: "Poppins_600SemiBold",
                            color: theme.colors.primary,
                          }}>
                            {formatPrice(listing.price)}
                          </Text>
                        </View>

                        <View style={{
                          backgroundColor: status.bg,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 16,
                          alignSelf: 'flex-start',
                          minWidth: 70,
                          alignItems: 'center',
                        }}>
                          <Text style={{
                            fontSize: 11,
                            fontFamily: "Poppins_500Medium",
                            color: status.text,
                          }}>
                            {status.label}
                          </Text>
                        </View>
                      </View>

                      {/* Stats */}
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 12,
                          marginBottom: 8,
                          flexWrap: 'wrap',
                        }}
                      >
                        {profile?.bedrooms > 0 && (
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                            <Bed size={14} color={theme.colors.primary} />
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: "Poppins_400Regular",
                                color: theme.colors.text,
                              }}
                            >
                              {profile.bedrooms} Beds
                            </Text>
                          </View>
                        )}

                        {profile?.bathrooms > 0 && (
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                            <Bath size={14} color={theme.colors.primary} />
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: "Poppins_400Regular",
                                color: theme.colors.text,
                              }}
                            >
                              {profile.bathrooms} Baths
                            </Text>
                          </View>
                        )}

                        {(profile?.carpetArea || profile?.plotArea) && (
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                            <Maximize size={14} color={theme.colors.primary} />
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: "Poppins_400Regular",
                                color: theme.colors.text,
                              }}
                            >
                              {(profile.carpetArea || profile.plotArea)} {profile.areaUnit || "sqft"}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Action Buttons */}
                  <View
                    style={{
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderTopColor: theme.colors.border,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleEdit(listing)}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 10,
                        gap: 4,
                        borderRightWidth: 1,
                        borderRightColor: theme.colors.border,
                      }}
                      activeOpacity={0.7}
                    >
                      <Edit size={14} color={theme.colors.info} strokeWidth={1.5} />
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_500Medium",
                          color: theme.colors.info,
                        }}
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(listing)}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 10,
                        gap: 4,
                        borderRightWidth: 1,
                        borderRightColor: theme.colors.border,
                      }}
                      activeOpacity={0.7}
                    >
                      <Trash2
                        size={14}
                        color={theme.colors.error}
                        strokeWidth={1.5}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins_500Medium",
                          color: theme.colors.error,
                        }}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.push({
                        pathname: "/property-details",
                params: {
                  id: listing.id,
                  properties: JSON.stringify(transformPropertyData(listing))
                }
                      })}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 12,
                        gap: 6,
                        borderRightWidth: 1,
                        borderRightColor: theme.colors.border,
                      }}
                      activeOpacity={0.7}
                    >
                      <Eye
                        size={16}
                        color={theme.colors.text}
                        strokeWidth={1.5}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Poppins_500Medium",
                          color: theme.colors.text,
                        }}
                      >
                        View Details
                      </Text>
                    </TouchableOpacity>

                    {!listing.isSold && listing.status === "verified" && (
                      <TouchableOpacity
                        onPress={() => handleSold(listing)}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingVertical: 10,
                          gap: 4,
                        }}
                        activeOpacity={0.7}
                      >
                        <Tag
                          size={14}
                          color="#DC2626"
                          strokeWidth={1.5}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Poppins_500Medium",
                            color: "#DC2626",
                          }}
                        >
                          Mark Sold
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </>
        )}

        {!loading && filteredListings.length === 0 && (
          <View
            style={{
              paddingVertical: 60,
              paddingHorizontal: 40,
              alignItems: "center",
            }}
          >
            <Search size={64} color={theme.colors.textSecondary} />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.text,
                textAlign: "center",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No listings found
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: theme.colors.textSecondary,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Try adjusting your search or filters
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setFilterStatus("all");
              }}
              style={{
                backgroundColor: theme.colors.primary,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: "#FFFFFF",
              }}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}