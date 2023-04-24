import React from 'react';

import { Login } from '~modules/login/components';
import { ScreenContainer } from '~modules/ui';

const LoginScreen: React.FC = () => (
  <ScreenContainer safeMargin={{ bottom: true, left: true, right: true }}>
    <Login />
  </ScreenContainer>
);

export default LoginScreen;
