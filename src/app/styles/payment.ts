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

  introCard: {
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: colors.primary,
    padding: 22,
    marginBottom: 24,
    elevation: 0,
  },

  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  iconText: {
    fontSize: 34,
  },

  introTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },

  introText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    opacity: 0.92,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  jobCard: {
    borderRadius: 18,
    backgroundColor: colors.white,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
    elevation: 0,
  },

  jobTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
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
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 13,
  },

  totalArea: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalLabel: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "900",
  },

  totalValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
  },

  methodsArea: {
    gap: 12,
  },

  methodCard: {
    minHeight: 78,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
    flexDirection: "row",
    alignItems: "center",
    elevation: 0,
  },

  methodCardActive: {
    borderWidth: 1,
    borderColor: "rgba(11,87,208,0.35)",
    backgroundColor: "rgba(11,87,208,0.025)",
  },

  methodIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(11,87,208,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  methodTextArea: {
    flex: 1,
  },

  methodTitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  methodSubtitle: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  radioActive: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
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
    elevation: 0,
  },

  confirmButtonPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },

  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
});