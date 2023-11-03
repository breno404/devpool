type UserType = 'admin' | 'developer' | 'recruiter' | 'user'
export interface IUserInput {
  type: UserType;
  email: string;
  name: string;
  password: string;
  username: string;
  avatar_url: string;
  cover_url: string;
}

export interface IcreateUserInput {
  input: IUserInput;
}