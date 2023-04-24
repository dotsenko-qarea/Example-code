import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import * as yup from 'yup';

import { INFORMATION_SCREEN_NAME } from '~modules/information/config';
import { signIn } from '~modules/login/services/authApi';
import { useQuery, useRealm, UsersRealm } from '~modules/realm';
import { getUserId, getUserRole, saveToken } from '~modules/security';
import { authorizationAtom, netInfoAtom } from '~modules/state';
import { useStatusMessage } from '~modules/statusMessages';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { ErrorDetails } from '~modules/errors/types';
import type { SignInFormValues } from '~modules/login/types';
import type { UsersType } from '~modules/realm/types';
import type { ReportEditRouteType, RootStackParamList } from '~modules/reports/types';
import type { AxiosError } from 'axios';
import type React from 'react';
import type { Control, FieldErrors, SubmitErrorHandler, SubmitHandler } from 'react-hook-form';

const schema = yup
  .object({
    email: yup.string().email('Введіть коректний Email').required("Email є обов'язковий"),
    password: yup.string().required("Пароль є обов'язковий"),
  })
  .required();

export const useLogin = (): {
  handleSubmit: (
    onValid: SubmitHandler<SignInFormValues>,
    onInvalid?: SubmitErrorHandler<SignInFormValues>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  isShowPassword: boolean;
  handleShowPassword: () => void;
  onSubmit: (data: SignInFormValues) => Promise<void>;
  handleAdminInfo: () => void;
  control: Control<SignInFormValues>;
  errors: FieldErrors<SignInFormValues>;
  isOnline: boolean | null | undefined;
} => {
  const { navigate } = useNavigation<StackNavigationProp<ReportEditRouteType | RootStackParamList>>();
  const [, setIsAuthorized] = useRecoilState(authorizationAtom);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const displayStatusMessage = useStatusMessage();
  const [netInfoState] = useRecoilState(netInfoAtom);
  const isOnline = netInfoState?.netInfo?.isConnected && netInfoState?.netInfo?.isInternetReachable;
  const realm = useRealm();
  const users: Realm.Results<UsersType> = useQuery(UsersRealm);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignInFormValues): Promise<void> => {
    try {
      if (isOnline) {
        const { data: response } = await signIn(data);

        await saveToken({
          token: response.token,
          expiresIn: response.expiresIn,
          refreshToken: response.refreshToken,
        });

        const userId = await getUserId();
        const userRole = await getUserRole();

        if (userId && userRole && !users?.find(r => userId === r.id)) {
          realm.write(() => {
            const user = {
              id: userId,
              email: data.email,
              role: userRole,
            };

            realm.create('UsersRealm', user);
          });
        } else {
          const user = users.filtered(`email = "${data.email}"`)[0];

          if (userRole) {
            realm.write(() => {
              user.role = userRole;
            });
          }
        }

        setIsAuthorized({ isAuthorized: true });
      } else {
        const user = users.filtered(`email = "${data.email}"`)[0];

        if (user) {
          await AsyncStorage.setItem('offlineId', user.id.toString());
          setIsAuthorized({ isAuthorized: true });
        } else {
          displayStatusMessage('Some Text', 'error');
        }
      }
    } catch (e) {
      const error = e as AxiosError;

      displayStatusMessage((error?.response?.data as ErrorDetails)?.message || 'Some Text', 'error');
    }
  };

  const handleAdminInfo = (): void => {
    navigate(INFORMATION_SCREEN_NAME);
  };

  const handleShowPassword = (): void => {
    setIsShowPassword(prev => !prev);
  };

  return {
    handleShowPassword,
    handleAdminInfo,
    onSubmit,
    errors,
    control,
    handleSubmit,
    isShowPassword,
    isOnline,
  };
};
