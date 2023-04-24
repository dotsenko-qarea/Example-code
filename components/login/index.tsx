import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { Controller } from 'react-hook-form';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, TextInput } from 'react-native-paper';

import tw from '~modules/lib/tailwind';

import { HeaderLogin } from '../header';
import { useLogin } from '../hooks';

export const Login: React.FC = () => {
  const { handleShowPassword, handleAdminInfo, onSubmit, errors, control, handleSubmit, isShowPassword, isOnline } =
    useLogin();

  return (
    <View style={tw`justify-between h-full`}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 25 : 60}
        enableAutomaticScroll
        keyboardShouldPersistTaps='handled'
      >
        <HeaderLogin online={isOnline || false} />
        <View style={tw`px-4 mt-14`}>
          <Text style={tw`text-primary mb-8 text-xl`}>{`Some Text`}</Text>
          <View style={tw`mb-4 h-18`}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  keyboardType='email-address'
                  label='Email'
                  mode='outlined'
                  onBlur={onBlur}
                  onChangeText={(val: string) => onChange(val.toLocaleLowerCase().trim())}
                  value={value}
                  error={!!errors?.email}
                />
              )}
              name='email'
            />
            {errors.email && <Text style={tw`text-error`}>{errors.email.message}</Text>}
          </View>
          <View style={tw`mb-4 h-18`}>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  secureTextEntry={!isShowPassword}
                  label='Password'
                  mode='outlined'
                  textContentType='password'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors?.password}
                  right={
                    <TextInput.Icon
                      name={isShowPassword ? 'eye-off-outline' : 'eye-outline'}
                      onPress={handleShowPassword}
                    />
                  }
                />
              )}
              name='password'
            />
            {errors.password && <Text style={tw`text-error`}>{errors.password.message}</Text>}
          </View>
          <Button
            mode='contained'
            style={tw`mt-2 rounded`}
            labelStyle={tw`text-base font-semibold`}
            onPress={handleSubmit(onSubmit)}
          >
            {`Login`}
          </Button>
          <Pressable onPress={handleAdminInfo} style={tw`mt-10`}>
            <Text style={tw`text-lg text-primary`}>{`Some Text`}</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
      <Text style={tw`text-center`}>{`Version: ${DeviceInfo.getVersion()}`}</Text>
    </View>
  );
};
