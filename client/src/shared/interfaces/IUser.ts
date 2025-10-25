export interface IUser {
  email: string;
  isActivated: boolean;
  id: string;
  firstName?: string;
  familyName?: string;
  dateOfBirth?: Date;
  height?: number;
  gender?: string;
  createdAt?: Date;
}
