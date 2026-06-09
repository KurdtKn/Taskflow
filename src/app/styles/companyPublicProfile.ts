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

  companyCard: {
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

  logoArea: {
    position: "relative",
    marginBottom: 14,
  },

  logo: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.lightGray,
  },

  verifiedBadge: {
    position: "absolute",
    right: 2,
    bottom: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  verifiedIcon: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
  },

  companyName: {
    color: colors.black,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 4,
    textAlign: "center",
  },

  companyType: {
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

  jobCard: {
    borderRadius: 18,
    backgroundColor: colors.primary,
    padding: 16,
    marginBottom: 18,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.9,
    marginBottom: 4,
  },

  jobTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 5,
  },

  jobText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.92,
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

  section: {
    marginBottom: 22,
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
    fontWeight: "600",
    marginBottom: 14,
  },

  aboutText: {
    color: colors.gray,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    marginBottom: 14,
  },

  tagsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.1)",
  },

  tagText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  infoCard: {
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
    marginBottom: 22,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "rgba(11,87,208,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoTextArea: {
    flex: 1,
  },

  infoLabel: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },

  infoValue: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 13,
  },

  reviewsList: {
    gap: 12,
  },

  reviewCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(11,87,208,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  avatarText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
  },

  reviewHeaderText: {
    flex: 1,
  },

  freelancerName: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 2,
  },

  reviewDate: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "700",
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

  securityBox: {
    backgroundColor: "rgba(11,87,208,0.08)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
  },

  securityTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5,
  },

  securityText: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  primaryButton: {
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

  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});