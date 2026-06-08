import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 46,
    paddingBottom: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  greeting: {
    color: colors.black,
    fontSize: 22,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.gray,
    fontSize: 13,
    marginTop: 2,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },

  searchArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 26,
  },

  searchBox: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: colors.black,
  },

  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "800",
  },

  seeMapText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  servicesList: {
    gap: 14,
  },

  serviceCard: {
    minHeight: 116,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  serviceCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  serviceContent: {
    flex: 1,
    paddingRight: 12,
  },

  serviceTitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },

  servicePrice: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 6,
  },

  infoText: {
    color: colors.gray,
    fontSize: 12,
    flexShrink: 1,
  },

  serviceImageBox: {
    width: 92,
    height: 78,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});