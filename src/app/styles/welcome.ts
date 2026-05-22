import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 34,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  textArea: {
    width: "64%",
    zIndex: 2,
  },

  title: {
    color: colors.primaryDark,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    marginBottom: 16,
  },

  subtitle: {
    color: colors.black,
    fontSize: 16,
    lineHeight: 23,
  },

  image: {
    position: "absolute",
    right: -50,
    bottom: -24,
    width: 273,
    height: 395,
    opacity: 0.96,
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  buttonPressed: {
    opacity: 0.98,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  loginArea: {
    alignItems: "center",
  },

  loginText: {
    color: colors.black,
    fontSize: 15,
  },

  loginLink: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
});