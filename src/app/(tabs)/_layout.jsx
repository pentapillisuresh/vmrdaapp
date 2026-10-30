import React, { useEffect, useRef, useState } from "react";
import { Tabs, router } from "expo-router";
import {
  Home,
  Building2,
  Plus,
  Users,
  UserCircle,
} from "lucide-react-native";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  useWindowDimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  orange: "#EA580C",
  orangeLight: "#F97316",
  orangeDeep: "#C2410C",
  white: "#FFFFFF",
  inactive: "#FED7AA",
  iconInactive: "#FFD8B0",
};

const TAB_HEIGHT = 84;
const CENTER_SIZE = 72;

// Static icon and label for regular tabs (no animation).
function TabContent({ Icon, label, focused }) {
  const color = focused ? C.white : C.iconInactive;

  return (
    <View style={styles.tabContent}>
      <View style={styles.iconWrapper}>
        <Icon
          size={25}
          color={color}
          strokeWidth={focused ? 2.6 : 2}
          fill={
            focused && label === "Home"
              ? color
              : "transparent"
          }
        />
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.tabLabel,
          { color },
          focused && styles.activeTabLabel,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

// Raised center button — static, rounded, orange.
function CenterButton({ Icon = Plus, onPress, onLongPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Post property"
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.centerPressable}
    >
      <View style={styles.centerOuterRing}>
        <Icon
          size={33}
          color={C.white}
          strokeWidth={2.8}
        />
      </View>
    </Pressable>
  );
}

// SVG background with a curved notch around the center button.
function CurvedBarBackground({ width, center }) {
  const height = TAB_HEIGHT;

  const path = [
    `M 23 12`,
    `L ${center - 57} 12`,
    `C ${center - 37} 12, ${center - 39} 37, ${center - 19} 49`,
    `C ${center - 9} 56, ${center + 9} 56, ${center + 19} 49`,
    `C ${center + 39} 37, ${center + 37} 12, ${center + 57} 12`,
    `L ${width - 23} 12`,
    `Q ${width} 12 ${width} 35`,
    `L ${width} ${height - 20}`,
    `Q ${width} ${height} ${width - 20} ${height}`,
    `L 20 ${height}`,
    `Q 0 ${height} 0 ${height - 20}`,
    `L 0 35`,
    `Q 0 12 23 12`,
    `Z`,
  ].join(" ");

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={StyleSheet.absoluteFill}
    >
      <Path
        d={path}
        fill={C.orange}
      />
    </Svg>
  );
}

