import React, { useEffect, useState } from 'react'
import { StyleSheet, TextStyle, ViewStyle } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { Dropdown } from 'react-native-element-dropdown'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

export interface DropDownItem {
  [x: string]: any
  label?: string
  value?: string
}

interface DropDownProps {
  items: DropDownItem[]
  placeholder?: string
  initialValue?: string
  setSelected?: (item: DropDownItem) => void
  style?: ViewStyle
  containerStyle?: ViewStyle
  placeholderStyle?: TextStyle
  itemTextStyle?: TextStyle
  selectedTextStyle?: TextStyle
}

export const DropDown = (props: DropDownProps) => {
  const {
    items,
    placeholder,
    setSelected,
    initialValue = '',
    style,
    containerStyle,
    placeholderStyle,
    itemTextStyle,
    selectedTextStyle
  } = props
  const [value, setValue] = useState(initialValue)
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue, props])

  const onChange = (item: DropDownItem) => {
    setValue(item.value || '')
    if (setSelected) {
      setSelected(item)
    }
  }

  return (
    <Dropdown
      data={items}
      value={value}
      labelField={'label'}
      valueField={'value'}
      placeholder={placeholder}
      onChange={onChange}
      style={[styles.style, style]}
      containerStyle={[styles.containerStyle, containerStyle]}
      placeholderStyle={[styles.itemTextStyle, placeholderStyle]}
      itemTextStyle={[styles.itemTextStyle, itemTextStyle]}
      selectedTextStyle={[styles.itemTextStyle, selectedTextStyle]}
      autoScroll={false}
    />
  )
}

const styles = StyleSheet.create({
  style: {
    backgroundColor: colors.inputBox,
    borderWidth: 0,
    paddingHorizontal: vh(20),
    paddingVertical: vh(10),
    borderRadius: vw(10)
  },
  itemTextStyle: {
    fontSize: vw(16),
    fontFamily: fonts.MEDIUM,
    color: colors.appBlack
  },
  containerStyle: {
    borderRadius: vw(10)
  }
})
