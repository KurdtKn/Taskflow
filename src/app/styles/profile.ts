import { colors } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 46,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  headerTitle: {
    color: colors.black,
    fontSize: 26,
    fontWeight: "900",
  },

  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },

  settingsIcon: {
    fontSize: 20,
  },

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 18,
  },

  avatarArea: {
    position: "relative",
    marginBottom: 14,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.lightGray,
  },

  onlineBadge: {
    position: "absolute",
    right: 4,
    bottom: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.white,
  },

  userName: {
    color: colors.black,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 4,
  },

  userType: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },

  ratingArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  ratingIcon: {
    fontSize: 15,
    marginRight: 5,
  },

  ratingText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
  },

  ratingSubtext: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "600",
  },

  statsArea: {
    width: "100%",
    minHeight: 70,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 3,
  },

  statLabel: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
  },

  statDivider: {
    width: 1,
    height: 34,
    backgroundColor: colors.border,
  },

  aboutCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: 20,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  aboutText: {
    color: colors.gray,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },

  tagsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.1)",
  },

  tagText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  menuArea: {
    marginBottom: 20,
  },

  menuItem: {
    minHeight: 72,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F1F1",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  menuItemPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  menuIcon: {
    fontSize: 21,
  },

  menuTextArea: {
    flex: 1,
  },

  menuTitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  menuSubtitle: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
  },

  menuArrow: {
    color: colors.gray,
    fontSize: 28,
    fontWeight: "300",
    marginLeft: 8,
  },

  logoutButton: {
  height: 54,
  borderRadius: 14,
  backgroundColor: "#d83f3f",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "#c03333",

  shadowColor: "#000000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.30,
  shadowRadius: 8,
  elevation: 4,
},


  logoutButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  logoutText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
});
