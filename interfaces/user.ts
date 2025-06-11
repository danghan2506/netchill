import { Timestamp } from 'firebase/firestore';
export type User = {
  id: string;
  name: string;
  email: string;
  uid: string;
  profilePicture: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
