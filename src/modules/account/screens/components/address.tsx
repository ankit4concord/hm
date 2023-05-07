import { FloatingTextInput } from '@ecom/components/CustomInput'
import { DropDown, DropDownItem } from '@ecom/components/drop-down'
import { Description, Header, LabelName } from '@ecom/components/typography'
import { ProfileAddress } from '@ecom/modals'
import { addressLookup } from '@ecom/modules/shop/action'
import colors from '@ecom/utils/colors'
import { vh, vw } from '@ecom/utils/dimension'
import fonts from '@ecom/utils/fonts'
import { isArray, isEmpty } from 'lodash'
import React, { createRef, useEffect, useRef, useState } from 'react'
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import LocalizedStrings from 'react-native-localization'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useDispatch } from 'react-redux'
import States from './states.json'
import { VerifyAddressBottomSheet } from './verify-address-bottom-sheet'

interface AddressProps extends ProfileAddress {
  onChange?: (address: ProfileAddress) => void
  addressErrors?: ProfileAddress
  uspsCorrectedAddress?: ProfileAddress
  showAddressModal: boolean
  okBottomSheet?: (correctedAddress: ProfileAddress) => void
  hideAddressModal?: () => void
}

export const AddressComponent = (props: AddressProps) => {
  const {
    onChange,
    addressErrors,
    uspsCorrectedAddress,
    okBottomSheet,
    showAddressModal,
    hideAddressModal,
    ...rest
  } = props
  const dispatch = useDispatch()
  const [address, setAddress] = useState(rest)
  const [showLine2, setShowLine2] = useState(!!rest.addressLine2)
  const [errors, setErrors] = useState(addressErrors)
  const [suggestedAddr, setSuggestedAddr] = useState([])
  const [visibleSuggestion, setVisibleSuggestion] = useState(true)
  const bottomSheetRef = useRef<RBSheet>(null)

  const states = [{ label: 'State', value: '' }, ...States.states]

  const line2Ref = createRef<TextInput>()
  const cityRef = createRef<TextInput>()
  const zipRef = createRef<TextInput>()

  useEffect(() => {
    setAddress({
      addressLine1: rest.addressLine1,
      addressLine2: rest.addressLine2,
      city: rest.city,
      stateCode: rest.stateCode,
      zip: rest.zip
    })
  }, [
    rest.addressLine1,
    rest.addressLine2,
    rest.city,
    rest.stateCode,
    rest.zip
  ])

  useEffect(() => {
    setErrors(addressErrors)
  }, [addressErrors])

  useEffect(() => {
    if (showAddressModal) {
      bottomSheetRef?.current?.open()
    }
  }, [showAddressModal, bottomSheetRef])

  useEffect(() => {
    setShowLine2(!!rest.addressLine2)
  }, [rest.addressLine2])

  const handleChange = (type: any, value: any) => {
    if (type === 'addressLine1') {
      setVisibleSuggestion(true)
      dispatch(addressLookup(value, onAddressLookup))
    }
    const newAddress = { ...address, [type]: value }
    setAddress(newAddress)
    updateAddress(newAddress)
  }

  const onAddressLookup = (res: any) => {
    setSuggestedAddr(res)
  }

  const updateAddress = (newAddress: ProfileAddress) => {
    if (onChange) {
      onChange(newAddress)
    }
  }

  const onSetState = (item: DropDownItem) => {
    const { value } = item
    handleChange('stateCode', value)
  }

  const closeBottomSheet = () => {
    if (hideAddressModal) {
      hideAddressModal()
    }
    bottomSheetRef?.current?.close()
  }

  const onOkBottomSheet = (correctedAddress: ProfileAddress) => {
    if (okBottomSheet) {
      okBottomSheet(correctedAddress)
      closeBottomSheet()
    }
  }

  const renderSuggestion = (item: any) => {
    const addrLine = `${item?.street_line}${item?.secondary ? ' ' : ''}${
      item?.secondary ? item?.secondary : ''
    } ${item?.city}, ${item?.state} ${item?.zipcode}`

    const onSuggestion = () => {
      setVisibleSuggestion(false)
      Keyboard.dismiss()
      const newAddress = {
        addressLine1: item?.street_line || '',
        addressLine2: item?.secondary || '',
        city: item?.city || '',
        stateCode: item?.state || '',
        zip: item?.zipcode || ''
      }
      setAddress(newAddress)
      updateAddress(newAddress)
    }

    return (
      <TouchableOpacity
        style={styles.searchTypeAheadContent}
        activeOpacity={0.7}
        onPress={onSuggestion}>
        <LabelName>{addrLine}</LabelName>
      </TouchableOpacity>
    )
  }

  const renderSuggestions = () => {
    return visibleSuggestion &&
      !isEmpty(suggestedAddr) &&
      isArray(suggestedAddr) &&
      !isEmpty(address?.addressLine1) ? (
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        onScroll={() => Keyboard.dismiss()}
        nestedScrollEnabled={true}
        style={styles.suggestedList}>
        {suggestedAddr.map((i) => {
          return renderSuggestion(i)
        })}
      </ScrollView>
    ) : null
  }

  return (
    <>
      <View style={styles.fieldContainer}>
        <FloatingTextInput
          placeholder={strings.line1}
          autoCapitalize={false}
          fieldName={'addressLine1'}
          returnKeyType={'next'}
          value={address.addressLine1 || ''}
          onChangeText={handleChange}
          hasError={errors?.addressLine1}
          onSubmitEditing={() => {
            if (showLine2) {
              line2Ref?.current?.focus()
            } else {
              cityRef?.current?.focus()
            }
          }}
        />
        {renderSuggestions()}
      </View>
      <View style={styles.fieldContainer}>
        {showLine2 ? (
          <FloatingTextInput
            textInputRef={line2Ref}
            placeholder={strings.line2}
            autoCapitalize={false}
            fieldName={'addressLine2'}
            returnKeyType={'next'}
            value={address.addressLine2 || ''}
            onChangeText={handleChange}
            hasError={errors?.addressLine2}
            onSubmitEditing={() => {
              cityRef?.current?.focus()
            }}
          />
        ) : (
          <Pressable onPress={() => setShowLine2(true)}>
            <Header style={styles.link}>{strings.add}</Header>
          </Pressable>
        )}
      </View>
      <View style={styles.fieldContainer}>
        <FloatingTextInput
          textInputRef={cityRef}
          placeholder={strings.city}
          autoCapitalize={false}
          fieldName={'city'}
          returnKeyType={'next'}
          value={address.city || ''}
          onChangeText={handleChange}
          hasError={errors?.city}
          onSubmitEditing={() => {
            zipRef?.current?.focus()
          }}
        />
      </View>
      <View style={styles.stateZipContainer}>
        <View style={styles.stateContainer}>
          <LabelName style={styles.label}>{strings.state}</LabelName>
          <DropDown
            items={states}
            setSelected={onSetState}
            placeholder={strings.state}
            initialValue={address.stateCode || ''}
            containerStyle={styles.state}
          />
          {errors?.stateCode ? (
            <Description style={styles.error}>{errors?.stateCode}</Description>
          ) : null}
        </View>
        <View style={styles.spacer} />
        <View style={styles.zip}>
          <FloatingTextInput
            textInputRef={zipRef}
            placeholder={strings.zip}
            autoCapitalize={false}
            fieldName={'zip'}
            returnKeyType={'done'}
            value={address.zip || ''}
            onChangeText={handleChange}
            hasError={errors?.zip}
            keyboardType={'number-pad'}
          />
        </View>
      </View>
      {uspsCorrectedAddress ? (
        <VerifyAddressBottomSheet
          bottomSheetRef={bottomSheetRef}
          close={closeBottomSheet}
          ok={onOkBottomSheet}
          address={address || {}}
          correctedAddress={uspsCorrectedAddress}
        />
      ) : null}
    </>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    line1: 'Address Line 1',
    line2: 'Address Line 2',
    city: 'City',
    state: 'State',
    zip: 'Zip Code',
    add: 'Add Line 2 +',
    enterZip: 'Enter Zip Code first to autofill State and City'
  }
})

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: vh(20)
  },
  link: {
    color: colors.hmPurple,
    alignSelf: 'flex-end'
  },
  stateZipContainer: {
    flexDirection: 'row',
    marginBottom: vh(30)
  },
  stateContainer: {
    flexDirection: 'column',
    flex: 1
  },
  state: {
    height: vh(175)
  },
  zip: {
    flex: 1
  },
  spacer: {
    width: vw(15)
  },
  label: {
    fontFamily: fonts.REGULAR,
    paddingBottom: vh(8)
  },
  error: {
    fontFamily: fonts.MEDIUM,
    marginTop: vh(8),
    color: colors.darkOrange
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
  suggestedList: {
    maxHeight: vh(250)
  }
})
