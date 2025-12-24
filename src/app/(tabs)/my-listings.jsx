import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
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
  Eye,
  MessageCircle,
  Heart,
  Edit,
  Trash2,
  TrendingUp,
} from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "../../utils/theme";
import { properties } from "../../utils/dummyData";

export default function MyListingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState("active");

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const tabs = [
    { id: "active", label: "Active" },
    { id: "pending", label: "Pending" },
    { id: "draft", label: "Drafts" },
    { id: "expired", label: "Expired" },
  ];

  const myProperties = properties.filter((p) => p.ownerId === "owner1");
  const filteredProperties = myProperties.filter(
    (p) => p.status === selectedTab,
  );

  const handleEdit = (propertyId) => {
    router.push(`/edit-property?id=${propertyId}`);
  };

  const handleDelete = (propertyId) => {
    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Delete", propertyId),
        },
      ],
    );
  };

  const handleBoost = (propertyId) => {
    Alert.alert(
      "Boost Property",
      "Upgrade to boost your property listing and get more visibility!",
    );
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
          paddingTop: insets.top + 20,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.background,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Poppins_600SemiBold",
            color: theme.colors.text,
          }}
        >
          My Listings
        </Text>
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
        }}
      >
        {tabs.map((tab) => {
          const isSelected = selectedTab === tab.id;
          const count = myProperties.filter((p) => p.status === tab.id).length;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setSelectedTab(tab.id)}
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
        {filteredProperties.map((property) => (
          <View
            key={property.id}
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
          >
            <TouchableOpacity
              onPress={() => router.push(`/property-details?id=${property.id}`)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: property.images[0] }}
                style={{ width: "100%", height: 160 }}
              />

              <View style={{ padding: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "Poppins_600SemiBold",
                        color: theme.colors.text,
                        marginBottom: 8,
                      }}
                    >
                      {property.title}
                    </Text>
                  </View>

                  {property.verified && (
                    <View
                      style={{
                        backgroundColor: theme.colors.success,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Poppins_500Medium",
                          color: "#FFFFFF",
                        }}
                      >
                        Verified
                      </Text>
                    </View>
                  )}
                </View>

                {/* Stats */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 16,
                    marginBottom: 12,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Eye
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
                      {property.views}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MessageCircle
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
                      {property.leads}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Heart
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
                      {property.saves}
                    </Text>
                  </View>
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
                onPress={() => handleEdit(property.id)}
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
                <Edit size={16} color={theme.colors.text} strokeWidth={1.5} />
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_500Medium",
                    color: theme.colors.text,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(property.id)}
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
                onPress={() => handleBoost(property.id)}
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
                <TrendingUp
                  size={16}
                  color={theme.colors.primary}
                  strokeWidth={1.5}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins_500Medium",
                    color: theme.colors.primary,
                  }}
                >
                  Boost
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredProperties.length === 0 && (
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
              No {selectedTab} Properties
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
              Start posting properties to see them here
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/post-property")}
              style={{
                backgroundColor: theme.colors.primary,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_600SemiBold",
                  color: "#FFFFFF",
                }}
              >
                Post Property
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
