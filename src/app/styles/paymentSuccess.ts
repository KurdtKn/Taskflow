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

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  successCircle: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "rgba(0,176,80,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  successIcon: {
    color: colors.success,
    fontSize: 62,
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
    borderRadius: 20,
    backgroundColor: colors.white,
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
    color: colors.black,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 14,
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
    fontSize: 15,
    fontWeight: "900",
  },

  totalValue: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "900",
  },

  infoBox: {
    width: "100%",
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
    fontWeight: "900",
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
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});