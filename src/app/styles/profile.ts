import { colors } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 42,
    paddingBottom: 34,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
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
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8ECF4",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  settingsIcon: {
    fontSize: 20,
  },

  profileCard: {
    backgroundColor: "#0B57D0",
    borderRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 18,
    paddingBottom: 18,
    alignItems: "center",
    shadowColor: "#0B57D0",
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    marginBottom: 18,
  },

  avatarArea: {
    position: "relative",
    marginBottom: 14,
  },

  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.lightGray,
    borderWidth: 4,
    borderColor: colors.white,
  },

  onlineBadge: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.white,
  },

  userName: {
    color: colors.white,
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 4,
    textAlign: "center",
  },

  userType: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 9,
  },

  ratingArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  ratingIcon: {
    fontSize: 16,
    marginRight: 5,
  },

  ratingText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  ratingSubtext: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    fontWeight: "700",
  },

  statsArea: {
    width: "100%",
    minHeight: 78,
    borderRadius: 22,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  statNumber: {
    color: colors.black,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },

  statLabel: {
    color: "#8A94A6",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },

  statDivider: {
    width: 1,
    height: 38,
    backgroundColor: "#EEF1F6",
  },

  aboutCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E8ECF4",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 18,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },

  aboutText: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },

  tagsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.10)",
    borderWidth: 1,
    borderColor: "rgba(11,87,208,0.16)",
  },

  tagText: {
    color: "#0B57D0",
    fontSize: 12,
    fontWeight: "900",
  },

  menuArea: {
    marginBottom: 20,
  },

  menuItem: {
    minHeight: 68,
    borderRadius: 18,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8ECF4",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.045,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  menuItemPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  menuIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(11,87,208,0.10)",
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
    color: "#8A94A6",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },

  menuArrow: {
    color: "#A0A8B8",
    fontSize: 28,
    fontWeight: "300",
    marginLeft: 8,
  },

  logoutButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B91C1C",
    shadowColor: "#DC2626",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.26,
    shadowRadius: 9,
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