export default interface User {
  uid: string;
  username: string;
  email: string;
  role: string;
  fullname?: string;
  phoneNumber?: string;
  avatar?: string;
  status?: string;
  verified?: boolean;
}
