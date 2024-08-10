export default interface Notification {
  id: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}