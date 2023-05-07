import { Auth as AuthScreen, Splash } from '@ecom/modules/auth'
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack'

import Onboarding from '@ecom/modules/auth/screens/Onboarding'
import React from 'react'
import { View } from 'react-native'
import screenNames from '@ecom/utils/screenNames'

const Auth = createStackNavigator()
const AuthNavigator = () => {
  return (
    <Auth.Navigator>
      <Auth.Screen
        name={screenNames.SPLASH}
        component={Splash}
        options={{ headerShown: false }}
      />
      <Auth.Screen
        name={screenNames.ONBOARDING_SCREEN}
        component={Onboarding}
        options={{ headerShown: false }}
      />
      <Auth.Screen
        name={screenNames.LOGIN}
        component={AuthScreen}
        options={{
          cardOverlay: () => (
            <View
              style={{ backgroundColor: 'gray', opacity: 1, flex: 1 }}></View>
          ),
          headerShown: false,
          presentation: 'modal',
          cardStyle: {
            backgroundColor: 'white',
            shadowOffset: { width: 2, height: 8 },
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 3
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: false
        }}
      />
    </Auth.Navigator>
  )
}

export default AuthNavigator
