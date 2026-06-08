import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  keyboardArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 46,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },

  headerTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "900",
  },

  headerPlaceholder: {
    width: 42,
    height: 42,
  },

  scrollContent: {
    paddingBottom: 34,
  },

  heroCard: {
    minHeight: 130,
    borderRadius: 22,
    backgroundColor: colors.primary,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  heroLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.9,
    marginBottom: 4,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 6,
    maxWidth: 230,
  },

  heroText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.92,
    maxWidth: 230,
  },

  heroIconBox: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  formArea: {
    gap: 18,
    marginBottom: 20,
  },

  inputGroup: {
    gap: 8,
  },

  label: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
  },

  passwordBox: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 8,
  },

  input: {
    flex: 1,
    height: "100%",
    color: colors.black,
    fontSize: 14,
    fontWeight: "600",
  },

  eyeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  infoBox: {
    backgroundColor: "rgba(11,87,208,0.08)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
  },

  infoTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5,
  },

  infoText: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  saveButton: {
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
    marginBottom: 12,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  cancelButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});