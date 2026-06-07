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

  introCard: {
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: colors.primary,
    padding: 22,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  iconText: {
    fontSize: 34,
  },

  introTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center",
  },

  introText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    opacity: 0.92,
  },

  serviceCard: {
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
    marginBottom: 24,
  },

  cardLabel: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
  },

  serviceTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  infoLabel: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "700",
  },

  infoValue: {
    flex: 1,
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },

  sectionSubtitle: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },

  starsArea: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 8,
  },

  starButton: {
    paddingHorizontal: 5,
  },

  star: {
    fontSize: 42,
  },

  starActive: {
    color: "#FFD700",
  },

  starInactive: {
    color: colors.border,
  },

  ratingText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  tagsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  tag: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
  },

  tagActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  tagText: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "800",
  },

  tagTextActive: {
    color: colors.white,
  },

  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.black,
    backgroundColor: colors.white,
    lineHeight: 21,
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

  submitButton: {
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

  submitButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  secondaryButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
  },
});