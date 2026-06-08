import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  keyboardArea: {
    flex: 1,
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
    fontSize: 17,
    fontWeight: "900",
  },

  headerPlaceholder: {
    width: 42,
    height: 42,
  },

  scrollContent: {
    paddingBottom: 34,
  },

  heroCard: {
    minHeight: 130,
    borderRadius: 22,
    backgroundColor: colors.primary,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  heroLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.9,
    marginBottom: 4,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 6,
    maxWidth: 230,
  },

  heroText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.92,
    maxWidth: 230,
  },

  heroIconBox: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  issueList: {
    gap: 12,
  },

  issueCard: {
    minHeight: 72,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  issueCardActive: {
    borderColor: "rgba(11,87,208,0.45)",
    backgroundColor: "rgba(11,87,208,0.06)",
  },

  issueIcon: {
    fontSize: 25,
    marginRight: 12,
  },

  issueTextArea: {
    flex: 1,
  },

  issueTitle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 3,
  },

  issueTitleActive: {
    color: colors.primary,
  },

  issueSubtitle: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },

  issueSubtitleActive: {
    color: colors.primaryDark,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  radioActive: {
    borderColor: colors.primary,
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  paymentMethods: {
    flexDirection: "row",
    gap: 10,
  },

  paymentMethod: {
    flex: 1,
    minHeight: 74,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  paymentMethodActive: {
    backgroundColor: "rgba(11,87,208,0.08)",
    borderColor: "rgba(11,87,208,0.45)",
  },

  paymentMethodText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "900",
  },

  paymentMethodTextActive: {
    color: colors.primary,
  },

  paymentMethodIcon: {
    fontSize: 24,
  },

  label: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },

  input: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 14,
    color: colors.black,
    fontSize: 14,
    fontWeight: "600",
  },

  twoColumns: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  columnItem: {
    flex: 1,
  },

  inputWithIcon: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  inputInside: {
    flex: 1,
    height: "100%",
    color: colors.black,
    fontSize: 13,
    fontWeight: "600",
  },

  textArea: {
    height: 126,
    paddingTop: 14,
    paddingBottom: 14,
  },

  warningBox: {
    backgroundColor: "rgba(245,158,11,0.12)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },

  warningTitle: {
    color: "#92400E",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5,
  },

  warningText: {
    color: "#92400E",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  infoBox: {
    borderRadius: 16,
    backgroundColor: "rgba(11,87,208,0.08)",
    padding: 14,
    marginBottom: 22,
  },

  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  infoTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900",
  },

  infoText: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  sendButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
    marginBottom: 12,
  },

  sendButtonText: {
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

  cancelButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});