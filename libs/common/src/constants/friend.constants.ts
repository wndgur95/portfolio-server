export const FriendRequestType = {
  None: 0,
  Request: 1,
  Response: 2,
  Accept: 3,
  Reject: 4,
  Block: 5,
} as const;
export type FriendRequestType =
  (typeof FriendRequestType)[keyof typeof FriendRequestType];
