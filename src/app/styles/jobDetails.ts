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
    paddingBottom: 32,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
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
    fontSize: 17,
    fontWeight: "800",
  },

  headerPlaceholder: {
    width: 42,
    height: 42,
  },

  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 22,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  imageIcon: {
    fontSize: 62,
  },

  titleArea: {
    marginBottom: 18,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(11,87,208,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },

  categoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  title: {
    color: colors.black,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    marginBottom: 6,
  },

  price: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
  },

  infoCard: {
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
    marginBottom: 24,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoIcon: {
    fontSize: 18,
  },

  infoTextArea: {
    flex: 1,
  },

  infoLabel: {
    color: colors.gray,
    fontSize: 12,
    marginBottom: 2,
  },

  infoValue: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
  },

  description: {
    color: colors.gray,
    fontSize: 14,
    lineHeight: 22,
  },

  companyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: 16,
  },

  companyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  companyAvatarText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  companyInfo: {
    flex: 1,
  },

  companyName: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  companyRating: {
    color: colors.gray,
    fontSize: 12,
  },

  warningBox: {
    backgroundColor: "rgba(11,87,208,0.08)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 22,
  },

  warningText: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  button: {
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

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
});