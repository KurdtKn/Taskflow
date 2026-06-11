import { useEffect, useState } from "react";
import { router, Tabs } from "expo-router";

import HomeIcon from "../../../assets/icons/Home-solid-full.svg";
import MapIcon from "../../../assets/icons/Location-check.svg";
import NotificationsIcon from "../../../assets/icons/notifications.svg";
import ProfileIcon from "../../../assets/icons/Perfil.svg";

import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { getLoggedUser } from "@/services/storage";

export default function TabsLayout() {
  const { isDark, theme } = useTheme();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const tabIconColor = isDark ? colors.white : colors.black;
  const tabLabelColor = isDark ? colors.white : colors.black;

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getLoggedUser();

        if (!user || user.tipoUsuario !== "freelancer") {
          router.replace("/login");
          return;
        }

        setIsCheckingAuth(false);
      } catch (error) {
        console.log("Erro ao verificar login do freelancer:", error);
        router.replace("/login");
      }
    }

    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,

        tabBarActiveTintColor: tabLabelColor,
        tabBarInactiveTintColor: tabLabelColor,

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
              color={tabIconColor}
              fill={tabIconColor}
              opacity={focused ? 1 : 0.75}
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
              color={tabIconColor}
              fill={tabIconColor}
              opacity={focused ? 1 : 0.75}
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
              color={tabIconColor}
              fill={tabIconColor}
              opacity={focused ? 1 : 0.75}
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
              color={tabIconColor}
              fill={tabIconColor}
              opacity={focused ? 1 : 0.75}
            />
          ),
        }}
      />
    </Tabs>
  );
}