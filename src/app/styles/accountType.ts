import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 34,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    marginLeft: -8,
  },

  title: {
    color: colors.primaryDark,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    marginBottom: 12,
  },

  subtitle: {
    color: colors.black,
    fontSize: 15,
    lineHeight: 22,
    width: "82%",
  },

  cardsArea: {
    flexDirection: "row",
    gap: 16,
    marginTop: 70,
  },

  cardWrapper: {
    flex: 1,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  card: {
    minHeight: 154,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    justifyContent: "center",
    overflow: "hidden",
  },

  cardIcon: {
    width: 38,
    height: 38,
    marginBottom: 12,
  },

  cardTitle: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 6,
  },

  cardTitleActive: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 6,
  },

  cardText: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 16,
  },

  cardTextActive: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.95,
  },

  button: {
  height: 52,
  borderRadius: 10,
  backgroundColor: colors.primary,
  alignItems: "center",
  justifyContent: "center",
  marginTop: "auto",
  shadowColor: colors.primary,
  shadowOpacity: 0.22,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 5 },
  elevation: 4,
},

buttonPressed: {
  opacity: 0.85,
  transform: [{ scale: 0.98 }],
},

buttonText: {
  color: colors.white,
  fontSize: 16,
  fontWeight: "700",
},
});