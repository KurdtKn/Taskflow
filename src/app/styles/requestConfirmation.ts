import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 46,
    paddingBottom: 28,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  successCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "rgba(0,176,80,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },

  successIcon: {
    color: colors.success,
    fontSize: 58,
    fontWeight: "900",
  },

  title: {
    color: colors.black,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: colors.gray,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 26,
  },

  card: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 16,
  },

  cardLabel: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },

  cardTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  infoIconBox: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  infoText: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: "600",
  },

  warningBox: {
    width: "100%",
    backgroundColor: "rgba(11,87,208,0.08)",
    borderRadius: 14,
    padding: 14,
  },

  warningText: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    textAlign: "center",
  },

  footer: {
    gap: 12,
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
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },

  secondaryButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});