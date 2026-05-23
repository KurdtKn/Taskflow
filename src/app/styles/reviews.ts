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
    paddingBottom: 32,
  },

  summaryCard: {
    minHeight: 128,
    borderRadius: 22,
    backgroundColor: colors.primary,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: colors.primary,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  ratingCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  averageRating: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
  },

  summaryContent: {
    flex: 1,
  },

  summaryTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 5,
  },

  summaryStars: {
    color: "#FFD700",
    fontSize: 18,
    letterSpacing: 1,
    marginBottom: 5,
  },

  summarySubtitle: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
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
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 4,
  },

  statLabel: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "800",
  },

  filterArea: {
    flexDirection: "row",
    backgroundColor: colors.lightGray,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },

  filterButton: {
    flex: 1,
    height: 42,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  filterButtonActive: {
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  filterText: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: "800",
  },

  filterTextActive: {
    color: colors.primary,
  },

  reviewsList: {
    gap: 14,
    marginBottom: 20,
  },

  reviewCard: {
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
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  reviewInfo: {
    flex: 1,
  },

  reviewAuthor: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  reviewService: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
  },

  reviewDate: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "700",
  },

  stars: {
    color: "#FFD700",
    fontSize: 17,
    letterSpacing: 1,
    marginBottom: 8,
  },

  comment: {
    color: colors.gray,
    fontSize: 14,
    lineHeight: 21,
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