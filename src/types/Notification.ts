export default interface Notification {
  _id: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}