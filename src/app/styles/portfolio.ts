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
    paddingBottom: 32,
  },

  profileSummaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 20,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.lightGray,
    marginRight: 14,
  },

  profileInfo: {
    flex: 1,
  },

  userName: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },

  userRole: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },

  ratingArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingIcon: {
    fontSize: 14,
    marginRight: 5,
  },

  ratingText: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "700",
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

  summaryText: {
    color: colors.gray,
    fontSize: 14,
    lineHeight: 22,
  },

  skillsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.1)",
  },

  skillText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  addButton: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
  },

  portfolioList: {
    gap: 14,
    marginBottom: 20,
  },

  portfolioCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  portfolioCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  itemIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  itemIcon: {
    fontSize: 25,
  },

  itemContent: {
    flex: 1,
  },

  itemHeader: {
    marginBottom: 3,
  },

  itemTitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 20,
  },

  itemDate: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },

  itemCategory: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },

  itemDescription: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 19,
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