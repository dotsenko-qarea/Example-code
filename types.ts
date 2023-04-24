export type SignInFormValues = { email: string; password: string };

export type HeaderLoginPropsType = { online: boolean };

export type TokenType = {
  token: string;
  expiresIn: string;
  refreshToken: string;
};
