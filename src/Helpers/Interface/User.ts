export interface IUser {
  id: number,
  email: string,
  password: string,
  fullName: string,
  role: string,
  deletedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}