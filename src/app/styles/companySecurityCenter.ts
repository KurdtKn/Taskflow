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

  heroCard: {
    minHeight: 138,
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

  statusCard: {
    borderRadius: 16,
    backgroundColor: "rgba(0,176,80,0.09)",
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  statusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(0,176,80,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  statusTextArea: {
    flex: 1,
  },

  statusTitle: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },

  statusText: {
    color: colors.success,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
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

  tipsList: {
    gap: 12,
  },

  tipCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  tipIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },

  tipTextArea: {
    flex: 1,
  },

  tipTitle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },

  tipDescription: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },

  featuresList: {
    gap: 12,
  },

  featureCard: {
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

  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(11,87,208,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  featureTextArea: {
    flex: 1,
  },

  featureTitle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 3,
  },

  featureSubtitle: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },

  warningBox: {
    backgroundColor: "rgba(245,158,11,0.12)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
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

  actionsCard: {
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    padding: 14,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  actionsTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },

  actionItem: {
    minHeight: 62,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  actionItemPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  actionTextArea: {
    flex: 1,
  },

  actionTitle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 2,
  },

  actionSubtitle: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "600",
  },

  actionArrow: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900",
    marginLeft: 8,
  },

  primaryButton: {
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

  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  secondaryButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});