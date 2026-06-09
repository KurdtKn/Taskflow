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
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  title: {
    color: colors.black,
    fontSize: 26,
    fontWeight: "900",
  },

  subtitle: {
    color: colors.gray,
    fontSize: 14,
    marginTop: 4,
  },

  readButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  readButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },

  filtersArea: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  filterChip: {
    paddingHorizontal: 16,
    height: 38,
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

  notificationsList: {
    paddingBottom: 24,
    gap: 14,
  },

  notificationCard: {
    minHeight: 92,
    borderRadius: 14,
    backgroundColor: colors.white,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 3,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    position: "relative",
  },

  notificationCardUnread: {
    borderColor: "rgba(72, 250, 1, 0.25)",
    backgroundColor: colors.grays[150]
  },

  notificationCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  notificationIcon: {
    fontSize: 22,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 8,
  },

  notificationTitle: {
    flex: 1,
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
  },

  notificationTime: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "700",
  },

  notificationDescription: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 19,
  },

  unreadDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  emptyArea: {
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },

  emptyText: {
    color: colors.gray,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    width: "80%",
  },
});