import {
  OutlinedLargeButton,
  PrimaryLargeButton
} from '@ecom/components/buttons'
import { StyleSheet, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'
import { Body, Header, HeaderSmallTight } from '@ecom/components/typography'
import LocalizedStrings from 'react-native-localization'
import RBSheet from 'react-native-raw-bottom-sheet'
import React from 'react'
import colors from '@ecom/utils/colors'
import { ProfileAddress } from '@ecom/modals'
import { Divider } from 'react-native-elements'

export interface VerifyAddressBottomSheetProps {
  address: ProfileAddress
  correctedAddress: ProfileAddress
  close: () => void
  ok: (correctedAddress: ProfileAddress) => void
  bottomSheetRef: React.RefObject<RBSheet>
}

export const VerifyAddressBottomSheet = (
  props: VerifyAddressBottomSheetProps
) => {
  const { close, ok, bottomSheetRef, address, correctedAddress } = props

  const renderAddress = (item: ProfileAddress, key: string) => {
    const showAddress =
      item && item.addressLine1 && item.city && item.stateCode && item.zip
    const regex = /(\d{5})(\d{4})/
    const zip =
      showAddress && item?.zip?.length === 9
        ? item.zip.replace(regex, '$1-$2')
        : item?.zip
    const addressLine3 = showAddress
      ? `${item.city}, ${item.stateCode} ${zip}`
      : ''
    return showAddress ? (
      <View key={key}>
        <Body>{item.addressLine1}</Body>
        {item.addressLine2 ? <Body>{item.addressLine2}</Body> : null}
        <Body>{addressLine3}</Body>
      </View>
    ) : null
  }

  const onOK = () => {
    ok(correctedAddress)
  }

  return (
    <RBSheet
      customStyles={{ container: styles.container }}
      closeOnPressMask={false}
      ref={bottomSheetRef}>
      <Header style={styles.title}>{strings.title}</Header>
      <HeaderSmallTight>{strings.youEntered}</HeaderSmallTight>
      <Divider style={styles.divider} />
      {renderAddress(address, 'currentAddress')}
      <HeaderSmallTight style={styles.basedOn}>
        {strings.basedOn}
      </HeaderSmallTight>
      <Divider style={styles.divider} />
      {renderAddress(correctedAddress, 'correctedAddress')}
      <View style={styles.buttonContainer}>
        <OutlinedLargeButton style={styles.cancelButton} onPress={close}>
          {strings.cancel}
        </OutlinedLargeButton>
        <PrimaryLargeButton style={styles.signOutButton} onPress={onOK}>
          {strings.useUSPS}
        </PrimaryLargeButton>
      </View>
    </RBSheet>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    title: 'Verify your address',
    youEntered: 'You entered:',
    basedOn: 'Based on this address, the USPS recommends:',
    cancel: 'Cancel',
    useUSPS: 'Use USPS Address'
  }
})

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: vw(20),
    borderTopRightRadius: vw(20),
    backgroundColor: colors.white,
    paddingHorizontal: vw(20),
    height: vh(419)
  },
  title: {
    marginTop: vh(40),
    marginBottom: vh(30),
    alignSelf: 'center'
  },
  divider: {
    marginVertical: vh(5)
  },
  basedOn: {
    marginTop: vh(40)
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: vh(30),
    justifyContent: 'center',
    marginBottom: vh(20)
  },
  cancelButton: {
    width: vw(105),
    marginRight: vw(15)
  },
  signOutButton: {
    width: vw(195)
  }
})
