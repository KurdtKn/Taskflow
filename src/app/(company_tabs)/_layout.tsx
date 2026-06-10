import { Tabs } from "expo-router";

import AssignmentIcon from "../../../assets/icons/assignment.svg";
import CreditCardIcon from "../../../assets/icons/credit_card.svg";
import NotificationsIcon from "../../../assets/icons/notifications.svg";
import ProfileIcon from "../../../assets/icons/Perfil.svg";

import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

export default function CompanyTabsLayout() {
  const { isDark, theme } = useTheme();

  return (
    <Tabs
      initialRouteName="company-dashboard"
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
        name="company-dashboard"
        options={{
          title: "Chamados",
          tabBarIcon: ({ focused }) => (
            <AssignmentIcon
              width={24}
              height={24}
              opacity={focused ? 1 : 0.7}
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
              opacity={focused ? 1 : 0.7}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="company-notifications"
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
        name="company-profile"
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