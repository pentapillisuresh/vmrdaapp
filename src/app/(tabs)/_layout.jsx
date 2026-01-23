import { Tabs } from "expo-router";
import { Home, LayoutList, PlusCircle, Users, User } from "lucide-react-native";
import { useTheme } from "../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: theme.colors.tabBarBorder,

          // ✅ FIX: Safe padding for system navigation
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 8,
          height: 60 + insets.bottom,
          elevation: 0,
        },
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Poppins_500Medium",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home
              color={color}
              size={24}
              fill={focused ? color : "transparent"}
              strokeWidth={focused ? 0 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="my-listings"
        options={{
          tabBarLabel: "My Listings",
          tabBarIcon: ({ color }) => (
            <LayoutList color={color} size={24} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="post-property"
        options={{
          tabBarLabel: "Post",
          tabBarIcon: ({ color, focused }) => (
            <PlusCircle
              color={color}
              size={26}
              // fill={focused ? color : "transparent"}
              strokeWidth={2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="leads"
        options={{
          tabBarLabel: "Leads",
          tabBarIcon: ({ color }) => (
            <Users color={color} size={24} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color, focused }) => (
            <User
              color={color}
              size={24}
              fill={focused ? color : "transparent"}
              strokeWidth={2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
