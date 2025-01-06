export interface Message {
  conversationId: string;
  messagingId: string;
  userId: string;
  msgtype: string;
  text: string;
  payload: object;
}
