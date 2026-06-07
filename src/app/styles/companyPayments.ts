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
    minHeight: 128,
    borderRadius: 22,
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

  summaryLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.9,
    marginBottom: 4,
  },

  summaryValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 5,
  },

  summaryText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
    maxWidth: 215,
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

  paymentsList: {
    gap: 14,
    marginBottom: 20,
  },

  paymentCard: {
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

  paymentCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 14,
  },

  cardTitleArea: {
    flex: 1,
  },

  paymentService: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },

  paymentFreelancer: {
    color: colors.gray,
    fontSize: 12,
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
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    padding: 14,
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  infoLabel: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "700",
  },

  infoValue: {
    flex: 1,
    color: colors.black,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 11,
  },

  totalArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalLabel: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
  },

  totalValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
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