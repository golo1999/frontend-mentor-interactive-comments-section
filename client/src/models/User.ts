export type User = {
  emailAddress: string;
  id: string;
  username: string;
};

export type UserDTO = Pick<User, "emailAddress" | "username">;

export type UserWithToken = User & { token: string };
