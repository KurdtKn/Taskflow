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

  markAllButton: {
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  markAllText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },

  scrollContent: {
    paddingBottom: 34,
  },

  summaryCard: {
    minHeight: 126,
    borderRadius: 22,
    backgroundColor: colors.primary,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  summaryLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.9,
    marginBottom: 4,
  },

  summaryTitle: {
    color: colors.white,
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 5,
    maxWidth: 220,
  },

  summaryText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
    maxWidth: 220,
  },

  summaryIconBox: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryIcon: {
    fontSize: 30,
  },

  filtersArea: {
    flexDirection: "row",
    flexWrap: "wrap",
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

  notificationsList: {
    gap: 14,
    marginBottom: 20,
  },

  notificationCard: {
    borderRadius: 18,
    backgroundColor: colors.white,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  notificationCardUnread: {
    borderColor: "rgba(11,87,208,0.35)",
    backgroundColor: "rgba(11,87,208,0.025)",
  },

  notificationCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  iconText: {
    fontSize: 22,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  notificationTitle: {
    flex: 1,
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
  },

  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },

  notificationDescription: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    marginBottom: 10,
  },

  notificationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  typeBadgeText: {
    fontSize: 11,
    fontWeight: "900",
  },

  timeText: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "700",
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