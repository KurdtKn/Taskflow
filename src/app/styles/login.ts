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
    paddingTop: 50,
    paddingBottom: 34,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
    marginBottom: 28,
  },

  header: {
    marginBottom: 28,
  },

  title: {
    color: colors.black,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
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
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.black,
    backgroundColor: colors.white,
    marginBottom: 16,
  },

  passwordArea: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingLeft: 14,
    paddingRight: 12,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  passwordIconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: colors.black,
  },

  showPasswordText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 22,
  },

  forgotPasswordText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "700",
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
    marginTop: 26,
    marginBottom: 16,
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
    width: 58,
    height: 58,
    borderRadius: 29,
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

  createAccountArea: {
    marginTop: "auto",
    alignItems: "center",
  },

  createAccountText: {
    color: colors.black,
    fontSize: 15,
  },

  createAccountLink: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
});