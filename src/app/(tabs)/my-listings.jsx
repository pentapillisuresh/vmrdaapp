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

  // Fetch listings from API
  const fetchListings = async () => {
    setLoading(true);
    try {
      // Get client ID from storage (adjust based on your storage method)
      const {user,token} = await getAuth(); // Replace with actual client data retrieval
      const clientId = user ? user?.id : null;
      
      if (!clientId) {
        Alert.alert("Error", "Please login to view your listings");
        setLoading(false);
        return;
      }

      const response = await ApiService.get(`/properties?clientId=${clientId}`);
      
      if (response?.properties) {
        const data = response.properties;
        setListings(data);
        filterListings(data, searchQuery, filterStatus);
      } else {
        setListings([]);
        setFilteredListings([]);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert("Error", "Failed to load listings");
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
          listing?.title?.toLowerCase().includes(query.toLowerCase()) ||
          listing?.propertyName?.toLowerCase().includes(query.toLowerCase()) ||
          (listing?.address?.locality?.toLowerCase().includes(query.toLowerCase())) ||
          (listing?.address?.city?.toLowerCase().includes(query.toLowerCase()))
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
      // Get token from storage (adjust based on your storage method)
      const {token,user} = await getAuth(); // Replace with actual token retrieval
      
      const response = await ApiService.delete(`properties/${listing?.id}`, {
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
      
      const response = await ApiService.put(`/properties/${user.id}`, 
        { isSold: true }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        Alert.alert("Success", "Property marked as SOLD successfully!");
        fetchListings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error marking as sold:', error);
      Alert.alert("Error", "Failed to update property status.");
    }
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
          <View style={{ flex: 1 }}>
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
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 30,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
                color: "#FFFFFF",
              }}
            >
              Add New Listing
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={{ 
          backgroundColor: "#FFFFFF", 
          borderRadius: 12, 
          padding: 16, 
          marginTop: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Search Input */}
            <View style={{ flex: 1, position: 'relative' }}>
              <Search 
                size={20} 
                color={theme.colors.textSecondary} 
                style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}
              />
              <TextInput
                style={{
                  flex: 1,
                  height: 44,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 8,
                  paddingLeft: 40,
                  paddingRight: 12,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                }}
                placeholder="Search by title or location..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Filter Dropdown */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: 8,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 8,
              paddingHorizontal: 12,
            }}>
              <Filter size={20} color={theme.colors.textSecondary} />
              <Text style={{ 
                fontSize: 14, 
                fontFamily: "Poppins_400Regular", 
                color: theme.colors.text 
              }}>
                Filter
              </Text>
            </View>
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
        }}
        style={{
          flexGrow: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          backgroundColor: "#FFFFFF",
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
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
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
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ 
              marginTop: 16, 
              fontSize: 16, 
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text 
            }}>
              Loading listings...
            </Text>
          </View>
        ) : (
          <>
            {/* Results Count */}
            <View style={{ 
              paddingHorizontal: 20, 
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
              backgroundColor: "#FFFFFF"
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
              const profile = listing?.profile || {};
              const address = listing?.address || {};
              
              return (
                <View
                  key={listing.id}
                  style={{
                    marginHorizontal: 20,
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
                >
                  {/* Sold Badge */}
                  {listing?.isSold && (
                    <View style={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12, 
                      zIndex: 10,
                      backgroundColor: "#DC2626",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: "#FFFFFF"
                    }}>
                      <Text style={{ 
                        fontSize: 12, 
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
                      params: { id: listing.id }
                    })}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: getPhotoSrc(listing.photos) }}
                      style={{ width: "100%", height: 180 }}
                      resizeMode="cover"
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
                              fontSize: 18,
                              fontFamily: "Poppins_600SemiBold",
                              color: theme.colors.text,
                              marginBottom: 8,
                            }}
                            numberOfLines={2}
                          >
                            {listing.title}
                          </Text>
                          
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                            <MapPin size={14} color={theme.colors.textSecondary} />
                            <Text style={{
                              fontSize: 13,
                              fontFamily: "Poppins_400Regular",
                              color: theme.colors.textSecondary,
                            }}>
                              {address?.locality ? `${address.locality}, ${address.city}` : address?.city}
                            </Text>
                          </View>
                          
                          <Text style={{
                            fontSize: 20,
                            fontFamily: "Poppins_600SemiBold",
                            color: theme.colors.primary,
                          }}>
                            {formatPrice(listing.price)}
                          </Text>
                        </View>

                        <View style={{
                          backgroundColor: status.bg,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 20,
                          alignSelf: 'flex-start',
                        }}>
                          <Text style={{
                            fontSize: 12,
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
                          gap: 16,
                          marginBottom: 12,
                          flexWrap: 'wrap',
                        }}
                      >
                        {profile?.bedrooms > 0 && (
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Bed size={16} color={theme.colors.primary} />
                            <Text
                              style={{
                                fontSize: 13,
                                fontFamily: "Poppins_400Regular",
                                color: theme.colors.text,
                                marginLeft: 4,
                              }}
                            >
                              {profile.bedrooms} Beds
                            </Text>
                          </View>
                        )}

                        {profile?.bathrooms > 0 && (
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Bath size={16} color={theme.colors.primary} />
                            <Text
                              style={{
                                fontSize: 13,
                                fontFamily: "Poppins_400Regular",
                                color: theme.colors.text,
                                marginLeft: 4,
                              }}
                            >
                              {profile.bathrooms} Baths
                            </Text>
                          </View>
                        )}

                        {(profile?.carpetArea || profile?.plotArea) && (
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Maximize size={16} color={theme.colors.primary} />
                            <Text
                              style={{
                                fontSize: 13,
                                fontFamily: "Poppins_400Regular",
                                color: theme.colors.text,
                                marginLeft: 4,
                              }}
                            >
                              {(profile.carpetArea || profile.plotArea)} {profile.areaUnit || "sqft"}
                            </Text>
                          </View>
                        )}

                        {listing?.viewCount > 0 && (
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Eye size={16} color={theme.colors.info} />
                            <Text
                              style={{
                                fontSize: 13,
                                fontFamily: "Poppins_400Regular",
                                color: theme.colors.text,
                                marginLeft: 4,
                              }}
                            >
                              {listing.viewCount} views
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
                        paddingVertical: 12,
                        gap: 6,
                        borderRightWidth: 1,
                        borderRightColor: theme.colors.border,
                      }}
                      activeOpacity={0.7}
                    >
                      <Edit size={16} color={theme.colors.info} strokeWidth={1.5} />
                      <Text
                        style={{
                          fontSize: 13,
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
                        paddingVertical: 12,
                        gap: 6,
                        borderRightWidth: 1,
                        borderRightColor: theme.colors.border,
                      }}
                      activeOpacity={0.7}
                    >
                      <Trash2
                        size={16}
                        color={theme.colors.error}
                        strokeWidth={1.5}
                      />
                      <Text
                        style={{
                          fontSize: 13,
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
                        params: { id: listing.id }
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
                          paddingVertical: 12,
                          gap: 6,
                        }}
                        activeOpacity={0.7}
                      >
                        <Tag
                          size={16}
                          color="#DC2626"
                          strokeWidth={1.5}
                        />
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: "Poppins_500Medium",
                            color: "#DC2626",
                          }}
                        >
                          Mark as Sold
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
                fontSize: 20,
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
          </View>
        )}
      </ScrollView>
    </View>
  );
}