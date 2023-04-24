import React from 'react';

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import renderer from 'react-test-renderer';
import { RecoilRoot } from 'recoil';

import { HeaderLogin, Login, LoginScreen } from '~modules/login';
import { RealmProvider } from '~modules/realm';

jest.mock('react-native-device-info', () => {
  return {
    getVersion: () => 4,
  };
});
jest.mock('@react-navigation/core');
jest.mock('react-native-keyboard-aware-scroll-view');
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };

  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  };
});
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: jest.fn() }),
}));
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

describe('modules', () => {
  describe('login', () => {
    it('renders <LoginScreen />', () => {
      const loginScreen = renderer
        .create(
          <RecoilRoot>
            <RealmProvider>
              <LoginScreen />
            </RealmProvider>
          </RecoilRoot>
        )
        .toJSON();

      expect(loginScreen).toMatchSnapshot();
    });

    it('renders <HeaderLogin />', () => {
      const headerLogin = renderer.create(<HeaderLogin online={false} />).toJSON();

      expect(headerLogin).toMatchSnapshot();
    });

    it('renders <Login />', () => {
      const login = renderer
        .create(
          <RecoilRoot>
            <RealmProvider>
              <Login />
            </RealmProvider>
          </RecoilRoot>
        )
        .toJSON();

      expect(login).toMatchSnapshot();
    });
  });
});
