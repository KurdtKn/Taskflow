import { Tabs } from "expo-router";

import HomeIcon from "../../../assets/icons/Home-solid-full.svg";
import MapIcon from "../../../assets/icons/Location-check.svg";
import NotificationsIcon from "../../../assets/icons/notifications.svg";
import ProfileIcon from "../../../assets/icons/Perfil.svg";

import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

export default function TabsLayout() {
  const { isDark, theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: isDark ? theme.primary : colors.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: theme.card,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              width={24}
              height={24}
              opacity={focused ? 1 : 0.7}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ focused }) => (
            <MapIcon
              width={24}
              height={24}
              opacity={focused ? 1 : 0.7}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificações",
          tabBarIcon: ({ focused }) => (
            <NotificationsIcon
              width={24}
              height={24}
              opacity={focused ? 1 : 0.7}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <ProfileIcon
              width={24}
              height={24}
              opacity={focused ? 1 : 0.7}
            />
          ),
        }}
      />
    </Tabs>
  );
}