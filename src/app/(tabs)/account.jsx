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
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import {
  User,
  Heart,
  Clock,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "../../utils/theme";
import { userProfile } from "../../utils/dummyData";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const menuItems = [
    {
      id: "wishlist",
      title: "Wishlist",
      description: "Your saved properties",
      icon: Heart,
      onPress: () => router.push("/wishlist"),
    },
    {
      id: "recent",
      title: "Recently Viewed",
      description: "Properties you viewed",
      icon: Clock,
      onPress: () => router.push("/recently-viewed"),
    },
    {
      id: "settings",
      title: "Settings",
      description: "App preferences",
      icon: Settings,
      onPress: () => Alert.alert("Settings", "Settings coming soon"),
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage alerts",
      icon: Bell,
      onPress: () =>
        Alert.alert("Notifications", "Notification settings coming soon"),
    },
    {
      id: "help",
      title: "Help & Support",
      description: "Get assistance",
      icon: HelpCircle,
      onPress: () => Alert.alert("Help", "Support coming soon"),
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      description: "Your data protection",
      icon: Shield,
      onPress: () => Alert.alert("Privacy", "Privacy settings coming soon"),
    },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/login-selection"),
      },
    ]);
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
          Account
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              ...theme.elevation.card,
            }}
          >
            <Image
              source={{ uri: userProfile.profileImage }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                marginRight: 16,
              }}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins_600SemiBold",
                  color: theme.colors.text,
                  marginBottom: 4,
                }}
              >
                {userProfile.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.textSecondary,
                  marginBottom: 6,
                }}
              >
                {userProfile.email}
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
                  {userProfile.role.toUpperCase()}
                </Text>
              </View>
            </View>

            <ChevronRight
              size={20}
              color={theme.colors.textSecondary}
              strokeWidth={1.5}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isLast = index === menuItems.length - 1;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={item.onPress}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: isLast ? 16 : 0,
                  borderTopLeftRadius: index === 0 ? 16 : 0,
                  borderTopRightRadius: index === 0 ? 16 : 0,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderTopWidth: index === 0 ? 1 : 0,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: theme.colors.background,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <IconComponent
                    size={20}
                    color={theme.colors.text}
                    strokeWidth={1.5}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins_600SemiBold",
                      color: theme.colors.text,
                      marginBottom: 2,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Poppins_400Regular",
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {item.description}
                  </Text>
                </View>

                <ChevronRight
                  size={20}
                  color={theme.colors.textSecondary}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.error,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            activeOpacity={0.7}
          >
            <LogOut size={20} color={theme.colors.error} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_600SemiBold",
                color: theme.colors.error,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View style={{ alignItems: "center", marginTop: 24 }}>
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
      </ScrollView>
    </View>
  );
}
