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

  successCard: {
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

  successIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  successIcon: {
    color: colors.white,
    fontSize: 38,
    fontWeight: "900",
  },

  successTitle: {
    color: colors.white,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center",
  },

  successText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    opacity: 0.92,
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  infoCard: {
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

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 13,
  },

  candidateCard: {
    flexDirection: "row",
    alignItems: "center",
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

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
  },

  candidateInfo: {
    flex: 1,
  },

  candidateName: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 3,
  },

  candidateType: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
  },

  ratingArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingIcon: {
    fontSize: 13,
    marginRight: 5,
  },

  ratingText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
  },

  paymentCard: {
    borderRadius: 18,
    backgroundColor: colors.lightGray,
    padding: 16,
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  paymentLabel: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: "700",
  },

  paymentValue: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
  },

  paymentDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  totalLabel: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "900",
  },

  totalValue: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "900",
  },

  warningBox: {
    backgroundColor: "rgba(245,158,11,0.12)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
  },

  warningTitle: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5,
  },

  warningText: {
    color: colors.black,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  confirmButton: {
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

  confirmButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  cancelButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  cancelButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
  },
});