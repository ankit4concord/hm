import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import React from 'react'
import { TextWithIcon } from './TextWithIcon'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

export default function Button({
  onPress,
  disable = false,
  isLoading = false,
  label = 'Continue',
  buttonStyle,
  textStyle,
  buttonColor,
  icon = false
}: {
  onPress: any
  disable?: boolean | undefined
  isLoading?: boolean | undefined
  label?: string | undefined
  buttonStyle: any
  textStyle: any
  buttonColor: any
  icon?: boolean | undefined
}): JSX.Element {
  return (
    <TouchableOpacity
      disabled={disable}
      style={[
        styles.button,
        buttonStyle,
        { backgroundColor: disable ? '#cccccc' : buttonColor }
      ]}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={styles.container}>
          <TextWithIcon
            style={[styles.text, textStyle]}
            label={label}
            isIcon={icon}
          />
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    borderRadius: vw(50)
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: vw(50)
  },

  text: {
    color: colors.white,
    fontSize: vw(16),
    fontFamily: fonts.MEDIUM,
    fontStyle: 'normal',
    alignSelf: 'center',
    lineHeight: vh(19)
  }
})
