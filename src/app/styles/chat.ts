import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  keyboardArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 46,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
    marginRight: 4,
  },

  headerInfo: {
    flex: 1,
  },

  headerTitle: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 2,
  },

  headerSubtitle: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "800",
  },

  finishButton: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  finishButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },

  jobCard: {
    borderRadius: 18,
    backgroundColor: colors.primary,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 5,
  },

  jobText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.92,
  },

  messagesContent: {
    paddingTop: 4,
    paddingBottom: 18,
    gap: 10,
  },

  systemMessage: {
    alignSelf: "center",
    backgroundColor: colors.lightGray,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 4,
  },

  systemMessageText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  messageRow: {
    width: "100%",
    flexDirection: "row",
  },

  messageRowCompany: {
    justifyContent: "flex-end",
  },

  messageRowFreelancer: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "78%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  companyBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 5,
  },

  freelancerBubble: {
    backgroundColor: colors.lightGray,
    borderBottomLeftRadius: 5,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },

  companyMessageText: {
    color: colors.white,
  },

  freelancerMessageText: {
    color: colors.black,
  },

  messageTime: {
    fontSize: 10,
    fontWeight: "700",
    alignSelf: "flex-end",
  },

  companyMessageTime: {
    color: "rgba(255,255,255,0.75)",
  },

  freelancerMessageTime: {
    color: colors.gray,
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    borderRadius: 18,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: colors.black,
    fontSize: 14,
    lineHeight: 20,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  sendButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },

  sendButtonText: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "900",
    marginLeft: 2,
  },
});