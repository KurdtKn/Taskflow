import { SafeAreaView, Text } from "react-native";
import { styles } from "../styles/simpleScreen";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Perfil geral do usuário.</Text>
    </SafeAreaView>
  );
}