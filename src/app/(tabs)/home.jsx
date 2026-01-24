import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";
import { Search, MapPin, Heart, Bed, Bath, Maximize, SlidersHorizontal } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../../utils/theme";
import ApiService from "../../components/ApiService";


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTab, setSelectedTab] = useState("properties"); // "properties" or "projects"
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [cityLocalities, setCityLocalities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const [loaded, fontError] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const getDashBoardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.get(`/dashboard`, {
        params: { limit, page }
      });
      if (response?.status) {
        const dashboardData = response?.data;
        // Transform API categories to match the UI format
        const transformedCategories = [
          { id: "all", label: "All" },
          ...dashboardData.categories.map(category => ({
            id: category.id,
            label: category.name
          }))
        ];
        setCategories(transformedCategories);

        // Set properties from mostViewedProperties
        if (dashboardData.mostViewedProperties?.properties) {
          const propertiesList = dashboardData.mostViewedProperties.properties;
          setProperties(propertiesList);
          setHasMore(dashboardData.mostViewedProperties.currentPage <
            dashboardData.mostViewedProperties.totalPages);
        }
        // Set projects from mostViewedProjects
        if (dashboardData.mostViewedProjects?.projects) {
          const projectsList = dashboardData.mostViewedProjects.projects;
          setProjects(projectsList);
        }

        setCityLocalities(dashboardData?.cityLocalities || []);
      } else {
        setError('Failed to get dashboard data.');
      }
    } catch (err) {
      console.error("dashboard data error:", err);
      setError(
        err?.response?.data?.message ||
        'Failed to get dashboard data.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProperties = async () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setLoading(true);

    try {
      const response = await ApiService.get(`/dashboard`, {
        params: { limit, page: nextPage }
      });

      if (response.data?.status) {
        const dashboardData = response.data.data;
        if (dashboardData.mostViewedProperties?.properties) {
          setProperties(prev => [...prev, ...dashboardData.mostViewedProperties.properties]);
          setHasMore(dashboardData.mostViewedProperties.currentPage <
            dashboardData.mostViewedProperties.totalPages);
          setPage(nextPage);
        }
      }
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getDashBoardData();
    }, [])
  );

  // Transform API property data to match the UI format
  const transformPropertyData = (property) => {
    return {
      id: property?.id,
      title: property?.title || property?.propertyName,
      location: `${property?.address?.locality}, ${property?.address?.city}`,
      category: property.category?.id || "all",
      price: parseFloat(property?.price) || 0,
      images: property?.photos || [],
      featured: property?.status === "verified",
      bedrooms: property?.profile?.bedrooms || 0,
      bathrooms: property?.profile?.bathrooms || 0,
      area: property?.profile?.carpetArea || property?.profile?.plotArea || property?.profile?.landArea || 0,
      areaUnit: property?.profile?.areaUnit || "sqft",
      status: property?.isActive ? "active" : "inactive",
      isSold: property?.isSold || false,
      isProject: property?.isProject || false
    };
  };

  // Filter properties based on selected tab, category and search
  const getFilteredData = () => {
    const dataList = selectedTab === "properties" ? properties : projects;

    return dataList
      .map(transformPropertyData)
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "all" || item.category === selectedCategory;
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch && item.status === "active" && !item.isSold;
      });
  };

  const filteredProperties = getFilteredData();
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (!loaded && !fontError) {
    return null;
  }

  if (loading && properties.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style={theme.statusBarStyle} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
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
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>

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
        <TouchableOpacity
          onPress={() => router.push("/blog")}
          style={{
            paddingVertical: 5,
            alignItems: "center",
            borderRadius: 8,
            backgroundColor:  theme.colors.primary,
            borderWidth: 1,width:80,height:40,
            borderColor: theme.colors.primary,
            marginLeft: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color:  "#FFFFFF",
              padding:5
            }}
          >
            Blogs
          </Text>
        </TouchableOpacity>

        </View>

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
      {/* Properties/Projects Tabs */}
      <View style={{
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.background,
      }}>
        <TouchableOpacity
          onPress={() => setSelectedTab("properties")}
          style={{
            flex: 1,
            paddingVertical: 10,
            alignItems: "center",
            borderRadius: 8,
            backgroundColor: selectedTab === "properties"
              ? theme.colors.primary
              : theme.colors.surface,
            borderWidth: 1,
            borderColor: selectedTab === "properties"
              ? theme.colors.primary
              : theme.colors.border,
            marginRight: 8,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: selectedTab === "properties"
                ? "#FFFFFF"
                : theme.colors.text,
            }}
          >
            Properties ({properties.filter(p => !p.isProject && p.isActive && !p.isSold).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedTab("projects")}
          style={{
            flex: 1,
            paddingVertical: 10,
            alignItems: "center",
            borderRadius: 8,
            backgroundColor: selectedTab === "projects"
              ? theme.colors.primary
              : theme.colors.surface,
            borderWidth: 1,
            borderColor: selectedTab === "projects"
              ? theme.colors.primary
              : theme.colors.border,
            marginLeft: 8,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: selectedTab === "projects"
                ? "#FFFFFF"
                : theme.colors.text,
            }}
          >
            Projects ({projects.filter(p => p.isProject && p.isActive && !p.isSold).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Properties List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

          if (isCloseToBottom && hasMore && !loading) {
            loadMoreProperties();
          }
        }}
        scrollEventThrottle={400}
      >
        {filteredProperties.map((property) => {
          const image = JSON.parse(property.images)[0]
          return (
            <TouchableOpacity
              key={property.id}
              onPress={() => router.push({
                pathname: "/property-details",
                params: {
                  id: property.id,
                  properties: JSON.stringify(transformPropertyData(property))
                }
              })}
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
                  source={
                    image
                      ? { uri: image }
                      : require("../../../assets/images/applogo.png")
                  }
                  style={{ width: "100%", height: 200 }}
                  resizeMode="cover"
                />


                {/* Featured Badge */}
                {property.featured && (
                  <View
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      backgroundColor: property.isProject
                        ? "#10B981"
                        : theme.colors.primary,
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
                      {property.isProject ? "Project" : property.featured ? "Featured" : "Property"}                    </Text>
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

                    {property.area > 0 && (
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
                    )}
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
          )
        })}

        {loading && filteredProperties.length > 0 && (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}

        {filteredProperties.length === 0 && !loading && (
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
              No {selectedTab === "properties" ? "Properties" : "Projects"} Found            </Text>
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