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
    minHeight: 128,
    borderRadius: 22,
    backgroundColor: colors.primary,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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

  tabsArea: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },

  tabButton: {
    flex: 1,
    height: 42,
    borderRadius: 999,
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  tabText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "900",
  },

  tabTextActive: {
    color: colors.white,
  },

  contentCard: {
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
    marginBottom: 18,
  },

  contentTitle: {
    color: colors.black,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 6,
  },

  contentDescription: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    marginBottom: 18,
  },

  itemsList: {
    gap: 14,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  itemNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(11,87,208,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },

  itemNumberText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },

  itemText: {
    flex: 1,
    color: colors.black,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  warningBox: {
    backgroundColor: "rgba(245,158,11,0.12)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
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

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});