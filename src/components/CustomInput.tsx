import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { vh, vw } from '../utils/dimension'

import { Icon } from './icons'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { useSelector } from 'react-redux'

export interface FloatingTextInputProps {
  container?: Object
  textInputStyle?: Object
  value: string
  fieldName: string
  placeholder?: string
  onBlur?: Function
  onFocus?: Function
  onChangeText: Function
  hasError?: string
  secureTextEntry?: boolean
  keyboardType?: any
  returnKeyType?: any
  returnKeyLabel?: string
  onSubmitEditing?: Function
  autoCapitalize?: boolean
  ref?: any
  textInputRef?: React.RefObject<TextInput>
  infoMessage?: string
  hasInfoIcon?: boolean
  maxLength?: number
  editable?: boolean
  extraBtn?: boolean
  extraBtnTxt?: string
  isClearAll?: boolean
  fromProfile?: boolean
  required?: boolean
  multiline?: boolean
  numberOfLines?: number
}

export const FloatingTextInput = React.forwardRef(
  (props: FloatingTextInputProps, ref: any) => {
    const { value, textInputRef, multiline = false, numberOfLines = 1 } = props
    const [isFieldActive, setField] = useState(false)
    const [toggleShow, setToggleShow] = useState(true)
    const [secureTextEntry, setSecureTextEntry] = useState(false)
    const [position, setPosition] = useState(new Animated.Value(value ? 1 : 0))
    const [isError, setIsError] = useState(!!props?.hasError)
    const { appConfigValues } = useSelector(
      (state: RootReducerModal) => state.configReducer
    )

    useEffect(() => {
      if (props?.fieldName.toLowerCase()?.includes('password')) {
        if (
          toggleShow &&
          !['confirmpassword,createpassword,currentpassword'].includes(
            props?.fieldName.toLowerCase()
          )
        )
          setSecureTextEntry(false)
        else {
          setSecureTextEntry(true)
        }
      }
    }, [toggleShow])

    useEffect(() => {
      setIsError(!!props.hasError)
    }, [props.hasError])

    /**
     * handle placeholder animation
     */
    useEffect(() => {
      if (props.value) {
        Animated.timing(position, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false
        }).start()
      }
    }, [props.value])

    const _handleFocus = () => {
      if (!isFieldActive) {
        setField(true)
        Animated.timing(position, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false
        }).start()
      }
      if (props.onFocus) {
        props.onFocus()
      }
    }

    const _handleBlur = () => {
      if (isFieldActive && !props.value) {
        setField(false)
        Animated.timing(position, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false
        }).start()
      }
      if (props.onBlur) {
        props.onBlur(props.fieldName)
      }
    }

    useEffect(() => {
      if (!props.isClearAll) {
        _handleBlur()
      }
    }, [props.isClearAll])

    useEffect(() => {
      if (props?.secureTextEntry) setToggleShow(false)
    }, [props?.secureTextEntry])

    const renderPasswordToggle = () => (
      <TouchableOpacity onPress={handleToggleText}>
        {toggleShow ? (
          <View
            style={{
              paddingVertical: vw(6),
              paddingHorizontal: vw(6),
              backgroundColor: colors.white,
              borderRadius: vw(20),
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Icon name={'hm_Eye-thin'} size={vw(11)} />
          </View>
        ) : (
          <View
            style={{
              paddingVertical: vw(6),
              paddingHorizontal: vw(6),
              backgroundColor: colors.white,
              borderRadius: vw(20),
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Icon name={'hm_EyeClosed-thin'} size={vw(11)} />
          </View>
        )}
      </TouchableOpacity>
    )
    const handleOnSubmitEditing = () => {
      if (props.onSubmitEditing) {
        props.onSubmitEditing()
      }
    }
    const handleChangeText = (val: string) => {
      props.onChangeText(props.fieldName, val, props.value)
    }
    const handleToggleText = () => {
      setToggleShow(!toggleShow)
      setSecureTextEntry(!secureTextEntry)
    }

    const { container, textInputStyle } = props

    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              color: colors.appBlack,
              fontFamily: fonts.REGULAR,
              fontSize: vw(14),
              lineHeight: vh(18),
              paddingBottom: vh(8)
            }}>
            {props.placeholder}
          </Text>
          {props?.required && <Text style={{ color: colors.appBlack }}>*</Text>}
        </View>

        <View
          style={{
            borderRadius: vw(!props?.fromProfile ? 8 : 4)
          }}>
          <View
            style={[
              styles.container,
              container,
              {
                borderRadius: vw(8),
                backgroundColor: isError ? colors.lightgraybox : colors.inputBox
              }
            ]}>
            <TextInput
              multiline={multiline}
              numberOfLines={numberOfLines}
              maxLength={props.maxLength}
              ref={textInputRef || ref}
              autoCapitalize={props.autoCapitalize ? 'words' : 'none'}
              returnKeyType={props.returnKeyType || 'next'}
              value={props.value}
              onChangeText={handleChangeText}
              onBlur={_handleBlur}
              selectionColor={colors.orange}
              onFocus={_handleFocus}
              style={[
                styles.textInput,
                textInputStyle,
                props?.fromProfile && { marginTop: 0 }
              ]}
              keyboardType={props.keyboardType ? props.keyboardType : 'default'}
              onSubmitEditing={handleOnSubmitEditing}
              secureTextEntry={secureTextEntry}
              editable={!props.editable}
              placeholderTextColor={colors.placeholderHallmark}
            />
            {props.secureTextEntry &&
              !props?.fromProfile &&
              renderPasswordToggle()}
            {props?.extraBtn && (
              <TouchableOpacity onPress={handleOnSubmitEditing}>
                <Text style={styles.extraBtnTxtStyle}>
                  {props?.extraBtnTxt}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {isError && (
            <Text
              style={{
                color: colors.darkOrange,
                fontSize: vw(12),
                lineHeight: vh(18),
                fontFamily: fonts.MEDIUM,
                paddingTop: vh(8)
              }}>
              {props?.hasError ??
                appConfigValues?.screen_content?.shop?.bopis_error}
            </Text>
          )}
        </View>
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: vh(17),

    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    height: vw(18),
    width: vw(18)
  },
  textInput: {
    fontSize: vw(16),
    alignSelf: 'center',
    flex: 1,
    paddingVertical: vh(16),
    fontFamily: fonts.MEDIUM,
    color: colors.appBlack
  },
  textInputLabel: {
    position: 'absolute',
    paddingHorizontal: vw(8),
    marginHorizontal: vw(10),
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    color: colors.placeholderHallmark,
    marginBottom: vh(5),
    fontSize: vw(16),
    lineHeight: vh(20),
    fontFamily: fonts.REGULAR
  },
  errorStyle: {
    borderColor: colors.lightgray,
    borderWidth: vw(0.5)
  },
  showText: {
    color: colors.lightgray,
    fontSize: vw(12)
  },
  hideText: {
    color: colors.lightgray,
    fontSize: vw(12)
  },
  extraBtnTxtStyle: {
    fontSize: vw(15),
    fontFamily: fonts.MEDIUM,
    color: colors.hmPurple
  },
  floatingLable: {}
})
