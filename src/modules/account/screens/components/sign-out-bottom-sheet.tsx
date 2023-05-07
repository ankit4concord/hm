import {
  OutlinedLargeButton,
  PrimaryLargeButton
} from '@ecom/components/buttons'
import { StyleSheet, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { HeaderBody } from '@ecom/components/typography'
import LocalizedStrings from 'react-native-localization'
import RBSheet from 'react-native-raw-bottom-sheet'
import React from 'react'
import { Warning } from '@ecom/assets/svg'
import colors from '@ecom/utils/colors'

export interface SignOutBottomSheetProps {
  close: () => void
  ok: () => void
  bottomSheetRef: React.RefObject<RBSheet>
}

export const SignOutBottomSheet = (props: SignOutBottomSheetProps) => {
  const { close, ok, bottomSheetRef } = props
  return (
    <RBSheet
      customStyles={{ container: styles.container }}
      closeOnPressMask={false}
      ref={bottomSheetRef}>
      <Warning style={styles.warning} />
      <HeaderBody style={styles.prompt}>{strings.prompt}</HeaderBody>
      <View style={styles.buttonContainer}>
        <OutlinedLargeButton style={styles.cancelButton} onPress={close}>
          {strings.cancel}
        </OutlinedLargeButton>
        <PrimaryLargeButton style={styles.signOutButton} onPress={ok}>
          {strings.signOut}
        </PrimaryLargeButton>
      </View>
    </RBSheet>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    prompt: 'Are You Sure You Want to Sign Out?',
    cancel: 'Cancel',
    signOut: 'Sign Out'
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: vw(20),
    borderTopRightRadius: vw(20),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  warning: {
    marginBottom: vh(25)
  },
  prompt: {
    marginBottom: vh(30)
  },
  buttonContainer: {
    flexDirection: 'row'
  },
  cancelButton: {
    width: vw(105),
    marginRight: vw(15)
  },
  signOutButton: {
    width: vw(105)
  }
})
