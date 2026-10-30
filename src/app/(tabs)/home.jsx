import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Dimensions, FlatList, RefreshControl } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback, useRef } from "react";
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Search, MapPin, Heart, Bed, Bath, Maximize, SlidersHorizontal, Building2, Sparkles, ChevronRight } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../../utils/theme";
import ApiService from "../../components/ApiService";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTab, setSelectedTab] = useState("properties");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [cityLocalities, setCityLocalities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [limit] = useState(10);
  const [hasMoreProperties, setHasMoreProperties] = useState(true);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const flatListRef = useRef(null);

  const [loaded, fontError] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const getDashBoardData = async (pageNum = 1, isLoadMore = false, isProject = false) => {
    if (!isLoadMore) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const response = await ApiService.get(`/dashboard`, {
        params: { limit, page: pageNum }
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
          if (isLoadMore && !isProject) {
            setProperties(prev => [...prev, ...propertiesList]);
          } else if (!isProject) {
            setProperties(propertiesList);
          }
          setTotalProperties(dashboardData.mostViewedProperties.total || propertiesList.length);
          setHasMoreProperties(dashboardData.mostViewedProperties.currentPage < 
            dashboardData.mostViewedProperties.totalPages);
          if (!isProject) {
            setPage(pageNum);
          }
        }
        
        // Set projects from mostViewedProjects
        if (dashboardData.mostViewedProjects?.projects) {
          const projectsList = dashboardData.mostViewedProjects.projects;
          if (isLoadMore && isProject) {
            setProjects(prev => [...prev, ...projectsList]);
          } else if (isProject) {
            setProjects(projectsList);
          }
          setTotalProjects(dashboardData.mostViewedProjects.total || projectsList.length);
          setHasMoreProjects(dashboardData.mostViewedProjects.currentPage < 
            dashboardData.mostViewedProjects.totalPages);
          if (isProject) {
            setProjectPage(pageNum);
          }
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
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const loadMoreProperties = async () => {
    if (selectedTab === "properties") {
      if (!hasMoreProperties || loadingMore || loading) return;
      const nextPage = page + 1;
      await getDashBoardData(nextPage, true, false);
    } else {
      if (!hasMoreProjects || loadingMore || loading) return;
      const nextPage = projectPage + 1;
      await getDashBoardData(nextPage, true, true);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setProjectPage(1);
    setHasMoreProperties(true);
    setHasMoreProjects(true);
    if (selectedTab === "properties") {
      await getDashBoardData(1, false, false);
    } else {
      await getDashBoardData(1, false, true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedTab === "properties") {
        getDashBoardData(1, false, false);
      } else {
        getDashBoardData(1, false, true);
      }
    }, [selectedTab])
  );

  // Transform API property data to match the UI format
  const transformPropertyData = (property) => {
    return {
      id: property?.id,
      title: property?.title || property?.propertyName,
      location: `${property?.address?.locality || ''}, ${property?.address?.city || ''}`,
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
      isProject: property?.isProject || false,
      views: property?.views || 0,
      createdAt: property?.createdAt || new Date().toISOString(),
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

  const renderPropertyCard = ({ item }) => {
    const image = item.images && JSON.parse(item.images)[0];
    
    return (
      <TouchableOpacity
        onPress={() => router.push({
          pathname: "/property-details",
          params: {
            id: item.id,
            properties: JSON.stringify(transformPropertyData(item))
          }
        })}
        style={{
          marginHorizontal: 20,
          marginBottom: 20,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 4,
        }}
        activeOpacity={0.9}
      >
        {/* Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={
              image
                ? { uri: image }
                : require("../../../assets/images/applogo.png")
            }
            style={{ width: "100%", height: 220 }}
            resizeMode="cover"
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
            }}
          />

          {/* Featured Badge */}
          {item.featured && (
            <View
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                backgroundColor: item.isProject ? "#10B981" : theme.colors.primary,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Sparkles size={12} color="#FFFFFF" />
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Poppins_500Medium",
                  color: "#FFFFFF",
                }}
              >
                {item.isProject ? "Project" : "Featured"}
              </Text>
            </View>
          )}

          {/* Price Tag */}
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              backgroundColor: 'rgba(0,0,0,0.6)',
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_700Bold",
                color: "#FFFFFF",
              }}
            >
              {formatPrice(item.price)}
            </Text>
          </View>

          {/* Wishlist Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
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
              fontSize: 17,
              fontFamily: "Poppins_600SemiBold",
              color: '#1A1A1A',
              marginBottom: 4,
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <MapPin
              size={14}
              color="#888888"
              strokeWidth={1.5}
            />
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_400Regular",
                color: "#888888",
                marginLeft: 4,
              }}
              numberOfLines={1}
            >
              {item.location}
            </Text>
          </View>

          {/* Property Stats */}
          {(item.bedrooms > 0 || item.bathrooms > 0 || item.area > 0) && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                marginBottom: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: '#F0F0F0',
              }}
            >
              {item.bedrooms > 0 && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Bed size={16} color="#888888" strokeWidth={1.5} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_400Regular",
                      color: "#666666",
                      marginLeft: 4,
                    }}
                  >
                    {item.bedrooms}
                  </Text>
                </View>
              )}

              {item.bathrooms > 0 && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Bath size={16} color="#888888" strokeWidth={1.5} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_400Regular",
                      color: "#666666",
                      marginLeft: 4,
                    }}
                  >
                    {item.bathrooms}
                  </Text>
                </View>
              )}

              {item.area > 0 && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Maximize size={16} color="#888888" strokeWidth={1.5} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_400Regular",
                      color: "#666666",
                      marginLeft: 4,
                    }}
                  >
                    {item.area} {item.areaUnit}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* View Count */}
          {item.views > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Poppins_400Regular",
                  color: "#999999",
                }}
              >
                👁 {item.views} views
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View
      style={{
        paddingVertical: 80,
        paddingHorizontal: 40,
        alignItems: "center",
      }}
    >
      <Building2 size={60} color="#CCCCCC" strokeWidth={1.5} />
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Poppins_600SemiBold",
          color: '#1A1A1A',
          textAlign: "center",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        No {selectedTab === "properties" ? "Properties" : "Projects"} Found
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Poppins_400Regular",
          color: "#888888",
          textAlign: "center",
        }}
      >
        Try adjusting your filters or search criteria
      </Text>
    </View>
  );

  if (!loaded && !fontError) {
    return null;
  }

  if (loading && properties.length === 0 && projects.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F7FA', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <StatusBar style="dark" />

      {/* Header with Gradient Background */}
      <LinearGradient
        colors={[theme.colors.primary || '#FF6B35', theme.colors.primaryLight || '#FF8A5C']}
        style={{
          paddingTop: insets.top + 20,
          paddingBottom: 24,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_400Regular",
                color: 'rgba(255,255,255,0.8)',
                letterSpacing: 1,
              }}
            >
              Welcome Back
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Poppins_700Bold",
                color: '#FFFFFF',
                marginTop: 2,
              }}
            >
              Find Your Dream Property
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => router.push("/blog")}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 30,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_500Medium",
                color: "#FFFFFF",
                letterSpacing: 0.5,
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
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 16,
              paddingHorizontal: 16,
            }}
          >
            <Search
              size={20}
              color="#888888"
              strokeWidth={1.5}
            />
            <TextInput
              style={{
                flex: 1,
                fontSize: 14,
                fontFamily: "Poppins_400Regular",
                color: '#1A1A1A',
                paddingVertical: 14,
                paddingHorizontal: 12,
              }}
              placeholder="Search properties, location..."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push("/filter-properties")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <SlidersHorizontal size={22} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Categories - Horizontal Scroll */}
      <View style={{ backgroundColor: '#FFFFFF' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 14,
            gap: 8,
          }}
          style={{
            flexGrow: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#F0F0F0',
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
                  borderRadius: 25,
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : '#F5F7FA',
                  borderWidth: 1,
                  borderColor: isSelected
                    ? theme.colors.primary
                    : '#E8E8E8',
                  marginRight: 8,
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_500Medium",
                    color: isSelected ? "#FFFFFF" : '#1A1A1A',
                  }}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Properties/Projects Tabs */}
      <View style={{
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
      }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab("properties");
            setPage(1);
            setHasMoreProperties(true);
            getDashBoardData(1, false, false);
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 12,
            backgroundColor: selectedTab === "properties"
              ? theme.colors.primary
              : '#F5F7FA',
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
                : '#1A1A1A',
            }}
          >
            Properties ({totalProperties})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setSelectedTab("projects");
            setProjectPage(1);
            setHasMoreProjects(true);
            getDashBoardData(1, false, true);
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 12,
            backgroundColor: selectedTab === "projects"
              ? theme.colors.primary
              : '#F5F7FA',
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
                : '#1A1A1A',
            }}
          >
            Projects ({totalProjects})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Properties List */}
      <FlatList
        ref={flatListRef}
        data={filteredProperties}
        renderItem={renderPropertyCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
        }}
        onEndReached={loadMoreProperties}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
}