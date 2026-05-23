import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    color: colors.black,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    color: colors.gray,
    fontSize: 15,
    textAlign: "center",
  },
});