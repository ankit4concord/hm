import { HeaderBody, HeaderSmallTight } from '@ecom/components/typography'
import {
  OutlinedLargeButton,
  PrimaryLargeButton
} from '@ecom/components/buttons'
import { StyleSheet, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import LocalizedStrings from 'react-native-localization'
import RBSheet from 'react-native-raw-bottom-sheet'
import React from 'react'
import { Warning } from '@ecom/assets/svg'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

export interface SignOutBottomSheetProps {
  close: () => void
  ok: () => void
  bottomSheetRef: React.RefObject<RBSheet>
}

const CustomizationDisclaimer = ({
  CustomizationDisclaimerRef,
  goToPreview
}: any) => {
  return (
    <RBSheet
      customStyles={{ container: styles.container }}
      closeOnPressMask={false}
      ref={CustomizationDisclaimerRef}>
      <Warning style={styles.warning} />
      <HeaderBody style={styles.prompt}>{strings.prompt}</HeaderBody>
      <HeaderSmallTight style={styles.headerSubText}>
        {strings.subPrompt}
      </HeaderSmallTight>
      <View style={styles.buttonContainer}>
        <OutlinedLargeButton
          style={styles.cancelButton}
          onPress={() => {
            CustomizationDisclaimerRef?.current?.close()
          }}>
          {strings.keepEditing}
        </OutlinedLargeButton>
        <PrimaryLargeButton
          style={styles.signOutButton}
          onPress={() => {
            goToPreview()
          }}>
          {strings.continue}
        </PrimaryLargeButton>
      </View>
    </RBSheet>
  )
}
export default CustomizationDisclaimer

const strings = new LocalizedStrings({
  'en-us': {
    prompt: `You didn't use all customazible areas`,
    subPrompt: 'Do you wanna go back and customize more things ?',
    keepEditing: 'Keep Editing',
    continue: 'Continue'
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
  prompt: { fontSize: vw(14), marginBottom: vh(3), lineHeight: vh(18) },
  buttonContainer: {
    flexDirection: 'row'
  },
  cancelButton: {
    width: vw(150),
    marginRight: vw(15)
  },
  signOutButton: {
    width: vw(105)
  },
  headerSubText: {
    fontFamily: fonts.REGULAR,
    color: 'black',
    paddingHorizontal: vw(55),
    lineHeight: vh(20),
    fontSize: vw(14),
    marginBottom: vh(30),
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }
})
