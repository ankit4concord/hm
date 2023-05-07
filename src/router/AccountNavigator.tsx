import {
  AccountDetails,
  AccountUser,
  CustomerService,
  OrderDetails,
  OrderHistory,
  Payments,
  ChangePassword,
  EditDetails,
  CustomerServiceMessage,
  CustomerServiceInformation,
  CustomerServiceFiles,
  AddPayment,
  DeleteAccount,
  DigitalOrderHistory,
  PrivacyPolicy
} from '@ecom/modules/account'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import colors from '@ecom/utils/colors'
import { StyleSheet, ViewStyle, Pressable } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'
import fonts from '@ecom/utils/fonts'
import { BackCircleButton } from '@ecom/components/buttons'

export type AccountStackParamList = {
  AccountOverview: undefined
  AccountDetails: undefined
  AccountOrderHistory: undefined
  AccountOrderDetails: { orderID: string }
  AccountPayments: undefined
  AccountCustomerService: undefined
  AccountCustomerServiceMessage: undefined
  AccountCustomerServiceInformation: undefined
  AccountCustomerServiceFiles: undefined
  AccountChangePassword: undefined
  AccountEditDetails: undefined
  AccountAddPayment: undefined
  AccountDelete: undefined
  AccountPrivacyPolicy: undefined
  AccountDigitalOrderHistory: undefined
}

const Account = createStackNavigator<AccountStackParamList>()

const AccountNavigator = () => {
  return (
    <Account.Navigator initialRouteName={'AccountOverview'}>
      <Account.Screen
        name={'AccountOverview'}
        component={AccountUser}
        options={{ headerShown: false }}
      />
      <Account.Screen
        name={'AccountDetails'}
        component={AccountDetails}
        options={({ navigation }) => ({
          title: 'Account Details',
          headerMode: 'float',
          ...headerOptions(navigation, styles.headerPurpleBG)
        })}
      />
      <Account.Screen
        name={'AccountChangePassword'}
        component={ChangePassword}
        options={({ navigation }) => ({
          title: 'Change Password',
          ...headerOptions(navigation, styles.headerWhiteBG)
        })}
      />
      <Account.Screen
        name={'AccountEditDetails'}
        component={EditDetails}
        options={({ navigation }) => ({
          title: 'Edit Account Details',
          headerTitleAlign: 'left',
          ...headerOptions(navigation, styles.headerWhiteBG)
        })}
      />
      <Account.Screen
        name={'AccountOrderHistory'}
        component={OrderHistory}
        options={({ navigation }) => ({
          title: 'Order History',
          headerTitleAlign: 'left',
          ...headerOptions(navigation, styles.headerPurpleBG)
        })}
      />
      <Account.Screen
        name={'AccountOrderDetails'}
        component={OrderDetails}
        options={({ navigation }) => ({
          title: 'Order Details',
          headerTitleAlign: 'left',
          ...headerOptions(navigation, styles.headerPurpleBG)
        })}
      />
      <Account.Screen
        name={'AccountPayments'}
        component={Payments}
        options={({ navigation }) => ({
          title: 'Payment Methods',
          headerTitleAlign: 'left',
          ...headerOptions(navigation, styles.headerPurpleBG)
        })}
      />
      <Account.Screen
        name={'AccountAddPayment'}
        component={AddPayment}
        options={({ navigation }) => ({
          title: 'Add A Card',
          headerTitleAlign: 'left',
          ...headerOptions(navigation, styles.headerWhiteBG)
        })}
      />
      <Account.Screen
        name={'AccountCustomerService'}
        component={CustomerService}
        options={({ navigation }) => ({
          title: 'Consumer Care',
          ...headerOptions(navigation, styles.headerWhiteBG)
        })}
      />
      <Account.Screen
        name={'AccountCustomerServiceMessage'}
        component={CustomerServiceMessage}
        options={({ navigation }) => ({
          title: 'Write Your Message',
          ...headerOptions(navigation, styles.headerWhiteBG)
        })}
      />
      <Account.Screen
        name={'AccountCustomerServiceInformation'}
        component={CustomerServiceInformation}
        options={({ navigation }) => ({
          title: 'Complete Your Information',
          ...headerOptions(navigation, styles.headerWhiteBG)
        })}
      />
      <Account.Screen
        name={'AccountCustomerServiceFiles'}
        component={CustomerServiceFiles}
        options={({ navigation }) => ({
          title: 'Add Files (optional)',
          ...headerOptions(navigation, styles.headerWhiteBG)
        })}
      />
      <Account.Screen
        name={'AccountDelete'}
        component={DeleteAccount}
        options={({ navigation }) => ({
          title: 'Delete Account',
          ...headerOptions(navigation, styles.headerWhiteBG)
        })}
      />
      <Account.Screen
        name={'AccountPrivacyPolicy'}
        component={PrivacyPolicy}
        options={({ navigation }) => ({
          title: 'Terms & Privacy Policy',
          headerTitleAlign: 'center',
          ...headerOptions(navigation, styles.headerPurpleBG)
        })}
      />
      <Account.Screen
        name={'AccountDigitalOrderHistory'}
        component={DigitalOrderHistory}
        options={({ navigation }) => ({
          title: 'Digital Sends',
          ...headerOptions(navigation, styles.headerPurpleBG)
        })}
      />
    </Account.Navigator>
  )
}

const headerOptions = (navigation: any, headerStyle: ViewStyle) => {
  return {
    headerShadowVisible: false,
    headerStyle: headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerLeft: () => (
      <Pressable onPress={() => navigation.goBack()}>
        <BackCircleButton style={styles.backButton} />
      </Pressable>
    )
  }
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: vw(20)
  },
  headerPurpleBG: {
    backgroundColor: colors.pageBackground
  },
  headerWhiteBG: {
    backgroundColor: colors.white
  },
  headerTitleStyle: {
    fontFamily: fonts.BOLD,
    fontSize: vw(16),
    lineHeight: vh(19.2),
    color: colors.blackText,
    textAlign: 'center',
    alignSelf: 'center',
    minWidth: vw(275)
  }
})

export default AccountNavigator
