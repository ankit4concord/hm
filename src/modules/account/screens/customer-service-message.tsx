import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '@ecom/utils/colors'
import { vh, vw } from '@ecom/utils/dimension'
import LocalizedStrings from 'react-native-localization'
import { DropDown, DropDownItem } from '@ecom/components/drop-down'
import fonts from '@ecom/utils/fonts'
import { Description, LabelName } from '@ecom/components/typography'
import { FloatingTextInput } from '@ecom/components/CustomInput'
import { PrimaryLargeButton } from '@ecom/components/buttons'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducerModal } from '@ecom/modals'
import actionNames from '@ecom/utils/actionNames'
import { StackScreenProps } from '@react-navigation/stack'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'

const careReasonList: DropDownItem[] = [
  {
    label: 'Select a Reason',
    value: '',
    orderNumNeeded: false
  },
  {
    label: 'Account Assistance',
    value: 'Account Assistance',
    orderNumNeeded: false
  },
  {
    label: 'Order Management',
    value: 'Order Management',
    orderNumNeeded: true
  },
  {
    label: 'Order Shipping & Pickup',
    value: 'Order Shipping & Pickup',
    orderNumNeeded: true
  },
  {
    label: 'Keepsake Ornament Club',
    value: 'Keepsake Ornament Club',
    orderNumNeeded: false
  },
  {
    label: 'Request/Question',
    value: 'Request/Question',
    orderNumNeeded: false
  },
  { label: 'Feedback', value: 'Feedback', orderNumNeeded: false }
]

type CustomerServiceMessageProps = StackScreenProps<
  AccountStackParamList,
  'AccountCustomerServiceMessage'
>

export const CustomerServiceMessage = ({
  navigation
}: CustomerServiceMessageProps) => {
  const dispatch = useDispatch()
  const careCase = useSelector(
    (state: RootReducerModal) => state.careReducer.careCase
  )
  const [description, setDescription] = useState(careCase.Description || '')
  const [reason, setReason] = useState(careCase.Topic_2__c || '')
  const [orderNum, setOrderNum] = useState(careCase.Order_Number__c || '')
  const [showOrderNum, setShowOrderNum] = useState(
    careCase.Topic_2__c?.includes('Order') || false
  )
  const [reasonErr, setReasonErr] = useState('')
  const [orderNumErr, setOrderNumErr] = useState('')

  useEffect(() => {
    setDescription(careCase.Description || '')
    setReason(careCase.Topic_2__c || '')
    setOrderNum(careCase.Order_Number__c || '')
    setShowOrderNum(careCase.Topic_2__c?.includes('Order') || false)
  }, [careCase])

  const handleChange = (type: any, value: any) => {
    switch (type) {
      case 'description':
        setDescription(value)
        break
      case 'orderNum':
        setOrderNum(value)
        break
      default:
        break
    }
  }

  const dropdownSelect = (item: DropDownItem) => {
    setShowOrderNum(item.orderNumNeeded || false)
    setReason(item.value || '')
  }

  const onNext = () => {
    if (validateForm()) {
      dispatch({
        type: actionNames.CARE_ADD_REASON,
        payload: {
          Topic_2__c: reason,
          Description: description,
          Order_Number__c: orderNum
        }
      })
      navigation.navigate('AccountCustomerServiceInformation')
    }
  }

  const validateForm = () => {
    clearErrors()
    if (!reason) {
      setReasonErr(strings.reasonError)
      return false
    } else if (showOrderNum && !orderNum) {
      setOrderNumErr(strings.orderNumError)
      return false
    }
    return true
  }

  const clearErrors = () => {
    setOrderNumErr('')
    setReasonErr('')
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={vh(75)}>
        <ScrollView contentContainerStyle={styles.container}>
          <LabelName style={styles.label}>{strings.reason}</LabelName>
          <DropDown
            items={careReasonList}
            setSelected={dropdownSelect}
            placeholder={'Select a Reason'}
            initialValue={reason}
          />
          {reasonErr ? (
            <Description style={styles.error}>{reasonErr}</Description>
          ) : null}
          {showOrderNum ? (
            <View style={styles.fieldContainer}>
              <FloatingTextInput
                placeholder={strings.orderNum}
                autoCapitalize={false}
                fieldName={'orderNum'}
                returnKeyType={'next'}
                value={orderNum}
                onChangeText={handleChange}
                required
                hasError={orderNumErr}
              />
            </View>
          ) : null}
          <View style={styles.fieldContainer}>
            <FloatingTextInput
              multiline
              numberOfLines={5}
              placeholder={strings.description}
              autoCapitalize={false}
              fieldName={'description'}
              returnKeyType={'default'}
              value={description}
              onChangeText={handleChange}
              textInputStyle={styles.textArea}
            />
          </View>
          <PrimaryLargeButton style={styles.nextButton} onPress={onNext}>
            {strings.next}
          </PrimaryLargeButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    reason: 'Reason*',
    description: 'Description',
    next: 'Next',
    orderNum: 'Order number',
    orderNumError: 'Please enter your order number',
    reasonError: 'Please select a reason'
  }
})

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
    flex: 1
  },
  container: {
    marginTop: vh(35),
    marginHorizontal: vw(20)
  },
  label: {
    fontFamily: fonts.REGULAR,
    paddingBottom: vh(8)
  },
  textArea: {
    height: vh(165),
    paddingTop: vh(20)
  },
  nextButton: {
    marginTop: vh(25)
  },
  fieldContainer: {
    marginTop: vh(20)
  },
  error: {
    fontFamily: fonts.MEDIUM,
    marginTop: vh(8),
    color: colors.darkOrange
  }
})
