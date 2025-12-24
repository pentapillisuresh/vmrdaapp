import { Tabs } from "expo-router";
import { Home, LayoutList, PlusCircle, Users, User } from "lucide-react-native";
import { useTheme } from "../../utils/theme";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: theme.colors.tabBarBorder,
          paddingBottom: 24,
          paddingTop: 12,
          height: 84,
          shadowColor: "transparent",
          elevation: 0,
        },
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Poppins_500Medium",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
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
          title: "My Listings",
          tabBarLabel: "My Listings",
          tabBarIcon: ({ color, focused }) => (
            <LayoutList color={color} size={24} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="post-property"
        options={{
          title: "Post Property",
          tabBarLabel: "Post",
          tabBarIcon: ({ color, focused }) => (
            <PlusCircle
              color={color}
              size={24}
              fill={focused ? color : "transparent"}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          title: "Leads",
          tabBarLabel: "Leads",
          tabBarIcon: ({ color, focused }) => (
            <Users color={color} size={24} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
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
