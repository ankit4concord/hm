import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { addressLookup, updateSenderAddress } from '../../action'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import Button from '@ecom/components/Button'
import CustomCheckbox from '@ecom/components/CustomCheckbox'
import CustomInputWithIcon from '@ecom/components/CustomInputWithIcon'
import CustomInputs from '@ecom/components/CustomInputs'
import DeliveryMadeAccount from './DeliveryMadeAccount'
import Dropdown from '@ecom/components/Dropdown'
import Loader from '@ecom/components/Loader'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import ToggleButton from 'react-native-toggle-element'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { isEmpty } from 'lodash'
import localImages from '@ecom/utils/localImages'
import { useState } from 'react'
import validateInput from '@ecom/components/ValidationInput'

export default function DeliveryYourAddress(props: any) {
  const dispatch = useDispatch()
  const [isToggleSwitch, setIsToggleSwitch] = useState(false)
  const [isAddressLine2, setIsAddressLine2] = useState(false)
  const [isShowPassword, setIsShowPassword] = useState(false)
  const { cardDeliveryData } = useSelector(
    (state: RootReducerModal) => state.deliveryReducer
  )
  const { addressLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
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
  let previousData = cardDeliveryData?.filter(
    (d) => d.type === 'DeliveryYourAddress'
  )
  const { profile } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const userAddress = profile?.address
  const yourAddress = previousData[0]?.formDetails
    ? previousData[0]?.formDetails
    : {
        addrLine1: userAddress?.addressLine1 ? userAddress?.addressLine1 : '',
        addrLine2: userAddress?.addressLine2 ? userAddress?.addressLine2 : '',
        lastName: profile?.lastName ? profile?.lastName : '',
        city: userAddress?.city ? userAddress?.city : '',
        state: userAddress?.stateCode ? userAddress?.stateCode : '',
        zipCode: userAddress?.zip ? userAddress?.zip : '',
        name: profile?.firstName ? profile?.firstName : '',
        email: '',
        password: ''
      }
  const [formData, setFormData] = useState(yourAddress)

  const areFormValuesEmpty = Object.values(formData).every(
    (value) => value == ''
  )

  const [empty, setEmpty] = useState(areFormValuesEmpty)
  const [errors, setErrors] = useState({})
  const [onSucess, setOnSucess] = useState(false)

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
      if (!isToggleSwitch) {
        if (type === 'password' || type === 'email') {
          continue
        }
      }
      errorData = {
        ...errorData,
        [type]: validateInput(type, formData[type])
      }
      setErrors(errorData)
    }

    let errorsArr = Object.values(errorData)
    if (
      errorsArr.filter((d) => d != null).length == 0 &&
      formData?.email &&
      formData?.password
    ) {
      setOnSucess(true)
    } else if (
      errorsArr.filter((d) => d != null).length == 0 &&
      !formData?.email &&
      !formData?.password
    ) {
      dispatch(
        updateSenderAddress(formData, (res) => {
          if (res === 201) {
            props?.closeBottomSheet(props.type)
          } else {
            console.log('here usps')
          }
        })
      )
      // setSelectedType("DeliveryYourAddress")
    }

    // if (empty) {
    //   alert("Please fill all the feilds");
    // }
    // setHasError(false);
    // setEmpty(false);
    // for (const type in formData) {
    //   const error = validateInput(type, formData[type]);
    //   if (error) {
    //     setErrors({
    //       ...errors,
    //       [type]: error,
    //     });
    //     setHasError(true);
    //   } else {
    //     setErrors({
    //       ...errors,
    //       [type]: "",
    //     });
    //   }
    // }
    // if (!hasErrors) {
    //   alert("Sumited"); // submit the form data
    // }
  }

  const toggleSwitch = () =>
    setIsToggleSwitch((previousState) => !previousState)

  const onSuffixClick = () => setIsShowPassword(!isShowPassword)

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={64}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {onSucess ? (
            <DeliveryMadeAccount {...props} />
          ) : (
            <View style={styles.container}>
              <View style={styles.headerContainer}>
                <Text style={styles.heading}>Add Your Address</Text>
                {/* <View>
                  <Button
                    label="Sign In"
                    buttonStyle={styles.btn}
                    buttonColor={colors.darkPink}
                    icon={
                      <View style={{ paddingRight: 5 }}>
                        <Image
                          source={localImages.userImage}
                          style={styles.userImage}
                        />
                      </View>
                    }
                  />
                </View> */}
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
                <View style={styles.noteContainer}>
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
              {/* {isToggleSwitch && (
                <View>
                  <CustomInputs
                    label="Email address*"
                    onChange={(value: any) => handleChange('email', value)}
                    value={formData.email}
                    error={errors.email}
                    textStyle={undefined}
                    subLabel={undefined}
                    placeholder={undefined}
                    type={undefined}
                  />
                  <CustomInputWithIcon
                    label="Password*"
                    subLabel="min. 6 characters"
                    onChange={(value: any) => handleChange('password', value)}
                    value={formData.password}
                    error={errors.password}
                    type={isShowPassword ? 'text' : 'password'}
                    suffix={
                      <Image
                        style={styles.eyeImage}
                        source={localImages.eyeImage}
                      />
                    }
                    onSuffixClick={onSuffixClick}
                  />
                  <CustomCheckbox
                    check={true}
                    content={
                      <View style={styles.checkBoxContainer}>
                        <Text style={styles.noteTxt}>
                          By creating a Hallmark.com account, you agree to the
                          <Text style={styles.subNote}>{' Terms of Use '}</Text>
                          {'and '}
                          <Text style={styles.subNote}>
                            {'Privacy Policy. '}
                          </Text>
                          Hallmark and its companies can email you about special
                          offers and promotions. You can change your email
                          preferences at any time. For Crown Rewards, see
                          <Text style={styles.subNote}>
                            {' Program Information & Terms and Conditions.'}
                          </Text>
                        </Text>
                      </View>
                    }
                  />
                </View>
              )} */}

              <View>
                {addressLoading ? (
                  <Loader />
                ) : (
                  <Button
                    // disable={
                    //   Object.values(errors)?.filter((d) => d != null).length == 0
                    //     ? false
                    //     : true
                    // }
                    label={isToggleSwitch ? 'Sign up and Continue' : 'Continue'}
                    onPress={handleSubmit}
                    buttonColor={colors.hmPurple}
                    buttonStyle={styles.continueBtn}
                    textStyle={undefined}
                  />
                )}
              </View>
            </View>
          )}
        </ScrollView>
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
  btn: {
    padding: vw(15)
  },
  continueBtn: {
    padding: vw(20)
  },
  userImage: {
    width: vw(12),
    height: vh(12),
    resizeMode: 'contain'
  },
  headerContainer: {
    marginBottom: vh(30),
    alignItems: 'center',
    justifyContent: 'center'
    // flexDirection: 'row',

    // justifyContent: 'space-between',
    // alignItems: 'flex-end'
  },
  toggelContainer: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    marginLeft: vw(10)
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vh(20)
  },
  eyeImage: { width: vw(30), height: vh(30), resizeMode: 'contain' },
  checkBoxContainer: { paddingRight: vw(20), paddingTop: vh(8) },
  noteTxt: { fontSize: vw(12), lineHeight: vh(18) },
  subNote: { fontFamily: fonts.BOLD, textDecorationLine: 'underline' },
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
