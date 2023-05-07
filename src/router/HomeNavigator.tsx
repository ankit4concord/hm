import { HomeScreen } from '@ecom/modules/home'
import React from 'react'
import { SearchResultScreen } from '@ecom/modules/shop'
import { createStackNavigator } from '@react-navigation/stack'
//Custom Imports
import screenNames from '@ecom/utils/screenNames'

const Home = createStackNavigator()
const HomeNavigator = () => {
  return (
    <Home.Navigator>
      <Home.Screen
        name={screenNames.HOME_SCREEN}
        component={HomeScreen}
        options={() => ({
          headerShown: false
        })}
      />
      <Home.Screen
        name={screenNames.SEARCH_RESULT_SCREEN}
        component={SearchResultScreen}
        options={() => ({
          headerShown: false
        })}
      />
    </Home.Navigator>
  )
}

export default HomeNavigator
