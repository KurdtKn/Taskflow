import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 46,
    paddingBottom: 18,
  },

  header: {
    marginBottom: 18,
  },

  title: {
    color: colors.black,
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.gray,
    fontSize: 14,
    marginTop: 4,
  },

  searchArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },

  searchBox: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 8,
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

  filterIcon: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "800",
  },

  mapContainer: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#DDEBDF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    position: "relative",
  },

  mapBackground: {
    flex: 1,
    backgroundColor: "#DCECDD",
    position: "relative",
  },

  road: {
    position: "absolute",
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#D7D7D7",
  },

  roadHorizontalOne: {
    width: "120%",
    height: 34,
    top: "30%",
    left: "-10%",
    transform: [{ rotate: "-12deg" }],
  },

  roadHorizontalTwo: {
    width: "120%",
    height: 32,
    top: "63%",
    left: "-10%",
    transform: [{ rotate: "10deg" }],
  },

  roadVerticalOne: {
    width: 34,
    height: "120%",
    top: "-10%",
    left: "28%",
    transform: [{ rotate: "8deg" }],
  },

  roadVerticalTwo: {
    width: 32,
    height: "120%",
    top: "-10%",
    left: "68%",
    transform: [{ rotate: "-8deg" }],
  },

  mapLabel: {
    position: "absolute",
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.7,
  },

  mapLabelOne: {
    top: "18%",
    left: "12%",
  },

  mapLabelTwo: {
    top: "44%",
    right: "14%",
  },

  mapLabelThree: {
    bottom: "18%",
    left: "18%",
  },

  pin: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(11,87,208,0.15)",
  },

  pinSelected: {
    backgroundColor: "rgba(11,87,208,0.28)",
    transform: [{ scale: 1.1 }],
  },

  pinCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
  },

  pinText: {
    color: colors.white,
    fontSize: 9,
  },

  currentLocationButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  currentLocationIcon: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "800",
  },

  serviceCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  cardTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "800",
  },

  cardCategory: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 3,
  },

  cardPrice: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  infoIcon: {
    fontSize: 13,
    marginRight: 6,
  },

  infoText: {
    color: colors.gray,
    fontSize: 13,
  },

  detailsButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  detailsButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  detailsButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
});