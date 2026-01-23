import {View,Text,TextInput,ScrollView,TouchableOpacity,Image,Dimensions,Share,Linking,Alert, ActivityIndicator} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useRef,useCallback } from "react";
import {useFonts,Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium} from "@expo-google-fonts/poppins";
import {ChevronLeft,ChevronRight,ChevronUp,ChevronDown,Heart,Share2,MapPin,Bed,Bath,Maximize,Phone,MessageCircle,Mail,Check,Home,Compass,Building,CheckCircle,Calendar,ArrowLeft} from "lucide-react-native";
import { router, useLocalSearchParams,useFocusEffect } from "expo-router";
import { useTheme } from "../utils/theme";
import ApiService from "../components/ApiService";
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get("window");

const formatPrice = (price) => {
  if (!price) return "Price on request";
  const num = parseFloat(price);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lac`;
  }
  return `₹${num.toLocaleString()}`;
};

export default function PropertyDetailsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { id,properties } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(properties);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("");

  const [loaded, fontError] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  // Fetch property details
  const fetchPropertyDetails = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get(`/properties/${id}`);
      
      if (response?.property) {
        const propertyDetails = response.property;
        setProperty(propertyDetails);
        
        // Fetch similar properties
        getPropertyByCategory(propertyDetails);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      Alert.alert("Error", "Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch similar properties
  const getPropertyByCategory = async (propertyDetails) => {
    try {
      const payload = {
        page: 1,
        limit: 3,
        categoryId: propertyDetails?.categoryId,
        marketType: propertyDetails?.marketType,
      };
      
      const response = await ApiService.get('/properties', { params: payload });
      
      if (response?.properties) {
        const data = response.properties;
        const filtered = data.filter((item) => item.id !== propertyDetails?.id);
        setSimilarProperties(filtered);
      }
    } catch (error) {
      console.error('Error fetching similar properties:', error);
    }
  };

  // Record property view
  const addViewProperty = async () => {
    try {
      // Get token from your storage (adjust based on your storage method)
      const clientToken = ""; // Replace with actual token retrieval
      const response = await ApiService.post(
        `/propertyView`,
        { propertyId: id },
        {
          headers: {
            Authorization: `Bearer ${clientToken}`,
          },
        }
      );
      console.log('Property view recorded:', response);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  // Update view count
  const updateViewCount = async () => {
    try {
      const clientToken = ""; // Replace with actual token retrieval
      const response = await ApiService.put(`/properties/updateView/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
        },
      });
      console.log('View count updated');
    } catch (err) {
      console.error('Error updating view count:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPropertyDetails();
    }, [])
  );

  useEffect(() => {
    
    // Record view
    const isLogin = false; // Replace with actual login check
    if (isLogin) {
      addViewProperty();
    }
    
    // Update view count after 5 seconds
    const timer = setTimeout(() => {
      updateViewCount();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [id]);


  // Share functionality
  const getShareUrl = () => {
    return `property/${id}`; // Adjust based on your app URL structure
  };

  const getShareMessage = () => {
    return `Check out this amazing property: ${property?.title} - ${formatPrice(property?.price)}`;
  };

  const shareOnWhatsApp = () => {
    const url = `whatsapp://send?text=${encodeURIComponent(getShareMessage() + '\n' + getShareUrl())}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "WhatsApp is not installed");
    });
  };

  const shareViaEmail = () => {
    const subject = `Check out this property: ${property?.title}`;
    const body = `${getShareMessage()}\n\nView more details: ${getShareUrl()}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(getShareUrl());
      Alert.alert("Success", "Link copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy: ', err);
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  const handleNativeShare = async () => {
    try {
      await Share.share({
        title: property?.title,
        message: `${getShareMessage()}\n${getShareUrl()}`,
        url: getShareUrl(),
      });
    } catch (error) {
      console.log('Error sharing:', error);
      copyToClipboard();
    }
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phoneNumber) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setFormStatus("Submitting...");
    
    const payload = {
      propertyId: property?.id || null,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      message: formData.message,
      leadType: "callback",
    };

    try {
      const response = await ApiService.post("/leads", payload);
      console.log("rrr::",response);
      if (response) {
        setFormStatus("Thank you! Our team will contact you soon.");
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
        setTimeout(() => {
          setFormStatus("");
        }, 3000);
      } else {
        setFormStatus("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setFormStatus("Something went wrong. Please try again later.");
    }
  };

  // Get gallery images
  const getGalleryImages = () => {
    if (!property) return [];
    
    console.log("Getting gallery images for property:", property?.title);
    console.log("Photos data:", property?.photos);
    
    try {
      let photos = property?.photos;
      
      // If photos is a string, try to parse it as JSON
      if (typeof photos === 'string') {
        console.log("Photos is a string, attempting to parse JSON");
        // Clean the string if needed
        photos = photos.trim();
        if (photos.startsWith('[') && photos.endsWith(']')) {
          const parsed = JSON.parse(photos);
          console.log("Parsed photos array:", parsed);
          return Array.isArray(parsed) ? parsed : [parsed];
        } else {
          // If it's not a JSON array but still a string, treat it as a single image URL
          console.log("Photos is a single URL string:", photos);
          return [photos];
        }
      }
      
      // If photos is already an array
      if (Array.isArray(photos)) {
        console.log("Photos is already an array:", photos);
        return photos;
      }
      
      // Fallback to category photo
      if (property?.category?.photo) {
        console.log("Using category photo as fallback:", property.category.photo);
        return [property.category.photo];
      }
      
    } catch (err) {
      console.error('Error parsing photos:', err);
      console.error('Photos string that caused error:', property?.photos);
    }
    
    console.log("Returning empty array for photos");
    return [];
  };

  // Get a safe image URL
  const getSafeImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
    
    // Check if URL is valid
    try {
      new URL(url);
      return url;
    } catch (error) {
      console.error('Invalid URL:', url);
      return "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
    }
  };
  // Truncate description
  const getTruncatedDescription = (description, maxLength = 300) => {
    if (!description) return "";
    if (description.length <= maxLength || showFullDescription) {
      return description;
    }
    return description.substring(0, maxLength) + "...";
  };

  // Helper to check if value should be shown
  const safeShow = (val) => {
    return val !== null && val !== undefined && val !== "" && val !== 0;
  };

  if (!loaded && !fontError) {
    return null;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="dark" />
        <Text style={{ fontSize: 18, color: theme.colors.text }}>Property not found</Text>
      </View>
    );
  }

  const galleryImages = getGalleryImages();
  const profile = property?.profile || {};
  const address = property?.address || {};
  const category = property?.category || {};
  const client = property?.client || {};

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="dark" />

      {/* Header Bar */}
      <View style={{
        backgroundColor: "#003366",
        paddingVertical: 16,
        paddingTop: insets.top + 16,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: '600' }}>Back to Listings</Text>
          </TouchableOpacity>
          
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: '600' }}>
            {category.name || "Property Details"}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
          {/* Image Gallery Section */}
          {galleryImages.length > 0 && (
          <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
            <View style={{ 
              backgroundColor: "#FFFFFF", 
              borderRadius: 12, 
              overflow: 'hidden',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
              {/* Main Image */}
              <View style={{ position: 'relative', height: 200 }}>
                <Image
                  source={{ uri: getSafeImageUrl(galleryImages[currentImageIndex]) }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                
                {/* Navigation Buttons */}
                {galleryImages.length > 1 && (
                  <>
                    {currentImageIndex > 0 && (
                      <TouchableOpacity
                        onPress={() => setCurrentImageIndex(prev => prev - 1)}
                        style={{
                          position: 'absolute',
                          left: 16,
                          top: '50%',
                          transform: [{ translateY: -20 }],
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <ChevronLeft size={24} color="#003366" />
                      </TouchableOpacity>
                    )}
                    
                    {currentImageIndex < galleryImages.length - 1 && (
                      <TouchableOpacity
                        onPress={() => setCurrentImageIndex(prev => prev + 1)}
                        style={{
                          position: 'absolute',
                          right: 16,
                          top: '50%',
                          transform: [{ translateY: -20 }],
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <ChevronRight size={24} color="#003366" />
                      </TouchableOpacity>
                    )}
                  </>
                )}
                
                {/* Image Indicator Dots */}
                {galleryImages.length > 1 && (
                  <View style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                    {galleryImages.map((_, index) => (
                      <View
                        key={index}
                        style={{
                          width: currentImageIndex === index ? 20 : 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: currentImageIndex === index ? theme.colors.primary : 'rgba(255, 255, 255, 0.7)',
                        }}
                      />
                    ))}
                  </View>
                )}
              </View>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ padding: 12 }}
                >
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {galleryImages.map((image, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setCurrentImageIndex(index)}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 8,
                          overflow: 'hidden',
                          borderWidth: 2,
                          borderColor: currentImageIndex === index ? theme.colors.primary : 'transparent',
                        }}
                      >
                        <Image
                          source={{ uri: getSafeImageUrl(image) }}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        )}
        {/* Main Content */}
        <View style={{ paddingHorizontal: 20 }}>
          {/* Property Info Section */}
          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 12, marginTop: 20, padding: 16 }}>
            {/* Title and Price */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: "#003366", marginBottom: 4 }}>
                  {property?.title}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: "#003366", marginBottom: 4 }}>
                  {property?.propertyName}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MapPin size={18} color={theme.colors.primary} />
                  <Text style={{ fontSize: 16, color: theme.colors.textSecondary }}>
                    {address?.locality && `${address?.locality}, `}
                    {address?.city && `${address?.city}`}
                  </Text>
                </View>
              </View>
              
              <View style={{ alignItems: 'flex-end' }}>
                {property?.price ? (
                  <Text style={{ fontSize: 28, fontWeight: '700', color: theme.colors.primary }}>
                    {formatPrice(property?.price)}
                  </Text>
                ) : (
                  <TouchableOpacity
                    style={{ backgroundColor: theme.colors.info, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
                    onPress={() => Alert.alert("Contact", "Contact us for price!")}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: '600' }}>Contact Us for Price</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Share Section */}
            <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme.colors.border, paddingVertical: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>Share this project:</Text>
                
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {/* WhatsApp */}
                  <TouchableOpacity
                    onPress={shareOnWhatsApp}
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#25D366", justifyContent: 'center', alignItems: 'center' }}
                  >
                    <MessageCircle size={20} color="#FFFFFF" />
                  </TouchableOpacity>

                  {/* Facebook */}
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`)}
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#1877F2", justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: 'bold' }}>f</Text>
                  </TouchableOpacity>

                  {/* Twitter */}
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareMessage())}&url=${encodeURIComponent(getShareUrl())}`)}
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#1DA1F2", justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: 'bold' }}>𝕏</Text>
                  </TouchableOpacity>

                  {/* LinkedIn */}
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`)}
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#0A66C2", justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: 'bold' }}>in</Text>
                  </TouchableOpacity>

                  {/* Email */}
                  <TouchableOpacity
                    onPress={shareViaEmail}
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#EA4335", justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Mail size={20} color="#FFFFFF" />
                  </TouchableOpacity>

                  {/* Native Share */}
                  <TouchableOpacity
                    onPress={handleNativeShare}
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#6B7280", justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Share2 size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Key Features */}
            <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderColor: theme.colors.border }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
                {/* Plot/Land specific */}
                {(category.name === "Plot" || category.name === "Land") ? (
                  <>
                    {category.name !== "Land" ? (
                      safeShow(profile?.plotArea) && (
                        <FeatureCard
                          icon={<Maximize size={24} color="#003366" />}
                          label="Plot Area"
                          value={`${profile?.plotArea} ${profile?.areaUnit || "sqft"}`}
                        />
                      )
                    ) : (
                      <FeatureCard
                        icon={<Maximize size={24} color="#003366" />}
                        label="Land Area"
                        value={`${profile?.landArea} ${profile?.areaUnit || "sqft"}`}
                      />
                    )}

                    {safeShow(profile?.facing) && (
                      <FeatureCard
                        icon={<Compass size={24} color="#003366" />}
                        label="Facing"
                        value={profile?.facing}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {/* Non-plot property fields */}
                    {safeShow(profile?.bedrooms) && (
                      <FeatureCard icon={<Bed size={24} color="#003366" />} label="Bedrooms" value={profile?.bedrooms} />
                    )}

                    {safeShow(profile?.bathrooms) && (
                      <FeatureCard icon={<Bath size={24} color="#003366" />} label="Bathrooms" value={profile?.bathrooms} />
                    )}

                    {safeShow(profile?.carpetArea) && (
                      <FeatureCard
                        icon={<Maximize size={24} color="#003366" />}
                        label="Carpet Area"
                        value={`${profile?.carpetArea} ${profile?.areaUnit || "sqft"}`}
                      />
                    )}

                    {safeShow(property?.status) && (
                      <FeatureCard icon={<Building size={24} color="#003366" />} label="Status" value={property?.status} />
                    )}
                  </>
                )}
              </View>
            </View>

            {/* Property Details */}
            <View style={{ marginTop: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: "#003366", marginBottom: 16 }}>Property Details</Text>
              
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {safeShow(category.name) && (
                  <DetailCard label="Property Type" value={category.name} />
                )}
                {safeShow(address?.locality) && (
                  <DetailCard label="Locality" value={address.locality} />
                )}
                {safeShow(address?.city) && (
                  <DetailCard label="City" value={address.city} />
                )}
                {safeShow(profile?.totalFloors) && (
                  <DetailCard label="Total Floors" value={profile.totalFloors} />
                )}
              </View>
            </View>

            {/* Nearby Places */}
            {Array.isArray(address?.near_by) && address.near_by.length > 0 && (
              <View style={{ marginTop: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: "#003366", marginBottom: 16 }}>Nearby Places</Text>
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {address.near_by.map((place, idx) => (
                    <DetailCard 
                      key={idx}
                      label={place.info}
                      value={place.distance}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Amenities */}
            {Array.isArray(property?.amenities) && property?.amenities.length > 0 && (
              <View style={{ marginTop: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: "#003366", marginBottom: 16 }}>Amenities & Features</Text>
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {property?.amenities.map((amenity, idx) => (
                    <DetailCard 
                      key={idx}
                      label={amenity}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Overview */}
            {safeShow(property?.description) && (
              <View style={{ marginTop: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: "#003366", marginBottom: 16 }}>Overview</Text>
                
                <Text style={{ fontSize: 14, color: theme.colors.text, lineHeight: 22 }}>
                  {getTruncatedDescription(property?.description)}
                </Text>
                
                {property?.description && property.description.length > 300 && (
                  <TouchableOpacity
                    onPress={() => setShowFullDescription(!showFullDescription)}
                    style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}
                  >
                    {showFullDescription ? (
                      <>
                        <ChevronUp size={16} color={theme.colors.primary} />
                        <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Show Less</Text>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} color={theme.colors.primary} />
                        <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Read More</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Contact Form Section */}
          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 12, marginTop: 20, padding: 16 }}>
            {showContact && (
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{ width: 80, height: 80, backgroundColor: "#003366", borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                  <Building size={36} color="#FFFFFF" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: '700', color: "#003366", textTransform: 'capitalize' }}>
                  {"VMRDA Plots"}
                </Text>
                {client.phoneNumber && (
                  <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 }}>📞 {client.phoneNumber}</Text>
                )}
              </View>
            )}

            <TouchableOpacity
              onPress={() => setShowContact(!showContact)}
              style={{ backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 20 }}
            >
              <Phone size={20} color="#FFFFFF" />
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: '600' }}>
                {!showContact ? "Show Contact Details" : "Hide Contact Details"}
              </Text>
            </TouchableOpacity>

            <View style={{ borderTopWidth: 1, borderColor: theme.colors.border, paddingTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: "#003366", marginBottom: 16 }}>Schedule a Visit</Text>
              
              <View style={{ gap: 12 }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 14,
                  }}
                  placeholder="Your Name"
                  value={formData.name}
                  onChangeText={(text) => handleFormChange('name', text)}
                />
                
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 14,
                  }}
                  placeholder="Your Email"
                  value={formData.email}
                  onChangeText={(text) => handleFormChange('email', text)}
                  keyboardType="email-address"
                />
                
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 14,
                  }}
                  placeholder="Your Phone"
                  value={formData.phoneNumber}
                  onChangeText={(text) => handleFormChange('phoneNumber', text)}
                  keyboardType="phone-pad"
                />
                
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 14,
                    height: 80,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Message (Optional)"
                  value={formData.message}
                  onChangeText={(text) => handleFormChange('message', text)}
                  multiline
                />
                
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{ backgroundColor: "#003366", paddingVertical: 12, borderRadius: 8 }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
                    {formStatus.includes("Submitting") ? "Submitting..." : "Request a Callback"}
                  </Text>
                </TouchableOpacity>
                
                {formStatus && (
                  <Text style={{ fontSize: 14, color: formStatus.includes("Thank you") ? theme.colors.success : theme.colors.error, textAlign: 'center' }}>
                    {formStatus}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <View style={{ marginTop: 32 }}>
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 8 }}>
                  <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>
                    Similar Properties
                  </Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: "#1F2937", textAlign: 'center' }}>
                  Similar Properties You Might Like
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20 }}
              >
                <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 20 }}>
                  {similarProperties.map((similarProp) => (
                    <SimilarPropertyCard
                      key={similarProp.id}
                      property={similarProp}
                      onPress={() => router.push(`/property-details?id=${similarProp.id}`)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Reusable Components
const FeatureCard = ({ icon, label, value }) => (
  <View style={{ alignItems: 'center', width: '30%' }}>
    <View style={{ backgroundColor: "#EFF6FF", padding: 12, borderRadius: 20, marginBottom: 8 }}>
      {icon}
    </View>
    <Text style={{ fontSize: 16, fontWeight: '700', color: "#003366" }}>{value}</Text>
    <Text style={{ fontSize: 12, color: "#6B7280" }}>{label}</Text>
  </View>
);

const DetailCard = ({ label, value }) => (
  <View style={{ 
    backgroundColor: "#EFF6FF", 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8, 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: '45%'
  }}>
    <CheckCircle size={16} color={theme.colors.primary} />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 12, color: "#6B7280" }}>{label}</Text>
      {value && (
        <Text style={{ fontSize: 14, fontWeight: '600', color: "#003366" }}>{value}</Text>
      )}
    </View>
  </View>
);

const SimilarPropertyCard = ({ property, onPress }) => {
  const profile = property?.profile || {};
  const address = property?.address || {};
  
  const getPhotoSrc = (photos) => {
    if (!photos) return "https://via.placeholder.com/400x300?text=Property";
    
    try {
      if (Array.isArray(photos) && photos.length > 0) {
        return photos[0];
      } else if (typeof photos === 'string') {
        // Check if it's a JSON string
        if (photos.startsWith('[')) {
          const parsed = JSON.parse(photos);
          return parsed[0] || "https://via.placeholder.com/400x300?text=Property";
        }
        return photos;
      }
    } catch (error) {
      console.error('Error parsing photos:', error);
    }
    
    return "https://via.placeholder.com/400x300?text=Property";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ 
        width: 280, 
        backgroundColor: "#FFFFFF", 
        borderRadius: 12, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: "#F3F4F6"
      }}
    >
      {/* Image */}
      <View style={{ height: 160, overflow: 'hidden' }}>
        <Image
          source={{ uri: getPhotoSrc(property?.photos) }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: "#003366", marginBottom: 8 }} numberOfLines={2}>
          {property?.title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <MapPin size={14} color={theme.colors.primary} />
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary }} numberOfLines={1}>
            {address?.city}, {address?.locality}
          </Text>
        </View>

        {profile && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            {profile?.bedrooms > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Bed size={14} color="#003366" />
                <Text style={{ fontSize: 12, color: "#6B7280" }}>{profile?.bedrooms}</Text>
              </View>
            )}
            {profile?.bathrooms > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Bath size={14} color="#003366" />
                <Text style={{ fontSize: 12, color: "#6B7280" }}>{profile?.bathrooms}</Text>
              </View>
            )}
            {profile?.carpetArea && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Maximize size={14} color="#003366" />
                <Text style={{ fontSize: 12, color: "#6B7280" }}>
                  {profile?.carpetArea} {profile?.areaUnit}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={{ borderTopWidth: 1, borderColor: "#F3F4F6", paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.primary }}>
            {property?.price ? formatPrice(property?.price) : "Contact Us"}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: "#003366" }}>View Details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Global theme variable - adjust based on your theme structure
const theme = {
  colors: {
    primary: "#EA580C",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    background: "#F9FAFB",
    success: "#10B981",
    error: "#EF4444",
    info: "#3B82F6",
  }
};