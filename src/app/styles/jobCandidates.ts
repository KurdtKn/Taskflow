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

  jobCard: {
    borderRadius: 20,
    backgroundColor: colors.primary,
    padding: 18,
    marginBottom: 22,
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  jobLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.9,
    marginBottom: 4,
  },

  jobTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },

  jobInfoArea: {
    gap: 6,
  },

  jobInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  jobInfoIcon: {
    fontSize: 14,
    marginRight: 7,
  },

  jobInfoText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.95,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    color: colors.black,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 3,
  },

  sectionSubtitle: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: "600",
  },

  candidatesList: {
    gap: 14,
    marginBottom: 20,
  },

  candidateCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  candidateCardSelected: {
    borderColor: "rgba(11,87,208,0.45)",
    backgroundColor: "rgba(11,87,208,0.025)",
  },

  candidateCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  candidateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.lightGray,
    marginRight: 12,
  },

  candidateInfo: {
    flex: 1,
  },

  candidateName: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 3,
  },

  candidateRole: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
  },

  ratingArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingIcon: {
    fontSize: 13,
    marginRight: 4,
  },

  ratingText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
  },

  candidatePrice: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
  },

  description: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },

  skillsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  skillChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.1)",
  },

  skillText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },

  statsArea: {
    minHeight: 64,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 2,
  },

  statLabel: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "700",
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },

  acceptButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  acceptButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  acceptButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  infoBox: {
    backgroundColor: "rgba(11,87,208,0.08)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
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

  selectedText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});