import { useEffect, useState } from "react";
import { router, Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

import HomeIcon from "../../../assets/icons/Home-solid-full.svg";
import MapIcon from "../../../assets/icons/Location-check.svg";
import NotificationsIcon from "../../../assets/icons/notifications.svg";
import ProfileIcon from "../../../assets/icons/Perfil.svg";

import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { getLoggedUser } from "@/services/storage";
import { getTaskFlowNotifications } from "@/services/local-notifications";

function getLoggedUserId(user: any) {
  const value =
    user?.idUsuario ??
    user?.usuarioId ??
    user?.userId ??
    user?.id_usuario ??
    user?.id;

  if (value === null || value === undefined || value === "") {
    return "";
  }

  return String(value);
}

function NotificationTabIcon({
  focused,
  color,
  hasUnread,
}: {
  focused: boolean;
  color: string;
  hasUnread: boolean;
}) {
  return (
    <View style={localStyles.notificationIconWrapper}>
      <NotificationsIcon
        width={24}
        height={24}
        color={color}
        fill={color}
        opacity={focused ? 1 : 0.75}
      />

      {hasUnread ? <View style={localStyles.notificationBadge} /> : null}
    </View>
  );
}

export default function TabsLayout() {
  const { isDark, theme } = useTheme();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loggedUserId, setLoggedUserId] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const tabIconColor = isDark ? colors.white : colors.black;
  const tabLabelColor = isDark ? colors.white : colors.black;

  async function refreshUnreadNotifications(userId = loggedUserId) {
    try {
      const notifications = await getTaskFlowNotifications({
        audience: "freelancer",
        userId,
      });

      setHasUnreadNotifications(
        notifications.some((notification) => !notification.read)
      );
    } catch (error) {
      console.log("Erro ao buscar badge de notificações:", error);
      setHasUnreadNotifications(false);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getLoggedUser();

        if (!user || user.tipoUsuario !== "freelancer") {
          router.replace("/login");
          return;
        }

        const userId = getLoggedUserId(user);
        setLoggedUserId(userId);
        await refreshUnreadNotifications(userId);
        setIsCheckingAuth(false);
      } catch (error) {
        console.log("Erro ao verificar login do freelancer:", error);
        router.replace("/login");
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    if (isCheckingAuth) {
      return;
    }

    const interval = setInterval(() => {
      refreshUnreadNotifications();
    }, 1200);

    return () => clearInterval(interval);
  }, [isCheckingAuth, loggedUserId]);

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
            <NotificationTabIcon
              focused={focused}
              color={tabIconColor}
              hasUnread={hasUnreadNotifications}
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

const localStyles = StyleSheet.create({
  notificationIconWrapper: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  notificationBadge: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
