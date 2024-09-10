export default interface Notification {
  _id: string;
  title: string;
  content: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
}