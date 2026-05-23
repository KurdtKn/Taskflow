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
    paddingBottom: 32,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 26,
  },

  avatarArea: {
    position: "relative",
    marginBottom: 10,
  },

  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.lightGray,
  },

  editPhotoButton: {
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

  editPhotoIcon: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  avatarText: {
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
    fontWeight: "700",
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
    minHeight: 96,
    lineHeight: 21,
  },

  availabilityCard: {
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

  availabilityTitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  availabilitySubtitle: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    maxWidth: 230,
  },

  skillsSection: {
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

  skillsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
  },

  skillChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  skillText: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "800",
  },

  skillTextActive: {
    color: colors.white,
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