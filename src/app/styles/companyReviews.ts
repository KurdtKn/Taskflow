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

  summaryCard: {
    borderRadius: 22,
    backgroundColor: colors.primary,
    padding: 22,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: colors.primary,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  ratingCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 14,
  },

  ratingNumber: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "900",
  },

  ratingMax: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
    opacity: 0.85,
    marginTop: 8,
  },

  summaryTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },

  summaryStars: {
    flexDirection: "row",
    marginBottom: 10,
  },

  summaryText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    opacity: 0.92,
  },

  statsArea: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    minHeight: 78,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },

  statNumber: {
    color: colors.black,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },

  statLabel: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "800",
  },

  filtersArea: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  filterChip: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },

  filterChipActive: {
    backgroundColor: colors.primary,
  },

  filterText: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "800",
  },

  filterTextActive: {
    color: colors.white,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 3,
  },

  sectionSubtitle: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "600",
  },

  reviewsList: {
    gap: 14,
    marginBottom: 20,
  },

  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(11,87,208,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "900",
  },

  reviewHeaderText: {
    flex: 1,
  },

  freelancerName: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 2,
  },

  serviceName: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
  },

  reviewDate: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "700",
  },

  reviewStarsArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  star: {
    fontSize: 18,
    marginRight: 2,
  },

  starActive: {
    color: "#FFD700",
  },

  starInactive: {
    color: colors.border,
  },

  reviewRatingText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 6,
  },

  reviewComment: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
    marginBottom: 12,
  },

  tagsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.08)",
  },

  tagText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  infoBox: {
    backgroundColor: "rgba(11,87,208,0.08)",
    borderRadius: 16,
    padding: 14,
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
});