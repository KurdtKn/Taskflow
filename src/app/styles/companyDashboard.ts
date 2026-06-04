import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 46,
    paddingBottom: 34,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  greeting: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  title: {
    color: colors.black,
    fontSize: 25,
    fontWeight: "900",
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  profileInitial: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  summaryArea: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  summaryCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryNumber: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 4,
  },

  summaryLabel: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "800",
  },

  createJobButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  createJobIcon: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
    marginRight: 8,
    marginTop: -2,
  },

  createJobText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 3,
  },

  sectionSubtitle: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "600",
  },

  jobsList: {
    gap: 14,
    marginBottom: 20,
  },

  jobCard: {
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

  jobCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },

  cardTitleArea: {
    flex: 1,
  },

  jobTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },

  jobCategory: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  activeBadge: {
    backgroundColor: "rgba(0,176,80,0.12)",
  },

  pendingBadge: {
    backgroundColor: "rgba(245,158,11,0.14)",
  },

  finishedBadge: {
    backgroundColor: "rgba(11,87,208,0.1)",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "900",
  },

  activeText: {
    color: colors.success,
  },

  pendingText: {
    color: colors.warning,
  },

  finishedText: {
    color: colors.primary,
  },

  infoArea: {
    gap: 6,
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    fontSize: 14,
    marginRight: 7,
  },

  infoText: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "600",
  },

  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  candidatesArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  candidatesNumber: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    marginRight: 5,
  },

  candidatesText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
  },

  detailsText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
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

  tipText: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  logoutButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "rgba(220,38,38,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(220,38,38,0.18)",
  },

  logoutButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  logoutText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "900",
  },
});