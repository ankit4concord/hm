import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import React, { useState } from 'react'
import { addressLookup, updateSenderAddress } from '../../action'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import Button from '@ecom/components/Button'
import CustomInputs from '@ecom/components/CustomInputs'
import Dropdown from '@ecom/components/Dropdown'
import Loader from '@ecom/components/Loader'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { isEmpty } from 'lodash'
import { showToastMessage } from '@ecom/utils/constant'
import { updateRecipientAddress } from '../../action'
import validateInput from '@ecom/components/ValidationInput'

export default function DeliveryRecipient(props: any) {
  const dispatch = useDispatch()
  const [isAddressLine2, setIsAddressLine2] = useState(false)
  const { cardDeliveryData } = useSelector(
    (state: RootReducerModal) => state.deliveryReducer
  )
  const { addressLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  let previousData = cardDeliveryData?.filter((d) => d.type === 'recipient')
  const address = previousData[0]?.formDetails
    ? previousData[0]?.formDetails
    : {
        addrLine1: '',
        addrLine2: '',
        lastName: '',
        city: '',
        state: '',
        zipCode: '',
        name: ''
      }
  const [formData, setFormData] = useState(address)
  const [errors, setErrors] = useState({})
  const [visibleSuggestion, setVisibleSuggestion] = useState(true)
  const RenderItem = ({ item }: any) => {
    const addrLine = `${item?.street_line}${item.secondary ? ' ' : ''}${
      item.secondary ? item.secondary : ''
    } ${item?.city}, ${item?.state} ${item?.zipcode}`
    return (
      <TouchableOpacity
        style={styles.searchTypeAheadContent}
        activeOpacity={0.7}
        onPress={() => {
          setVisibleSuggestion(false)
          Keyboard.dismiss()
          setFormData({
            name: formData?.name,
            lastName: formData.lastName,
            addrLine1: item?.street_line,
            addrLine2: item.secondary,
            city: item.city,
            state: item.state,
            zipCode: item.zipcode
          })
          setErrors({
            ...errors,
            ['addrLine1']: validateInput('addrLine1', item?.street_line),
            ['addrLine2']: validateInput('addrLine2', item.secondary),
            ['city']: validateInput('city', item.city),
            ['state']: validateInput('state', item.state),
            ['zipCode']: validateInput('zipCode', item.zipcode)
          })
        }}>
        <Text style={styles.searchTypeAheadContentTxt}>{addrLine}</Text>
      </TouchableOpacity>
    )
  }
  const [suggestedAddr, setSuggestedAddr] = useState([])
  const handleChange = (type: any, value: any) => {
    setVisibleSuggestion(true)
    if (type == 'addrLine1') {
      dispatch(
        addressLookup(value, (res: any) => {
          setSuggestedAddr(res)
        })
      )
    }
    setFormData({
      ...formData,
      [type]: value
    })
    setErrors({
      ...errors,
      [type]: validateInput(type, value)
    })
  }

  const handleSubmit = () => {
    let errorData = {
      ...errors
    }
    for (const type in formData) {
      errorData = {
        ...errorData,
        [type]: validateInput(type, formData[type])
      }
      setErrors(errorData)
    }
    let errorsArr = Object.values(errorData)
    if (errorsArr.filter((d) => d != null).length == 0) {
      dispatch(
        updateRecipientAddress(formData, (res) => {
          if (res === 201) {
            props?.closeBottomSheet(props.type)
          } else {
            showToastMessage('Invalid Address', 'invalid')
          }
        })
      )
      // props?.closeBottomSheet(props.type)
    }
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={64}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <View style={styles.headerContainer}>
                <Text style={styles.heading}>Add Recipient Address</Text>
              </View>
              <CustomInputs
                label="First name*"
                onChange={(value: any) => handleChange('name', value)}
                value={formData.name}
                error={errors?.name}
                textStyle={undefined}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
              />
              <CustomInputs
                label="Last name*"
                onChange={(value: any) => handleChange('lastName', value)}
                value={formData.lastName}
                error={errors?.lastName}
                textStyle={undefined}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
              />
              <CustomInputs
                label="Address Line 1*"
                onChange={(value: any) => handleChange('addrLine1', value)}
                value={formData.addrLine1}
                error={errors?.addrLine1}
                textStyle={undefined}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
              />
              {visibleSuggestion && (
                <ScrollView
                  keyboardShouldPersistTaps={'handled'}
                  onScroll={() => Keyboard.dismiss()}>
                  {!isEmpty(suggestedAddr) &&
                    !isEmpty(formData.addrLine1) &&
                    formData.addrLine1?.length >= 1 && (
                      <View>
                        <FlatList
                          keyboardShouldPersistTaps={'always'}
                          data={suggestedAddr}
                          renderItem={({ item }) => (
                            <>
                              <RenderItem item={item} />
                            </>
                          )}
                          keyExtractor={(index) => index.toString()}
                          horizontal={false}
                          showsVerticalScrollIndicator={false}
                        />
                      </View>
                    )}
                </ScrollView>
              )}
              <TouchableOpacity
                onPress={() => setIsAddressLine2(!isAddressLine2)}>
                <View>
                  <Text style={styles.note}>
                    Add line 2 and company name {isAddressLine2 ? '-' : '+'}
                  </Text>
                </View>
              </TouchableOpacity>

              {isAddressLine2 && (
                <CustomInputs
                  label="Address Line 2"
                  onChange={(value: any) => handleChange('addrLine2', value)}
                  value={formData.addrLine2}
                  error={errors?.addrLine2}
                  textStyle={undefined}
                  subLabel={undefined}
                  placeholder={undefined}
                  type={undefined}
                />
              )}
              <CustomInputs
                label="City"
                onChange={(value: any) => handleChange('city', value)}
                value={formData.city}
                error={errors?.city}
                textStyle={undefined}
                subLabel={undefined}
                placeholder={undefined}
                type={undefined}
              />

              <View style={styles.boxContainer}>
                <View style={styles.box}>
                  <Dropdown
                    label={'State'}
                    onChange={(value: any) => handleChange('state', value)}
                    placeholder={undefined}
                    value={formData.state}
                  />
                  {errors?.state && (
                    <Text style={styles.error}>{errors?.state}</Text>
                  )}

                  {/* <CustomInputs
                    label="State"
                    onChange={(value: any) => handleChange('state', value)}
                    value={formData.state}
                    error={errors?.state}
                    textStyle={undefined}
                    subLabel={undefined}
                    placeholder={'NY'}
                    type={undefined}
                  /> */}
                </View>
                <View style={styles.box}>
                  <CustomInputs
                    label="ZIP Code"
                    onChange={(value: any) => handleChange('zipCode', value)}
                    value={formData.zipCode}
                    error={errors?.zipCode}
                    textStyle={undefined}
                    subLabel={undefined}
                    placeholder={undefined}
                    type={undefined}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View>
                {addressLoading ? (
                  <Loader />
                ) : (
                  <Button
                    label={'Continue'}
                    onPress={handleSubmit}
                    buttonColor={colors.hmPurple}
                    buttonStyle={styles.continueBtn}
                    textStyle={undefined}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: vw(20),
    paddingBottom: vh(35)
  },
  heading: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  boxContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  box: {
    flex: 0.45
  },
  note: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    alignSelf: 'flex-end',
    color: colors.hmPurple,
    lineHeight: vh(17),
    marginBottom: vh(17)
  },
  continueBtn: {
    padding: vw(20)
  },
  headerContainer: {
    marginBottom: vh(30),
    alignItems: 'center'
  },
  searchTypeAheadContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: vh(10),
    borderBottomColor: colors.graylight,
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingLeft: vw(10)
  },
  searchTypeAheadContentTxt: {
    fontSize: vw(14),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(19),
    letterSpacing: vw(-0.03),
    color: 'black'
  },
  error: {
    color: colors.darkOrange,
    fontSize: vw(12),
    marginTop: vh(5),
    marginBottom: vh(12)
  }
})
