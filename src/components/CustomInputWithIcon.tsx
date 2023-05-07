import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

export default function CustomInputWithIcon({
  onChange,
  disable = false,
  textStyle,
  value,
  label,
  subLabel,
  placeholder,
  keybordType = 'default',
  type,
  suffix,
  onSuffixClick,
  autoCapitalize,
  isError
}: {
  onChange: any
  disable?: boolean | undefined
  textStyle: any
  value: any
  label: any
  subLabel: any
  placeholder: any
  keybordType?: any
  type: any
  suffix: any
  onSuffixClick: any
  autoCapitalize: any
  isError: any
}): JSX.Element {
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.label}>{label} </Text>
        {subLabel && <Text style={styles.subTxt}>{subLabel}</Text>}
      </View>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: isError ? colors.lightgraybox : colors.inputBox }
        ]}>
        <>
          <TextInput
            editable={!disable}
            selectTextOnFocus={!disable}
            style={[styles.input, textStyle]}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            keyboardType={keybordType}
            secureTextEntry={type === 'password' ? true : false}
            autoCapitalize={autoCapitalize}
          />
          <TouchableOpacity onPress={onSuffixClick}>
            <View>{suffix}</View>
          </TouchableOpacity>
        </>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.inputBox,
    borderRadius: vw(10),
    marginTop: vh(12),
    padding: vw(10)
  },
  input: {
    flex: 1
  },
  label: {
    fontSize: vw(14),
    lineHeight: vh(18),
    fontFamily: fonts.REGULAR
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  subTxt: {
    fontSize: vw(12),
    color: colors.passSubTxt,
    marginLeft: vw(5),
    fontFamily: fonts.REGULAR
  }
})