// Custom bottom bar: controls spacing and alignment precisely.
function PremiumTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [curveCenter, setCurveCenter] = useState(0);
  const curvePosition = useRef(new Animated.Value(0)).current;
  const hasSwitchedTab = useRef(false);

  const horizontalMargin = 14;
  const barWidth = screenWidth - horizontalMargin * 2;

  useEffect(() => {
    const initialCenter = barWidth / 2;
    curvePosition.setValue(initialCenter);
    setCurveCenter(initialCenter);
    const listenerId = curvePosition.addListener(({ value }) => {
      setCurveCenter(value);
    });
    return () => curvePosition.removeListener(listenerId);
  }, [barWidth, curvePosition]);

  useEffect(() => {
    if (!hasSwitchedTab.current) return;
    const targetCenter = barWidth * (state.index + 0.5) / 5;
    Animated.spring(curvePosition, {
      toValue: targetCenter,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start();
  }, [state.index, barWidth, curvePosition]);

  const barBottom = Math.max(insets.bottom, 10) + 2;
  const containerHeight = TAB_HEIGHT + 16;

  const handleTabPress = (route, focused) => {
    hasSwitchedTab.current = true;
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!focused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const handleTabLongPress = (route) => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  const tabItems = [
    {
      name: "home",
      title: "Home",
      Icon: Home,
    },
    {
      name: "my-listings",
      title: "Listings",
      Icon: Building2,
    },
    {
      name: "post-property",
      title: "Post",
      Icon: Plus,
    },
    {
      name: "leads",
      title: "Leads",
      Icon: Users,
    },
    {
      name: "account",
      title: "Account",
      Icon: UserCircle,
    },
  ];

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.barContainer,
        {
          left: horizontalMargin,
          right: horizontalMargin,
          bottom: barBottom,
          height: containerHeight,
        },
      ]}
    >
      {/* Curved orange background */}
      <View
        pointerEvents="none"
        style={[
          styles.barSurface,
          {
            width: barWidth,
            height: TAB_HEIGHT,
            top: containerHeight - TAB_HEIGHT,
          },
        ]}
      >
        <CurvedBarBackground width={barWidth} center={curveCenter} />
      </View>

      {/* Five equally spaced navigation slots */}
      <View
        style={[
          styles.tabRow,
          {
            width: barWidth,
            top: containerHeight - TAB_HEIGHT + 17,
          },
        ]}
      >
        {tabItems.map((item, index) => {
          const routeIndex = state.routes.findIndex(
            (route) => route.name === item.name
          );

          if (routeIndex === -1) return null;

          const route = state.routes[routeIndex];
          const focused = state.index === routeIndex;
          const options = descriptors[route.key]?.options || {};

          if (item.name === "post-property") {
            const showPostShortcut =
              hasSwitchedTab.current &&
              state.routes[state.index]?.name !== "post-property";

            if (!showPostShortcut) {
              return <View key={item.name} style={styles.tabSlot} />;
            }

            return (
              <Pressable
                key={item.name}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel="Post property"
                onPress={() => handleTabPress(route, focused)}
                onLongPress={() => handleTabLongPress(route)}
                style={styles.tabSlot}
              >
                <TabContent
                  Icon={Plus}
                  label="Post"
                  focused={focused}
                />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={item.name}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel || item.title}
              onPress={() => handleTabPress(route, focused)}
              onLongPress={() => handleTabLongPress(route)}
              style={styles.tabSlot}
            >
              <TabContent
                Icon={item.Icon}
                label={options.tabBarLabel || item.title}
                focused={focused}
              />
            </Pressable>
          );
        })}
      </View>

      {/* The raised button moves with the curved notch to keep alignment. */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.movingCenterButton,
          {
            left: curvePosition,
            top: containerHeight - TAB_HEIGHT + 10,
            transform: [{ translateX: -38 }],
          },
        ]}
      >
        {(() => {
          const activeItem = hasSwitchedTab.current
            ? (tabItems.find(
                (item) => item.name === state.routes[state.index]?.name
              ) || tabItems[0])
            : tabItems.find((item) => item.name === "post-property");
          const activeRoute = hasSwitchedTab.current
            ? state.routes[state.index]
            : state.routes.find((route) => route.name === "post-property");
          return (
            <CenterButton
              Icon={activeItem.Icon}
              onPress={() => {
                if (activeRoute) handleTabPress(activeRoute, true);
              }}
              onLongPress={() => {
                if (activeRoute) handleTabLongPress(activeRoute);
              }}
            />
          );
        })()}
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <PremiumTabBar {...props} />
      )}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: "#FFF8EF",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home" }}
      />

      <Tabs.Screen
        name="my-listings"
        options={{ title: "Listings" }}
      />

      <Tabs.Screen
        name="post-property"
        options={{ title: "Post Property" }}
      />

      <Tabs.Screen
        name="leads"
        options={{ title: "Leads" }}
      />

      <Tabs.Screen
        name="account"
        options={{ title: "Account" }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    position: "absolute",
    zIndex: 100,
    elevation: 18,
  },

  movingCenterButton: {
    position: "absolute",
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  barSurface: {
    position: "absolute",
    left: 0,
    overflow: "visible",
    borderRadius: 32,
    backgroundColor: "transparent",

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 13,
    elevation: 12,
  },

  tabRow: {
    position: "absolute",
    left: 0,
    height: 59,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  tabSlot: {
    flex: 1,
    height: 59,
    alignItems: "center",
    justifyContent: "center",
  },

  tabContent: {
    width: "100%",
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 26,
  },

  tabLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "500",
    includeFontPadding: false,
    textAlign: "center",
  },

  activeTabLabel: {
    fontWeight: "800",
  },

  centerPressable: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -27,
  },

  centerOuterRing: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    backgroundColor: C.orangeLight,
    borderWidth: 3,
    borderColor: C.white,
    alignItems: "center",
    justifyContent: "center",

    elevation: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});