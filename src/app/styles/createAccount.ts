import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  keyboardArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 28,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
    marginBottom: 18,
  },

  header: {
    marginBottom: 22,
  },

  title: {
    color: colors.black,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: colors.gray,
    fontSize: 15,
    lineHeight: 22,
  },

  form: {
    width: "100%",
  },

  label: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.black,
    backgroundColor: colors.white,
    marginBottom: 14,
  },

  passwordArea: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingLeft: 14,
    paddingRight: 12,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: colors.black,
  },

  passwordIconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  termsArea: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
    marginBottom: 20,
  },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 1,
  },

  checkboxChecked: {
    backgroundColor: "#39BFEF",
    borderColor: "#39BFEF",
  },

  checkText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 20,
  },

  termsText: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 19,
    flexWrap: "wrap",
  },

  termsLink: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
  },

  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },

  dividerArea: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 14,
  },

  dividerText: {
    color: colors.gray,
    fontSize: 13,
  },

  socialArea: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 22,
  },

  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  socialIcon: {
    width: 30,
    height: 30,
  },

  loginArea: {
    marginTop: "auto",
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