export interface IGet {
  userId: string;
}

export interface IUser {
  email: string;
  name: string;
  password: string;
  photoUrl: string;
}

export interface IUserAuth {
  email: string;
  password: string;
}
