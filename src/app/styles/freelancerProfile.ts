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

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 18,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(11,87,208,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: "900",
  },

  name: {
    color: colors.black,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 4,
    textAlign: "center",
  },

  role: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },

  ratingArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  ratingIcon: {
    fontSize: 15,
    marginRight: 5,
  },

  ratingText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
  },

  ratingSubtext: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "600",
  },

  statsArea: {
    width: "100%",
    minHeight: 70,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 3,
  },

  statLabel: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
  },

  statDivider: {
    width: 1,
    height: 34,
    backgroundColor: colors.border,
  },

  serviceCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: 18,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
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

  priceValue: {
    flex: 1,
    color: colors.success,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 13,
  },

  aboutCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: 18,
  },

  aboutText: {
    color: colors.gray,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },

  section: {
    marginBottom: 22,
  },

  skillsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  skillChip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.1)",
  },

  skillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  portfolioList: {
    gap: 12,
  },

  portfolioCard: {
    minHeight: 76,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    flexDirection: "row",
    alignItems: "center",
  },

  portfolioIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  portfolioIcon: {
    fontSize: 21,
  },

  portfolioTextArea: {
    flex: 1,
  },

  portfolioTitle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 3,
  },

  portfolioDescription: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },

  reviewsList: {
    gap: 12,
  },

  reviewCard: {
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    padding: 14,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
    gap: 12,
  },

  reviewCompany: {
    flex: 1,
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
  },

  reviewRating: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
  },

  reviewComment: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
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

  acceptButton: {
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

  acceptButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  acceptButtonText: {
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