import { useEffect, useState } from "react";
import { router, Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

import AssignmentIcon from "../../../assets/icons/assignment.svg";
import CreditCardIcon from "../../../assets/icons/credit_card.svg";
import NotificationsIcon from "../../../assets/icons/notifications.svg";
import ProfileIcon from "../../../assets/icons/Perfil.svg";

import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { getLoggedUser } from "@/services/storage";
import { getTaskFlowNotifications } from "@/services/local-notifications";

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

export default function CompanyTabsLayout() {
  const { isDark, theme } = useTheme();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const tabIconColor = isDark ? colors.white : colors.black;
  const tabLabelColor = isDark ? colors.white : colors.black;

  async function refreshUnreadNotifications() {
    try {
      // A tela de notificações da empresa já lista todas as notificações company.
      // O badge segue a mesma regra para não perder eventos salvos sem targetUserId.
      const notifications = await getTaskFlowNotifications({
        audience: "company",
      });

      setHasUnreadNotifications(
        notifications.some((notification) => !notification.read)
      );
    } catch (error) {
      console.log("Erro ao buscar badge de notificações da empresa:", error);
      setHasUnreadNotifications(false);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getLoggedUser();

        if (!user || user.tipoUsuario !== "empresa") {
          router.replace("/login");
          return;
        }

        await refreshUnreadNotifications();
        setIsCheckingAuth(false);
      } catch (error) {
        console.log("Erro ao verificar login da empresa:", error);
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
  }, [isCheckingAuth]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <Tabs
      initialRouteName="company-dashboard"
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
        name="company-dashboard"
        options={{
          title: "Chamados",
          tabBarIcon: ({ focused }) => (
            <AssignmentIcon
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
        name="company-payments"
        options={{
          title: "Pagamentos",
          tabBarIcon: ({ focused }) => (
            <CreditCardIcon
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
        name="company-notifications"
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
        name="company-profile"
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
