import { instance } from '~modules/api/axiosBase';

import type { SignInFormValues, TokenType } from '../types';
import type { AxiosResponse } from 'axios';

const SIGN_IN = '/login';
const LOGOUT = '/logout';

export const signIn = async (formValues: SignInFormValues): Promise<AxiosResponse<TokenType>> => {
  return await instance.post(SIGN_IN, formValues);
};

export const logout = async (): Promise<void> => {
  return await instance.post(LOGOUT);
};
