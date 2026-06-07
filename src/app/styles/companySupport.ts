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

  heroCard: {
    minHeight: 130,
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

  heroLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.9,
    marginBottom: 4,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 5,
    maxWidth: 220,
  },

  heroText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
    maxWidth: 220,
  },

  heroIconBox: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroIcon: {
    fontSize: 30,
  },

  optionsArea: {
    gap: 12,
    marginBottom: 24,
  },

  optionCard: {
    minHeight: 74,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  optionCardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  optionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionIcon: {
    fontSize: 22,
  },

  optionTextArea: {
    flex: 1,
  },

  optionTitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  optionSubtitle: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },

  optionArrow: {
    color: colors.gray,
    fontSize: 28,
    fontWeight: "300",
    marginLeft: 8,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },

  sectionSubtitle: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    marginBottom: 14,
  },

  faqArea: {
    gap: 12,
  },

  faqCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  faqCardActive: {
    borderColor: "rgba(11,87,208,0.35)",
    backgroundColor: "rgba(11,87,208,0.025)",
  },

  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  faqQuestion: {
    flex: 1,
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
  },

  faqIcon: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
  },

  faqAnswer: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    marginTop: 10,
  },

  formCard: {
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
    marginBottom: 20,
  },

  label: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 7,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.black,
    backgroundColor: colors.white,
    marginBottom: 16,
  },

  textArea: {
    minHeight: 120,
    lineHeight: 21,
  },

  sendButton: {
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
  },

  sendButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  sendButtonText: {
    color: colors.white,
    fontSize: 16,
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