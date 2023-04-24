import React from 'react';
import { Text, View } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import tw from '~modules/lib/tailwind';
import { theme } from '~modules/lib/tailwind.config';
import { LocalImage } from '~modules/ui';

import type { HeaderLoginPropsType } from '../../types';

export const HeaderLogin: React.FC<HeaderLoginPropsType> = React.memo(({ online }) => (
  <>
    <View style={tw`bg-blue ios:pt-12 android:pt-4 items-center flex-col px-4 pb-4`}>
      {!online && (
        <View style={tw`flex-row items-center justify-center w-full mb-2`}>
          <Icon name='cloud-offline-outline' color={theme.extend.colors.error} />
          <Text style={tw`text-error text-xs ml-2`}>{'Some Text'}</Text>
        </View>
      )}

      <View style={tw`flex-row items-center justify-between w-full`}>
        <LocalImage source='logo' width={50} height={50} />
        <Text style={tw`text-center text-white text-lg`}>{`Some Text`}</Text>
        <View style={tw`w-10`} />
      </View>
    </View>

    <View style={tw`flex-row justify-between bg-surface p-4 items-center`}>
      <LocalImage source='coatOfArms' width={50} height={70} />
      <Text style={tw`text-center text-primary text-3xl font-bold`}>{`Some Text`}</Text>
      <View style={tw`w-10`} />
    </View>
  </>
));
