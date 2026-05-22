import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logo: {
    width: 240,
    height: 240,
    marginBottom: 18,
    opacity: 0.90,
  },

  title: {
    color: colors.white,
    fontSize: 40,
    fontWeight: "400",
    letterSpacing: 2.5,
    marginBottom: 15,
  },

  subtitle: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 26,
    textAlign: "center",
    opacity: 0.92,
    fontWeight: "400",
  },

  progressBackground: {
    width: 190,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginTop: 115,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.white,
  },
});