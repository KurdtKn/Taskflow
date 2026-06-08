import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  switchCard: {
    minHeight: 78,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  optionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(11,87,208,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 10,
  },

  optionTitle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 3,
  },

  optionSubtitle: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },

  infoBox: {
    backgroundColor: "rgba(11,87,208,0.08)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
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

  securityCard: {
    borderRadius: 18,
    backgroundColor: colors.white,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 22,
  },

  securityTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },

  securityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  securityDot: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
    marginRight: 8,
    marginTop: -2,
  },

  securityText: {
    flex: 1,
    color: colors.gray,
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
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});