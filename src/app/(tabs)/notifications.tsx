import { styles } from "@/app/styles/simpleScreen";
import { SafeAreaView, Text } from "react-native";

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      <Text style={styles.subtitle}>Tela de notificações do freelancer.</Text>
    </SafeAreaView>
  );
}
