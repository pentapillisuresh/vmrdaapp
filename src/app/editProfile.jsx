import { View, Text, ScrollView,TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";
import { User, Heart, Clock, Settings, Bell, HelpCircle, Shield, LogOut, ChevronRight, Mail, Phone, Building, MapPin, FileText, Camera, Lock, Save, Edit, X, Eye, EyeOff, LoaderCircle } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../utils/theme";
import ApiService from "../components/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getAuth } from "../utils/auth/auth";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    address: '',
    bio: '',
    profilePic: '',
    area: '',
    kycProofName: 'ADHAR',
    kycProofNumber: '',
    kycUploadFile: '',
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  const [originalData, setOriginalData] = useState({ ...profileData });

  const [loaded, fontError] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  // Fetch client data
  const fetchClientData = async () => {
    setLoading(true);
    try {
      const { token, user } = await getAuth();
      const clientId = user?.id;
  
      if (!token || !user) {
        Alert.alert("Error", "Please login to view profile");
        router.replace("/login-selection");
        return;
      }
  
      const response = await ApiService.get(
        `/clients/getClient/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response?.client) {
        const client = response.client;
  
        const mappedData = {
          fullName: client.fullName ?? '',
          email: client.email ?? '',
          phoneNumber: client.phoneNumber ?? '',
          companyName: client.companyName ?? '',
          address: client.address ?? '',
          bio: client.bio ?? '',
          profilePic: client.profilePic ?? '',
          area: client.area ?? '',
          kycProofName: client.kycProofName ?? 'ADHAR',
          kycProofNumber: client.kycProofNumber ?? '',
          kycUploadFile: client.kycUploadFile ?? '',
        };
  
        setProfileData(mappedData);
        setOriginalData(mappedData);
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      Alert.alert("Error", "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      fetchClientData();
    }, [])
  );

  // Handle image upload
  const uploadImage = async (fileUri, fileName, fileType) => {
    const { token, user } = await getAuth(); // Replace with actual client data retrieval
    const clientId = user ? user?.id : null;
  
    const formData = new FormData();
    formData.append("image", {
      uri: fileUri,
      name: fileName,
      type: fileType,
    });

    try {
      const response = await ApiService.post("/images/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
console.log("eee:::",response.url)
      return response.imageUrl || response.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      Alert.alert("Error", "Image upload failed");
      return null;
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Permission Required", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      const fileName = fileUri.split('/').pop();
      const fileType = `image/${fileName.split('.').pop()}`;
      
      const uploadedUrl = await uploadImage(fileUri, fileName, fileType);
      if (uploadedUrl) {
        setProfileData(prev => ({ ...prev, profilePic: uploadedUrl }));
      }
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Permission Required", "Please grant camera permissions");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      const fileName = fileUri.split('/').pop();
      const fileType = `image/${fileName.split('.').pop()}`;
      
      const uploadedUrl = await uploadImage(fileUri, fileName, fileType);
      if (uploadedUrl) {
        setProfileData(prev => ({ ...prev, profilePic: uploadedUrl }));
      }
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle edit toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert to original data
      setProfileData({ ...originalData });
    } else {
      // Start editing - save current state as original
      setOriginalData({ ...profileData });
    }
    setIsEditing(!isEditing);
  };

  // Handle save profile
  const handleSave = async () => {
    // setIsSaving(true);
    try {
      const { token, user } = await getAuth(); // Replace with actual client data retrieval
      const clientId = user ? user?.id : null;
      const response = await ApiService.put(`/clients/${clientId}`,
        profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.client) {
        const mappedData = {
            fullName: response.client.fullName ?? '',
            email: response.client.email ?? '',
            phoneNumber: response.client.phoneNumber ?? '',
            companyName: response.client.companyName ?? '',
            address: response.client.address ?? '',
            bio: response.client.bio ?? '',
            profilePic: response.client.profilePic ?? '',
            area: response.client.area ?? '',
            kycProofName: response.client.kycProofName ?? 'ADHAR',
            kycProofNumber: response.client.kycProofNumber ?? '',
            kycUploadFile: response.client.kycUploadFile ?? '',
          };
          setOriginalData(mappedData);
        setIsEditing(false);
        fetchClientData(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating client:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwords.newPass !== passwords.confirm) {
      Alert.alert("Error", "New passwords do not match!");
      return;
    }

    if (passwords.newPass.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    try {
      const { token, user } = await getAuth(); // Replace with actual client data retrieval
      const clientId = user ? user?.id : null;

      const response = await ApiService.put(`/clients/${clientId}/update-password`,
        passwords, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        Alert.alert("Success", "Password updated successfully!");
        setPasswords({ current: "", newPass: "", confirm: "" });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "Password update failed");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/login-selection");
        },
      },
    ]);
  };

  if (!loaded && !fontError) {
    return null;
  }

  if (loading && activeTab === 'profile') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style={theme.statusBarStyle} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, fontSize: 16, fontFamily: "Poppins_500Medium", color: theme.colors.text }}>
          Loading profile...
        </Text>
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
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
            }}
          >
            Profile Settings
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              marginTop: 4,
            }}
          >
            Manage your account settings and preferences
          </Text>
        </View>

        {activeTab === 'profile' && (
          <TouchableOpacity
            onPress={handleEditToggle}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: isEditing ? "#DC2626" : theme.colors.primary,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {isEditing ? <X size={16} color="#FFFFFF" /> : <Edit size={16} color="#FFFFFF" />}
            <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: "#FFFFFF" }}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={{ 
        flexDirection: 'row', 
        borderBottomWidth: 1, 
        borderBottomColor: theme.colors.border,
        backgroundColor: "#FFFFFF",
      }}>
        <TouchableOpacity
          onPress={() => setActiveTab('profile')}
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'profile' ? theme.colors.primary : 'transparent',
            backgroundColor: activeTab === 'profile' ? "#FEF3C7" : "#FFFFFF",
          }}
        >
          <User size={20} color={activeTab === 'profile' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={{ 
            fontSize: 14, 
            fontFamily: "Poppins_500Medium", 
            color: activeTab === 'profile' ? theme.colors.primary : theme.colors.textSecondary,
            marginTop: 4,
          }}>
            Profile Info
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('security')}
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'security' ? theme.colors.primary : 'transparent',
            backgroundColor: activeTab === 'security' ? "#FEF3C7" : "#FFFFFF",
          }}
        >
          <Lock size={20} color={activeTab === 'security' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={{ 
            fontSize: 14, 
            fontFamily: "Poppins_500Medium", 
            color: activeTab === 'security' ? theme.colors.primary : theme.colors.textSecondary,
            marginTop: 4,
          }}>
            Security
          </Text>
        </TouchableOpacity>
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
        {activeTab === 'profile' ? (
          <View style={{ paddingHorizontal: 20 }}>
            {/* Profile Picture Section */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
              marginBottom: 16,
            }}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ 
                    uri: profileData.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                  }}
                  style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: 40,
                    borderWidth: 3,
                    borderColor: theme.colors.border,
                  }}
                />
                {isEditing && (
                  <View style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    flexDirection: 'row', 
                    gap: 4 
                  }}>
                    <TouchableOpacity
                      onPress={pickImage}
                      style={{
                        backgroundColor: theme.colors.primary,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <FileText size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={takePhoto}
                      style={{
                        backgroundColor: "#10B981",
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Camera size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ 
                  fontSize: 20, 
                  fontFamily: "Poppins_600SemiBold", 
                  color: theme.colors.text,
                  textTransform: 'capitalize',
                }}>
                  {profileData.fullName || 'Your Name'}
                </Text>
                <Text style={{ 
                  fontSize: 14, 
                  fontFamily: "Poppins_400Regular", 
                  color: theme.colors.textSecondary,
                  marginTop: 2,
                }}>
                  {profileData.companyName || 'Company Name'}
                </Text>
                {isEditing && (
                  <Text style={{ 
                    fontSize: 12, 
                    fontFamily: "Poppins_400Regular", 
                    color: theme.colors.textSecondary,
                    marginTop: 4,
                  }}>
                    Tap buttons to upload or take a photo
                  </Text>
                )}
              </View>
            </View>

            {/* Basic Details */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ 
                fontSize: 16, 
                fontFamily: "Poppins_600SemiBold", 
                color: theme.colors.text,
                marginBottom: 12,
              }}>
                Basic Details
              </Text>

              <View style={{ gap: 12 }}>
                {/* Full Name */}
                <View>
                  <Text style={{ 
                    fontSize: 14, 
                    fontFamily: "Poppins_500Medium", 
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}>
                    Full Name
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    backgroundColor: isEditing ? "#FFFFFF" : "#F9FAFB",
                  }}>
                    <User size={20} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.text,
                        paddingVertical: 12,
                      }}
                      value={profileData.fullName}
                      onChangeText={(text) => handleInputChange('fullName', text)}
                      placeholder="Full Name"
                      editable={isEditing}
                    />
                  </View>
                </View>

                {/* Email */}
                <View>
                  <Text style={{ 
                    fontSize: 14, 
                    fontFamily: "Poppins_500Medium", 
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}>
                    Email Address
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    backgroundColor: isEditing ? "#FFFFFF" : "#F9FAFB",
                  }}>
                    <Mail size={20} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.text,
                        paddingVertical: 12,
                      }}
                      value={profileData.email}
                      onChangeText={(text) => handleInputChange('email', text)}
                      placeholder="Email Address"
                      editable={isEditing}
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                {/* Phone Number */}
                <View>
                  <Text style={{ 
                    fontSize: 14, 
                    fontFamily: "Poppins_500Medium", 
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}>
                    Phone Number
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    backgroundColor: isEditing ? "#FFFFFF" : "#F9FAFB",
                  }}>
                    <Phone size={20} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.text,
                        paddingVertical: 12,
                      }}
                      value={profileData.phoneNumber}
                      onChangeText={(text) => handleInputChange('phoneNumber', text)}
                      placeholder="Phone Number"
                      editable={isEditing}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Company Name */}
                <View>
                  <Text style={{ 
                    fontSize: 14, 
                    fontFamily: "Poppins_500Medium", 
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}>
                    Company Name
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    backgroundColor: isEditing ? "#FFFFFF" : "#F9FAFB",
                  }}>
                    <Building size={20} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.text,
                        paddingVertical: 12,
                      }}
                      value={profileData.companyName}
                      onChangeText={(text) => handleInputChange('companyName', text)}
                      placeholder="Company Name"
                      editable={isEditing}
                    />
                  </View>
                </View>

                {/* Address */}
                <View>
                  <Text style={{ 
                    fontSize: 14, 
                    fontFamily: "Poppins_500Medium", 
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}>
                    Address
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    backgroundColor: isEditing ? "#FFFFFF" : "#F9FAFB",
                  }}>
                    <MapPin size={20} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.text,
                        paddingVertical: 12,
                      }}
                      value={profileData.address}
                      onChangeText={(text) => handleInputChange('address', text)}
                      placeholder="Address"
                      editable={isEditing}
                      multiline
                    />
                  </View>
                </View>

                {/* Aadhaar Number */}
                <View>
                  <Text style={{ 
                    fontSize: 14, 
                    fontFamily: "Poppins_500Medium", 
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}>
                    Aadhaar Number
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    backgroundColor: isEditing ? "#FFFFFF" : "#F9FAFB",
                  }}>
                    <FileText size={20} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.text,
                        paddingVertical: 12,
                      }}
                      value={profileData.kycProofNumber}
                      onChangeText={(text) => handleInputChange('kycProofNumber', text)}
                      placeholder="Aadhaar Number"
                      editable={isEditing}
                      keyboardType="number-pad"
                      maxLength={12}
                    />
                  </View>
                </View>

                {/* Deal With Areas */}
                <View>
                  <Text style={{ 
                    fontSize: 14, 
                    fontFamily: "Poppins_500Medium", 
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}>
                    Deal With Areas
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.text,
                      backgroundColor: isEditing ? "#FFFFFF" : "#F9FAFB",
                      minHeight: 100,
                      textAlignVertical: 'top',
                    }}
                    value={profileData.area}
                    onChangeText={(text) => handleInputChange('area', text)}
                    placeholder="Deal with Area"
                    editable={isEditing}
                    multiline
                  />
                </View>

                {/* Bio */}
                <View>
                  <Text style={{ 
                    fontSize: 14, 
                    fontFamily: "Poppins_500Medium", 
                    color: theme.colors.text,
                    marginBottom: 4,
                  }}>
                    Bio
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.text,
                      backgroundColor: isEditing ? "#FFFFFF" : "#F9FAFB",
                      minHeight: 100,
                      textAlignVertical: 'top',
                    }}
                    value={profileData.bio}
                    onChangeText={(text) => handleInputChange('bio', text)}
                    placeholder="Tell about yourself"
                    editable={isEditing}
                    multiline
                  />
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving || !isEditing}
              style={{
                backgroundColor: theme.colors.primary,
                paddingVertical: 14,
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                opacity: isSaving || !isEditing ? 0.5 : 1,
              }}
            >
              {isSaving ? (
                <>
                  <LoaderCircle size={20} color="#FFFFFF" />
                  <Text style={{ 
                    fontSize: 16, 
                    fontFamily: "Poppins_600SemiBold", 
                    color: "#FFFFFF" 
                  }}>
                    Saving...
                  </Text>
                </>
              ) : (
                <>
                  <Save size={20} color="#FFFFFF" />
                  <Text style={{ 
                    fontSize: 16, 
                    fontFamily: "Poppins_600SemiBold", 
                    color: "#FFFFFF" 
                  }}>
                    Save Changes
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* Security Tab */
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ 
              fontSize: 16, 
              fontFamily: "Poppins_600SemiBold", 
              color: theme.colors.text,
              marginBottom: 16,
            }}>
              Change Password
            </Text>

            <View style={{ gap: 16 }}>
              {/* Current Password */}
              <View>
                <Text style={{ 
                  fontSize: 14, 
                  fontFamily: "Poppins_500Medium", 
                  color: theme.colors.text,
                  marginBottom: 4,
                }}>
                  Current Password
                </Text>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                }}>
                  <Lock size={20} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.text,
                      paddingVertical: 12,
                    }}
                    value={passwords.current}
                    onChangeText={(text) => setPasswords(prev => ({ ...prev, current: text }))}
                    placeholder="Current Password"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={20} color={theme.colors.textSecondary} /> : <EyeOff size={20} color={theme.colors.textSecondary} />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View>
                <Text style={{ 
                  fontSize: 14, 
                  fontFamily: "Poppins_500Medium", 
                  color: theme.colors.text,
                  marginBottom: 4,
                }}>
                  New Password
                </Text>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                }}>
                  <Lock size={20} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.text,
                      paddingVertical: 12,
                    }}
                    value={passwords.newPass}
                    onChangeText={(text) => setPasswords(prev => ({ ...prev, newPass: text }))}
                    placeholder="New Password"
                    secureTextEntry={!showPassword}
                  />
                </View>
              </View>

              {/* Confirm Password */}
              <View>
                <Text style={{ 
                  fontSize: 14, 
                  fontFamily: "Poppins_500Medium", 
                  color: theme.colors.text,
                  marginBottom: 4,
                }}>
                  Confirm New Password
                </Text>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                }}>
                  <Lock size={20} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.text,
                      paddingVertical: 12,
                    }}
                    value={passwords.confirm}
                    onChangeText={(text) => setPasswords(prev => ({ ...prev, confirm: text }))}
                    placeholder="Confirm New Password"
                    secureTextEntry={!showConfirm}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <Eye size={20} color={theme.colors.textSecondary} /> : <EyeOff size={20} color={theme.colors.textSecondary} />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Requirements */}
              <View style={{ 
                backgroundColor: "#FEF3C7", 
                padding: 16, 
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#FBBF24",
              }}>
                <Text style={{ 
                  fontSize: 14, 
                  fontFamily: "Poppins_600SemiBold", 
                  color: "#92400E",
                  marginBottom: 8,
                }}>
                  Password Requirements:
                </Text>
                <Text style={{ 
                  fontSize: 13, 
                  fontFamily: "Poppins_400Regular", 
                  color: "#92400E",
                  lineHeight: 20,
                }}>
                  • At least 8 characters long{"\n"}
                  • Contains uppercase and lowercase letters{"\n"}
                  • Includes at least one number{"\n"}
                  • Contains at least one special character
                </Text>
              </View>

              {/* Update Password Button */}
              <TouchableOpacity
                onPress={handlePasswordChange}
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingVertical: 14,
                  borderRadius: 8,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Lock size={20} color="#FFFFFF" />
                <Text style={{ 
                  fontSize: 16, 
                  fontFamily: "Poppins_600SemiBold", 
                  color: "#FFFFFF" 
                }}>
                  Update Password
                </Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                marginTop: 32,
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#DC2626",
                paddingVertical: 14,
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LogOut size={20} color="#DC2626" />
              <Text style={{ 
                fontSize: 16, 
                fontFamily: "Poppins_600SemiBold", 
                color: "#DC2626" 
              }}>
                Logout
              </Text>
            </TouchableOpacity>

            {/* Version */}
            <View style={{ alignItems: "center", marginTop: 32 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.textSecondary,
                }}
              >
                Version 1.0.0
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}