import * as navigationRef from '@ecom/utils/navigationService'

import { Image, Platform, StyleSheet, Text, View } from 'react-native'
import { screenHeight, vh, vw } from '@ecom/utils/dimension'
import { useDispatch, useSelector } from 'react-redux'

import AccountNavigator from './AccountNavigator'
import { AdobeObj } from '@ecom/utils/analytics'
import CartNavigator from './CartNavigator'
import HomeNavigator from './HomeNavigator'
import { Icon } from '@ecom/components/icons'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import ShopNavigator from './ShopNavigator'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import fonts from '@ecom/utils/fonts'
import { getBasket } from '@ecom/modules/cart/actions'
import screenNames from '@ecom/utils/screenNames'
import screenTypes from '@ecom/utils/screenTypes'

export const BottomMenu = () => {
  const Tab = createBottomTabNavigator()
  const dispatch = useDispatch()
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  const { isGuestMode } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const { basket } = useSelector((state: RootReducerModal) => state.cartReducer)

  const routeName = navigationRef.currentRoute()?.name
  function getTabBarVisible() {
    switch (routeName) {
      case screenNames.FILTER_MODAl:
      case screenNames.PDP_SCREEN:
      case screenNames.PDP_SCREEN_NAVIGATOR:
      case screenNames.SEARCH_SCREEN:
      case screenNames.DELIVERY_METHOD_SCREEN:
      case screenNames.LOAD_TEMPLATE:
      case screenNames.ANIMATION_PREVIEW_SCREEN:
      case screenNames.POD_ADDTOCART:
      case screenNames.CHECKOUT_MODAL:
      case screenNames.ACCOUNT_CHANGE_PASSWORD:
      case screenNames.ACCOUNT_EDIT_DETAILS:
      case screenNames.ACCOUNT_CUSTOMER_SERVICE_FILES:
      case screenNames.ACCOUNT_CUSTOMER_SERVICE_MESSAGE:
      case screenNames.ACCOUNT_CUSTOMER_SERVICE_INFORMATION:
      case screenNames.ACCOUNT_ADD_PAYMENT:
      case screenNames.ACCOUNT_ORDER_DETAILS_SCREEN:
        return false
      default:
        return true
    }
  }
  return (
    <View
      style={{
        flex: 1,
        zIndex: 1000,
        backgroundColor:
          routeName && routeName === 'Cart Screen'
            ? colors.gray
            : ((routeName && routeName === 'Account Screen') ||
                (routeName && routeName === 'List Screen')) &&
              isGuestMode
            ? colors.gray
            : 'white'
      }}>
      <Tab.Navigator
        screenOptions={{
          // tabBarIconStyle: { display: 'none' },
          tabBarShowLabel: false,
          tabBarStyle: styles.tabStyle
        }}>
        <Tab.Screen
          name={screenNames.HOME_NAVIGATOR}
          component={HomeNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.tabIconLabel}>
                  <Icon
                    name={'hm_Home-thick'}
                    size={vh(19)}
                    color={colors.hmPurple}
                    style={styles.accountIcon}
                  />

                  <Text style={styles.tabSelectedTxt}>
                    {appConfigValues?.screen_content?.bottom_menu?.home}
                  </Text>
                </View>
              ) : (
                <View style={styles.tabIconLabel}>
                  <Icon
                    name={'hm_Home-thick'}
                    size={vh(19)}
                    color={colors.lightgray}
                    style={styles.accountIcon}
                  />
                  <Text style={styles.tabUnSelectedTxt}>
                    {appConfigValues?.screen_content?.bottom_menu?.home}
                  </Text>
                </View>
              )
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault()
              navigation.navigate(screenNames.HOME_NAVIGATOR, {
                screen: screenNames.HOME_SCREEN
              })
            }
          })}
        />
        <Tab.Screen
          name={screenNames.SHOP_NAVIGATOR}
          component={ShopNavigator}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault()
              if (routeName === 'PLP') {
                navigation.reset({
                  index: 0,
                  routes: [{ name: screenNames.SHOP_SCREEN }]
                })
              } else {
                navigation.navigate(screenNames.SHOP_NAVIGATOR, {
                  screen: screenNames.SHOP_SCREEN
                })
              }
            }
          })}
          options={{
            unmountOnBlur: true,
            headerShown: false,
            tabBarStyle: getTabBarVisible()
              ? styles.tabStyle
              : { display: 'none' },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.tabIconLabel}>
                  <Icon
                    name={'hm_Discover-thick'}
                    size={vh(24)}
                    color={colors.hmPurple}
                  />

                  <Text style={styles.tabSelectedTxt}>
                    {appConfigValues?.screen_content?.bottom_menu?.discover}
                  </Text>
                </View>
              ) : (
                <View style={styles.tabIconLabel}>
                  <Icon
                    name={'hm_Discover-thick'}
                    size={vh(24)}
                    color={colors.lightgray}
                  />
                  <Text style={styles.tabUnSelectedTxt}>
                    {appConfigValues?.screen_content?.bottom_menu?.discover}
                  </Text>
                </View>
              )
          }}
        />
        <Tab.Screen
          name={screenNames.ACCOUNT_NAVIGATOR}
          component={AccountNavigator}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault()
              navigation.navigate(screenNames.ACCOUNT_NAVIGATOR, {
                screen: screenNames.ACCOUNT_SCREEN
              })
            }
          })}
          options={{
            headerShown: false,
            tabBarStyle: getTabBarVisible()
              ? styles.tabStyle
              : { display: 'none' },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.tabIconLabel}>
                  <Icon
                    name={'hm_Account-thick'}
                    size={vh(19)}
                    color={colors.hmPurple}
                    style={styles.accountIcon}
                  />
                  <Text style={styles.tabSelectedTxt}>
                    {appConfigValues?.screen_content?.bottom_menu?.account}
                  </Text>
                </View>
              ) : (
                <View style={styles.tabIconLabel}>
                  <Icon
                    name={'hm_Account-thick'}
                    size={vh(19)}
                    color={colors.lightgray}
                    style={styles.accountIcon}
                  />
                  <Text style={styles.tabUnSelectedTxt}>
                    {appConfigValues?.screen_content?.bottom_menu?.account}
                  </Text>
                </View>
              )
          }}
        />
        <Tab.Screen
          name={screenNames.CART_NAVIGATOR}
          component={CartNavigator}
          listeners={({ navigation }) => ({
            tabPress: () => {
              dispatch(
                getBasket(() => {
                  navigation.navigate(screenNames.CART_NAVIGATOR, {
                    screen: screenNames.CART_SCREEN
                  })
                })
              )
            }
          })}
          options={{
            headerShown: false,
            // tabBarBadge: basket?.productItems?.reduce(
            //   (a: any, b: any) => a + (b['quantity'] || 0),
            //   0
            // ),
            tabBarBadge: basket?.totalProducts,
            // tabBarAllowFontScaling:{false},
            // tabBarBadge: 1,
            tabBarBadgeStyle: {
              backgroundColor: colors.hmPurple,
              fontFamily: fonts.BOLD,
              fontSize: vw(7),
              lineHeight: vw(16),
              minWidth: vw(16),
              maxHeight: vw(16),
              borderRadius: vw(8),
              top: 9,
              opacity: basket?.totalProducts > 0 ? 1 : 0
            },

            tabBarStyle: getTabBarVisible()
              ? styles.tabStyle
              : { display: 'none' },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.tabIconLabel}>
                  <Icon
                    name={'hm_Bag-thick'}
                    size={vh(18)}
                    color={colors.hmPurple}
                    style={styles.bagIcon}
                  />
                  <Text style={styles.tabSelectedTxt}>
                    {appConfigValues?.screen_content?.bottom_menu?.bag}
                  </Text>
                </View>
              ) : (
                <View style={styles.tabIconLabel}>
                  <Icon
                    name={'hm_Bag-thick'}
                    size={vh(18)}
                    color={colors.lightgray}
                    style={styles.bagIcon}
                  />
                  <Text style={styles.tabUnSelectedTxt}>
                    {appConfigValues?.screen_content?.bottom_menu?.bag}
                  </Text>
                </View>
              )
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  tabSelectedTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(9),
    fontWeight: '500',
    lineHeight: vh(15),
    letterSpacing: 0.5,
    color: colors.hmPurple,
    textTransform: 'uppercase',
    justifyContent: 'center'
  },
  tabUnSelectedTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(9),
    fontWeight: '500',
    lineHeight: vh(15),
    letterSpacing: 0.5,
    color: colors.lightGray,
    textTransform: 'uppercase',
    justifyContent: 'center'
  },

  tabStyle: {
    height: vh(75.29),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: vh(2)
  },
  bagIcon: {
    marginTop: vh(4)
  },
  accountIcon: {
    marginTop: vh(2)
  },

  tabIconLabel: {
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    height: vh(40),
    marginTop: vh(15)
  }
})
