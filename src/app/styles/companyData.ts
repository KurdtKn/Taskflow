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

  logoSection: {
    alignItems: "center",
    marginBottom: 26,
  },

  logoArea: {
    position: "relative",
    marginBottom: 10,
  },

  logo: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.lightGray,
  },

  editLogoButton: {
    position: "absolute",
    right: -2,
    bottom: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
  },

  editLogoIcon: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  logoText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  form: {
    width: "100%",
  },

  label: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 7,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.black,
    backgroundColor: colors.white,
    marginBottom: 16,
  },

  textArea: {
    minHeight: 110,
    lineHeight: 21,
  },

  verifiedCard: {
    minHeight: 78,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  verifiedTitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  verifiedSubtitle: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    maxWidth: 230,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 4,
  },

  sectionSubtitle: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },

  areasArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  areaChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
  },

  areaChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  areaText: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "800",
  },

  areaTextActive: {
    color: colors.white,
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
  },

  saveButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
});