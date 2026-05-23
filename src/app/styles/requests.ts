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

  summaryCard: {
    minHeight: 96,
    borderRadius: 20,
    backgroundColor: colors.primary,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    shadowColor: colors.primary,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  summaryTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },

  summarySubtitle: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },

  summaryNumberBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryNumber: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
  },

  filtersArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
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

  scrollContent: {
    paddingBottom: 30,
    gap: 14,
  },

  requestCard: {
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

  requestCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },

  cardTitleArea: {
    flex: 1,
  },

  requestTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },

  companyName: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "700",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "900",
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

  createdAt: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
  },

  detailsText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
  },

  emptyArea: {
    minHeight: 340,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIcon: {
    fontSize: 50,
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
    width: "82%",
  },
});